namespace platform.events;

// 1. Reusable Types
type Email : String(255);
type Phone : String(20);
type Amount : Decimal(10, 2);
type Rating : Integer;
type Name : String(100);
type URL : String(255);

// 2. Enums
type VenueType : String enum { Auditorium; ConferenceHall; Outdoor; Virtual; }
type EventType : String enum { Conference; Workshop; Seminar; Webinar; Meetup; }
type EventStatus : String enum { Draft; Published; Ongoing; Completed; Cancelled; }
type TicketType : String enum { General; VIP; Student; }
type RegistrationStatus : String enum { Confirmed; Cancelled; Waitlisted; Attended; }

// 3. Entities
entity Venues {
    key ID         : UUID;
    name           : Name;
    address        : String(255);
    city           : String(100);
    capacity       : Integer;
    type           : VenueType;
    amenities      : String; // Comma-separated
    hourlyRate     : Amount;
    contactPerson  : Name;
    phone          : Phone;
    isActive       : Boolean default true;
}

entity Events {
    key ID         : UUID;
    title          : String(150);
    description    : LargeString;
    eventType      : EventType;
    venueId        : UUID; // Foreign key reference to Venues
    startDate      : Date;
    endDate        : Date;
    startTime      : Time;
    endTime        : Time;
    maxAttendees   : Integer;
    registeredCount: Integer default 0; // Default value requirement
    ticketPrice    : Amount;
    status         : EventStatus default 'Draft'; // Default value requirement
    organizerName  : Name;
    organizerEmail : Email;
    tags           : String; // Comma-separated
}

entity Speakers {
    key ID         : UUID;
    name           : Name;
    email          : Email;
    phone          : Phone;
    bio            : LargeString;
    company        : String(100);
    designation    : String(100);
    expertise      : String;
    photoUrl       : URL;
    rating         : Decimal(2,1); // e.g., 4.5
    totalTalks     : Integer;
    isActive       : Boolean default true;
}

entity EventSpeakers {
    key eventId    : UUID; // Composite Key Part 1
    key speakerId  : UUID; // Composite Key Part 2
    topic          : String(255);
    sessionTime    : Time;
    sessionDuration: Integer; // In minutes
    roomNumber     : String(50);
}

entity Registrations {
    key ID         : UUID;
    eventId        : UUID; // Foreign key reference to Events
    attendeeName   : Name;
    attendeeEmail  : Email;
    attendeePhone  : Phone;
    company        : String(100);
    ticketType     : TicketType;
    registrationDate: Date;
    status         : RegistrationStatus default 'Confirmed'; // Default value requirement
    amountPaid     : Amount;
    paymentId      : String(100);
}

entity Feedback {
    key ID         : UUID;
    eventId        : UUID;
    attendeeEmail  : Email;
    overallRating  : Rating; // 1-5
    contentRating  : Rating; // 1-5
    venueRating    : Rating; // 1-5
    speakerRating  : Rating; // 1-5
    comment        : LargeString;
    submittedAt    : Timestamp;
}