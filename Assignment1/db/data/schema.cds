namespace hospital.management;

using { cuid } from '@sap/cds/common';

// 1. Reusable Types
type Name        : String(50);
type Phone       : String(15);
type Email       : String(100);
type Amount      : Decimal(10,2);
type MedicalNote : String(1000);

// 2. Enums
type Gender            : String enum { Male; Female; Other; }
type BloodGroup        : String enum { A_pos = 'A+'; A_neg = 'A-'; B_pos = 'B+'; B_neg = 'B-'; O_pos = 'O+'; O_neg = 'O-'; AB_pos = 'AB+'; AB_neg = 'AB-'; }
type AppointmentStatus : String enum { Scheduled; Completed; Cancelled; NoShow; }

// 3. Entities
entity Departments : cuid {
    name       : String(100);
    floor      : Integer;
    head       : Name; 
    capacity   : Integer;
    phone      : Phone;
    isActive   : Boolean default true;
    doctors    : Association to many Doctors on doctors.department = $self;
}

entity Doctors : cuid {
    firstName      : Name;
    lastName       : Name;
    specialization : String(100);
    qualification  : String(100);
    experience     : Integer;
    fee            : Amount;
    department     : Association to Departments;
    phone          : Phone;
    email          : Email;
    availableDays  : String(50); 
    isActive       : Boolean default true;
}

entity Patients : cuid {
    firstName        : Name;
    lastName         : Name;
    dateOfBirth      : Date;
    gender           : Gender;
    bloodGroup       : BloodGroup;
    phone            : Phone;
    email            : Email;
    address          : String(255);
    emergencyContact : Phone;
    registrationDate : Date;
}

entity Appointments : cuid {
    patient         : Association to Patients;
    doctor          : Association to Doctors;
    appointmentDate : Date;
    appointmentTime : Time;
    status          : AppointmentStatus default 'Scheduled';
    reason          : String(255);
    notes           : MedicalNote;
    fee             : Amount;
}

entity MedicalRecords : cuid {
    patient        : Association to Patients;
    doctor         : Association to Doctors;
    appointment    : Association to Appointments;
    diagnosis      : String(500);
    prescription   : String(1000);
    testRecommended: String(500);
    recordDate     : Date;
}
