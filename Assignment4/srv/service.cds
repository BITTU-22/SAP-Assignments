using { platform.events as my } from '../db/schema';

service EventService {
    entity Venues        as projection on my.Venues;
    entity Events        as projection on my.Events;
    entity Speakers      as projection on my.Speakers;
    entity EventSpeakers as projection on my.EventSpeakers;
    entity Registrations as projection on my.Registrations;
    entity Feedback      as projection on my.Feedback;
}