/**
 * EMBER & OAK — Modern Dining
 * Core Menu Data
 * Comprehensive gourmet culinary catalog with realistic ingredients, prices, dietary tags, and dual image paths (local + CDN fallback).
 */

const MENU_CONFIG = {
  restaurantName: "EMBER & OAK",
  tagline: "Modern Dining • Wood-Fired Craft",
  currencySymbol: "₹",
  taxRate: 0.05, // 5% GST // 8.25%
  serviceFeeRate: 0.05, // 5% artisanal kitchen fee
  defaultTableId: "T01",
  productionBaseUrl: "" // Auto-resolved to active host URL (menu.html)
};

const MENU_ITEMS = [
  // ==================== STARTERS ====================
  {
    id: "starter-1",
    name: "Truffle & Fontina Arancini",
    category: "starters",
    price: 495.00,
    rating: 4.9,
    reviews: 84,
    description: "Crispy arborio spheres filled with melted Fontina cheese and black winter truffle, served over roasted garlic emulsion.",
    longDescription: "Hand-rolled risotto spheres gently crisped in cold-pressed olive oil. Stuffed with aged Italian Fontina cheese and fragrant black winter truffles, finished with fresh micro herbs and sea salt crystals.",
    image: "assets/images/dish-truffle-arancini.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=800&q=80&auto=format&fit=crop",
    calories: 420,
    isVegetarian: true,
    isGlutenFree: false,
    isChefSpecial: true,
    spiciness: 0,
    prepTime: "12 mins",
    ingredients: ["Carnaroli Rice", "Black Winter Truffle", "Fontina Val d'Aosta", "Garlic Aioli", "Chives"],
    addOns: [
      { name: "Extra Black Truffle Shavings", price: 150.00 },
      { name: "Truffle Honey Drizzle", price: 75.00 }
    ]
  },
  {
    id: "starter-2",
    name: "Wood-Fired Heirloom Bruschetta",
    category: "starters",
    price: 395.00,
    rating: 4.8,
    reviews: 62,
    description: "Charred sourdough crusts topped with marinated heirloom tomatoes, torn Genovese basil, and 12-year aged balsamic glaze.",
    longDescription: "Fermented artisan sourdough charred directly over oak embers, rubbed with raw garlic, and layered with tri-color heirloom tomatoes steeped in cold-pressed olive oil, basil flowers, and Modena balsamic reduction.",
    image: "assets/images/dish-bruschetta.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&q=80&auto=format&fit=crop",
    calories: 310,
    isVegetarian: true,
    isGlutenFree: false,
    isChefSpecial: false,
    spiciness: 0,
    prepTime: "10 mins",
    ingredients: ["Oak-Charred Sourdough", "Heirloom Tomatoes", "Genovese Basil", "12-Yr Balsamic", "Fleur de Sel"],
    addOns: [
      { name: "Smoked Stracciatella Cheese", price: 110.00 },
      { name: "Prosciutto di Parma Crudo", price: 150.00 }
    ]
  },
  {
    id: "starter-3",
    name: "Crispy Calamari Fritti",
    category: "starters",
    price: 525.00,
    rating: 4.8,
    reviews: 96,
    description: "Tender Monterey squid dusted in semolina and tossed with blistered shishito peppers, charred lemon, and saffron aioli.",
    longDescription: "Flash-fried tender squid tubes and tentacles in an ultra-light sea salt crust. Accompanied by charred sweet shishito peppers, pickled chili rings, and a golden Spanish saffron emulsion.",
    image: "assets/images/dish-calamari.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&q=80&auto=format&fit=crop",
    calories: 460,
    isVegetarian: false,
    isGlutenFree: false,
    isChefSpecial: false,
    spiciness: 1,
    prepTime: "10 mins",
    ingredients: ["Monterey Squid", "Semolina Crust", "Shishito Peppers", "Saffron Garlic Aioli", "Charred Lemon"],
    addOns: [
      { name: "Spicy Calabrian Chili Oil", price: 50.00 },
      { name: "Extra Saffron Aioli", price: 60.00 }
    ]
  },
  {
    id: "starter-4",
    name: "Smoked Burrata & Charred Peaches",
    category: "starters",
    price: 575.00,
    rating: 5.0,
    reviews: 110,
    description: "Pugliese burrata cheese lightly cold-smoked, served with grilled yellow peaches, wild baby arugula, and crushed pistachio praline.",
    longDescription: "Imported fresh burrata infused with gentle applewood cold smoke. Paired with caramelized sweet stone fruit, peppery wild rocket, Sicilian roasted pistachios, and floral clover honey.",
    image: "assets/images/dish-burrata.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop",
    calories: 390,
    isVegetarian: true,
    isGlutenFree: true,
    isChefSpecial: true,
    spiciness: 0,
    prepTime: "8 mins",
    ingredients: ["Pugliese Burrata", "Grilled Peaches", "Wild Arugula", "Pistachio Praline", "Wildflower Honey"],
    addOns: [
      { name: "Grilled Herb Focaccia", price: 90.00 },
      { name: "Crispy Guanciale Bits", price: 110.00 }
    ]
  },

  // ==================== BURGERS ====================
  {
    id: "burger-1",
    name: "The Ember Wagyu Reserve Burger",
    category: "burgers",
    price: 795.00,
    rating: 5.0,
    reviews: 215,
    description: "Prime A5 Wagyu blend patty, double melted aged cheddar, smoked marrow aioli, caramelized shallot jam, on toasted brioche.",
    longDescription: "Our crown jewel burger inspired by modern steakhouse mastery. 8oz of custom-ground A5 Wagyu and dry-aged brisket flame-seared over white oak coals. Layered with two thick cuts of 18-month sharp Vermont cheddar, house bacon jam, and truffle bone marrow emulsion inside a golden brioche bun.",
    image: "assets/images/dish-wagyu-burger.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80&auto=format&fit=crop",
    calories: 840,
    isVegetarian: false,
    isGlutenFree: false,
    isChefSpecial: true,
    spiciness: 0,
    prepTime: "15 mins",
    ingredients: ["A5 Wagyu & Brisket Blend", "18-Mo Vermont Cheddar", "Shallot Bacon Jam", "Bone Marrow Aioli", "Artisan Brioche"],
    addOns: [
      { name: "Thick Cut Applewood Bacon", price: 120.00 },
      { name: "Fried Farmhouse Egg", price: 75.00 },
      { name: "Truffle Parmesan Fries", price: 150.00 }
    ]
  },
  {
    id: "burger-2",
    name: "Smoked Cheddar & Hickory Bacon Burger",
    category: "burgers",
    price: 675.00,
    rating: 4.9,
    reviews: 140,
    description: "Oak-grilled Angus beef, thick applewood bacon, smoked Wisconsin cheddar, bourbon barbecue glaze, and crispy tobacco onions.",
    longDescription: "Prime ground Angus chuck grilled medium over embers. Smothered in slow-simmered Kentucky bourbon BBQ sauce, double smoked bacon slabs, and mountain of crispy flash-fried spiced shallot rings.",
    image: "assets/images/dish-cheddar-bacon-burger.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&q=80&auto=format&fit=crop",
    calories: 890,
    isVegetarian: false,
    isGlutenFree: false,
    isChefSpecial: false,
    spiciness: 1,
    prepTime: "14 mins",
    ingredients: ["Black Angus Beef", "Smoked Cheddar", "Applewood Bacon", "Bourbon BBQ Glaze", "Crispy Onions"],
    addOns: [
      { name: "Extra Bacon Slices (2)", price: 95.00 },
      { name: "Pickled Jalapeño Coins", price: 50.00 }
    ]
  },
  {
    id: "burger-3",
    name: "Crispy Buttermilk Truffle Chicken Burger",
    category: "burgers",
    price: 625.00,
    rating: 4.8,
    reviews: 118,
    description: "24-hour buttermilk soaked organic chicken thigh, twice-fried crisp, black truffle ranch, red cabbage slaw, and dill pickles.",
    longDescription: "Free-range chicken thigh marinated in herb buttermilk and cayenne spices. Fried to supreme golden crunch, coated in whipped truffle emulsion, crunchy citrus slaw, and sour barrel pickles.",
    image: "assets/images/dish-crispy-chicken-burger.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&q=80&auto=format&fit=crop",
    calories: 760,
    isVegetarian: false,
    isGlutenFree: false,
    isChefSpecial: false,
    spiciness: 1,
    prepTime: "12 mins",
    ingredients: ["Crispy Buttermilk Chicken", "Truffle Herb Ranch", "Red Cabbage Slaw", "Pickled Cucumbers", "Potato Bun"],
    addOns: [
      { name: "Nashville Hot Dip Glaze", price: 60.00 },
      { name: "Melted Pepperjack Cheese", price: 75.00 }
    ]
  },
  {
    id: "burger-4",
    name: "Forest Mushroom & Swiss Brioche",
    category: "burgers",
    price: 645.00,
    rating: 4.7,
    reviews: 73,
    description: "Char-grilled beef patty or portobello cap, sautéed chanterelles and king oysters, melted Gruyère cheese, and black garlic mayo.",
    longDescription: "An earthy, deeply savory creation featuring a sauté of wild forest mushrooms deglazed with dry Madeira wine. Blanketed under creamy Swiss Gruyère and rich black garlic mayonnaise.",
    image: "assets/images/dish-mushroom-swiss-burger.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80&auto=format&fit=crop",
    calories: 730,
    isVegetarian: false,
    isGlutenFree: false,
    isChefSpecial: false,
    spiciness: 0,
    prepTime: "13 mins",
    ingredients: ["Angus Beef (or Portobello)", "Sautéed Forest Mushrooms", "Cave-Aged Gruyère", "Black Garlic Mayo", "Brioche Bun"],
    addOns: [
      { name: "Swap for Organic Portobello Cap (Veg)", price: 0.00 },
      { name: "Double Gruyère Cheese", price: 90.00 }
    ]
  },

  // ==================== MAIN COURSE ====================
  {
    id: "mains-1",
    name: "Wood-Fired Tomahawk Ribeye (32oz)",
    category: "mains",
    price: 2850.00,
    rating: 5.0,
    reviews: 164,
    description: "USDA Prime 45-day dry-aged bone-in ribeye, seared over live white oak coals, roasted bone marrow, and smoked herb chimichurri.",
    longDescription: "Our flagship sharing cut. 32 ounces of prime dry-aged beef showcasing deep nutty marble. Hand-rubbed with cracked tellicherry peppercorns and flaked Maldon sea salt, basted with rosemary brown butter over embers.",
    image: "assets/images/dish-tomahawk-steak.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&auto=format&fit=crop",
    calories: 1250,
    isVegetarian: false,
    isGlutenFree: true,
    isChefSpecial: true,
    spiciness: 0,
    prepTime: "25 mins",
    ingredients: ["45-Day Dry Aged Ribeye", "Herb Brown Butter", "Roasted Bone Marrow", "Charred Garlic", "Oak Chimichurri"],
    addOns: [
      { name: "Seared Jumbo Sea Scallops (2)", price: 450.00 },
      { name: "Black Truffle Butter Disc", price: 150.00 },
      { name: "Crisp Duck Fat Potatoes", price: 195.00 }
    ]
  },
  {
    id: "mains-2",
    name: "Pan-Seared Atlantic King Salmon",
    category: "mains",
    price: 1250.00,
    rating: 4.9,
    reviews: 182,
    description: "Crispy skin Faroe Islands salmon fillet, English pea velouté, charred asparagus, lemon-dill beurre blanc, and salmon roe pearls.",
    longDescription: "Sustainably caught pristine salmon seared till skin is glass-crisp while the flesh remains buttery medium-rare. Served on a vibrant emerald pea emulsion with charred garden shoots and sparkling trout caviar.",
    image: "assets/images/dish-pan-salmon.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80&auto=format&fit=crop",
    calories: 580,
    isVegetarian: false,
    isGlutenFree: true,
    isChefSpecial: true,
    spiciness: 0,
    prepTime: "18 mins",
    ingredients: ["Faroe Island Salmon", "Sweet Pea Puree", "Asparagus Spears", "Dill Beurre Blanc", "Salmon Caviar"],
    addOns: [
      { name: "Charred Lemon-Garlic Prawns (3)", price: 350.00 },
      { name: "Wild Herb Polenta", price: 175.00 }
    ]
  },
  {
    id: "mains-3",
    name: "Oak-Braised Beef Short Ribs",
    category: "mains",
    price: 1350.00,
    rating: 4.9,
    reviews: 97,
    description: "12-hour braised prime short rib, creamy white polenta, glazed baby heritage carrots, and rich Barolo wine reduction.",
    longDescription: "Fork-tender prime beef rib slow cooked over low hardwood embers in rich aromatic stock and Piedmontese Barolo red wine. Resting on stone-ground mascarpone polenta.",
    image: "assets/images/dish-braised-short-ribs.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop",
    calories: 790,
    isVegetarian: false,
    isGlutenFree: true,
    isChefSpecial: false,
    spiciness: 0,
    prepTime: "16 mins",
    ingredients: ["Prime Beef Short Rib", "Stone Ground Polenta", "Heritage Carrots", "Barolo Wine Glaze", "Crisp Sage"],
    addOns: [
      { name: "Grated Fresh Horseradish", price: 50.00 },
      { name: "Caramelized Cipollini Onions", price: 110.00 }
    ]
  },
  {
    id: "mains-4",
    name: "Pan-Roasted Duck Breast",
    category: "mains",
    price: 1195.00,
    rating: 4.8,
    reviews: 79,
    description: "Hudson Valley duck breast, spiced sour cherry reduction, celery root mousseline, and charred broccolini.",
    longDescription: "Crispy diamond-scored skin over juicy pink magret duck breast. Balanced against sweet-tart Montmorency cherries simmered with star anise, cassis liqueur, and velvety root purée.",
    image: "assets/images/dish-roast-duck.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=800&q=80&auto=format&fit=crop",
    calories: 640,
    isVegetarian: false,
    isGlutenFree: true,
    isChefSpecial: false,
    spiciness: 0,
    prepTime: "20 mins",
    ingredients: ["Hudson Valley Duck", "Sour Cherry Gastrique", "Celeriac Mousseline", "Charred Broccolini", "Star Anise"],
    addOns: [
      { name: "Seared Foie Gras Medallion", price: 395.00 },
      { name: "Smoked Sea Salt Flakes", price: 40.00 }
    ]
  },

  // ==================== PIZZA ====================
  {
    id: "pizza-1",
    name: "Neapolitan Margherita Di Bufala",
    category: "pizza",
    price: 595.00,
    rating: 4.9,
    reviews: 135,
    description: "72-hour slow fermented dough, San Marzano D.O.P. tomato sauce, fresh buffalo mozzarella, torn basil, and cold-pressed olive oil.",
    longDescription: "Wood-fired at 480°C in our volcanic stone oven for precisely 90 seconds. Features blistered airy crust, sweet volcanic tomatoes, creamy melted water buffalo mozzarella, and fresh sweet basil leaves.",
    image: "assets/images/dish-margherita-pizza.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80&auto=format&fit=crop",
    calories: 680,
    isVegetarian: true,
    isGlutenFree: false,
    isChefSpecial: false,
    spiciness: 0,
    prepTime: "10 mins",
    ingredients: ["72hr Fermented Flour", "San Marzano D.O.P.", "Mozzarella di Bufala", "Fresh Basil", "EVOO"],
    addOns: [
      { name: "Spicy Calabrian Chili Oil", price: 50.00 },
      { name: "Anchovy Fillets in Olive Oil", price: 110.00 }
    ]
  },
  {
    id: "pizza-2",
    name: "Tartufo & Wild Forest Mushroom",
    category: "pizza",
    price: 745.00,
    rating: 5.0,
    reviews: 172,
    description: "Creamy Fontina & fior di latte base, roasted porcini and chanterelles, fragrant black truffle cream, fresh thyme, and sea salt.",
    longDescription: "A white pizza masterpiece. Earthy roasted wild mushrooms paired with velvet black truffle paste, thyme leaves, and bubbly browned alpine cheese on an ultra-light blistered rim.",
    image: "assets/images/dish-truffle-mushroom-pizza.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80&auto=format&fit=crop",
    calories: 740,
    isVegetarian: true,
    isGlutenFree: false,
    isChefSpecial: true,
    spiciness: 0,
    prepTime: "12 mins",
    ingredients: ["Fontina Cheese", "Porcini Mushrooms", "Black Truffle Puree", "Fior di Latte", "Garden Thyme"],
    addOns: [
      { name: "Fresh Shaved Truffle", price: 195.00 },
      { name: "Crispy Prosciutto Bits", price: 110.00 }
    ]
  },
  {
    id: "pizza-3",
    name: "Prosciutto Crudo & Arugula",
    category: "pizza",
    price: 725.00,
    rating: 4.8,
    reviews: 88,
    description: "Crushed tomato sauce, fresh mozzarella, finished fresh out of oven with 24-month aged Prosciutto di Parma, arugula, and Parmigiano.",
    longDescription: "The contrast of hot blistered cheese and cool, silky cured ham. Fresh baby arugula tossed in lemon vinaigrette and ribbons of shaved 24-month Reggiano over paper-thin prosciutto.",
    image: "assets/images/dish-prosciutto-pizza.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80&auto=format&fit=crop",
    calories: 720,
    isVegetarian: false,
    isGlutenFree: false,
    isChefSpecial: false,
    spiciness: 0,
    prepTime: "11 mins",
    ingredients: ["24-Mo Prosciutto di Parma", "San Marzano Sauce", "Baby Rocket Greens", "Parmigiano Reggiano", "Lemon Oil"],
    addOns: [
      { name: "Burrata Ball in Center", price: 175.00 },
      { name: "Balsamic Glaze Swirl", price: 50.00 }
    ]
  },
  {
    id: "pizza-4",
    name: "Spicy Calabrian Nduja & Hot Honey",
    category: "pizza",
    price: 695.00,
    rating: 4.9,
    reviews: 124,
    description: "Spicy spreadable pork nduja, roasted sweet red peppers, smoked provolone, fresh mozzarella, and a drizzle of wildflower hot honey.",
    longDescription: "Fiery Calabrian sausage melts into bubbling smoked cheese, harmonized by roasted sweet peppers and our house-infused habanero chili wildflower honey.",
    image: "assets/images/dish-spicy-nduja-pizza.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80&auto=format&fit=crop",
    calories: 810,
    isVegetarian: false,
    isGlutenFree: false,
    isChefSpecial: false,
    spiciness: 2,
    prepTime: "11 mins",
    ingredients: ["Calabrian Nduja", "Hot Wildflower Honey", "Smoked Provolone", "Roasted Sweet Peppers", "Oregano"],
    addOns: [
      { name: "Extra Hot Honey Pot", price: 60.00 },
      { name: "Pickled Jalapeños", price: 50.00 }
    ]
  },

  // ==================== PASTA ====================
  {
    id: "pasta-1",
    name: "Handmade Tagliatelle Bolognese",
    category: "pasta",
    price: 675.00,
    rating: 5.0,
    reviews: 194,
    description: "Daily rolled egg tagliatelle, slow-simmered heritage beef, veal & pancetta ragù, whole milk, and 24-month Parmigiano Reggiano.",
    longDescription: "Traditional Bolognese simmered for eight patient hours. Silk egg pasta ribbons clinging to velvety meat sauce with sweet sofrito, white wine, and hand-grated Parmigiano.",
    image: "assets/images/dish-tagliatelle-bolognese.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80&auto=format&fit=crop",
    calories: 690,
    isVegetarian: false,
    isGlutenFree: false,
    isChefSpecial: true,
    spiciness: 0,
    prepTime: "14 mins",
    ingredients: ["Fresh Egg Tagliatelle", "Prime Beef & Veal", "Pancetta Arrotolata", "Parmigiano Reggiano", "Nutmeg"],
    addOns: [
      { name: "Fresh Stracciatella on Top", price: 125.00 },
      { name: "Garlic Focaccia Slice", price: 75.00 }
    ]
  },
  {
    id: "pasta-2",
    name: "Cacio e Pepe al Tartufo",
    category: "pasta",
    price: 645.00,
    rating: 4.9,
    reviews: 147,
    description: "Bronze-die tonnarelli pasta, aged Pecorino Romano D.O.P., toasted black Sarawak peppercorns, and fresh black truffle butter.",
    longDescription: "The timeless Roman classic elevated with black winter truffle. Starchy pasta water emulsified into a glossy cream with sharp sheep's milk cheese and freshly toasted peppercorns.",
    image: "assets/images/dish-cacio-pepe.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&q=80&auto=format&fit=crop",
    calories: 620,
    isVegetarian: true,
    isGlutenFree: false,
    isChefSpecial: false,
    spiciness: 1,
    prepTime: "12 mins",
    ingredients: ["Artisan Tonnarelli", "Pecorino Romano D.O.P.", "Sarawak Peppercorn", "Truffle Butter", "Fleur de Sel"],
    addOns: [
      { name: "Crispy Guanciale Cracklings", price: 110.00 },
      { name: "Fresh Shaved Black Truffle", price: 195.00 }
    ]
  },
  {
    id: "pasta-3",
    name: "Maine Lobster & Crab Ravioli",
    category: "pasta",
    price: 950.00,
    rating: 4.9,
    reviews: 132,
    description: "Handcrafted pillows stuffed with sweet Maine lobster and blue crab, saffron shellfish bisque, and tarragon breadcrumbs.",
    longDescription: "Delicate squid-ink striped egg pasta filled with sweet claw meat and ricotta. Floating in a luxurious saffron-infused lobster bisque finished with aromatic French tarragon.",
    image: "assets/images/dish-lobster-ravioli.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80&auto=format&fit=crop",
    calories: 590,
    isVegetarian: false,
    isGlutenFree: false,
    isChefSpecial: true,
    spiciness: 0,
    prepTime: "16 mins",
    ingredients: ["Maine Lobster", "Blue Crab", "Saffron Bisque", "Tarragon Panko", "Citrus Zest"],
    addOns: [
      { name: "Butter-Poached Lobster Tail (3oz)", price: 475.00 },
      { name: "Trout Caviar Garnish", price: 150.00 }
    ]
  },
  {
    id: "pasta-4",
    name: "Rigatoni Alla Vodka & Burrata",
    category: "pasta",
    price: 625.00,
    rating: 4.8,
    reviews: 110,
    description: "Extruded rigatoni tubes in a velvety San Marzano tomato & cream sauce deglazed with rye vodka, topped with fresh cold burrata.",
    longDescription: "Deep ridges hold the spicy-sweet blush sauce made with caramelized shallots, crushed red peppers, organic heavy cream, and distilled rye spirit. Crowned with chilled creamy burrata.",
    image: "assets/images/dish-rigatoni-vodka.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80&auto=format&fit=crop",
    calories: 670,
    isVegetarian: true,
    isGlutenFree: false,
    isChefSpecial: false,
    spiciness: 1,
    prepTime: "13 mins",
    ingredients: ["Rigatoni Pasta", "Vodka Blush Cream", "Crushed Calabrian Pepper", "Pugliese Burrata", "Sweet Basil"],
    addOns: [
      { name: "Spicy Italian Sausage Crumbles", price: 110.00 },
      { name: "Charred Garlic Bread", price: 75.00 }
    ]
  },

  // ==================== DESSERTS ====================
  {
    id: "dessert-1",
    name: "Molten Valrhona Chocolate Fondant",
    category: "desserts",
    price: 425.00,
    rating: 5.0,
    reviews: 188,
    description: "Warm 70% dark Guanaja chocolate cake with flowing molten core, roasted Madagascar vanilla bean gelato, and smoked salted caramel.",
    longDescription: "Baked to order. A fragile dark chocolate exterior that yields to reveal a decadent warm flowing ganache. Complemented by hand-churned vanilla gelato and warm sea salt caramel sauce.",
    image: "assets/images/dish-chocolate-fondant.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80&auto=format&fit=crop",
    calories: 540,
    isVegetarian: true,
    isGlutenFree: false,
    isChefSpecial: true,
    spiciness: 0,
    prepTime: "14 mins",
    ingredients: ["70% Valrhona Guanaja", "Vanilla Bean Gelato", "Smoked Salted Caramel", "Cocoa Nib Tuile", "Mint"],
    addOns: [
      { name: "Extra Scoop Bourbon Vanilla Gelato", price: 95.00 },
      { name: "Double Smoked Caramel Sauce", price: 60.00 }
    ]
  },
  {
    id: "dessert-2",
    name: "Madagascar Vanilla Bean Panna Cotta",
    category: "desserts",
    price: 375.00,
    rating: 4.8,
    reviews: 82,
    description: "Silky set Piedmontese cream infused with whole vanilla bean pod, macerated wild blackberries, and almond biscotti crumble.",
    longDescription: "Gently trembling, feather-light sweetened cream speckled with thousands of real vanilla seeds. Accompanied by tart berry coulis and toasted almond crunch.",
    image: "assets/images/dish-vanilla-panna-cotta.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80&auto=format&fit=crop",
    calories: 380,
    isVegetarian: true,
    isGlutenFree: true,
    isChefSpecial: false,
    spiciness: 0,
    prepTime: "6 mins",
    ingredients: ["Heavy Cream", "Madagascar Vanilla Pods", "Wild Blackberries", "Almond Biscotti Crumble", "Mint Sprig"],
    addOns: [
      { name: "Aged Port Wine Reduction", price: 85.00 },
      { name: "Extra Biscotti Pieces", price: 60.00 }
    ]
  },
  {
    id: "dessert-3",
    name: "Artisanal Tiramisu Rustico",
    category: "desserts",
    price: 395.00,
    rating: 4.9,
    reviews: 143,
    description: "Espresso-soaked Savoiardi biscuits, whipped sweet mascarpone sabayon, dark Marsala wine, and Dutch cocoa dust.",
    longDescription: "Our chef's homage to Treviso. Ladyfinger sponge soaked in double espresso and aged Sicilian Marsala, folded between layers of whipped sweet mascarpone and generous dark cocoa dusting.",
    image: "assets/images/dish-tiramisu.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80&auto=format&fit=crop",
    calories: 460,
    isVegetarian: true,
    isGlutenFree: false,
    isChefSpecial: false,
    spiciness: 0,
    prepTime: "5 mins",
    ingredients: ["Savoiardi Biscuits", "Double Shot Espresso", "Sweet Mascarpone", "Marsala Superiore", "Valrhona Cocoa"],
    addOns: [
      { name: "Side Shot Hot Espresso", price: 75.00 },
      { name: "Dark Chocolate Shavings", price: 50.00 }
    ]
  },
  {
    id: "dessert-4",
    name: "Caramelized Honeycrisp Tart Tatin",
    category: "desserts",
    price: 415.00,
    rating: 4.9,
    reviews: 67,
    description: "Slow-caramelized Honeycrisp apples, flaky French puff pastry, brown butter cinnamon syrup, and crème fraîche.",
    longDescription: "Golden upside-down pastry with tender apples caramelized in dark brown sugar, butter, and vanilla. Finished with a quenelle of tangy chilled crème fraîche.",
    image: "assets/images/dish-apple-tarte-tatin.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=800&q=80&auto=format&fit=crop",
    calories: 490,
    isVegetarian: true,
    isGlutenFree: false,
    isChefSpecial: false,
    spiciness: 0,
    prepTime: "12 mins",
    ingredients: ["Honeycrisp Apples", "All-Butter Puff Pastry", "Brown Butter Caramel", "Normandy Crème Fraîche", "Cinnamon"],
    addOns: [
      { name: "Cinnamon Gelato Scoop", price: 95.00 },
      { name: "Candied Pecans", price: 60.00 }
    ]
  },

  // ==================== BEVERAGES ====================
  {
    id: "bev-1",
    name: "The Ember Smoked Old Fashioned",
    category: "beverages",
    price: 650.00,
    rating: 5.0,
    reviews: 210,
    description: "Woodford Reserve Kentucky Bourbon, toasted oak smoke infusion, demerara syrup, Angostura & orange bitters, expressed orange peel.",
    longDescription: "Our signature cocktail presented under a glass cloche filled with aromatic white oak wood smoke. Released tableside for an unforgettable olfactory reveal.",
    image: "assets/images/dish-smoked-old-fashioned.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80&auto=format&fit=crop",
    calories: 190,
    isVegetarian: true,
    isGlutenFree: true,
    isChefSpecial: true,
    spiciness: 0,
    prepTime: "4 mins",
    ingredients: ["Bourbon Whiskey", "Toasted Oak Wood Smoke", "Demerara Sugar", "Angostura Bitters", "Luxardo Cherry"],
    addOns: [
      { name: "Upgrade to Michter's 10-Yr Rye", price: 180.00 },
      { name: "Smoked Bacon Strip Garnish", price: 75.00 }
    ]
  },
  {
    id: "bev-2",
    name: "Blood Orange & Rosemary Spritz",
    category: "beverages",
    price: 495.00,
    rating: 4.8,
    reviews: 89,
    description: "Malfy Blood Orange Gin, Prosecco Superiore D.O.C.G., torched garden rosemary sprig, and Fever-Tree soda water.",
    longDescription: "Vibrant ruby Italian aperitivo with effervescent bubbles, crisp citrus aromatics, and the piney smokiness of fresh rosemary charred right before serving.",
    image: "assets/images/dish-rosemary-spritz.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80&auto=format&fit=crop",
    calories: 160,
    isVegetarian: true,
    isGlutenFree: true,
    isChefSpecial: false,
    spiciness: 0,
    prepTime: "3 mins",
    ingredients: ["Sicilian Blood Orange Gin", "Valdobbiadene Prosecco", "Torched Rosemary", "Club Soda", "Grapefruit Wheel"],
    addOns: [
      { name: "Add Elderflower Liqueur Float", price: 95.00 }
    ]
  },
  {
    id: "bev-3",
    name: "Hibiscus Elderflower Zero-Proof Elixir",
    category: "beverages",
    price: 350.00,
    rating: 4.9,
    reviews: 74,
    description: "Brewed wild hibiscus blossoms, French elderflower cordial, fresh yuzu juice, sparkling mineral water, and edible orchid.",
    longDescription: "A sophisticated non-alcoholic botanical creation. Refreshingly tart and floral with lively carbonation and natural antioxidants.",
    image: "assets/images/dish-elderflower-mocktail.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&q=80&auto=format&fit=crop",
    calories: 90,
    isVegetarian: true,
    isGlutenFree: true,
    isChefSpecial: false,
    spiciness: 0,
    prepTime: "3 mins",
    ingredients: ["Cold-Brewed Hibiscus", "St-Germain Style Floral Cordial", "Japanese Yuzu", "Sparkling Water", "Botanical Flower"],
    addOns: [
      { name: "Organic Chia Seed Swirl", price: 40.00 },
      { name: "Extra Crushed Mint", price: 25.00 }
    ]
  },
  {
    id: "bev-4",
    name: "Smoked Oak Nitro Cold Brew",
    category: "beverages",
    price: 275.00,
    rating: 4.8,
    reviews: 64,
    description: "Single-origin Ethiopian Yirgacheffe coffee steeped for 24 hours, infused with pure nitrogen and a hint of smoked Madagascar vanilla.",
    longDescription: "Cascading velvet microfoam with zero dairy needed. Naturally sweet chocolate-berry notes with an ultra-creamy mouthfeel and subtle oak smoke finish.",
    image: "assets/images/dish-nitro-cold-brew.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&q=80&auto=format&fit=crop",
    calories: 25,
    isVegetarian: true,
    isGlutenFree: true,
    isChefSpecial: false,
    spiciness: 0,
    prepTime: "2 mins",
    ingredients: ["Single-Origin Ethiopian Coffee", "Liquid Nitrogen Draught", "Smoked Vanilla Bean", "Demerara Touch"],
    addOns: [
      { name: "Oat Milk Cloud Float", price: 50.00 },
      { name: "Caramelized Brown Sugar Syrup", price: 40.00 }
    ]
  }
];

