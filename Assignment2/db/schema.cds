namespace edu.university;

using { cuid} from '@sap/cds/common';

type Email      : String(100);
type Phone      : String(15);
type Percentage : Decimal(5,2);
type GradePoint : Decimal(3,2);
type Semester   : Integer enum {
    S1 = 1; S2 = 2; S3 = 3; S4 = 4;
    S5 = 5; S6 = 6; S7 = 7; S8 = 8;
};


type Designation : String enum {
    Assistant     = 'Assistant';
    Associate     = 'Associate';
    Full          = 'Full';
    Distinguished = 'Distinguished';
};

type EnrollmentStatus : String enum {
    Enrolled  = 'Enrolled';
    Dropped   = 'Dropped';
    Completed = 'Completed';
};

type Grade : String enum {
    A = 'A';
    B = 'B';
    C = 'C';
    D = 'D';
    F = 'F';
};

type ExamType : String enum {
    Midterm    = 'Midterm';
    Final      = 'Final';
    Quiz       = 'Quiz';
    Assignment = 'Assignment';
};

entity Departments {
    key code            : String(10);
        name            : String(100)  not null;
        building        : String(50);
        headProfessor   : String(100);
        establishedYear : Integer;
}


entity Professors : cuid {
    firstName      : String(50)   not null;
    lastName       : String(50)   not null;
    email          : Email        not null;
    phone          : Phone;
    departmentCode : String(10);
    designation    : Designation;
    joinDate       : Date;
    salary         : Decimal(12,2);
    officeRoom     : String(20);

    department     : Association to Departments on department.code = departmentCode;
}

entity Courses {
    key code            : String(10);
        title           : String(150)  not null;
        description     : String(500);
        credits         : Integer      not null;
        maxStudents     : Integer      default 60;
        currentEnrolled : Integer      default 0;
        semester        : Semester     not null;
        departmentCode  : String(10);
        professorId     : UUID;
        schedule        : String(50);
        roomNumber      : String(20);
        isActive        : Boolean      default true;

        department      : Association to Departments on department.code = departmentCode;
        professor       : Association to Professors   on professor.ID   = professorId;
}


entity Students : cuid {
    rollNumber      : String(20)  not null;
    firstName       : String(50)  not null;
    lastName        : String(50)  not null;
    email           : Email       not null;
    phone           : Phone;
    dateOfBirth     : Date;
    admissionYear   : Integer;
    currentSemester : Semester;
    cgpa            : GradePoint  default 0.00;
    departmentCode  : String(10);
    isActive        : Boolean     default true;

    department      : Association to Departments on department.code = departmentCode;
}

entity Enrollments {
    key studentId        : UUID;
    key courseCode       : String(10);
        enrollmentDate   : Date;
        status           : EnrollmentStatus default 'Enrolled';
        grade            : Grade;
        gradePoints      : GradePoint;
        attendancePercent: Percentage;

        student          : Association to Students on student.ID        = studentId;
        course           : Association to Courses  on course.code       = courseCode;
}


entity Exams : cuid {
    courseCode      : String(10);
    examType        : ExamType    not null;
    date            : Date;
    maxMarks        : Integer     default 100;
    weightagePercent: Percentage;

    course          : Association to Courses on course.code = courseCode;
}
