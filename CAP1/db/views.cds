namespace my.views;

using {lib.management} from './schema';

// ─── VIEW 1: Available Books (for library kiosk) ───
entity AvailableBooks as select from management.Books {
    ID,
    title,
    isbn,
    price,
    availableCopies,
    author.firstName || ' ' || author.lastName as authorName : String(101),
    genre.name as genreName
} where availableCopies > 0;

// ─── VIEW 2: Overdue Borrowings (for staff) ────────
entity OverdueBorrowings as select from management.Borrowings {
    ID,
    borrowDate,
    dueDate,
    fineAmount,
    book.title as bookTitle,
    member.firstName || ' ' || member.lastName as memberName : String(101),
    member.email as memberEmail,
    member.phone as memberPhone
} where status = 'Overdue';

// ─── VIEW 3: Book Summary with pricing ─────────────
entity BookPricing as select from management.Books {
    ID,
    title,
    price
};

// ─── VIEW 4: Member Activity ───────────────────────
entity MemberActivity as select from management.Members {
    ID,
    firstName || ' ' || lastName as memberName : String(101)
};