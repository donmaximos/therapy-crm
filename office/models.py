from django.db import models

class Patient(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    parent_name = models.CharField(max_length=100)
    parent_phone = models.CharField(max_length=15)
    # Πότε κόψαμε τελευταία φορά απόδειξη; (Για να υπολογίζουμε το επόμενο)
    last_invoice_date = models.DateField(null=True, blank=True)
    # Πότε πρέπει να κοπεί η επόμενη;
    next_invoice_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.last_name} {self.first_name}"

class Appointment(models.Model):
    # ΕΔΩ ΟΡΙΖΟΥΜΕ ΤΙΣ ΕΠΙΛΟΓΕΣ ΠΟΥ ΕΛΕΙΠΑΝ
    STATUS_CHOICES = [
        ('SCHEDULED', 'Προγραμματισμένο'),
        ('COMPLETED', 'Ολοκληρώθηκε'),
        ('CANCELLED', 'Ακυρώθηκε'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    notes = models.TextField(blank=True, null=True)
    
    # Τώρα το STATUS_CHOICES υπάρχει, οπότε δεν θα βγάλει λάθος
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SCHEDULED')
    
    

    class Meta:
        ordering = ['-date', '-time'] # Ταξινόμηση: Πρώτα τα πιο πρόσφατα

    def __str__(self):
        return f"{self.patient.last_name} - {self.date}"