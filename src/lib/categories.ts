export interface Category {
  id: string;
  label: string;
  children?: Category[];
}

export const CATEGORY_TREE: Category[] = [
  {
    id: 'Smartphones',
    label: '📱 Smartphones',
    children: [
      { id: 'iOS', label: 'iOS (iPhone)' },
      { id: 'Android', label: 'Android' },
    ],
  },
  {
    id: 'Smartwatches',
    label: '⌚ Smart Watches',
    children: [
      { id: 'Smartwatches', label: 'Smartwatches' },
      { id: 'Fitness Trackers', label: 'Fitness Trackers' },
    ],
  },
  {
    id: 'TVs',
    label: '📺 TVs',
    children: [
      { id: 'OLED TVs', label: 'OLED' },
      { id: 'QLED TVs', label: 'QLED' },
      { id: '8K TVs', label: '8K' },
    ],
  },
  {
    id: 'Audio',
    label: '🎧 Audio',
    children: [
      { id: 'Headphones', label: 'Headphones' },
      { id: 'Earbuds', label: 'Earbuds' },
      { id: 'Speakers', label: 'Speakers' },
    ],
  },
  {
    id: 'Laptops',
    label: '💻 Laptops',
    children: [
      { id: 'Gaming Laptops', label: 'Gaming' },
      { id: 'Ultrabooks', label: 'Ultrabooks' },
      { id: 'Workstations', label: 'Workstations' },
    ],
  },
  {
    id: 'Tablets',
    label: '📟 Tablets',
    children: [
      { id: 'iPad', label: 'iPad' },
      { id: 'Android Tablets', label: 'Android Tablets' },
    ],
  },
  {
    id: 'Gaming',
    label: '🎮 Gaming',
    children: [
      { id: 'Gaming Consoles', label: 'Consoles' },
      { id: 'VR & AR', label: 'VR / AR' },
      { id: 'Gaming Accessories', label: 'Accessories' },
    ],
  },
  {
    id: 'Computer Accessories',
    label: '🖥 PC Accessories',
  },
  {
    id: 'Accessories',
    label: '🔌 Accessories',
    children: [
      { id: 'Chargers', label: 'Chargers' },
      { id: 'Cables', label: 'Cables' },
      { id: 'Cases', label: 'Cases' },
    ],
  },
  {
    id: 'Smart Home',
    label: '🏠 Smart Home',
  },
  {
    id: 'Car Tech',
    label: '🚗 Car Tech',
  },
  {
    id: 'Trending',
    label: '🔥 Trending',
  },
];

/** Returns all descendant ids including self */
export function getAllIds(cat: Category): string[] {
  const ids = [cat.id];
  if (cat.children) {
    for (const child of cat.children) {
      ids.push(...getAllIds(child));
    }
  }
  return ids;
}

/** Flat list of all category ids */
export function flatIds(tree: Category[]): string[] {
  return tree.flatMap(getAllIds);
}
