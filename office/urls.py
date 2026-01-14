from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientViewSet, AppointmentViewSet

# Δημιουργούμε τον Router
router = DefaultRouter()
router.register(r'patients', PatientViewSet)      # http://.../api/patients/
router.register(r'appointments', AppointmentViewSet) # http://.../api/appointments/

urlpatterns = [
    path('', include(router.urls)),
]