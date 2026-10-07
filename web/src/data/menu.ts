export type Category = "Biryani" | "Sides" | "Sweets" | "Drinks";

export type Dish = {
  id: string;
  /** The name as it is written on the board in the shop. */
  urdu: string;
  name: string;
  /** Short name for the big display type, split into lines. */
  lines: [string, string];
  category: Category;
  price: number;
  dum?: number;
  photo: string;
  blurb: string;
  description: string;
  tags: ("mutton" | "chicken" | "veg")[];
};

export const dishes: Dish[] = [
  {
    id: "kachchi",
    urdu: "کچی مٹن",
    name: "Hyderabadi Kachchi Mutton",
    lines: ["Kachchi", "Mutton"],
    category: "Biryani",
    price: 1450,
    dum: 45,
    photo: "/photos/mutton-rice.jpg",
    blurb: "Mutton, saffron, fried onion",
    description:
      "Raw-marinated mutton and aged basmati, layered and sealed together in the handi. Saffron, fried onion, mint. Forty-five minutes on dum, opened at your table.",
    tags: ["mutton"],
  },
  {
    id: "murgh",
    urdu: "مرغ دم",
    name: "Murgh Dum",
    lines: ["Murgh", "Dum"],
    category: "Biryani",
    price: 1150,
    dum: 35,
    photo: "/photos/biryani-pan.jpg",
    blurb: "Chicken on the bone, mint, kewra",
    description:
      "Chicken on the bone with mint, rose water and kewra, sealed over aged basmati and cooked down slowly.",
    tags: ["chicken"],
  },
  {
    id: "nizami",
    urdu: "نظامی شاہی",
    name: "Nizami Shahi Dum",
    lines: ["Nizami", "Shahi"],
    category: "Biryani",
    price: 1650,
    dum: 55,
    photo: "/photos/biryani-handi.jpg",
    blurb: "Lamb shank, cashew, apricot",
    description:
      "Slow-braised lamb shank with cashew, apricot and silver leaf. A court recipe, cooked with patience and very little hurry.",
    tags: ["mutton"],
  },
  {
    id: "sindhi",
    urdu: "آلو بخارا",
    name: "Sindhi Aloo Bukhara",
    lines: ["Aloo", "Bukhara"],
    category: "Biryani",
    price: 1250,
    dum: 40,
    photo: "/photos/biryani-red-cloth.jpg",
    blurb: "Chicken, sour plum, green chilli",
    description:
      "Chicken, sour plum, potato and green chilli. Bright, tangy, and properly hot if you ask for it.",
    tags: ["chicken"],
  },
  {
    id: "subz",
    urdu: "سبز دم",
    name: "Subz Dum",
    lines: ["Subz", "Dum"],
    category: "Biryani",
    price: 950,
    dum: 30,
    photo: "/photos/biryani-copper.jpg",
    blurb: "Seasonal vegetables, paneer, cashew",
    description:
      "Seasonal vegetables and paneer with ghee-roasted cashews, sealed and steamed the same way as the rest.",
    tags: ["veg"],
  },
  {
    id: "seekh",
    urdu: "سیخ کباب",
    name: "Seekh Kebab",
    lines: ["Seekh", "Kebab"],
    category: "Sides",
    price: 850,
    photo: "/photos/seekh-kebab.jpg",
    blurb: "Hand-pressed mince, charred over coal",
    description: "Hand-pressed mince on skewers, charred over live coal, with green chutney.",
    tags: ["mutton"],
  },
  {
    id: "raita",
    urdu: "برانی رائتہ",
    name: "Burani Raita",
    lines: ["Burani", "Raita"],
    category: "Sides",
    price: 250,
    photo: "/photos/raita.jpg",
    blurb: "Hung yoghurt, charred garlic, cumin",
    description: "Hung yoghurt with charred garlic and roasted cumin. Cold, thick, and the right answer to a hot handi.",
    tags: ["veg"],
  },
  {
    id: "salan",
    urdu: "مرچی کا سالن",
    name: "Mirchi ka Salan",
    lines: ["Mirchi", "Salan"],
    category: "Sides",
    price: 350,
    photo: "/photos/spice-spoons.jpg",
    blurb: "Chillies, peanut, sesame, tamarind",
    description: "Long green chillies simmered in a peanut, sesame and tamarind gravy.",
    tags: ["veg"],
  },
  {
    id: "meetha",
    urdu: "ڈبل کا میٹھا",
    name: "Double ka Meetha",
    lines: ["Double ka", "Meetha"],
    category: "Sweets",
    price: 450,
    photo: "/photos/dessert.jpg",
    blurb: "Fried bread, saffron milk, pistachio",
    description: "Fried bread soaked in saffron milk and set with rabri and pistachio.",
    tags: ["veg"],
  },
  {
    id: "qubani",
    urdu: "قوبانی کا میٹھا",
    name: "Qubani ka Meetha",
    lines: ["Qubani", "Meetha"],
    category: "Sweets",
    price: 500,
    photo: "/photos/star-anise.jpg",
    blurb: "Hunza apricots, cream, almond",
    description: "Stewed Hunza apricots with fresh cream and blanched almond.",
    tags: ["veg"],
  },
  {
    id: "sherbet",
    urdu: "گلاب شربت",
    name: "Rose Sherbet",
    lines: ["Rose", "Sherbet"],
    category: "Drinks",
    price: 300,
    photo: "/photos/lassi.jpg",
    blurb: "Rose syrup, basil seed, cold milk",
    description: "Rose syrup, basil seed and cold milk, poured over ice.",
    tags: ["veg"],
  },
  {
    id: "chai",
    urdu: "دودھ پتی چائے",
    name: "Doodh Patti Chai",
    lines: ["Doodh", "Patti"],
    category: "Drinks",
    price: 250,
    photo: "/photos/chai.jpg",
    blurb: "Boiled milk, strong leaf, cardamom",
    description: "Leaf boiled down in whole milk with cardamom until it is thick enough to hold the spoon. Poured at the table.",
    tags: ["veg"],
  },
];

export const categories: Category[] = ["Biryani", "Sides", "Sweets", "Drinks"];

export const categoryUrdu: Record<Category, string> = {
  Biryani: "بریانی",
  Sides: "لوازمات",
  Sweets: "مٹھائی",
  Drinks: "مشروبات",
};

export const byId = (id: string) => dishes.find((d) => d.id === id);

export const rupees = (n: number) => `Rs ${n.toLocaleString("en-US")}`;

export const portions = [
  { name: "Single", multiplier: 1, serves: "Serves 1" },
  { name: "Sharing", multiplier: 1.9, serves: "Serves 2 to 3" },
  { name: "Family handi", multiplier: 3.4, serves: "Serves 5 to 6" },
] as const;

export const spiceLevels = ["Mild", "Medium", "Hot", "Nizami"] as const;

export const addOns = [
  { id: "raita", name: "Burani raita", price: 250 },
  { id: "salan", name: "Mirchi ka salan", price: 350 },
  { id: "egg", name: "Boiled egg", price: 120 },
  { id: "saffron", name: "Extra saffron", price: 200 },
] as const;

export const portionPrice = (dish: Dish, index: number) =>
  Math.round((dish.price * portions[index].multiplier) / 50) * 50;
