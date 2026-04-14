export interface Category {
  id: string;
  label: string;
  children?: Category[];
}

export const CATEGORY_TREE: Category[] = [
  {
    id: 'Electronics',
    label: 'Electronics',
    children: [
      {
        id: 'Laptops',
        label: 'Laptops',
        children: [
          { id: 'Gaming Laptops', label: 'Gaming Laptops' },
          { id: 'Ultrabooks', label: 'Ultrabooks' },
          { id: 'Workstations', label: 'Workstations' },
        ],
      },
      {
        id: 'Smartphones',
        label: 'Smartphones',
        children: [
          { id: 'Android', label: 'Android' },
          { id: 'iOS', label: 'iOS' },
        ],
      },
      {
        id: 'Tablets',
        label: 'Tablets',
        children: [
          { id: 'iPad', label: 'iPad' },
          { id: 'Android Tablets', label: 'Android Tablets' },
        ],
      },
      {
        id: 'TVs',
        label: 'TVs',
        children: [
          { id: 'OLED TVs', label: 'OLED' },
          { id: 'QLED TVs', label: 'QLED' },
          { id: '8K TVs', label: '8K' },
        ],
      },
    ],
  },
  {
    id: 'Audio',
    label: 'Audio',
    children: [
      { id: 'Headphones', label: 'Headphones' },
      { id: 'Speakers', label: 'Speakers' },
      { id: 'Earbuds', label: 'Earbuds' },
    ],
  },
  {
    id: 'Wearables',
    label: 'Wearables',
    children: [
      { id: 'Smartwatches', label: 'Smartwatches' },
      { id: 'Fitness Trackers', label: 'Fitness Trackers' },
    ],
  },
  {
    id: 'Accessories',
    label: 'Accessories',
    children: [
      { id: 'Chargers', label: 'Chargers' },
      { id: 'Cases', label: 'Cases' },
      { id: 'Cables', label: 'Cables' },
    ],
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
