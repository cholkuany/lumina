export interface CategoryGroup {
  name: string;
  items: string[];
}

export interface Department {
  slug: string;
  name: string;
  groups: CategoryGroup[];
}

export const departments: Department[] = [
  {
    slug: "electronics",
    name: "Electronics",
    groups: [
      { name: "Computers", items: ["Laptops", "Desktops", "Monitors", "Keyboards & mice", "Storage & drives", "Laptop accessories"] },
      { name: "Audio", items: ["Headphones", "Earbuds", "Bluetooth speakers", "Soundbars", "Turntables", "Microphones"] },
      { name: "Phones & tablets", items: ["Smartphones", "Tablets", "Cases & covers", "Chargers & cables", "Power banks", "Screen protectors"] },
      { name: "Cameras", items: ["Mirrorless", "DSLR", "Action cameras", "Lenses", "Tripods", "Drones"] },
      { name: "TV & home theatre", items: ["Smart TVs", "Streaming devices", "Projectors", "Mounts & stands"] },
    ],
  },
  {
    slug: "home-kitchen",
    name: "Home & kitchen",
    groups: [
      { name: "Cookware", items: ["Frying pans", "Saucepans", "Cast iron", "Bakeware", "Pressure cookers", "Cookware sets"] },
      { name: "Small appliances", items: ["Air fryers", "Coffee makers", "Blenders", "Toasters", "Stand mixers", "Kettles"] },
      { name: "Dining", items: ["Dinnerware", "Glassware", "Cutlery", "Serveware", "Table linens"] },
      { name: "Storage & organization", items: ["Food containers", "Shelving", "Closet organizers", "Laundry baskets"] },
      { name: "Bedding & bath", items: ["Sheet sets", "Duvets & comforters", "Pillows", "Towels", "Shower curtains"] },
    ],
  },
  {
    slug: "fashion",
    name: "Fashion",
    groups: [
      { name: "Women", items: ["Dresses", "Tops & blouses", "Jeans", "Knitwear", "Coats & jackets", "Activewear"] },
      { name: "Men", items: ["Shirts", "T-shirts", "Trousers & chinos", "Hoodies", "Coats & jackets", "Suits"] },
      { name: "Shoes", items: ["Sneakers", "Boots", "Sandals", "Dress shoes", "Slippers"] },
      { name: "Accessories", items: ["Bags & backpacks", "Belts", "Hats & beanies", "Scarves", "Sunglasses", "Watches"] },
      { name: "Kids & baby", items: ["Girls' clothing", "Boys' clothing", "Baby onesies", "School uniforms"] },
    ],
  },
  {
    slug: "beauty",
    name: "Beauty & personal care",
    groups: [
      { name: "Skincare", items: ["Cleansers", "Moisturizers", "Serums", "Sunscreen", "Masks", "Eye care"] },
      { name: "Hair care", items: ["Shampoo", "Conditioner", "Styling tools", "Hair colour", "Treatments"] },
      { name: "Makeup", items: ["Face", "Eyes", "Lips", "Brushes & tools", "Makeup removers"] },
      { name: "Fragrance", items: ["Women's fragrance", "Men's fragrance", "Gift sets", "Body mists"] },
      { name: "Grooming", items: ["Shaving", "Beard care", "Electric razors", "Oral care"] },
    ],
  },
  {
    slug: "sports-outdoors",
    name: "Sports & outdoors",
    groups: [
      { name: "Camping & hiking", items: ["Tents", "Sleeping bags", "Backpacks", "Camp kitchen", "Headlamps", "Trekking poles"] },
      { name: "Fitness", items: ["Yoga mats", "Dumbbells", "Resistance bands", "Cardio machines", "Foam rollers"] },
      { name: "Cycling", items: ["Bikes", "Helmets", "Bike accessories", "Repair & tools", "Cycling apparel"] },
      { name: "Water sports", items: ["Swimwear", "Snorkelling", "Paddleboards", "Life jackets"] },
      { name: "Winter sports", items: ["Skis & snowboards", "Snow apparel", "Goggles", "Sleds"] },
    ],
  },
  {
    slug: "toys-games",
    name: "Toys & games",
    groups: [
      { name: "By age", items: ["Baby & toddler", "Ages 3–5", "Ages 6–8", "Ages 9–12", "Teens"] },
      { name: "Categories", items: ["Building blocks", "Puzzles", "Board games", "Dolls & figures", "Arts & crafts", "Outdoor play"] },
      { name: "Video games", items: ["Consoles", "Games", "Controllers", "Accessories", "Digital cards"] },
      { name: "Collectibles", items: ["Trading cards", "Model kits", "Action figures"] },
    ],
  },
  {
    slug: "groceries",
    name: "Groceries",
    groups: [
      { name: "Pantry", items: ["Pasta & rice", "Oils & vinegars", "Canned goods", "Spices", "Baking supplies"] },
      { name: "Snacks", items: ["Chips & crisps", "Chocolate", "Nuts & seeds", "Granola bars", "Popcorn"] },
      { name: "Beverages", items: ["Coffee", "Tea", "Sparkling water", "Juice", "Energy drinks"] },
      { name: "Breakfast", items: ["Cereal", "Oats", "Spreads", "Syrups"] },
    ],
  },
  {
    slug: "pet-supplies",
    name: "Pet supplies",
    groups: [
      { name: "Dogs", items: ["Dog food", "Treats", "Leashes & collars", "Beds", "Toys", "Grooming"] },
      { name: "Cats", items: ["Cat food", "Litter & boxes", "Scratchers", "Toys", "Carriers"] },
      { name: "Small pets", items: ["Bird supplies", "Fish & aquariums", "Rabbit & rodent"] },
    ],
  },
  {
    slug: "tools-auto",
    name: "Tools & automotive",
    groups: [
      { name: "Hand tools", items: ["Screwdrivers", "Wrenches", "Hammers", "Tool sets", "Measuring tools"] },
      { name: "Power tools", items: ["Drills", "Saws", "Sanders", "Batteries & chargers"] },
      { name: "Automotive", items: ["Car care", "Interior accessories", "Tires & wheels", "Replacement parts", "Dash cams"] },
      { name: "Garden", items: ["Lawn mowers", "Hoses & watering", "Planters", "Garden hand tools"] },
    ],
  },
  {
    slug: "books-office",
    name: "Books & office",
    groups: [
      { name: "Books", items: ["Fiction", "Non-fiction", "Children's books", "Cookbooks", "Textbooks", "E-readers"] },
      { name: "Office supplies", items: ["Notebooks", "Pens & pencils", "Paper", "Filing & storage", "Printers & ink"] },
      { name: "Home office", items: ["Desks", "Office chairs", "Desk lamps", "Monitor arms"] },
    ],
  },
];

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}