const MENU_CATEGORIES = [
  { id: "all", name: "All Items", icon: "✨" },
  { id: "starters", name: "Starters", icon: "🥗" },
  { id: "burgers", name: "Burgers", icon: "🍔" },
  { id: "mains", name: "Main Course", icon: "🥩" },
  { id: "pizza", name: "Pizza", icon: "🍕" },
  { id: "pasta", name: "Pasta", icon: "🍝" },
  { id: "desserts", name: "Desserts", icon: "🍮" },
  { id: "beverages", name: "Beverages", icon: "🍸" }
];

// Reference Video 1 sequential dishes for the orbital showcase
const SIGNATURE_SHOWCASE_ITEMS = [
  {
    dishId: "burger-1",
    name: "The Ember Wagyu Reserve",
    price: "₹795",
    subtitle: "Chef's Hearth Special",
    description: "Custom ground A5 Wagyu and dry-aged brisket seared over white oak coals, double melted 18-month Vermont cheddar, shallot bacon jam, and truffle marrow aioli on artisan brioche.",
    image: "assets/images/dish-wagyu-burger.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80&auto=format&fit=crop",
    tags: ["A5 Wagyu", "Oak Seared", "Marrow Aioli"],
    orbitThumbnail: "assets/images/dish-wagyu-burger.jpg"
  },
  {
    dishId: "mains-2",
    name: "Pan-Seared Atlantic King Salmon",
    price: "₹1,250",
    subtitle: "Ocean Catch of the Day",
    description: "Faroe Islands salmon fillet with diamond-crisp skin, velvety English sweet pea emulsion, charred asparagus shoots, and golden dill beurre blanc with trout caviar pearls.",
    image: "assets/images/dish-pan-salmon.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80&auto=format&fit=crop",
    tags: ["Faroe Islands", "Crispy Skin", "Trout Caviar"],
    orbitThumbnail: "assets/images/dish-pan-salmon.jpg"
  },
  {
    dishId: "mains-1",
    name: "Wood-Fired Tomahawk Ribeye",
    price: "₹2,850",
    subtitle: "Grand Sharing Cut (32oz)",
    description: "45-day dry-aged USDA Prime bone-in steak basted in rosemary brown butter over burning oak logs. Served with roasted bone marrow and oak chimichurri.",
    image: "assets/images/dish-tomahawk-steak.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&auto=format&fit=crop",
    tags: ["45-Day Dry Aged", "Live Fire 450°C", "Bone Marrow"],
    orbitThumbnail: "assets/images/dish-tomahawk-steak.jpg"
  },
  {
    dishId: "pasta-1",
    name: "Tagliatelle al Ragù Bolognese",
    price: "₹675",
    subtitle: "Handcrafted Daily Pasta",
    description: "Silk egg pasta ribbons rolled this morning, folded with eight-hour slow simmered heritage beef and veal ragù, and mountainous shavings of 24-month Parmigiano Reggiano.",
    image: "assets/images/dish-tagliatelle-bolognese.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80&auto=format&fit=crop",
    tags: ["Rolled This Morning", "8-Hour Ragù", "Parmigiano 24M"],
    orbitThumbnail: "assets/images/dish-tagliatelle-bolognese.jpg"
  },
  {
    dishId: "dessert-1",
    name: "Valrhona Chocolate Fondant",
    price: "₹425",
    subtitle: "Artisanal Sweet Finale",
    description: "Warm 70% Guanaja chocolate cake with flowing molten core, roasted Madagascar vanilla bean gelato, and smoked sea salt caramel drizzle.",
    image: "assets/images/dish-chocolate-fondant.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80&auto=format&fit=crop",
    tags: ["70% Valrhona", "Molten Center", "Smoked Caramel"],
    orbitThumbnail: "assets/images/dish-chocolate-fondant.jpg"
  }
];

