namespace logistics.fleet;

using { cuid, managed } from '@sap/cds/common';

// --- Reusable Types ---
type Phone   : String(20);
type Email   : String(100);
type Amount  : Decimal(10, 2);
type Distance: Integer;
type City    : String(50);
type Address : String(255);
type Rating  : Integer enum {
    One = 1; Two = 2; Three = 3; Four = 4; Five = 5;
};

// --- Enums ---
type VehicleType : String enum { Bike; Van; Truck; Trailer; }
type FuelType : String enum { Petrol; Diesel; Electric; CNG; }
type VehicleStatus : String enum { Available; OnTrip; Maintenance; Retired; }
type DriverStatus : String enum { Available; OnTrip; OnLeave; }
type ShipmentStatus : String enum { Booked; PickedUp; InTransit; OutForDelivery; Delivered; Failed; }
type PaymentStatus : String enum { Pending; Paid; COD; }
type CustomerTier : String enum { Regular; Premium; Enterprise; }

// --- Entities ---
entity Vehicles : cuid, managed {
    registrationNumber : String(50);
    type               : VehicleType;
    make               : String(50);
    model              : String(50);
    year               : Integer;
    capacity           : Decimal(10,2); // in kg
    fuelType           : FuelType;
    status             : VehicleStatus default 'Available';
    lastServiceDate    : Date;
    mileage            : Integer;
    insuranceExpiry    : Date;
}

entity Drivers : cuid, managed {
    name             : String(100);
    licenseNumber    : String(50);
    licenseExpiry    : Date;
    phone            : Phone;
    email            : Email;
    experience       : Integer; // years
    rating           : Rating;
    status           : DriverStatus default 'Available';
    vehicle          : Association to Vehicles;
    joinDate         : Date;
}

entity Customers : cuid, managed {
    name        : String(100);
    company     : String(100);
    phone       : Phone;
    email       : Email;
    address     : Address;
    city        : City;
    pincode     : String(20);
    gstNumber   : String(50);
    tier        : CustomerTier;
}

entity Shipments : cuid, managed {
    trackingNumber   : String(50);
    customer         : Association to Customers;
    driver           : Association to Drivers;
    vehicle          : Association to Vehicles;
    pickupAddress    : Address;
    deliveryAddress  : Address;
    pickupCity       : City;
    deliveryCity     : City;
    weight           : Decimal(10,2);
    status           : ShipmentStatus default 'Booked';
    bookedAt         : DateTime;
    pickedUpAt       : DateTime;
    deliveredAt      : DateTime;
    estimatedDelivery: DateTime;
    actualDistance   : Distance;
    charges          : Amount;
    paymentStatus    : PaymentStatus default 'Pending';
}

entity Routes : cuid, managed {
    fromCity       : City;
    toCity         : City;
    distance       : Distance; // in km
    estimatedHours : Decimal(5,2);
    tollCharges    : Amount;
    isActive       : Boolean default true;
}

entity ServiceRecords : cuid, managed {
    vehicle          : Association to Vehicles;
    serviceDate      : Date;
    serviceType      : String enum { Regular; Repair; Accident; };
    cost             : Amount;
    description      : String(255);
    nextServiceDate  : Date;
}