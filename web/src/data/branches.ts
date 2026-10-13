export type Branch = {
  id: string;
  name: string;
  /** The name on the board outside. */
  urdu: string;
  city: string;
  cityUrdu: string;
  address: string;
  phone: string;
  hours: string;
  seats: number;
  opened: number;
  photo: string;
  note: string;
};

export const branches: Branch[] = [
  {
    id: "dha",
    name: "DHA Phase 6",
    urdu: "ڈی ایچ اے",
    city: "Karachi",
    cityUrdu: "کراچی",
    address: "19-C Service Lane, Nishat Commercial, DHA Phase 6",
    phone: "021 3584 2210",
    hours: "12:00 – 23:30, every day",
    seats: 88,
    opened: 2019,
    photo: "/photos/dining-room.jpg",
    note: "The first kitchen. The original handi still comes out of this one.",
  },
  {
    id: "i10",
    name: "I-10/4",
    urdu: "آئی ١٠",
    city: "Islamabad",
    cityUrdu: "اسلام آباد",
    address: "Sohni Road, I-10/4",
    phone: "051 2287 4410",
    hours: "12:00 – 23:00, every day",
    seats: 64,
    opened: 2022,
    photo: "/photos/dining-room-2.jpg",
    note: "Long tables and a view straight into the kitchen.",
  },
  {
    id: "g8",
    name: "G-8 Markaz",
    urdu: "جی ٨ مرکز",
    city: "Islamabad",
    cityUrdu: "اسلام آباد",
    address: "Street 20A, G-8 Markaz",
    phone: "051 2654 330",
    hours: "12:00 – 23:00, closed Mondays",
    seats: 56,
    opened: 2024,
    photo: "/photos/biryani-copper.jpg",
    note: "The smallest room, and the one that sells out first.",
  },
];