// ==================== DEFAULT DEMO ORDERS (For Admin & Reports) ====================
const DEFAULT_ORDERS = [
  {
    id: "ORD-1081",
    createdAt: "2026-11-04 13:45",
    table: "T02",
    items: [
      { id: "burger-1", name: "The Ember Wagyu Reserve", qty: 1, price: 795.00 },
      { id: "starter-1", name: "Truffle & Fontina Arancini", qty: 1, price: 495.00 },
      { id: "bev-1", name: "Smoked Oak Old Fashioned", qty: 1, price: 650.00 }
    ],
    subtotal: 1940.00,
    tax: 97.00,
    serviceFee: 97.00,
    total: 2134.00,
    status: "preparing",
    customerNote: "Medium-rare on the Wagyu, extra napkins please."
  },
  {
    id: "ORD-1080",
    createdAt: "2026-11-04 13:20",
    table: "T05",
    items: [
      { id: "mains-1", name: "Wood-Fired Tomahawk Ribeye", qty: 1, price: 2850.00 },
      { id: "pizza-2", name: "Tartufo & Wild Forest Mushroom", qty: 1, price: 745.00 }
    ],
    subtotal: 3595.00,
    tax: 179.75,
    serviceFee: 179.75,
    total: 3954.50,
    status: "accepted",
    customerNote: "Celebrating wedding anniversary."
  },
  {
    id: "ORD-1079",
    createdAt: "2026-11-04 12:55",
    table: "Bar-01",
    items: [
      { id: "starter-3", name: "Crispy Calamari Fritti", qty: 1, price: 525.00 },
      { id: "bev-1", name: "Smoked Oak Old Fashioned", qty: 2, price: 650.00 }
    ],
    subtotal: 1825.00,
    tax: 91.25,
    serviceFee: 91.25,
    total: 2007.50,
    status: "ready",
    customerNote: ""
  },
  {
    id: "ORD-1078",
    createdAt: "2026-11-04 12:40",
    table: "T08",
    items: [
      { id: "mains-2", name: "Pan-Seared Atlantic King Salmon", qty: 2, price: 1250.00 },
      { id: "dessert-1", name: "Valrhona Chocolate Fondant", qty: 2, price: 425.00 }
    ],
    subtotal: 3350.00,
    tax: 167.50,
    serviceFee: 167.50,
    total: 3685.00,
    status: "completed",
    customerNote: "Gluten-aware prep requested."
  },
  {
    id: "ORD-1077",
    createdAt: "2026-11-04 12:15",
    table: "T04",
    items: [
      { id: "pasta-1", name: "Tagliatelle al Ragù Bolognese", qty: 2, price: 675.00 },
      { id: "starter-2", name: "Wood-Fired Heirloom Bruschetta", qty: 1, price: 395.00 }
    ],
    subtotal: 1745.00,
    tax: 87.25,
    serviceFee: 87.25,
    total: 1919.50,
    status: "completed",
    customerNote: ""
  },
  {
    id: "ORD-1076",
    createdAt: "2026-11-04 11:50",
    table: "T01",
    items: [
      { id: "pizza-1", name: "Margherita Di Bufala", qty: 1, price: 595.00 },
      { id: "bev-3", name: "Hibiscus Zero-Proof Spritz", qty: 1, price: 350.00 }
    ],
    subtotal: 945.00,
    tax: 47.25,
    serviceFee: 47.25,
    total: 1039.50,
    status: "completed",
    customerNote: "Outdoor terrace seating."
  }
];

