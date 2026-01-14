from django.db import models

# Κάθε Class είναι ένας Πίνακας (Table) στη βάση δεδομένων
class Patient(models.Model):
    # Τα πεδία (Fields) είναι οι Στήλες (Columns)
    
    first_name = models.CharField(max_length=50, verbose_name="Όνομα Παιδιού")
    last_name = models.CharField(max_length=50, verbose_name="Επώνυμο Παιδιού")
    date_of_birth = models.DateField(verbose_name="Ημερομηνία Γέννησης")
    next_invoice_date = models.DateField(null=True, blank=True, verbose_name="Επόμενη Τιμολόγηση")
    
    # Στοιχεία Γονέα
    parent_name = models.CharField(max_length=100, verbose_name="Ονοματεπώνυμο Γονέα")
    parent_phone = models.CharField(max_length=15, verbose_name="Τηλέφωνο")
    parent_email = models.EmailField(blank=True, null=True, verbose_name="Email") # blank=True σημαίνει προαιρετικό
    
    address = models.CharField(max_length=200, verbose_name="Διεύθυνση", blank=True)
    
    # Μεταδεδομένα (Audit fields)
    created_at = models.DateTimeField(auto_now_add=True) # Πότε δημιουργήθηκε η εγγραφή
    updated_at = models.DateTimeField(auto_now=True)     # Πότε ενημερώθηκε τελευταία φορά

    # Αυτό είναι η μέθοδος __str__ (όπως η toString στη Java). 
    # Καθορίζει πώς θα φαίνεται το αντικείμενο όταν το εκτυπώνουμε.
    def __str__(self):
        return f"{self.last_name} {self.first_name}"

    class Meta:
        verbose_name = "Ασθενής"
        verbose_name_plural = "Ασθενείς"

# ... (ο κώδικας του Patient μένει όπως είναι) ...

class Appointment(models.Model):
    # Επιλογές για το Status (dropdown list)
    # Η πρώτη τιμή είναι για τη βάση, η δεύτερη για το τι βλέπει ο χρήστης
    STATUS_CHOICES = [
        ('SCHEDULED', 'Προγραμματισμένο'),
        ('COMPLETED', 'Ολοκληρώθηκε'),
        ('CANCELLED', 'Ακυρώθηκε'),
        ('NO_SHOW', 'Δεν εμφανίστηκε'),
    ]

    # FOREIGN KEY: Σύνδεση με τον πίνακα Patient
    # on_delete=models.CASCADE: Αν διαγραφεί ο ασθενής, σβήνονται και τα ραντεβού του (προσοχή εδώ!)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments', verbose_name="Ασθενής")
    
    date = models.DateField(verbose_name="Ημερομηνία")
    time = models.TimeField(verbose_name="Ώρα")
    
    # default='SCHEDULED': Όταν φτιάχνω νέο ραντεβού, να είναι αυτόματα "Προγραμματισμένο"
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SCHEDULED', verbose_name="Κατάσταση")
    is_invoiced = models.BooleanField(default=False, verbose_name="Έχει Τιμολογηθεί;")
    notes = models.TextField(blank=True, verbose_name="Σημειώσεις Θεραπείας")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient} - {self.date} {self.time}"

    class Meta:
        verbose_name = "Ραντεβού"
        verbose_name_plural = "Ραντεβού"
        ordering = ['-date', '-time'] # Ταξινόμηση: Πρώτα τα πιο πρόσφατα