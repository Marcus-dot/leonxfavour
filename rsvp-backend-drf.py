# =============================================================================
# RSVP backend — Django + DRF option
# Use this when Leon wants an exportable list of responses (not just email).
# Drop into a small `rsvp` app. Public endpoint, so it has a honeypot + throttle.
# For v1 speed, you can skip all this and use Formspree (see rsvp-formspree.md).
# =============================================================================

# ---- rsvp/models.py ---------------------------------------------------------
from django.db import models


class Rsvp(models.Model):
    ATTENDING = [("yes", "Joyfully accepts"), ("no", "Regretfully declines")]

    name = models.CharField(max_length=120)
    contact = models.CharField(max_length=160, help_text="Email or phone")
    attending = models.CharField(max_length=3, choices=ATTENDING)
    party_size = models.PositiveSmallIntegerField(default=1)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.get_attending_display()} ({self.party_size})"


# ---- rsvp/serializers.py ----------------------------------------------------
from rest_framework import serializers
from .models import Rsvp


class RsvpSerializer(serializers.ModelSerializer):
    # Honeypot: real users never fill this hidden field; bots do. Reject if present.
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = Rsvp
        fields = ["id", "name", "contact", "attending", "party_size", "message", "website", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_party_size(self, value):
        if value < 1 or value > 12:
            raise serializers.ValidationError("Party size must be between 1 and 12.")
        return value

    def validate(self, attrs):
        if attrs.get("website"):
            raise serializers.ValidationError("Spam detected.")
        attrs.pop("website", None)
        return attrs


# ---- rsvp/views.py ----------------------------------------------------------
from rest_framework import generics, throttling
from .models import Rsvp
from .serializers import RsvpSerializer


class RsvpBurstThrottle(throttling.AnonRateThrottle):
    rate = "10/hour"  # public endpoint — keep it modest


class RsvpCreateView(generics.CreateAPIView):
    queryset = Rsvp.objects.all()
    serializer_class = RsvpSerializer
    throttle_classes = [RsvpBurstThrottle]
    # AllowAny by default for guests; the honeypot + throttle are the guardrails.


# ---- rsvp/urls.py -----------------------------------------------------------
from django.urls import path
from .views import RsvpCreateView

urlpatterns = [
    path("rsvp/", RsvpCreateView.as_view(), name="rsvp-create"),
]

# Then in the project urls.py:  path("api/", include("rsvp.urls"))
# CORS: allow the site's origin (django-cors-headers). Set wedding.ts
# rsvpEndpoint to the full URL, e.g. "https://api.yourhost.com/api/rsvp/".
#
# Export responses any time:
#   python manage.py shell -c "import csv,sys; from rsvp.models import Rsvp; \
#     w=csv.writer(sys.stdout); w.writerow(['name','contact','attending','party','msg','when']); \
#     [w.writerow([r.name,r.contact,r.attending,r.party_size,r.message,r.created_at]) for r in Rsvp.objects.all()]" > rsvps.csv