// ==================== DEFAULT DEMO RESERVATIONS ====================
const DEFAULT_RESERVATIONS = [
  {
    id: "RES-201",
    name: "Alexander Vance",
    email: "a.vance@luxury.example",
    phone: "+1 (555) 234-5678",
    guests: 4,
    date: "2026-11-04",
    time: "19:30",
    status: "confirmed",
    specialRequests: "Window table preferred, celebrating wedding anniversary."
  },
  {
    id: "RES-202",
    name: "Elena Rostova",
    email: "elena.r@sommelier.example",
    phone: "+1 (555) 345-6789",
    guests: 2,
    date: "2026-11-04",
    time: "20:00",
    status: "seated",
    specialRequests: "Master Sommelier vintage pairing requested."
  },
  {
    id: "RES-203",
    name: "Marcus Sterling",
    email: "marcus.s@fintech.example",
    phone: "+1 (555) 456-7890",
    guests: 6,
    date: "2026-11-04",
    time: "20:30",
    status: "pending",
    specialRequests: "Private dining booth requested."
  },
  {
    id: "RES-204",
    name: "Sophia Chen",
    email: "sophia.chen@studio.example",
    phone: "+1 (555) 567-8901",
    guests: 2,
    date: "2026-11-05",
    time: "19:00",
    status: "confirmed",
    specialRequests: "One vegetarian diner."
  },
  {
    id: "RES-205",
    name: "Julian Thorne",
    email: "julian@culinary.example",
    phone: "+1 (555) 678-9012",
    guests: 4,
    date: "2026-11-03",
    time: "18:30",
    status: "completed",
    specialRequests: "Chef's fire-side tasting menu."
  }
];

