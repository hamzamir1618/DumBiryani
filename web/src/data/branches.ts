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
    id: "clifton",
    name: "Clifton Block 5",
    urdu: "کلفٹن",
    city: "Karachi",
    cityUrdu: "کراچی",
    address: "Shop 4, Khayaban-e-Roomi, Block 5, Clifton",
    phone: "021 3530 1900",
    hours: "12:00 – 23:00, every day",
    seats: 64,
    opened: 2019,
    photo: "/photos/dining-room.jpg",
    note: "The first room. The original handi still comes out of this kitchen.",
  },
  {
    id: "dha",
    name: "DHA Phase 6",
    urdu: "ڈی ایچ اے",
    city: "Karachi",
    cityUrdu: "کراچی",
    address: "Ittehad Lane 3, Phase 6, DHA",
    phone: "021 3584 2210",
    hours: "12:00 – 23:30, every day",
    seats: 88,
    opened: 2021,
    photo: "/photos/dining-room-2.jpg",
    note: "The largest of the four, and the only one that takes large tables without notice.",
  },
  {
    id: "mmalam",
    name: "MM Alam Road",
    urdu: "ایم ایم عالم",
    city: "Lahore",
    cityUrdu: "لاہور",
    address: "Block C2, Gulberg III, MM Alam Road",
    phone: "042 3577 4180",
    hours: "12:30 – 00:00, every day",
    seats: 72,
    opened: 2022,
    photo: "/photos/seekh-kebab.jpg",
    note: "Charcoal grill runs alongside the handis here. Kebabs are worth the detour.",
  },
  {
    id: "f7",
    name: "F-7 Markaz",
    urdu: "ایف سیون",
    city: "Islamabad",
    cityUrdu: "اسلام آباد",
    address: "Bhittai Road, F-7 Markaz",
    phone: "051 2654 330",
    hours: "12:00 – 23:00, closed Mondays",
    seats: 56,
    opened: 2024,
    photo: "/photos/bowl-dark.jpg",
    note: "The newest room, and the quietest. Booking is sensible at the weekend.",
  },
];

export const areas = [
  "Clifton",
  "DHA Phase 5",
  "DHA Phase 6",
  "Bahadurabad",
  "Gulshan-e-Iqbal",
  "PECHS",
];

export const slots = ["As soon as it is ready", "20:00", "20:30", "21:00", "21:30"];

export const byBranch = (id: string) => branches.find((b) => b.id === id);
