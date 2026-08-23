/**
 * Customer Portal Logic — Surya Agencies
 * 8 Official Categories, Fixed Product Cards, Cart, Dynamic Live UPI QR Code, Print Receipt & Real-time Settings Sync
 */

class CustomerApp {
  constructor() {
    this.products = [
  {
    "id": "dp-001",
    "name": "Arokya Full Cream Milk (500ml)",
    "category": "Dairy Products",
    "packSize": "500ml",
    "price": 36,
    "stock": 50,
    "available": true,
    "description": "Rich, thick 6.0% fat farm-fresh pasteurised homogenized full cream milk.",
    "image": "/assets/arokya-milk.jpg"
  },
  {
    "id": "dp-002",
    "name": "Arokya Full Cream Milk (1 Litre)",
    "category": "Dairy Products",
    "packSize": "1 Litre",
    "price": 70,
    "stock": 40,
    "available": true,
    "description": "Wholesome full cream milk for tea, coffee, and traditional sweets.",
    "image": "/assets/arokya-milk.jpg"
  },
  {
    "id": "dp-003",
    "name": "Arokya Toned Milk (500ml)",
    "category": "Dairy Products",
    "packSize": "500ml",
    "price": 28,
    "stock": 60,
    "available": true,
    "description": "Daily fresh 3.0% fat toned milk with essential nutrients.",
    "image": "/assets/arokya-milk.jpg"
  },
  {
    "id": "dp-004",
    "name": "Arokya Toned Milk (1 Litre)",
    "category": "Dairy Products",
    "packSize": "1 Litre",
    "price": 54,
    "stock": 45,
    "available": true,
    "description": "Economical 1 Litre pack of pasteurized toned milk.",
    "image": "/assets/arokya-milk.jpg"
  },
  {
    "id": "dp-005",
    "name": "Arokya Double Toned Milk (500ml)",
    "category": "Dairy Products",
    "packSize": "500ml",
    "price": 25,
    "stock": 35,
    "available": true,
    "description": "Light and low-fat 1.5% double toned milk for healthy lifestyles.",
    "image": "/assets/arokya-milk.jpg"
  },
  {
    "id": "dp-006",
    "name": "Hatsun Curd (Dahi) Pouch (200g)",
    "category": "Dairy Products",
    "packSize": "200g",
    "price": 18,
    "stock": 40,
    "available": true,
    "description": "Thick, creamy, naturally set curd with delicious traditional taste.",
    "image": "/assets/hatsun-curd.jpg"
  },
  {
    "id": "dp-007",
    "name": "Hatsun Curd (Dahi) Pouch (400g)",
    "category": "Dairy Products",
    "packSize": "400g",
    "price": 35,
    "stock": 45,
    "available": true,
    "description": "Popular family pack curd, perfect with meals and rice.",
    "image": "/assets/hatsun-curd.jpg"
  },
  {
    "id": "dp-008",
    "name": "Hatsun Curd (Dahi) Pouch (1kg)",
    "category": "Dairy Products",
    "packSize": "1kg",
    "price": 80,
    "stock": 30,
    "available": true,
    "description": "Value pack fresh Hatsun curd for families and catering.",
    "image": "/assets/hatsun-curd.jpg"
  },
  {
    "id": "dp-009",
    "name": "Hatsun Curd Cup (200g)",
    "category": "Dairy Products",
    "packSize": "200g Cup",
    "price": 22,
    "stock": 30,
    "available": true,
    "description": "Convenient ready-to-eat cup of thick homestyle set curd.",
    "image": "/assets/hatsun-curd.jpg"
  },
  {
    "id": "dp-010",
    "name": "Hatsun Curd Cup (400g)",
    "category": "Dairy Products",
    "packSize": "400g Tub",
    "price": 42,
    "stock": 25,
    "available": true,
    "description": "Sturdy tub of premium set dahi, leak-proof and fresh.",
    "image": "/assets/hatsun-curd.jpg"
  },
  {
    "id": "dp-011",
    "name": "Hatsun Fresh Paneer (200g)",
    "category": "Dairy Products",
    "packSize": "200g",
    "price": 95,
    "stock": 30,
    "available": true,
    "description": "Ultra-soft, melt-in-mouth malai paneer made from pure cow milk.",
    "image": "/assets/hatsun-paneer.jpg"
  },
  {
    "id": "dp-012",
    "name": "Hatsun Fresh Paneer (500g)",
    "category": "Dairy Products",
    "packSize": "500g",
    "price": 230,
    "stock": 20,
    "available": true,
    "description": "Large block of premium cottage cheese for curries and snacks.",
    "image": "/assets/hatsun-paneer.jpg"
  },
  {
    "id": "dp-013",
    "name": "Hatsun Cooking Butter (100g)",
    "category": "Dairy Products",
    "packSize": "100g",
    "price": 58,
    "stock": 25,
    "available": true,
    "description": "Pure unsalted white cooking butter for traditional culinary dishes.",
    "image": "/assets/hatsun-butter.jpg"
  },
  {
    "id": "dp-014",
    "name": "Hatsun Cooking Butter (500g)",
    "category": "Dairy Products",
    "packSize": "500g",
    "price": 280,
    "stock": 20,
    "available": true,
    "description": "Pure unsalted butter made from fresh cream.",
    "image": "/assets/hatsun-butter.jpg"
  },
  {
    "id": "dp-015",
    "name": "Hatsun Table Butter (100g)",
    "category": "Dairy Products",
    "packSize": "100g",
    "price": 60,
    "stock": 30,
    "available": true,
    "description": "Pasteurized salted table butter, creamy and smooth on warm toasts.",
    "image": "/assets/hatsun-butter.jpg"
  },
  {
    "id": "dp-016",
    "name": "Hatsun Table Butter (500g)",
    "category": "Dairy Products",
    "packSize": "500g",
    "price": 290,
    "stock": 15,
    "available": true,
    "description": "Premium salted table butter for baking and spreads.",
    "image": "/assets/hatsun-butter.jpg"
  },
  {
    "id": "dp-017",
    "name": "Hatsun Pure Cow Ghee Pouch (200ml)",
    "category": "Dairy Products",
    "packSize": "200ml",
    "price": 155,
    "stock": 35,
    "available": true,
    "description": "Traditional golden granular cow ghee with rich natural aroma.",
    "image": "/assets/hatsun-ghee.jpg"
  },
  {
    "id": "dp-018",
    "name": "Hatsun Pure Cow Ghee Pouch (500ml)",
    "category": "Dairy Products",
    "packSize": "500ml",
    "price": 375,
    "stock": 30,
    "available": true,
    "description": "Pure, authentic aromatic cow ghee in convenient pouch pack.",
    "image": "/assets/hatsun-ghee.jpg"
  },
  {
    "id": "dp-019",
    "name": "Hatsun Pure Cow Ghee Jar (500ml)",
    "category": "Dairy Products",
    "packSize": "500ml Jar",
    "price": 395,
    "stock": 25,
    "available": true,
    "description": "Aromatic granular cow ghee in a reusable hygienic jar.",
    "image": "/assets/hatsun-ghee.jpg"
  },
  {
    "id": "dp-020",
    "name": "Hatsun Pure Cow Ghee Tin (1 Litre)",
    "category": "Dairy Products",
    "packSize": "1 Litre Tin",
    "price": 760,
    "stock": 20,
    "available": true,
    "description": "100% pure cow ghee in traditional airtight metal tin.",
    "image": "/assets/hatsun-ghee.jpg"
  },
  {
    "id": "dp-021",
    "name": "Hatsun Dairy Whitener (200g)",
    "category": "Dairy Products",
    "packSize": "200g",
    "price": 90,
    "stock": 25,
    "available": true,
    "description": "Instant rich dairy whitener for thick tea and coffee.",
    "image": "/assets/hatsun-ghee.jpg"
  },
  {
    "id": "dp-022",
    "name": "Hatsun Dairy Whitener (500g)",
    "category": "Dairy Products",
    "packSize": "500g",
    "price": 215,
    "stock": 20,
    "available": true,
    "description": "Special spray-dried milk powder with natural sweetness.",
    "image": "/assets/hatsun-ghee.jpg"
  },
  {
    "id": "dp-023",
    "name": "Hatsun Flavoured Milk Chocolate (200ml)",
    "category": "Dairy Products",
    "packSize": "200ml",
    "price": 35,
    "stock": 40,
    "available": true,
    "description": "Thick chocolate milkshake in easy-sip chilled bottle.",
    "image": "/assets/hatsun-flavoured-milk.jpg"
  },
  {
    "id": "dp-024",
    "name": "Hatsun Flavoured Milk Badam (200ml)",
    "category": "Dairy Products",
    "packSize": "200ml",
    "price": 35,
    "stock": 40,
    "available": true,
    "description": "Delicious almond flavoured milk packed with natural taste.",
    "image": "/assets/hatsun-flavoured-milk.jpg"
  },
  {
    "id": "dp-025",
    "name": "Hatsun Flavoured Milk Pista (200ml)",
    "category": "Dairy Products",
    "packSize": "200ml",
    "price": 35,
    "stock": 35,
    "available": true,
    "description": "Rich pistachio flavoured milk, creamy and refreshing.",
    "image": "/assets/hatsun-flavoured-milk.jpg"
  },
  {
    "id": "dp-026",
    "name": "Hatsun Flavoured Milk Strawberry (200ml)",
    "category": "Dairy Products",
    "packSize": "200ml",
    "price": 35,
    "stock": 35,
    "available": true,
    "description": "Fruity strawberry flavoured milkshake.",
    "image": "/assets/hatsun-flavoured-milk.jpg"
  },
  {
    "id": "dp-027",
    "name": "Hatsun Sweet Lassi (200ml)",
    "category": "Dairy Products",
    "packSize": "200ml",
    "price": 25,
    "stock": 45,
    "available": true,
    "description": "Traditional sweetened curd beverage, smooth and soothing.",
    "image": "/assets/hatsun-flavoured-milk.jpg"
  },
  {
    "id": "dp-028",
    "name": "Hatsun Mango Lassi (200ml)",
    "category": "Dairy Products",
    "packSize": "200ml",
    "price": 30,
    "stock": 40,
    "available": true,
    "description": "Thick creamy lassi blended with natural Alphonso mango pulp.",
    "image": "/assets/hatsun-flavoured-milk.jpg"
  },
  {
    "id": "dp-029",
    "name": "Hatsun Spiced Buttermilk (200ml)",
    "category": "Dairy Products",
    "packSize": "200ml",
    "price": 15,
    "stock": 50,
    "available": true,
    "description": "Refreshing spiced buttermilk with ginger, curry leaves, and green chilli.",
    "image": "/assets/hatsun-flavoured-milk.jpg"
  },
  {
    "id": "dp-030",
    "name": "Hatsun Yogurt Shake Strawberry (200ml)",
    "category": "Dairy Products",
    "packSize": "200ml",
    "price": 40,
    "stock": 30,
    "available": true,
    "description": "Probiotic drinkable yogurt shake with real strawberry pulp.",
    "image": "/assets/hatsun-flavoured-milk.jpg"
  },
  {
    "id": "cone-001",
    "name": "iCone Premium Butterscotch (120ml)",
    "category": "Ice Cream Cones",
    "packSize": "120ml Cone",
    "price": 55,
    "stock": 40,
    "available": true,
    "description": "Crispy wafer cone filled with rich butterscotch ice cream and roasted cashew praline.",
    "image": "/assets/arun-cone.jpg"
  },
  {
    "id": "cone-002",
    "name": "iCone Double Chocolate (120ml)",
    "category": "Ice Cream Cones",
    "packSize": "120ml Cone",
    "price": 60,
    "stock": 45,
    "available": true,
    "description": "Decadent dark chocolate ice cream loaded with chocolate fudge and chocolate chips.",
    "image": "/assets/arun-cone.jpg"
  },
  {
    "id": "cone-003",
    "name": "iCone Blackcurrant Blast (120ml)",
    "category": "Ice Cream Cones",
    "packSize": "120ml Cone",
    "price": 55,
    "stock": 35,
    "available": true,
    "description": "Real blackcurrant berries swirled in creamy ice cream with a crunchy chocolate tip.",
    "image": "/assets/arun-cone.jpg"
  },
  {
    "id": "cone-004",
    "name": "iCone Classic Vanilla (120ml)",
    "category": "Ice Cream Cones",
    "packSize": "120ml Cone",
    "price": 45,
    "stock": 30,
    "available": true,
    "description": "Pure Madagascar vanilla ice cream topped with chocolate drizzle and roasted peanuts.",
    "image": "/assets/arun-cone.jpg"
  },
  {
    "id": "cone-005",
    "name": "iCone Strawberry Ripple (120ml)",
    "category": "Ice Cream Cones",
    "packSize": "120ml Cone",
    "price": 50,
    "stock": 30,
    "available": true,
    "description": "Luscious strawberry ice cream with natural fruit syrup in a crunchy waffle cone.",
    "image": "/assets/arun-cone.jpg"
  },
  {
    "id": "cone-006",
    "name": "iCone Choco Coffee Mocha (120ml)",
    "category": "Ice Cream Cones",
    "packSize": "120ml Cone",
    "price": 60,
    "stock": 25,
    "available": true,
    "description": "Arabica coffee infused creamy ice cream with Belgian chocolate swirls.",
    "image": "/assets/arun-cone.jpg"
  },
  {
    "id": "cone-007",
    "name": "iCone Mini Choco (60ml)",
    "category": "Ice Cream Cones",
    "packSize": "60ml Mini",
    "price": 30,
    "stock": 40,
    "available": true,
    "description": "Snack-sized crunchy chocolate cone, ideal for quick cravings.",
    "image": "/assets/arun-cone.jpg"
  },
  {
    "id": "cone-008",
    "name": "iCone Mini Butterscotch (60ml)",
    "category": "Ice Cream Cones",
    "packSize": "60ml Mini",
    "price": 30,
    "stock": 40,
    "available": true,
    "description": "Bite-sized mini cone packed with butterscotch crunch.",
    "image": "/assets/arun-cone.jpg"
  },
  {
    "id": "bar-001",
    "name": "Arun Chocobar Classic (60ml)",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "60ml Bar",
    "price": 25,
    "stock": 50,
    "available": true,
    "description": "All-time favourite rich vanilla bar coated in crackling milk chocolate.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "bar-002",
    "name": "Arun Double Chocobar (70ml)",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "70ml Bar",
    "price": 35,
    "stock": 45,
    "available": true,
    "description": "Chocolate ice cream center dipped in thick gourmet chocolate shell.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "bar-003",
    "name": "iBar Mango Fruit Blast (70ml)",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "70ml Bar",
    "price": 40,
    "stock": 35,
    "available": true,
    "description": "Real Alphonso mango ice cream coated with a luscious mango glaze.",
    "image": "/assets/arun-likstick.jpg"
  },
  {
    "id": "bar-004",
    "name": "iBar Raspberry White Choco (70ml)",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "70ml Bar",
    "price": 45,
    "stock": 30,
    "available": true,
    "description": "Tangy raspberry ice cream enveloped in premium Belgian white chocolate.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "bar-005",
    "name": "Arun Choco Feast Bar (80ml)",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "80ml Bar",
    "price": 50,
    "stock": 35,
    "available": true,
    "description": "Crispy biscuit core surrounded by rich ice cream and crunchy chocolate nut crust.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "bar-006",
    "name": "Kulfi King Pista Stick (60ml)",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "60ml Stick",
    "price": 30,
    "stock": 40,
    "available": true,
    "description": "Authentic slow-simmered rabri kulfi studded with pistachios.",
    "image": "/assets/arun-kulfi-king.jpg"
  },
  {
    "id": "bar-007",
    "name": "Kulfi King Badam Stick (60ml)",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "60ml Stick",
    "price": 30,
    "stock": 40,
    "available": true,
    "description": "Traditional desi almond kulfi stick with authentic saffron cardamom flavor.",
    "image": "/assets/arun-kulfi-king.jpg"
  },
  {
    "id": "bar-008",
    "name": "Kulfi King Malai Stick (60ml)",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "60ml Stick",
    "price": 30,
    "stock": 35,
    "available": true,
    "description": "Pure cream malai kulfi frozen to perfection on traditional wooden stick.",
    "image": "/assets/arun-kulfi-king.jpg"
  },
  {
    "id": "bar-009",
    "name": "Likstick Mango Juicy Ice (50ml)",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "50ml Ice Lolly",
    "price": 15,
    "stock": 60,
    "available": true,
    "description": "Zesty refreshing mango fruit ice candy on a stick.",
    "image": "/assets/arun-likstick.jpg"
  },
  {
    "id": "bar-010",
    "name": "Likstick Juicy Grape Ice (50ml)",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "50ml Ice Lolly",
    "price": 15,
    "stock": 55,
    "available": true,
    "description": "Refreshing sweet purple grape fruit ice candy.",
    "image": "/assets/arun-likstick.jpg"
  },
  {
    "id": "bar-011",
    "name": "Likstick Tangy Orange Ice (50ml)",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "50ml Ice Lolly",
    "price": 15,
    "stock": 55,
    "available": true,
    "description": "Sun-ripened orange citrus ice lolly.",
    "image": "/assets/arun-likstick.jpg"
  },
  {
    "id": "bar-012",
    "name": "Yummy Bear Vanilla Stick (45ml)",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "45ml Bar",
    "price": 20,
    "stock": 35,
    "available": true,
    "description": "Fun bear-shaped vanilla ice cream stick for kids.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "bar-013",
    "name": "Yummy Bear Chocolate Stick (45ml)",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "45ml Bar",
    "price": 20,
    "stock": 35,
    "available": true,
    "description": "Kids favourite bear-shaped milk chocolate ice cream on a stick.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "bar-014",
    "name": "Arun Cotton Candy Stick (60ml)",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "60ml Bar",
    "price": 30,
    "stock": 30,
    "available": true,
    "description": "Whimsical swirl of pink and blue carnival cotton candy ice cream.",
    "image": "/assets/arun-likstick.jpg"
  },
  {
    "id": "cup-001",
    "name": "Arun Classic Vanilla Cup (50ml)",
    "category": "Ice Cream Cups & Duets",
    "packSize": "50ml Cup",
    "price": 15,
    "stock": 60,
    "available": true,
    "description": "Smooth and creamy classic vanilla cup with wooden spoon.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "cup-002",
    "name": "Arun Classic Vanilla Cup (100ml)",
    "category": "Ice Cream Cups & Duets",
    "packSize": "100ml Cup",
    "price": 25,
    "stock": 50,
    "available": true,
    "description": "Creamy pure vanilla treat in a generous 100ml cup.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "cup-003",
    "name": "Arun Fresh Strawberry Cup (50ml)",
    "category": "Ice Cream Cups & Duets",
    "packSize": "50ml Cup",
    "price": 15,
    "stock": 50,
    "available": true,
    "description": "Sweet strawberry ice cream cup with real fruit notes.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "cup-004",
    "name": "Arun Fresh Strawberry Cup (100ml)",
    "category": "Ice Cream Cups & Duets",
    "packSize": "100ml Cup",
    "price": 25,
    "stock": 40,
    "available": true,
    "description": "Luscious strawberry dessert cup.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "cup-005",
    "name": "Arun Chocolate Delight Cup (100ml)",
    "category": "Ice Cream Cups & Duets",
    "packSize": "100ml Cup",
    "price": 30,
    "stock": 45,
    "available": true,
    "description": "Rich cocoa chocolate ice cream cup.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "cup-006",
    "name": "Arun Butterscotch Crunch Cup (100ml)",
    "category": "Ice Cream Cups & Duets",
    "packSize": "100ml Cup",
    "price": 30,
    "stock": 45,
    "available": true,
    "description": "Caramel butterscotch ice cream packed with crunchy praline nuts.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "cup-007",
    "name": "Arun Blackcurrant Cup (100ml)",
    "category": "Ice Cream Cups & Duets",
    "packSize": "100ml Cup",
    "price": 35,
    "stock": 35,
    "available": true,
    "description": "Tangy sweet blackcurrant dessert with real berry compote.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "cup-008",
    "name": "Arun Royal Kesar Pista Cup (100ml)",
    "category": "Ice Cream Cups & Duets",
    "packSize": "100ml Cup",
    "price": 40,
    "stock": 35,
    "available": true,
    "description": "Infused with royal Kashmiri saffron and crunchy roasted pistachios.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "cup-009",
    "name": "Duet Vanilla-Raspberry (90ml)",
    "category": "Ice Cream Cups & Duets",
    "packSize": "90ml Bar",
    "price": 35,
    "stock": 35,
    "available": true,
    "description": "Rich vanilla ice cream core dipped in exotic raspberry fruit coat.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "cup-010",
    "name": "Duet Vanilla-Mango (90ml)",
    "category": "Ice Cream Cups & Duets",
    "packSize": "90ml Bar",
    "price": 35,
    "stock": 35,
    "available": true,
    "description": "Creamy vanilla surrounded by Alphonso mango fruit coating.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "cup-011",
    "name": "Duet Chocolate-Mint (90ml)",
    "category": "Ice Cream Cups & Duets",
    "packSize": "90ml Bar",
    "price": 40,
    "stock": 30,
    "available": true,
    "description": "Cool peppermint ice cream enrobed in dark chocolate shell.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "nov-001",
    "name": "Arun Vanilla Ice Cream Sandwich (100ml)",
    "category": "Ice Cream Novelties & Slices",
    "packSize": "100ml Sandwich",
    "price": 40,
    "stock": 35,
    "available": true,
    "description": "Thick vanilla ice cream slab sandwiched between soft chocolate biscuits.",
    "image": "/assets/arun-sandwich.jpg"
  },
  {
    "id": "nov-002",
    "name": "Arun Double Chocolate Sandwich (100ml)",
    "category": "Ice Cream Novelties & Slices",
    "packSize": "100ml Sandwich",
    "price": 45,
    "stock": 30,
    "available": true,
    "description": "Belgian chocolate ice cream between dark cocoa wafer cookies.",
    "image": "/assets/arun-sandwich.jpg"
  },
  {
    "id": "nov-003",
    "name": "Arun Cassata Cut Slice (120ml)",
    "category": "Ice Cream Novelties & Slices",
    "packSize": "120ml Slice",
    "price": 55,
    "stock": 30,
    "available": true,
    "description": "Tri-colour layered cassata on fluffy sponge cake with candied fruit peels and nuts.",
    "image": "/assets/arun-cassata-slice.jpg"
  },
  {
    "id": "nov-004",
    "name": "Arun Cassata Ball (100ml)",
    "category": "Ice Cream Novelties & Slices",
    "packSize": "100ml Ball",
    "price": 50,
    "stock": 25,
    "available": true,
    "description": "Multi-layered ice cream sphere with sweet fruity center.",
    "image": "/assets/arun-cassata-slice.jpg"
  },
  {
    "id": "nov-005",
    "name": "Arun Bites Kesar Peda (Box of 6)",
    "category": "Ice Cream Novelties & Slices",
    "packSize": "Box of 6",
    "price": 90,
    "stock": 25,
    "available": true,
    "description": "Bite-sized mithai fusion ice cream bonbons coated in white chocolate.",
    "image": "/assets/arun-matka-kulfi.jpg"
  },
  {
    "id": "nov-006",
    "name": "Arun Bites Motichoor (Box of 6)",
    "category": "Ice Cream Novelties & Slices",
    "packSize": "Box of 6",
    "price": 90,
    "stock": 25,
    "available": true,
    "description": "Fusion treats combining real motichoor laddu flavour and rich milk ice cream.",
    "image": "/assets/arun-matka-kulfi.jpg"
  },
  {
    "id": "nov-007",
    "name": "Arun Bites Kaju Katli (Box of 6)",
    "category": "Ice Cream Novelties & Slices",
    "packSize": "Box of 6",
    "price": 110,
    "stock": 20,
    "available": true,
    "description": "Exquisite cashew delicacy transformed into decadent ice cream bites.",
    "image": "/assets/arun-matka-kulfi.jpg"
  },
  {
    "id": "sun-001",
    "name": "Arun Chocolate Fudge Sundae Cup (140ml)",
    "category": "Sundaes & In-Store Specials",
    "packSize": "140ml Cup",
    "price": 65,
    "stock": 30,
    "available": true,
    "description": "Vanilla and chocolate ice cream layered with hot chocolate fudge and roasted peanuts.",
    "image": "/assets/arun-sundae.jpg"
  },
  {
    "id": "sun-002",
    "name": "Arun Butterscotch Crunch Sundae Cup (140ml)",
    "category": "Sundaes & In-Store Specials",
    "packSize": "140ml Cup",
    "price": 65,
    "stock": 30,
    "available": true,
    "description": "Rich butterscotch dessert topped with golden butterscotch sauce and caramelized nuts.",
    "image": "/assets/arun-sundae.jpg"
  },
  {
    "id": "sun-003",
    "name": "Arun Mango Jelly Sundae (140ml)",
    "category": "Sundaes & In-Store Specials",
    "packSize": "140ml Cup",
    "price": 65,
    "stock": 25,
    "available": true,
    "description": "Mango ice cream layered with sweet mango jelly cubes and cream sauce.",
    "image": "/assets/arun-sundae.jpg"
  },
  {
    "id": "sun-004",
    "name": "Arun Strawberry Twist Sundae (140ml)",
    "category": "Sundaes & In-Store Specials",
    "packSize": "140ml Cup",
    "price": 65,
    "stock": 25,
    "available": true,
    "description": "Strawberry swirls with strawberry compote drizzle and wafer crisps.",
    "image": "/assets/arun-sundae.jpg"
  },
  {
    "id": "sun-005",
    "name": "Arun Cookies & Cream Sundae (140ml)",
    "category": "Sundaes & In-Store Specials",
    "packSize": "140ml Cup",
    "price": 70,
    "stock": 25,
    "available": true,
    "description": "Vanilla cream layered with crumbled Oreo cookie chunks and chocolate syrup.",
    "image": "/assets/arun-sundae.jpg"
  },
  {
    "id": "tub-001",
    "name": "Arun Classic Vanilla Tub (1 Litre)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre Tub",
    "price": 160,
    "stock": 25,
    "available": true,
    "description": "Family dessert tub of pure velvety vanilla ice cream.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "tub-002",
    "name": "Arun Fresh Strawberry Tub (1 Litre)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre Tub",
    "price": 180,
    "stock": 20,
    "available": true,
    "description": "1 Litre tub of smooth strawberry ice cream made with real dairy milk.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "tub-003",
    "name": "Arun Chocolate Indulgence Tub (1 Litre)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre Tub",
    "price": 210,
    "stock": 25,
    "available": true,
    "description": "Rich dark and milk chocolate ice cream for chocolate lovers.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "tub-004",
    "name": "Arun Butterscotch Praline Tub (1 Litre)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre Tub",
    "price": 210,
    "stock": 25,
    "available": true,
    "description": "Creamy butterscotch ice cream generously loaded with crunchy praline chunks.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "tub-005",
    "name": "Arun Blackcurrant Berry Tub (1 Litre)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre Tub",
    "price": 230,
    "stock": 20,
    "available": true,
    "description": "Tangy sweet purple blackcurrant ice cream with whole berry pieces.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "tub-006",
    "name": "Arun Royal Kesar Pista Tub (1 Litre)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre Tub",
    "price": 260,
    "stock": 20,
    "available": true,
    "description": "Authentic Kashmiri saffron and pistachios in a 1 Litre party pack.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "tub-007",
    "name": "Arun Alphonso Mango Tub (1 Litre)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre Tub",
    "price": 220,
    "stock": 20,
    "available": true,
    "description": "Made with 100% Ratnagiri Alphonso mango pulp and pure milk.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "tub-008",
    "name": "Arun Exotic Red Velvet Tub (1 Litre)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre Tub",
    "price": 280,
    "stock": 15,
    "available": true,
    "description": "Gourmet red velvet cake crumbs swirled in cream cheese ice cream.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "tub-009",
    "name": "Arun Brownie Banoffee Tub (1 Litre)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre Tub",
    "price": 290,
    "stock": 15,
    "available": true,
    "description": "Fudgy brownie pieces, banana cream and caramel toffee swirl.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "tub-010",
    "name": "Arun Salted Caramel Crunch Tub (1 Litre)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre Tub",
    "price": 270,
    "stock": 15,
    "available": true,
    "description": "Smooth sea-salt caramel with crunchy buttered toffee bits.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "tub-011",
    "name": "Arun Jackfruit Special Tub (1 Litre)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre Tub",
    "price": 250,
    "stock": 15,
    "available": true,
    "description": "Traditional seasonal South Indian jackfruit (Pala Pazham) ice cream.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "tub-012",
    "name": "Arun Blueberry Cheesecake Tub (1 Litre)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre Tub",
    "price": 295,
    "stock": 15,
    "available": true,
    "description": "New York style cheesecake ice cream with blueberry swirl and graham cracker crunch.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "cake-001",
    "name": "Arun Signature Black Forest Ice Cream Cake (500g)",
    "category": "Ice Cream Cakes",
    "packSize": "500g Cake",
    "price": 450,
    "stock": 10,
    "available": true,
    "description": "Layers of rich chocolate sponge, vanilla ice cream, chocolate curls, and red cherries.",
    "image": "/assets/arun-ice-cream-cake.jpg"
  },
  {
    "id": "cake-002",
    "name": "Arun Butterscotch Delight Cake (500g)",
    "category": "Ice Cream Cakes",
    "packSize": "500g Cake",
    "price": 450,
    "stock": 10,
    "available": true,
    "description": "Crunchy butterscotch ice cream cake topped with roasted almond flakes and caramel.",
    "image": "/assets/arun-ice-cream-cake.jpg"
  },
  {
    "id": "cake-003",
    "name": "Arun Choco-Brownie Celebration Cake (1kg)",
    "category": "Ice Cream Cakes",
    "packSize": "1kg Cake",
    "price": 799,
    "stock": 8,
    "available": true,
    "description": "Double layer chocolate fudge brownie with Belgian dark chocolate ice cream.",
    "image": "/assets/arun-ice-cream-cake.jpg"
  },
  {
    "id": "cake-004",
    "name": "Arun Cassata Celebration Cake (1kg)",
    "category": "Ice Cream Cakes",
    "packSize": "1kg Cake",
    "price": 750,
    "stock": 8,
    "available": true,
    "description": "Grand rainbow cassata cake with tutti frutti, sponge cake, and royal dry fruits.",
    "image": "/assets/arun-ice-cream-cake.jpg"
  },
  {
    "id": "cake-005",
    "name": "Arun Mango Magic Ice Cream Cake (500g)",
    "category": "Ice Cream Cakes",
    "packSize": "500g Cake",
    "price": 480,
    "stock": 10,
    "available": true,
    "description": "Refreshing Alphonso mango ice cream cake decorated with white chocolate shavings.",
    "image": "/assets/arun-ice-cream-cake.jpg"
  },
  {
    "id": "cake-006",
    "name": "Arun Strawberry Cream Dream Cake (500g)",
    "category": "Ice Cream Cakes",
    "packSize": "500g Cake",
    "price": 480,
    "stock": 10,
    "available": true,
    "description": "Fresh strawberry ice cream and vanilla sponge layered with strawberry glaze.",
    "image": "/assets/arun-ice-cream-cake.jpg"
  },
  {
    "id": "cake-007",
    "name": "Arun Mini Ice Cream Log - Chocolate (250g)",
    "category": "Ice Cream Cakes",
    "packSize": "250g Mini Log",
    "price": 220,
    "stock": 15,
    "available": true,
    "description": "Dessert roll filled with dark chocolate fudge and vanilla ice cream.",
    "image": "/assets/arun-ice-cream-cake.jpg"
  },
  {
    "id": "cake-008",
    "name": "Arun Mini Ice Cream Log - Vanilla Strawberry (250g)",
    "category": "Ice Cream Cakes",
    "packSize": "250g Mini Log",
    "price": 220,
    "stock": 15,
    "available": true,
    "description": "Swiss roll style ice cream log with strawberry swirl.",
    "image": "/assets/arun-ice-cream-cake.jpg"
  }
];
    this.cart = [];
    this.selectedCategory = 'ALL';
    this.searchQuery = '';
    this.activeTrackedOrder = null;
    this.myOrders = [];
    this.isSubmittingOrder = false;
    this.currentView = 'catalog';
    this.upiId = 'suryaagencies@upi';

    this.categories = [
      { id: 'ALL', name: 'All Products', icon: '🍨' },
      { id: 'Dairy Products', name: 'Dairy Products', icon: '🥛' },
      { id: 'Ice Cream Cones', name: 'Ice Cream Cones (iCONE)', icon: '🍦' },
      { id: 'Ice Cream Bars & Sticks', name: 'Bars & Sticks (iBAR)', icon: '🍫' },
      { id: 'Ice Cream Cups & Duets', name: 'Cups & Duets', icon: '🍧' },
      { id: 'Ice Cream Novelties & Slices', name: 'Novelties & Slices', icon: '🍰' },
      { id: 'Sundaes & In-Store Specials', name: 'Sundaes & Specials', icon: '🍨' },
      { id: 'Family Tubs & Packs', name: 'Family Tubs (1L)', icon: '📦' },
      { id: 'Ice Cream Cakes', name: 'Ice Cream Cakes', icon: '🎂' }
    ];

    this.init();
  }