// ==================== DEFAULT DEMO GALLERY ====================
const DEFAULT_GALLERY = [
  {
    id: "gal-1",
    title: "The Grand Dining Sanctuary",
    category: "interior",
    image: "assets/images/gallery-1.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80&auto=format&fit=crop",
    alt: "Restaurant Interior Candlelight and Arched Stone",
    isFeatured: true
  },
  {
    id: "gal-2",
    title: "Live Hearth Sizzle",
    category: "kitchen",
    image: "assets/images/gallery-2.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80&auto=format&fit=crop",
    alt: "Executive Chef Searing Prime Cuts Over Oak Embers",
    isFeatured: true
  },
  {
    id: "gal-3",
    title: "Artisanal Tagliatelle",
    category: "food",
    image: "assets/images/gallery-3.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80&auto=format&fit=crop",
    alt: "Handcrafted Pasta Ribbons & 24-Month Parmigiano",
    isFeatured: true
  },
  {
    id: "gal-4",
    title: "The Sommelier Vault",
    category: "interior",
    image: "assets/images/story-wine.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80&auto=format&fit=crop",
    alt: "The Century Oak Wine Cellar - 340+ Vintage Reserves",
    isFeatured: true
  },
  {
    id: "gal-5",
    title: "Tableside Smoke Cloche",
    category: "drinks",
    image: "assets/images/gallery-4.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80&auto=format&fit=crop",
    alt: "Signature Smoked Old Fashioned tableside smoke cloche reveal",
    isFeatured: true
  },
  {
    id: "gal-6",
    title: "Evening Dinner Service",
    category: "ambiance",
    image: "assets/images/gallery-5.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&auto=format&fit=crop",
    alt: "Evening Service under Hand-Blown Amber Chandeliers",
    isFeatured: true
  }
];

