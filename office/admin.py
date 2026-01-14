from django.contrib import admin
from .models import Patient, Appointment # <--- Πρόσθεσε το Appointment εδώ

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('last_name', 'first_name', 'parent_phone')

# ΝΕΟ: Ρυθμίσεις για τα Ραντεβού στο Admin
@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('date', 'time', 'patient', 'status') # Τι βλέπουμε στις στήλες
    list_filter = ('status', 'date') # Φίλτρα στα δεξιά (π.χ. δείξε μόνο τα σημερινά)
    date_hierarchy = 'date' # Μπάρα πλοήγησης ημερομηνιών πάνω-πάνω
    