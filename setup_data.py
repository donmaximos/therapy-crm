import os
import django
import random
from datetime import date, timedelta, time

# 1. Ρύθμιση του Django (για να καταλάβει πού είναι η βάση)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'therapy_project.settings')
django.setup()

# 2. Τώρα μπορούμε να φέρουμε τα μοντέλα
from office.models import Patient, Appointment

def run():
    print("🧹 Καθαρισμός παλιάς βάσης...")
    Appointment.objects.all().delete()
    Patient.objects.all().delete()

    print("🚀 Δημιουργία 20 Νέων Πελατών...")

    first_names = ["Γιώργος", "Δημήτρης", "Κώστας", "Γιάννης", "Νίκος", "Μαρία", "Ελένη", "Κατερίνα", "Σοφία", "Άννα", "Αντώνης", "Βασιλική"]
    last_names = ["Παπαδόπουλος", "Γεωργίου", "Οικονόμου", "Δημητρίου", "Παπαγεωργίου", "Μακρής", "Βλάχος", "Αλεξίου", "Στεφανίδης", "Αναγνώστου"]
    parents = ["Αλέξανδρος", "Βασίλης", "Ευάγγελος", "Θεόδωρος", "Μιχάλης", "Αγγελική", "Δέσποινα", "Γεωργία"]

    patients_list = []

    # Δημιουργία Πελατών
    for i in range(20):
        fname = random.choice(first_names)
        lname = random.choice(last_names)
        parent = random.choice(parents)
        phone = f"69{random.randint(10000000, 99999999)}"
        
        # Τυχαία ημερομηνία επόμενης τιμολόγησης
        days_offset = random.choice([-2, 0, 1, 5, 10, 20, 30])
        next_inv = date.today() + timedelta(days=days_offset)

        p = Patient.objects.create(
            first_name=fname,
            last_name=lname,
            parent_name=parent,
            parent_phone=phone,
            next_invoice_date=next_inv
        )
        patients_list.append(p)
        print(f"   - Προστέθηκε: {lname} {fname}")

    print("📅 Δημιουργία Ραντεβού...")
    
    # Δημιουργία Ραντεβού για κάθε πελάτη
    for patient in patients_list:
        # 1 έως 3 ραντεβού στον καθένα
        for _ in range(random.randint(1, 3)):
            day_offset = random.randint(-10, 10) # Από 10 μέρες πριν έως 10 μετά
            app_date = date.today() + timedelta(days=day_offset)
            app_time = time(random.randint(10, 20), 0) # Ώρες 10:00 - 20:00

            Appointment.objects.create(
                patient=patient,
                date=app_date,
                time=app_time,
                notes="Συνεδρία λογοθεραπείας",
                status='SCHEDULED'
            )

    print("✅ ΟΛΑ ΕΤΟΙΜΑ! Η βάση γέμισε.")

if __name__ == '__main__':
    run()