// ==================== CENTRAL LOCALSTORAGE STORE ====================
// Provides unified same-origin persistence between Public Site and Admin Dashboard
const EmberStore = {
  getMenuItems() {
    try {
      const saved = localStorage.getItem('eo_menu_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If cached items have old USD prices (< 100), auto-migrate to new INR prices
          const sample = parsed.find(p => p.id === 'burger-1');
          if (sample && sample.price < 100) {
            this.saveMenuItems(MENU_ITEMS);
            return MENU_ITEMS;
          }
          return parsed;
        }
      }
    } catch(e) {}
    return MENU_ITEMS;
  },
  saveMenuItems(items) {
    try {
      const sanitized = (items || []).map(item => ({
        ...item,
        image: (item.image || '').replace(/^\.\.\//, '')
      }));
      localStorage.setItem('eo_menu_items', JSON.stringify(sanitized));
    } catch(e) {}
  },
  getCategories() {
    try {
      const saved = localStorage.getItem('eo_categories');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return MENU_CATEGORIES;
  },
  saveCategories(cats) {
    try {
      localStorage.setItem('eo_categories', JSON.stringify(cats));
    } catch(e) {}
  },
  getOrders() {
    try {
      const saved = localStorage.getItem('eo_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (parsed[0].total < 500) {
            this.saveOrders(DEFAULT_ORDERS);
            return DEFAULT_ORDERS;
          }
          return parsed;
        }
      }
    } catch(e) {}
    return DEFAULT_ORDERS;
  },
  saveOrders(orders) {
    try {
      localStorage.setItem('eo_orders', JSON.stringify(orders));
    } catch(e) {}
  },
  addOrder(order) {
    const list = this.getOrders();
    list.unshift(order);
    this.saveOrders(list);
    return order;
  },
  getReservations() {
    try {
      const saved = localStorage.getItem('eo_reservations');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return DEFAULT_RESERVATIONS;
  },
  saveReservations(res) {
    try {
      localStorage.setItem('eo_reservations', JSON.stringify(res));
    } catch(e) {}
  },
  addReservation(res) {
    const list = this.getReservations();
    list.unshift(res);
    this.saveReservations(list);
    return res;
  },
  getGallery() {
    try {
      const saved = localStorage.getItem('eo_gallery');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge fallbackImage from DEFAULT_GALLERY if missing
          return parsed.map(item => {
            const def = DEFAULT_GALLERY.find(d => d.id === item.id);
            if (def && !item.fallbackImage) {
              return { ...item, fallbackImage: def.fallbackImage };
            }
            return item;
          });
        }
      }
    } catch(e) {}
    return DEFAULT_GALLERY;
  },
  saveGallery(imgs) {
    try {
      const sanitized = (imgs || []).map(item => ({
        ...item,
        image: (item.image || '').replace(/^\.\.\//, '')
      }));
      localStorage.setItem('eo_gallery', JSON.stringify(sanitized));
    } catch(e) {}
  },
  getSettings() {
    try {
      const saved = localStorage.getItem('eo_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.currencySymbol === '$' || !parsed.currencySymbol)) {
          parsed.currencySymbol = '₹';
          parsed.taxRate = 0.05;
          try { localStorage.setItem('eo_settings', JSON.stringify(parsed)); } catch(e) {}
        }
        if (parsed && parsed.productionBaseUrl && parsed.productionBaseUrl.includes('emberandoak.restaurant')) {
          delete parsed.productionBaseUrl;
        }
        return { ...MENU_CONFIG, ...parsed };
      }
    } catch(e) {}
    return MENU_CONFIG;
  },
  getMenuUrl(tableId) {
    let base = '';
    try {
      const cfg = this.getSettings();
      if (cfg && cfg.productionBaseUrl && !cfg.productionBaseUrl.includes('emberandoak.restaurant')) {
        base = cfg.productionBaseUrl.trim();
      }
    } catch(e) {}

    if (!base && typeof window !== 'undefined' && window.location) {
      if (window.location.protocol.startsWith('http')) {
        const origin = window.location.origin;
        let parts = window.location.pathname.split('/').filter(Boolean);
        if (parts.length > 0 && parts[parts.length - 1].includes('.')) parts.pop();
        if (parts.length > 0 && parts[parts.length - 1] === 'admin') parts.pop();
        const basePath = parts.length > 0 ? '/' + parts.join('/') : '';
        base = `${origin}${basePath}/menu.html`;
      } else if (window.location.protocol === 'file:') {
        const href = window.location.href.split('?')[0].split('#')[0];
        let dir = href.substring(0, href.lastIndexOf('/'));
        if (dir.endsWith('/admin')) dir = dir.substring(0, dir.lastIndexOf('/'));
        base = `${dir}/menu.html`;
      }
    }

    if (!base) base = 'menu.html';

    if (tableId && tableId !== 'NONE' && tableId !== 'general') {
      const sep = base.includes('?') ? '&' : '?';
      return `${base}${sep}table=${encodeURIComponent(tableId)}`;
    }
    return base;
  },
  saveSettings(cfg) {
    try {
      localStorage.setItem('eo_settings', JSON.stringify(cfg));
    } catch(e) {}
  },
  resetDefaults() {
    try {
      localStorage.removeItem('eo_menu_items');
      localStorage.removeItem('eo_categories');
      localStorage.removeItem('eo_orders');
      localStorage.removeItem('eo_reservations');
      localStorage.removeItem('eo_gallery');
      localStorage.removeItem('eo_settings');
    } catch(e) {}
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MENU_CONFIG, MENU_ITEMS, MENU_CATEGORIES, SIGNATURE_SHOWCASE_ITEMS, DEFAULT_ORDERS, DEFAULT_RESERVATIONS, DEFAULT_GALLERY, EmberStore };
}