  async init() {
    this.loadCartFromStorage();
    this.loadMyOrdersFromStorage();
    await this.fetchProducts();
    await this.fetchSettings();
    this.setupRealtimeListeners();
    this.render();
  }

  async fetchSettings() {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings && data.settings.upiId) {
        this.upiId = data.settings.upiId;
      }
    } catch (e) {}
  }

  // --- STORAGE & PERSISTENCE ---

  loadCartFromStorage() {
    try {
      const stored = sessionStorage.getItem('surya_cart');
      if (stored) this.cart = JSON.parse(stored);
    } catch (e) {
      this.cart = [];
    }
  }

  saveCartToStorage() {
    try {
      sessionStorage.setItem('surya_cart', JSON.stringify(this.cart));
      this.updateCartBadge();
    } catch (e) {}
  }

  loadMyOrdersFromStorage() {
    try {
      const stored = localStorage.getItem('surya_my_orders');
      if (stored) this.myOrders = JSON.parse(stored);
    } catch (e) {
      this.myOrders = [];
    }
  }

  saveMyOrdersToStorage() {
    try {
      localStorage.setItem('surya_my_orders', JSON.stringify(this.myOrders));
      this.updateActiveOrdersBadge();
    } catch (e) {}
  }

  // --- REAL-TIME LISTENERS ---

  setupRealtimeListeners() {
    if (!window.socketClient) return;

    // Real-Time Stock Updates
    window.socketClient.on('product:created', (newProd) => {
        if (!newProd) return;
        const idx = this.products.findIndex(p => p.id === newProd.id);
        if (idx !== -1) {
          this.products[idx] = newProd;
        } else {
          this.products.unshift(newProd);
        }
        this.renderCategoryPills();
        this.renderProductsGrid();
      });

      window.socketClient.on('product:updated', (updatedProd) => {
        if (!updatedProd) return;
        const idx = this.products.findIndex(p => p.id === updatedProd.id);
        if (idx !== -1) {
          this.products[idx] = updatedProd;
          this.renderProductsGrid();
        }
      });

      window.socketClient.on('products:stock_batch_updated', (updatedList) => {
      if (!Array.isArray(updatedList)) return;
      let changed = false;

      updatedList.forEach(updatedProd => {
        const idx = this.products.findIndex(p => p.id === updatedProd.id);
        if (idx !== -1) {
          this.products[idx] = { ...this.products[idx], ...updatedProd };
          changed = true;
        }
      });

      if (changed) {
        this.renderProductGrid();
      }
    });

    window.socketClient.on('product:updated', (updatedProd) => {
      const idx = this.products.findIndex(p => p.id === updatedProd.id);
      if (idx !== -1) {
        this.products[idx] = { ...this.products[idx], ...updatedProd };
      } else {
        this.products.push(updatedProd);
      }
      this.renderProductGrid();
    });

    // Real-Time Shop Settings & UPI ID Update Broadcast
    window.socketClient.on('settings:updated', (newSettings) => {
      if (newSettings && newSettings.upiId) {
        this.upiId = newSettings.upiId;
        console.log('⚡ Dynamic UPI ID synchronized in real time:', this.upiId);
        // If checkout modal is open, re-render QR code
        const qrContainer = document.getElementById('checkout-upi-qrcode');
        if (qrContainer) {
          const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          this.renderCheckoutUPIQR(total);
        }
      }
    });

    window.socketClient.on('order:status_updated', (updatedOrder) => {
      const idx = this.myOrders.findIndex(o => o.id === updatedOrder.id || o.orderNumber === updatedOrder.orderNumber);
      if (idx !== -1) {
        this.myOrders[idx] = { ...this.myOrders[idx], ...updatedOrder };
        this.saveMyOrdersToStorage();
      }

      if (this.activeTrackedOrder && (this.activeTrackedOrder.id === updatedOrder.id || this.activeTrackedOrder.orderNumber === updatedOrder.orderNumber)) {
        this.activeTrackedOrder = { ...this.activeTrackedOrder, ...updatedOrder };
        if (window.appController) window.appController.playChime();
        if (this.currentView === 'tracking') {
          this.renderTrackingView();
        }
      }

      if (this.currentView === 'orders') {
        this.renderOrdersView();
      }
    });
  }

  // --- DATA FETCHING ---

  async fetchProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        this.products = data.products;
        this.renderProductGrid();
      }
    } catch (e) {
      console.warn('Using offline/local sample catalog');
    }
  }

  async refreshProducts() {
    await this.fetchProducts();
  }

  // --- RENDERING ---

  render() {
    this.renderCategoriesBar();
    this.renderProductGrid();
    this.updateCartBadge();
    this.updateActiveOrdersBadge();
  }

  renderCategoriesBar() {
    const bar = document.getElementById('customer-categories-bar');
    if (!bar) return;

    bar.innerHTML = this.categories.map(cat => {
      const isSelected = this.selectedCategory === cat.id;
      return `
        <button 
          type="button" 
          onclick="customerApp.selectCategory('${cat.id}')"
          class="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
            isSelected 
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25 scale-[1.02]' 
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }"
        >
          <span>${cat.icon}</span>
          <span>${cat.name}</span>
        </button>
      `;
    }).join('');
  }

  selectCategory(categoryId) {
    this.selectedCategory = categoryId;
    this.renderCategoriesBar();

    const titleEl = document.getElementById('current-category-title');
    const cat = this.categories.find(c => c.id === categoryId);
    if (titleEl) titleEl.textContent = cat ? cat.name : 'All Products';

    this.renderProductGrid();
  }

  setSearchQuery(query) {
    this.searchQuery = (query || '').toLowerCase().trim();
    this.renderProductGrid();
  }

  getFilteredProducts() {
    return this.products.filter(p => {
      const matchesCat = this.selectedCategory === 'ALL' || p.category === this.selectedCategory;
      const matchesSearch = !this.searchQuery || 
        p.name.toLowerCase().includes(this.searchQuery) ||
        (p.packSize && p.packSize.toLowerCase().includes(this.searchQuery)) ||
        (p.category && p.category.toLowerCase().includes(this.searchQuery));

      return matchesCat && matchesSearch;
    });
  }

  // --- PRODUCT GRID ---

  renderProductGrid() {
    const container = document.getElementById('customer-products-grid');
    const emptyState = document.getElementById('customer-empty-products');
    const countEl = document.getElementById('current-category-count');
    if (!container) return;

    const items = this.getFilteredProducts();

    if (countEl) countEl.textContent = `Showing ${items.length} items`;

    if (items.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    container.innerHTML = items.map(p => {
      const isOutOfStock = p.stock <= 0 || !p.available;
      const isLowStock = p.stock > 0 && p.stock <= 5 && p.available;
      const cartItem = this.cart.find(c => c.productId === p.id);
      const cartQty = cartItem ? cartItem.quantity : 0;
      const hasPrice = p.price !== null && p.price !== undefined;

      let stockBadge = '';
      if (!p.available || p.stock <= 0) {
        stockBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-200">✕ Out of Stock</span>`;
      } else if (isLowStock) {
        stockBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">⚡ Only ${p.stock} left</span>`;
      } else {
        stockBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">✓ ${p.stock} in stock</span>`;
      }

      const imageUrl = p.image || '/assets/arun-vanilla-cup.jpg';

      return `
        <div class="product-card ${isOutOfStock ? 'opacity-70 grayscale-[20%]' : ''}">
          <div>
            <div class="product-image-box">
              <img 
                src="${imageUrl}" 
                alt="${p.name}" 
                loading="lazy"
                onerror="this.src='/assets/arun-vanilla-cup.jpg'"
              />
              <div class="absolute top-2.5 left-2.5">
                <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 shadow-sm">
                  ${p.category}
                </span>
              </div>
              <div class="absolute top-2.5 right-2.5">
                ${stockBadge}
              </div>
            </div>

            <div class="p-4">
              <div class="flex items-center justify-between gap-1 mb-1">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  ${p.packSize || 'Standard Pack'}
                </span>
              </div>
              <h4 class="font-extrabold text-slate-900 dark:text-slate-100 text-sm leading-snug hover:text-rose-600 transition-colors line-clamp-2">
                ${p.name}
              </h4>
            </div>
          </div>

          <div class="p-4 pt-0">
            <div class="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 mt-1">
              <div>
                <span class="text-[9px] uppercase font-bold text-slate-400 block">Price</span>
                ${hasPrice 
                  ? `<span class="text-lg font-black text-slate-900 dark:text-white font-display">₹${p.price}</span>` 
                  : `<span class="text-xs font-bold text-amber-600">Price not configured</span>`
                }
              </div>

              <div>
                ${isOutOfStock || !hasPrice
                  ? `<button disabled class="px-3 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed">Unavailable</button>`
                  : cartQty > 0
                    ? `
                      <div class="flex items-center bg-rose-50 border border-rose-200 rounded-xl p-1 shadow-sm">
                        <button type="button" onclick="customerApp.decrementCart('${p.id}')" class="w-6 h-6 rounded-lg bg-white text-rose-700 font-extrabold flex items-center justify-center hover:bg-rose-100 shadow-sm">−</button>
                        <span class="w-6 text-center text-xs font-black text-rose-700">${cartQty}</span>
                        <button type="button" onclick="customerApp.incrementCart('${p.id}')" class="w-6 h-6 rounded-lg bg-rose-600 text-white font-extrabold flex items-center justify-center hover:bg-rose-700 shadow-sm" ${cartQty >= p.stock ? 'disabled opacity-40' : ''}>+</button>
                      </div>
                    `
                    : `
                      <button 
                        type="button" 
                        onclick="customerApp.addToCart('${p.id}', 1)"
                        class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-extrabold shadow-md shadow-rose-500/20 active:scale-95 transition-all flex items-center space-x-1"
                      >
                        <span>+ Add</span>
                      </button>
                    `
                }
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- CART MANAGEMENT ---

  addToCart(productId, qty = 1) {
    const prod = this.products.find(p => p.id === productId);
    if (!prod || prod.stock <= 0 || !prod.available) {
      if (window.appController) window.appController.showToast('Item is out of stock', 'error');
      return;
    }

    const existingIndex = this.cart.findIndex(c => c.productId === productId);
    if (existingIndex !== -1) {
      if (this.cart[existingIndex].quantity + qty > prod.stock) {
        if (window.appController) window.appController.showToast(`Only ${prod.stock} units available in parlour`, 'error');
        return;
      }
      this.cart[existingIndex].quantity += qty;
    } else {
      this.cart.push({
        productId: prod.id,
        name: prod.name,
        packSize: prod.packSize || '',
        price: prod.price || 0,
        image: prod.image,
        quantity: qty
      });
    }

    this.saveCartToStorage();
    this.renderProductGrid();
    if (window.appController) window.appController.showToast(`Added ${prod.name} to cart`, 'success');
  }

  incrementCart(productId) {
    const prod = this.products.find(p => p.id === productId);
    const item = this.cart.find(c => c.productId === productId);
    if (!prod || !item) return;

    if (item.quantity >= prod.stock) {
      if (window.appController) window.appController.showToast(`Maximum available stock reached (${prod.stock})`, 'error');
      return;
    }

    item.quantity += 1;
    this.saveCartToStorage();
    this.renderProductGrid();
    this.renderCartDrawerItems();
  }

  decrementCart(productId) {
    const itemIndex = this.cart.findIndex(c => c.productId === productId);
    if (itemIndex === -1) return;

    if (this.cart[itemIndex].quantity > 1) {
      this.cart[itemIndex].quantity -= 1;
    } else {
      this.cart.splice(itemIndex, 1);
    }

    this.saveCartToStorage();
    this.renderProductGrid();
    this.renderCartDrawerItems();
  }

  removeCartItem(productId) {
    this.cart = this.cart.filter(c => c.productId !== productId);
    this.saveCartToStorage();
    this.renderProductGrid();
    this.renderCartDrawerItems();
  }

  updateCartBadge() {
    const countEl = document.getElementById('cart-badge-count');
    const totalCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (countEl) countEl.textContent = totalCount;

    // Update Mobile Floating Quick Cart Bar
    const mobileBar = document.getElementById('mobile-floating-cart-bar');
    const mobileItems = document.getElementById('mobile-cart-items-count');
    const mobileTotal = document.getElementById('mobile-cart-total-amount');

    if (mobileBar && this.currentView === 'catalog') {
      if (totalCount > 0) {
        mobileBar.classList.remove('hidden');
        if (mobileItems) mobileItems.textContent = `${totalCount} Item${totalCount > 1 ? 's' : ''}`;
        if (mobileTotal) mobileTotal.textContent = `₹${totalPrice}`;
      } else {
        mobileBar.classList.add('hidden');
      }
    } else if (mobileBar) {
      mobileBar.classList.add('hidden');
    }
  }

  updateActiveOrdersBadge() {
    const badge = document.getElementById('active-orders-badge');
    const activeCount = this.myOrders.filter(o => o.orderStatus !== 'COMPLETED' && o.orderStatus !== 'CANCELLED').length;
    if (badge) {
      if (activeCount > 0) {
        badge.textContent = activeCount;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  }

  // --- CART DRAWER ---

  openCartDrawer() {
    const backdrop = document.getElementById('cart-drawer-backdrop');
    const panel = document.getElementById('cart-drawer-panel');
    if (backdrop && panel) {
      backdrop.classList.remove('hidden');
      setTimeout(() => panel.classList.remove('translate-x-full'), 10);
      this.renderCartDrawerItems();
    }
  }

  closeCartDrawer(event) {
    if (event && event.target !== event.currentTarget) return;
    const backdrop = document.getElementById('cart-drawer-backdrop');
    const panel = document.getElementById('cart-drawer-panel');
    if (panel) panel.classList.add('translate-x-full');
    setTimeout(() => {
      if (backdrop) backdrop.classList.add('hidden');
    }, 300);
  }

  renderCartDrawerItems() {
    const container = document.getElementById('cart-drawer-items');
    const emptyEl = document.getElementById('cart-drawer-empty');
    const footerEl = document.getElementById('cart-drawer-footer');
    const subtotalEl = document.getElementById('cart-drawer-subtotal');
    const totalEl = document.getElementById('cart-drawer-total');

    if (!container) return;

    if (this.cart.length === 0) {
      container.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('hidden');
      if (footerEl) footerEl.classList.add('hidden');
      return;
    }

    if (emptyEl) emptyEl.classList.add('hidden');
    if (footerEl) footerEl.classList.remove('hidden');

    let total = 0;

    container.innerHTML = this.cart.map(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      return `
        <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-3">
          <div class="flex items-center space-x-3">
            <img src="${item.image || '/assets/arun-vanilla-cup.jpg'}" alt="${item.name}" class="w-12 h-12 object-contain rounded-xl bg-white p-1 border border-slate-100" />
            <div>
              <h5 class="font-extrabold text-slate-900 dark:text-slate-100 text-xs leading-tight line-clamp-1">${item.name}</h5>
              <span class="text-[10px] text-slate-500 font-semibold">${item.packSize} • ₹${item.price} each</span>
              <span class="text-xs font-black text-rose-600 block mt-0.5">₹${itemTotal}</span>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <div class="flex items-center bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-0.5 shadow-sm">
              <button type="button" onclick="customerApp.decrementCart('${item.productId}')" class="w-6 h-6 rounded-lg text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600">−</button>
              <span class="w-6 text-center text-xs font-black text-slate-900 dark:text-white">${item.quantity}</span>
              <button type="button" onclick="customerApp.incrementCart('${item.productId}')" class="w-6 h-6 rounded-lg text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600">+</button>
            </div>
            <button type="button" onclick="customerApp.removeCartItem('${item.productId}')" class="text-slate-400 hover:text-rose-600 p-1 text-xs">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    if (subtotalEl) subtotalEl.textContent = `₹${total}`;
    if (totalEl) totalEl.textContent = `₹${total}`;
  }

  // --- CHECKOUT & DYNAMIC UPI QR CODE ---

    openCheckoutModal() {
    this.closeCartDrawer();

    const container = document.getElementById('checkout-modal-container');
    if (!container) return;

    const user = (window.appController && window.appController.customerUser && !window.appController.customerUser.isGuest) 
      ? window.appController.customerUser 
      : { name: '', phone: '', email: '' };
      
    const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    container.innerHTML = `
      <div id="checkout-modal-backdrop" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4" onclick="customerApp.closeCheckoutModal(event)">
        <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[92vh] overflow-y-auto" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white font-display">Surya Agencies Checkout</h3>
              <p class="text-[11px] sm:text-xs text-slate-500">Pick up fresh at the parlour counter</p>
            </div>
            <button type="button" onclick="customerApp.closeCheckoutModal()" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center hover:bg-slate-200">✕</button>
          </div>

          <form id="checkout-form" onsubmit="customerApp.submitOrder(event)" class="mt-4 space-y-3.5">
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Customer Name *</label>
              <input type="text" id="checkout-name" value="${user.name || ''}" required placeholder="Enter Your Full Name" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium" />
            </div>

            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Mobile Phone Number (For Order Tracking) *</label>
              <input type="tel" id="checkout-phone" value="${user.phone || ''}" required placeholder="Enter 10-digit Mobile Number" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium" />
            </div>

            <!-- Payment Method Choice -->
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-2">Choose Payment Option</label>
              <div class="grid grid-cols-2 gap-2.5">
                <label id="payment-upi-label" class="border-2 border-rose-600 bg-rose-50/60 dark:bg-rose-950/40 rounded-2xl p-3 flex items-center space-x-2 cursor-pointer transition-all">
                  <input type="radio" name="checkout-payment" value="upi" checked onchange="customerApp.togglePaymentMethod('upi')" class="text-rose-600 focus:ring-rose-500" />
                  <span class="text-xs font-extrabold text-slate-800 dark:text-slate-200">📱 UPI Payment</span>
                </label>
                <label id="payment-cash-label" class="border border-slate-300 dark:border-slate-700 rounded-2xl p-3 flex items-center space-x-2 cursor-pointer hover:border-slate-400 transition-all">
                  <input type="radio" name="checkout-payment" value="pay_at_shop" onchange="customerApp.togglePaymentMethod('pay_at_shop')" class="text-rose-600 focus:ring-rose-500" />
                  <span class="text-xs font-extrabold text-slate-800 dark:text-slate-200">💵 Pay at Shop</span>
                </label>
              </div>
            </div>

            <!-- DYNAMIC LARGE UPI QR CODE SECTION (NO PLAIN TEXT UPI ID DISPLAYED) -->
            <div id="checkout-upi-box" class="p-4 rounded-2xl bg-gradient-to-br from-purple-50 via-slate-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 border border-purple-200/80 dark:border-purple-900/50 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-xl">📱</span>
                  <div>
                    <h5 class="text-xs font-black text-slate-900 dark:text-white">Scan & Pay ₹${total} with any UPI App</h5>
                    <p class="text-[10px] text-slate-500 font-semibold">GPay, PhonePe, Paytm, BHIM</p>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200">INSTANT UPI</span>
              </div>

              <!-- Large QR Code Canvas Container -->
              <div class="flex flex-col items-center justify-center gap-3 py-2">
                <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-md flex items-center justify-center min-w-[170px] min-h-[170px]">
                  <div id="checkout-upi-qrcode"></div>
                </div>
                
                <a 
                  href="upi://pay?pa=${encodeURIComponent(this.upiId)}&pn=Surya%20Agencies&am=${total}&cu=INR&tn=Surya%20Agencies%20Order" 
                  class="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all space-x-1.5 sm:hidden"
                >
                  <span>⚡ Pay Directly via UPI App</span>
                </a>
                <p class="text-[11px] text-slate-500 font-medium text-center">Scan this QR code with Google Pay, PhonePe, Paytm, or any BHIM UPI app on your phone.</p>
              </div>
            </div>

            <!-- Order Summary Box -->
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div class="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>Items in Order</span>
                <span class="font-bold">${this.cart.reduce((s, i) => s + i.quantity, 0)} items</span>
              </div>
              <div class="flex justify-between text-base font-black text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-1.5">
                <span>Total Amount</span>
                <span class="text-rose-600 font-mono">₹${total}</span>
              </div>
            </div>

            <button 
              type="submit" 
              id="submit-order-btn"
              class="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-sm shadow-xl shadow-rose-600/25 active:scale-98 transition-all flex items-center justify-center space-x-2"
            >
              <span>Confirm & Place Order →</span>
            </button>
          </form>
        </div>
      </div>
    `;

    this.renderCheckoutUPIQR(total);
  }

  renderCheckoutUPIQR(amount) {
    setTimeout(() => {
      const qrContainer = document.getElementById('checkout-upi-qrcode');
      if (!qrContainer) return;

      const upiUrl = `upi://pay?pa=${encodeURIComponent(this.upiId)}&pn=Surya%20Agencies&am=${amount}&cu=INR&tn=Surya%20Icecream%20Order`;

      qrContainer.innerHTML = '';
      if (typeof QRCode !== 'undefined') {
        new QRCode(qrContainer, {
          text: upiUrl,
          width: 155,
          height: 155,
          colorDark: '#0f172a',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      }
    }, 50);
  }

  closeCheckoutModal(event) {
    if (event && event.target !== event.currentTarget) return;
    const container = document.getElementById('checkout-modal-container');
    if (container) container.innerHTML = '';
  }

  async submitOrder(event) {
    event.preventDefault();
    if (this.isSubmittingOrder) return;
    this.isSubmittingOrder = true;

    const btn = document.getElementById('submit-order-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Processing Order...</span>';
    }

    const customerName = document.getElementById('checkout-name').value.trim();
    const customerPhone = document.getElementById('checkout-phone').value.trim();
    const paymentMethod = document.querySelector('input[name="checkout-payment"]:checked').value;
    const user = (window.appController && window.appController.customerUser) || {};

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user.id || null,
          customerName: customerName,
          customerPhone: customerPhone,
          customerEmail: user.email || null,
          items: this.cart,
          paymentMethod: paymentMethod,
          paymentStatus: paymentMethod === 'upi' ? 'PAID' : 'PENDING'
        })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      const placedOrder = data.order;

      this.myOrders.unshift(placedOrder);
      this.saveMyOrdersToStorage();

      this.cart = [];
      this.saveCartToStorage();

      if (window.socketClient) {
        window.socketClient.subscribeToOrder(placedOrder.id);
        window.socketClient.subscribeToOrder(placedOrder.orderNumber);
      }

      this.closeCheckoutModal();
      if (window.appController) window.appController.showToast(`Order ${placedOrder.orderNumber} placed successfully!`, 'success');

      this.showTrackingView(placedOrder);

    } catch (err) {
      if (window.appController) window.appController.showToast(err.message, 'error');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>Confirm & Place Order →</span>';
      }
    } finally {
      this.isSubmittingOrder = false;
    }
  }

  // --- LIVE ORDER TRACKING (DIGITAL PICKUP TICKET & PRINT RECEIPT) ---

  showTrackingView(order) {
    this.activeTrackedOrder = order;
    this.currentView = 'tracking';

    document.getElementById('customer-catalog-view').classList.add('hidden');
    document.getElementById('customer-orders-view').classList.add('hidden');
    const trackingView = document.getElementById('customer-tracking-view');
    if (trackingView) trackingView.classList.remove('hidden');

    this.renderTrackingView();
  }

  renderTrackingView() {
    const container = document.getElementById('customer-tracking-view');
    if (!container || !this.activeTrackedOrder) return;

    const order = this.activeTrackedOrder;
    const statusMap = {
      'NEW': { text: 'Order Received', color: 'text-blue-700 bg-blue-50 border-blue-200', step: 1 },
      'ACCEPTED': { text: 'Order Accepted', color: 'text-indigo-700 bg-indigo-50 border-indigo-200', step: 2 },
      'PREPARING': { text: 'Preparing Items', color: 'text-amber-700 bg-amber-50 border-amber-200', step: 3 },
      'READY_FOR_PICKUP': { text: 'READY FOR PICKUP', color: 'text-emerald-800 bg-emerald-100 border-emerald-300 font-black animate-pulse', step: 4 },
      'COMPLETED': { text: 'Order Completed', color: 'text-slate-700 bg-slate-100 border-slate-200', step: 5 },
      'CANCELLED': { text: 'Order Cancelled', color: 'text-rose-700 bg-rose-50 border-rose-200', step: 0 }
    };

    const currentStatus = statusMap[order.orderStatus] || statusMap['NEW'];

    container.innerHTML = `
      <div id="printable-receipt" class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <!-- Ticket Header -->
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">LIVE PICKUP TICKET</span>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display mt-1">${order.orderNumber}</h2>
          </div>
          <div class="flex items-center space-x-2 no-print">
            <button type="button" onclick="window.print()" class="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-sm flex items-center space-x-1">
              <span>🖨️ Print Bill</span>
            </button>
            <button type="button" onclick="customerApp.showCatalogView()" class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs">
              ← Store
            </button>
          </div>
        </div>

        <!-- Live Status Alert Box -->
        <div class="p-4 rounded-2xl border ${currentStatus.color} flex items-center justify-between">
          <div>
            <span class="text-[10px] uppercase font-black block tracking-wider">Current Status</span>
            <span class="text-base sm:text-lg font-black">${currentStatus.text}</span>
          </div>
          <span class="text-2xl">${order.orderStatus === 'READY_FOR_PICKUP' ? '🎉' : '🍦'}</span>
        </div>

        <!-- Real-Time Stepper -->
        ${order.orderStatus !== 'CANCELLED' ? `
          <div class="py-4 no-print">
            <div class="flex items-center justify-between relative">
              <div class="stepper-step">
                <div class="stepper-circle ${currentStatus.step >= 1 ? (currentStatus.step === 1 ? 'active' : 'completed') : ''}">1</div>
                <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-2">Received</span>
              </div>
              <div class="stepper-step">
                <div class="stepper-circle ${currentStatus.step >= 2 ? (currentStatus.step === 2 ? 'active' : 'completed') : ''}">2</div>
                <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-2">Accepted</span>
              </div>
              <div class="stepper-step">
                <div class="stepper-circle ${currentStatus.step >= 3 ? (currentStatus.step === 3 ? 'active' : 'completed') : ''}">3</div>
                <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-2">Preparing</span>
              </div>
              <div class="stepper-step">
                <div class="stepper-circle ${currentStatus.step >= 4 ? (currentStatus.step === 4 ? 'active' : 'completed') : ''}">4</div>
                <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-2">Ready</span>
              </div>
              <div class="stepper-step">
                <div class="stepper-circle ${currentStatus.step >= 5 ? 'completed' : ''}">5</div>
                <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-2">Picked Up</span>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- QR Code & Counter Instructions -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center min-w-[130px] min-h-[130px]">
            <div id="tracking-qrcode-container"></div>
          </div>
          <div class="text-center sm:text-left space-y-1">
            <span class="text-xs font-bold text-slate-500">Show this QR code at Surya Agencies counter</span>
            <h4 class="font-extrabold text-slate-900 dark:text-white text-sm">Surya Agencies Counter Pickup</h4>
            <p class="text-xs text-slate-500">Customer: ${order.customerName} (${order.customerPhone || 'Counter Pickup'})</p>
            <div class="pt-1">
              <span class="inline-block px-2.5 py-0.5 rounded text-[10px] font-black ${order.paymentMethod === 'upi' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'}">Payment: ${order.paymentMethod === 'upi' ? 'UPI Online' : 'Pay at Shop'} (${order.paymentStatus})</span>
            </div>
          </div>
        </div>

        <!-- Order Items List -->
        <div class="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
          <h4 class="font-bold text-xs text-slate-400 uppercase">Ordered Items</h4>
          <div class="space-y-2">
            ${order.items.map(item => `
              <div class="flex items-center justify-between text-xs py-1 border-b border-slate-50 dark:border-slate-800">
                <span class="font-semibold text-slate-800 dark:text-slate-200">${item.name} (${item.packSize}) × ${item.quantity}</span>
                <span class="font-mono font-bold text-slate-900 dark:text-white">₹${item.itemTotal || (item.price * item.quantity)}</span>
              </div>
            `).join('')}
          </div>
          <div class="flex justify-between items-center text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
            <span>Total Amount</span>
            <span class="text-rose-600 font-mono text-base">₹${order.total}</span>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const qrEl = document.getElementById('tracking-qrcode-container');
      if (qrEl && typeof QRCode !== 'undefined') {
        qrEl.innerHTML = '';
        new QRCode(qrEl, {
          text: order.orderNumber,
          width: 120,
          height: 120,
          colorDark: '#0f172a',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      }
    }, 50);
  }

  // --- MY ORDERS VIEW ---

  showOrdersView() {
    this.currentView = 'orders';
    document.getElementById('customer-catalog-view').classList.add('hidden');
    document.getElementById('customer-tracking-view').classList.add('hidden');
    const ordersView = document.getElementById('customer-orders-view');
    if (ordersView) ordersView.classList.remove('hidden');

    this.renderOrdersView();
  }

  showCatalogView() {
    this.currentView = 'catalog';
    document.getElementById('customer-catalog-view').classList.remove('hidden');
    document.getElementById('customer-tracking-view').classList.add('hidden');
    document.getElementById('customer-orders-view').classList.add('hidden');
  }

  renderOrdersView() {
    const container = document.getElementById('customer-orders-view');
    if (!container) return;

    if (this.myOrders.length === 0) {
      container.innerHTML = `
        <div class="max-w-2xl mx-auto text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
          <span class="text-4xl block mb-2">📦</span>
          <h3 class="font-black text-lg text-slate-900 dark:text-white font-display">No Orders Yet</h3>
          <p class="text-xs text-slate-500 mt-1">Browse our 8 categories and place your first delicious order!</p>
          <button type="button" onclick="customerApp.showCatalogView()" class="mt-6 px-6 py-3 rounded-2xl bg-rose-600 text-white font-extrabold text-xs shadow-md">Browse Catalog →</button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="max-w-3xl mx-auto space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white font-display">My Orders History</h3>
            <p class="text-xs text-slate-500 font-semibold">${this.myOrders.length} order(s) placed</p>
          </div>
          <button type="button" onclick="customerApp.showCatalogView()" class="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs">
            ← Back to Store
          </button>
        </div>

        <div class="space-y-3">
          ${this.myOrders.map(order => {
            const isCompleted = order.orderStatus === 'COMPLETED';
            const isReady = order.orderStatus === 'READY_FOR_PICKUP';

            return `
              <div class="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-rose-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-black text-slate-900 dark:text-white font-display text-base">${order.orderNumber}</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${isReady ? 'bg-emerald-100 text-emerald-800 animate-pulse' : isCompleted ? 'bg-slate-100 text-slate-700' : 'bg-rose-100 text-rose-800'}">
                      ${order.orderStatus}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 mt-1">
                    ${order.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
                  </p>
                  <span class="text-xs font-black text-rose-600 font-mono mt-1 block">Total: ₹${order.total}</span>
                </div>

                <div class="flex items-center space-x-2 w-full sm:w-auto">
                  <button 
                    type="button" 
                    onclick='customerApp.showTrackingView(${JSON.stringify(order).replace(/'/g, "&#39;")})' 
                    class="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-900 dark:bg-rose-600 text-white text-xs font-bold shadow-sm"
                  >
                    View Ticket
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
}

window.customerApp = new CustomerApp();
