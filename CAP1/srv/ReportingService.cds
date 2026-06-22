using { my.views as v } from '../db/views';

service ReportingService @(path: '/reports') {
    @readonly entity AvailableBooks    as projection on v.AvailableBooks;
    @readonly entity OverdueBorrowings as projection on v.OverdueBorrowings;
    @readonly entity BookPricing      as projection on v.BookPricing;
    @readonly entity MemberActivity   as projection on v.MemberActivity;
}