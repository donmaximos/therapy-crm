from rest_framework import viewsets
from rest_framework.decorators import action # <--- ΝΕΟ IMPORT
from rest_framework.response import Response # <--- ΝΕΟ IMPORT
from django.utils import timezone # <--- ΝΕΟ IMPORT
from datetime import timedelta # <--- ΝΕΟ IMPORT
from .models import Patient, Appointment
from .serializers import PatientSerializer, AppointmentSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    # ΝΕΑ ΛΕΙΤΟΥΡΓΙΑ: Ειδοποιήσεις Τιμολόγησης
    # Αυτό δημιουργεί το URL: /api/patients/pending_invoices/
    @action(detail=False, methods=['get'])
    def pending_invoices(self, request):
        today = timezone.now().date()
        tomorrow = today + timedelta(days=1)
        
        # Ψάξε ασθενείς που η ημερομηνία τιμολόγησης είναι Σήμερα ή Αύριο
        # __lte σημαίνει "Less Than or Equal" (Μικρότερο ή Ίσο)
        # Δηλαδή φέρε μου όσους έχουν ημερομηνία <= Αύριο (και δεν το έχουμε αλλάξει)
        patients_to_invoice = Patient.objects.filter(next_invoice_date__lte=tomorrow)
        
        serializer = self.get_serializer(patients_to_invoice, many=True)
        return Response(serializer.data)

class AppointmentViewSet(viewsets.ModelViewSet):
    # ... (ο κώδικας μένει ίδιος)
    queryset = Appointment.objects.all().order_by('-date', '-time')
    serializer_class = AppointmentSerializer