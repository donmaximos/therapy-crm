from rest_framework import serializers
from .models import Patient, Appointment

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
        

    # Αυτή η μέθοδος τρέχει ΜΟΝΟ όταν το API στέλνει απαντήσεις (GET)
    # Λέμε: "Πάρε την κανονική απάντηση, αλλά στο πεδίο 'patient' 
    # βάλε όλα τα στοιχεία του ασθενή, όχι μόνο το ID".
    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['patient'] = PatientSerializer(instance.patient).data
        return response