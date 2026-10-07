/** Placeholder menu data until the backend is connected. */
export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'biryani' | 'sides' | 'desserts' | 'drinks';
};

export const dishes: Dish[] = [
  {
    id: 'hyderabadi-mutton',
    name: 'Hyderabadi Mutton Dum',
    description: 'Kachchi-style mutton, aged basmati, and saffron, sealed with dough and slow-cooked on dum.',
    price: 1450,
    category: 'biryani',
  },
  {
    id: 'murgh-dum',
    name: 'Murgh Dum',
    description: 'Chicken on the bone, fried onions, mint, and rose water.',
    price: 1150,
    category: 'biryani',
  },
  {
    id: 'subz-dum',
    name: 'Subz Dum',
    description: 'Seasonal vegetables, kewra, and ghee-roasted cashews.',
    price: 950,
    category: 'biryani',
  },
];
