const SAMPLE_PRODUCTS = [
  // -------------------------------------------------------------
  // CATEGORY 1: DAIRY PRODUCTS (Exact Hatsun & Arokya Catalog)
  // -------------------------------------------------------------
  {
    id: 'dp-001',
    name: 'Arokya Full Cream Milk (500ml)',
    category: 'Dairy Products',
    packSize: '500ml',
    price: 36,
    stock: 50,
    available: true,
    description: 'Rich, thick 6.0% fat farm-fresh pasteurised homogenized full cream milk.',
    image: '/assets/arokya-milk.jpg'
  },
  {
    id: 'dp-002',
    name: 'Arokya Full Cream Milk (1 Litre)',
    category: 'Dairy Products',
    packSize: '1 Litre',
    price: 70,
    stock: 40,
    available: true,
    description: 'Wholesome full cream milk for tea, coffee, and traditional sweets.',
    image: '/assets/arokya-milk.jpg'
  },
  {
    id: 'dp-003',
    name: 'Arokya Toned Milk (500ml)',
    category: 'Dairy Products',
    packSize: '500ml',
    price: 28,
    stock: 60,
    available: true,
    description: 'Daily fresh 3.0% fat toned milk with essential nutrients.',
    image: '/assets/arokya-milk.jpg'
  },
  {
    id: 'dp-004',
    name: 'Arokya Toned Milk (1 Litre)',
    category: 'Dairy Products',
    packSize: '1 Litre',
    price: 54,
    stock: 45,
    available: true,
    description: 'Economical 1 Litre pack of pasteurized toned milk.',
    image: '/assets/arokya-milk.jpg'
  },
  {
    id: 'dp-005',
    name: 'Arokya Double Toned Milk (500ml)',
    category: 'Dairy Products',
    packSize: '500ml',
    price: 25,
    stock: 35,
    available: true,
    description: 'Light and low-fat 1.5% double toned milk for healthy lifestyles.',
    image: '/assets/arokya-milk.jpg'
  },
  {
    id: 'dp-006',
    name: 'Hatsun Curd (Dahi) Pouch (200g)',
    category: 'Dairy Products',
    packSize: '200g',
    price: 18,
    stock: 40,
    available: true,
    description: 'Thick, creamy, naturally set curd with delicious traditional taste.',
    image: '/assets/hatsun-curd.jpg'
  },
  {
    id: 'dp-007',
    name: 'Hatsun Curd (Dahi) Pouch (400g)',
    category: 'Dairy Products',
    packSize: '400g',
    price: 35,
    stock: 45,
    available: true,
    description: 'Popular family pack curd, perfect with meals and rice.',
    image: '/assets/hatsun-curd.jpg'
  },
  {
    id: 'dp-008',
    name: 'Hatsun Curd (Dahi) Pouch (1kg)',
    category: 'Dairy Products',
    packSize: '1kg',
    price: 80,
    stock: 30,
    available: true,
    description: 'Value pack fresh Hatsun curd for families and catering.',
    image: '/assets/hatsun-curd.jpg'
  },
  {
    id: 'dp-009',
    name: 'Hatsun Curd Cup (200g)',
    category: 'Dairy Products',
    packSize: '200g Cup',
    price: 22,
    stock: 30,
    available: true,
    description: 'Convenient ready-to-eat cup of thick homestyle set curd.',
    image: '/assets/hatsun-curd.jpg'
  },
  {
    id: 'dp-010',
    name: 'Hatsun Curd Cup (400g)',
    category: 'Dairy Products',
    packSize: '400g Tub',
    price: 42,
    stock: 25,
    available: true,
    description: 'Sturdy tub of premium set dahi, leak-proof and fresh.',
    image: '/assets/hatsun-curd.jpg'
  },
  {
    id: 'dp-011',
    name: 'Hatsun Fresh Paneer (200g)',
    category: 'Dairy Products',
    packSize: '200g',
    price: 95,
    stock: 30,
    available: true,
    description: 'Ultra-soft, melt-in-mouth malai paneer made from pure cow milk.',
    image: '/assets/hatsun-paneer.jpg'
  },
  {
    id: 'dp-012',
    name: 'Hatsun Fresh Paneer (500g)',
    category: 'Dairy Products',
    packSize: '500g',
    price: 230,
    stock: 20,
    available: true,
    description: 'Large block of premium cottage cheese for curries and snacks.',
    image: '/assets/hatsun-paneer.jpg'
  },
  {
    id: 'dp-013',
    name: 'Hatsun Cooking Butter (100g)',
    category: 'Dairy Products',
    packSize: '100g',
    price: 58,
    stock: 25,
    available: true,
    description: 'Pure unsalted white cooking butter for traditional culinary dishes.',
    image: '/assets/hatsun-butter.jpg'
  },
  {
    id: 'dp-014',
    name: 'Hatsun Cooking Butter (500g)',
    category: 'Dairy Products',
    packSize: '500g',
    price: 280,
    stock: 20,
    available: true,
    description: 'Pure unsalted butter made from fresh cream.',
    image: '/assets/hatsun-butter.jpg'
  },
  {
    id: 'dp-015',
    name: 'Hatsun Table Butter (100g)',
    category: 'Dairy Products',
    packSize: '100g',
    price: 60,
    stock: 30,
    available: true,
    description: 'Pasteurized salted table butter, creamy and smooth on warm toasts.',
    image: '/assets/hatsun-butter.jpg'
  },
  {
    id: 'dp-016',
    name: 'Hatsun Table Butter (500g)',
    category: 'Dairy Products',
    packSize: '500g',
    price: 290,
    stock: 15,
    available: true,
    description: 'Premium salted table butter for baking and spreads.',
    image: '/assets/hatsun-butter.jpg'
  },
  {
    id: 'dp-017',
    name: 'Hatsun Pure Cow Ghee Pouch (200ml)',
    category: 'Dairy Products',
    packSize: '200ml',
    price: 155,
    stock: 35,
    available: true,
    description: 'Traditional golden granular cow ghee with rich natural aroma.',
    image: '/assets/hatsun-ghee.jpg'
  },
  {
    id: 'dp-018',
    name: 'Hatsun Pure Cow Ghee Pouch (500ml)',
    category: 'Dairy Products',
    packSize: '500ml',
    price: 375,
    stock: 30,
    available: true,
    description: 'Pure, authentic aromatic cow ghee in convenient pouch pack.',
    image: '/assets/hatsun-ghee.jpg'
  },
  {
    id: 'dp-019',
    name: 'Hatsun Pure Cow Ghee Jar (500ml)',
    category: 'Dairy Products',
    packSize: '500ml Jar',
    price: 395,
    stock: 25,
    available: true,
    description: 'Aromatic granular cow ghee in a reusable hygienic jar.',
    image: '/assets/hatsun-ghee.jpg'
  },
  {
    id: 'dp-020',
    name: 'Hatsun Pure Cow Ghee Tin (1 Litre)',
    category: 'Dairy Products',
    packSize: '1 Litre Tin',
    price: 760,
    stock: 20,
    available: true,
    description: '100% pure cow ghee in traditional airtight metal tin.',
    image: '/assets/hatsun-ghee.jpg'
  },
  {
    id: 'dp-021',
    name: 'Hatsun Dairy Whitener (200g)',
    category: 'Dairy Products',
    packSize: '200g',
    price: 90,
    stock: 25,
    available: true,
    description: 'Instant rich dairy whitener for thick tea and coffee.',
    image: '/assets/hatsun-ghee.jpg'
  },
  {
    id: 'dp-022',
    name: 'Hatsun Dairy Whitener (500g)',
    category: 'Dairy Products',
    packSize: '500g',
    price: 215,
    stock: 20,
    available: true,
    description: 'Special spray-dried milk powder with natural sweetness.',
    image: '/assets/hatsun-ghee.jpg'
  },
  {
    id: 'dp-023',
    name: 'Hatsun Flavoured Milk Chocolate (200ml)',
    category: 'Dairy Products',
    packSize: '200ml',
    price: 35,
    stock: 40,
    available: true,
    description: 'Thick chocolate milkshake in easy-sip chilled bottle.',
    image: '/assets/hatsun-flavoured-milk.jpg'
  },
  {
    id: 'dp-024',
    name: 'Hatsun Flavoured Milk Badam (200ml)',
    category: 'Dairy Products',
    packSize: '200ml',
    price: 35,
    stock: 40,
    available: true,
    description: 'Delicious almond flavoured milk packed with natural taste.',
    image: '/assets/hatsun-flavoured-milk.jpg'
  },
  {
    id: 'dp-025',
    name: 'Hatsun Flavoured Milk Pista (200ml)',
    category: 'Dairy Products',
    packSize: '200ml',
    price: 35,
    stock: 35,
    available: true,
    description: 'Rich pistachio flavoured milk, creamy and refreshing.',
    image: '/assets/hatsun-flavoured-milk.jpg'
  },
  {
    id: 'dp-026',
    name: 'Hatsun Flavoured Milk Strawberry (200ml)',
    category: 'Dairy Products',
    packSize: '200ml',
    price: 35,
    stock: 35,
    available: true,
    description: 'Fruity strawberry flavoured milkshake.',
    image: '/assets/hatsun-flavoured-milk.jpg'
  },
  {
    id: 'dp-027',
    name: 'Hatsun Sweet Lassi (200ml)',
    category: 'Dairy Products',
    packSize: '200ml',
    price: 25,
    stock: 45,
    available: true,
    description: 'Traditional sweetened curd beverage, smooth and soothing.',
    image: '/assets/hatsun-flavoured-milk.jpg'
  },
  {
    id: 'dp-028',
    name: 'Hatsun Mango Lassi (200ml)',
    category: 'Dairy Products',
    packSize: '200ml',
    price: 30,
    stock: 40,
    available: true,
    description: 'Thick creamy lassi blended with natural Alphonso mango pulp.',
    image: '/assets/hatsun-flavoured-milk.jpg'
  },
  {
    id: 'dp-029',
    name: 'Hatsun Spiced Buttermilk (200ml)',
    category: 'Dairy Products',
    packSize: '200ml',
    price: 15,
    stock: 50,
    available: true,
    description: 'Refreshing spiced buttermilk with ginger, curry leaves, and green chilli.',
    image: '/assets/hatsun-flavoured-milk.jpg'
  },
  {
    id: 'dp-030',
    name: 'Hatsun Yogurt Shake Strawberry (200ml)',
    category: 'Dairy Products',
    packSize: '200ml',
    price: 40,
    stock: 30,
    available: true,
    description: 'Probiotic drinkable yogurt shake with real strawberry pulp.',
    image: '/assets/hatsun-flavoured-milk.jpg'
  },

  // -------------------------------------------------------------
  // CATEGORY 2: ICE CREAM CONES (iCONE)
  // -------------------------------------------------------------
  {
    id: 'cone-001',
    name: 'iCone Premium Butterscotch (120ml)',
    category: 'Ice Cream Cones',
    packSize: '120ml Cone',
    price: 55,
    stock: 40,
    available: true,
    description: 'Crispy wafer cone filled with rich butterscotch ice cream and roasted cashew praline.',
    image: '/assets/arun-cone.jpg'
  },
  {
    id: 'cone-002',
    name: 'iCone Double Chocolate (120ml)',
    category: 'Ice Cream Cones',
    packSize: '120ml Cone',
    price: 60,
    stock: 45,
    available: true,
    description: 'Decadent dark chocolate ice cream loaded with chocolate fudge and chocolate chips.',
    image: '/assets/arun-cone.jpg'
  },
  {
    id: 'cone-003',
    name: 'iCone Blackcurrant Blast (120ml)',
    category: 'Ice Cream Cones',
    packSize: '120ml Cone',
    price: 55,
    stock: 35,
    available: true,
    description: 'Real blackcurrant berries swirled in creamy ice cream with a crunchy chocolate tip.',
    image: '/assets/arun-cone.jpg'
  },
  {
    id: 'cone-004',
    name: 'iCone Classic Vanilla (120ml)',
    category: 'Ice Cream Cones',
    packSize: '120ml Cone',
    price: 45,
    stock: 30,
    available: true,
    description: 'Pure Madagascar vanilla ice cream topped with chocolate drizzle and roasted peanuts.',
    image: '/assets/arun-cone.jpg'
  },
  {
    id: 'cone-005',
    name: 'iCone Strawberry Ripple (120ml)',
    category: 'Ice Cream Cones',
    packSize: '120ml Cone',
    price: 50,
    stock: 30,
    available: true,
    description: 'Luscious strawberry ice cream with natural fruit syrup in a crunchy waffle cone.',
    image: '/assets/arun-cone.jpg'
  },
  {
    id: 'cone-006',
    name: 'iCone Choco Coffee Mocha (120ml)',
    category: 'Ice Cream Cones',
    packSize: '120ml Cone',
    price: 60,
    stock: 25,
    available: true,
    description: 'Arabica coffee infused creamy ice cream with Belgian chocolate swirls.',
    image: '/assets/arun-cone.jpg'
  },
  {
    id: 'cone-007',
    name: 'iCone Mini Choco (60ml)',
    category: 'Ice Cream Cones',
    packSize: '60ml Mini',
    price: 30,
    stock: 40,
    available: true,
    description: 'Snack-sized crunchy chocolate cone, ideal for quick cravings.',
    image: '/assets/arun-cone.jpg'
  },
  {
    id: 'cone-008',
    name: 'iCone Mini Butterscotch (60ml)',
    category: 'Ice Cream Cones',
    packSize: '60ml Mini',
    price: 30,
    stock: 40,
    available: true,
    description: 'Bite-sized mini cone packed with butterscotch crunch.',
    image: '/assets/arun-cone.jpg'
  },

  // -------------------------------------------------------------
  // CATEGORY 3: ICE CREAM BARS & STICKS (iBAR & ARUN)
  // -------------------------------------------------------------
  {
    id: 'bar-001',
    name: 'Arun Chocobar Classic (60ml)',
    category: 'Ice Cream Bars & Sticks',
    packSize: '60ml Bar',
    price: 25,
    stock: 50,
    available: true,
    description: 'All-time favourite rich vanilla bar coated in crackling milk chocolate.',
    image: '/assets/arun-chocobar.jpg'
  },
  {
    id: 'bar-002',
    name: 'Arun Double Chocobar (70ml)',
    category: 'Ice Cream Bars & Sticks',
    packSize: '70ml Bar',
    price: 35,
    stock: 45,
    available: true,
    description: 'Chocolate ice cream center dipped in thick gourmet chocolate shell.',
    image: '/assets/arun-chocobar.jpg'
  },
  {
    id: 'bar-003',
    name: 'iBar Mango Fruit Blast (70ml)',
    category: 'Ice Cream Bars & Sticks',
    packSize: '70ml Bar',
    price: 40,
    stock: 35,
    available: true,
    description: 'Real Alphonso mango ice cream coated with a luscious mango glaze.',
    image: '/assets/arun-likstick.jpg'
  },
  {
    id: 'bar-004',
    name: 'iBar Raspberry White Choco (70ml)',
    category: 'Ice Cream Bars & Sticks',
    packSize: '70ml Bar',
    price: 45,
    stock: 30,
    available: true,
    description: 'Tangy raspberry ice cream enveloped in premium Belgian white chocolate.',
    image: '/assets/arun-chocobar.jpg'
  },
  {
    id: 'bar-005',
    name: 'Arun Choco Feast Bar (80ml)',
    category: 'Ice Cream Bars & Sticks',
    packSize: '80ml Bar',
    price: 50,
    stock: 35,
    available: true,
    description: 'Crispy biscuit core surrounded by rich ice cream and crunchy chocolate nut crust.',
    image: '/assets/arun-chocobar.jpg'
  },
  {
    id: 'bar-006',
    name: 'Kulfi King Pista Stick (60ml)',
    category: 'Ice Cream Bars & Sticks',
    packSize: '60ml Stick',
    price: 30,
    stock: 40,
    available: true,
    description: 'Authentic slow-simmered rabri kulfi studded with pistachios.',
    image: '/assets/arun-kulfi-king.jpg'
  },
  {
    id: 'bar-007',
    name: 'Kulfi King Badam Stick (60ml)',
    category: 'Ice Cream Bars & Sticks',
    packSize: '60ml Stick',
    price: 30,
    stock: 40,
    available: true,
    description: 'Traditional desi almond kulfi stick with authentic saffron cardamom flavor.',
    image: '/assets/arun-kulfi-king.jpg'
  },
  {
    id: 'bar-008',
    name: 'Kulfi King Malai Stick (60ml)',
    category: 'Ice Cream Bars & Sticks',
    packSize: '60ml Stick',
    price: 30,
    stock: 35,
    available: true,
    description: 'Pure cream malai kulfi frozen to perfection on traditional wooden stick.',
    image: '/assets/arun-kulfi-king.jpg'
  },
  {
    id: 'bar-009',
    name: 'Likstick Mango Juicy Ice (50ml)',
    category: 'Ice Cream Bars & Sticks',
    packSize: '50ml Ice Lolly',
    price: 15,
    stock: 60,
    available: true,
    description: 'Zesty refreshing mango fruit ice candy on a stick.',
    image: '/assets/arun-likstick.jpg'
  },
  {
    id: 'bar-010',
    name: 'Likstick Juicy Grape Ice (50ml)',
    category: 'Ice Cream Bars & Sticks',
    packSize: '50ml Ice Lolly',
    price: 15,
    stock: 55,
    available: true,
    description: 'Refreshing sweet purple grape fruit ice candy.',
    image: '/assets/arun-likstick.jpg'
  },
  {
    id: 'bar-011',
    name: 'Likstick Tangy Orange Ice (50ml)',
    category: 'Ice Cream Bars & Sticks',
    packSize: '50ml Ice Lolly',
    price: 15,
    stock: 55,
    available: true,
    description: 'Sun-ripened orange citrus ice lolly.',
    image: '/assets/arun-likstick.jpg'
  },
  {
    id: 'bar-012',
    name: 'Yummy Bear Vanilla Stick (45ml)',
    category: 'Ice Cream Bars & Sticks',
    packSize: '45ml Bar',
    price: 20,
    stock: 35,
    available: true,
    description: 'Fun bear-shaped vanilla ice cream stick for kids.',
    image: '/assets/arun-chocobar.jpg'
  },
  {
    id: 'bar-013',
    name: 'Yummy Bear Chocolate Stick (45ml)',
    category: 'Ice Cream Bars & Sticks',
    packSize: '45ml Bar',
    price: 20,
    stock: 35,
    available: true,
    description: 'Kids favourite bear-shaped milk chocolate ice cream on a stick.',
    image: '/assets/arun-chocobar.jpg'
  },
  {
    id: 'bar-014',
    name: 'Arun Cotton Candy Stick (60ml)',
    category: 'Ice Cream Bars & Sticks',
    packSize: '60ml Bar',
    price: 30,
    stock: 30,
    available: true,
    description: 'Whimsical swirl of pink and blue carnival cotton candy ice cream.',
    image: '/assets/arun-likstick.jpg'
  },

  // -------------------------------------------------------------
  // CATEGORY 4: ICE CREAM CUPS & DUETS
  // -------------------------------------------------------------
  {
    id: 'cup-001',
    name: 'Arun Classic Vanilla Cup (50ml)',
    category: 'Ice Cream Cups & Duets',
    packSize: '50ml Cup',
    price: 15,
    stock: 60,
    available: true,
    description: 'Smooth and creamy classic vanilla cup with wooden spoon.',
    image: '/assets/arun-vanilla-cup.jpg'
  },
  {
    id: 'cup-002',
    name: 'Arun Classic Vanilla Cup (100ml)',
    category: 'Ice Cream Cups & Duets',
    packSize: '100ml Cup',
    price: 25,
    stock: 50,
    available: true,
    description: 'Creamy pure vanilla treat in a generous 100ml cup.',
    image: '/assets/arun-vanilla-cup.jpg'
  },
  {
    id: 'cup-003',
    name: 'Arun Fresh Strawberry Cup (50ml)',
    category: 'Ice Cream Cups & Duets',
    packSize: '50ml Cup',
    price: 15,
    stock: 50,
    available: true,
    description: 'Sweet strawberry ice cream cup with real fruit notes.',
    image: '/assets/arun-vanilla-cup.jpg'
  },
  {
    id: 'cup-004',
    name: 'Arun Fresh Strawberry Cup (100ml)',
    category: 'Ice Cream Cups & Duets',
    packSize: '100ml Cup',
    price: 25,
    stock: 40,
    available: true,
    description: 'Luscious strawberry dessert cup.',
    image: '/assets/arun-vanilla-cup.jpg'
  },
  {
    id: 'cup-005',
    name: 'Arun Chocolate Delight Cup (100ml)',
    category: 'Ice Cream Cups & Duets',
    packSize: '100ml Cup',
    price: 30,
    stock: 45,
    available: true,
    description: 'Rich cocoa chocolate ice cream cup.',
    image: '/assets/arun-vanilla-cup.jpg'
  },
  {
    id: 'cup-006',
    name: 'Arun Butterscotch Crunch Cup (100ml)',
    category: 'Ice Cream Cups & Duets',
    packSize: '100ml Cup',
    price: 30,
    stock: 45,
    available: true,
    description: 'Caramel butterscotch ice cream packed with crunchy praline nuts.',
    image: '/assets/arun-vanilla-cup.jpg'
  },
  {
    id: 'cup-007',
    name: 'Arun Blackcurrant Cup (100ml)',
    category: 'Ice Cream Cups & Duets',
    packSize: '100ml Cup',
    price: 35,
    stock: 35,
    available: true,
    description: 'Tangy sweet blackcurrant dessert with real berry compote.',
    image: '/assets/arun-vanilla-cup.jpg'
  },
  {
    id: 'cup-008',
    name: 'Arun Royal Kesar Pista Cup (100ml)',
    category: 'Ice Cream Cups & Duets',
    packSize: '100ml Cup',
    price: 40,
    stock: 35,
    available: true,
    description: 'Infused with royal Kashmiri saffron and crunchy roasted pistachios.',
    image: '/assets/arun-vanilla-cup.jpg'
  },
  {
    id: 'cup-009',
    name: 'Duet Vanilla-Raspberry (90ml)',
    category: 'Ice Cream Cups & Duets',
    packSize: '90ml Bar',
    price: 35,
    stock: 35,
    available: true,
    description: 'Rich vanilla ice cream core dipped in exotic raspberry fruit coat.',
    image: '/assets/arun-chocobar.jpg'
  },
  {
    id: 'cup-010',
    name: 'Duet Vanilla-Mango (90ml)',
    category: 'Ice Cream Cups & Duets',
    packSize: '90ml Bar',
    price: 35,
    stock: 35,
    available: true,
    description: 'Creamy vanilla surrounded by Alphonso mango fruit coating.',
    image: '/assets/arun-chocobar.jpg'
  },
  {
    id: 'cup-011',
    name: 'Duet Chocolate-Mint (90ml)',
    category: 'Ice Cream Cups & Duets',
    packSize: '90ml Bar',
    price: 40,
    stock: 30,
    available: true,
    description: 'Cool peppermint ice cream enrobed in dark chocolate shell.',
    image: '/assets/arun-chocobar.jpg'
  },

  // -------------------------------------------------------------
  // CATEGORY 5: NOVELTIES & SLICES
  // -------------------------------------------------------------
  {
    id: 'nov-001',
    name: 'Arun Vanilla Ice Cream Sandwich (100ml)',
    category: 'Ice Cream Novelties & Slices',
    packSize: '100ml Sandwich',
    price: 40,
    stock: 35,
    available: true,
    description: 'Thick vanilla ice cream slab sandwiched between soft chocolate biscuits.',
    image: '/assets/arun-sandwich.jpg'
  },
  {
    id: 'nov-002',
    name: 'Arun Double Chocolate Sandwich (100ml)',
    category: 'Ice Cream Novelties & Slices',
    packSize: '100ml Sandwich',
    price: 45,
    stock: 30,
    available: true,
    description: 'Belgian chocolate ice cream between dark cocoa wafer cookies.',
    image: '/assets/arun-sandwich.jpg'
  },
  {
    id: 'nov-003',
    name: 'Arun Cassata Cut Slice (120ml)',
    category: 'Ice Cream Novelties & Slices',
    packSize: '120ml Slice',
    price: 55,
    stock: 30,
    available: true,
    description: 'Tri-colour layered cassata on fluffy sponge cake with candied fruit peels and nuts.',
    image: '/assets/arun-cassata-slice.jpg'
  },
  {
    id: 'nov-004',
    name: 'Arun Cassata Ball (100ml)',
    category: 'Ice Cream Novelties & Slices',
    packSize: '100ml Ball',
    price: 50,
    stock: 25,
    available: true,
    description: 'Multi-layered ice cream sphere with sweet fruity center.',
    image: '/assets/arun-cassata-slice.jpg'
  },
  {
    id: 'nov-005',
    name: 'Arun Bites Kesar Peda (Box of 6)',
    category: 'Ice Cream Novelties & Slices',
    packSize: 'Box of 6',
    price: 90,
    stock: 25,
    available: true,
    description: 'Bite-sized mithai fusion ice cream bonbons coated in white chocolate.',
    image: '/assets/arun-matka-kulfi.jpg'
  },
  {
    id: 'nov-006',
    name: 'Arun Bites Motichoor (Box of 6)',
    category: 'Ice Cream Novelties & Slices',
    packSize: 'Box of 6',
    price: 90,
    stock: 25,
    available: true,
    description: 'Fusion treats combining real motichoor laddu flavour and rich milk ice cream.',
    image: '/assets/arun-matka-kulfi.jpg'
  },
  {
    id: 'nov-007',
    name: 'Arun Bites Kaju Katli (Box of 6)',
    category: 'Ice Cream Novelties & Slices',
    packSize: 'Box of 6',
    price: 110,
    stock: 20,
    available: true,
    description: 'Exquisite cashew delicacy transformed into decadent ice cream bites.',
    image: '/assets/arun-matka-kulfi.jpg'
  },

  // -------------------------------------------------------------
  // CATEGORY 6: SUNDAES & IN-STORE SPECIALS
  // -------------------------------------------------------------
  {
    id: 'sun-001',
    name: 'Arun Chocolate Fudge Sundae Cup (140ml)',
    category: 'Sundaes & In-Store Specials',
    packSize: '140ml Cup',
    price: 65,
    stock: 30,
    available: true,
    description: 'Vanilla and chocolate ice cream layered with hot chocolate fudge and roasted peanuts.',
    image: '/assets/arun-sundae.jpg'
  },
  {
    id: 'sun-002',
    name: 'Arun Butterscotch Crunch Sundae Cup (140ml)',
    category: 'Sundaes & In-Store Specials',
    packSize: '140ml Cup',
    price: 65,
    stock: 30,
    available: true,
    description: 'Rich butterscotch dessert topped with golden butterscotch sauce and caramelized nuts.',
    image: '/assets/arun-sundae.jpg'
  },
  {
    id: 'sun-003',
    name: 'Arun Mango Jelly Sundae (140ml)',
    category: 'Sundaes & In-Store Specials',
    packSize: '140ml Cup',
    price: 65,
    stock: 25,
    available: true,
    description: 'Mango ice cream layered with sweet mango jelly cubes and cream sauce.',
    image: '/assets/arun-sundae.jpg'
  },
  {
    id: 'sun-004',
    name: 'Arun Strawberry Twist Sundae (140ml)',
    category: 'Sundaes & In-Store Specials',
    packSize: '140ml Cup',
    price: 65,
    stock: 25,
    available: true,
    description: 'Strawberry swirls with strawberry compote drizzle and wafer crisps.',
    image: '/assets/arun-sundae.jpg'
  },
  {
    id: 'sun-005',
    name: 'Arun Cookies & Cream Sundae (140ml)',
    category: 'Sundaes & In-Store Specials',
    packSize: '140ml Cup',
    price: 70,
    stock: 25,
    available: true,
    description: 'Vanilla cream layered with crumbled Oreo cookie chunks and chocolate syrup.',
    image: '/assets/arun-sundae.jpg'
  },

  // -------------------------------------------------------------
  // CATEGORY 7: FAMILY TUBS & PACKS (1 LITRE)
  // -------------------------------------------------------------
  {
    id: 'tub-001',
    name: 'Arun Classic Vanilla Tub (1 Litre)',
    category: 'Family Tubs & Packs',
    packSize: '1 Litre Tub',
    price: 160,
    stock: 25,
    available: true,
    description: 'Family dessert tub of pure velvety vanilla ice cream.',
    image: '/assets/arun-butterscotch-tub.jpg'
  },
  {
    id: 'tub-002',
    name: 'Arun Fresh Strawberry Tub (1 Litre)',
    category: 'Family Tubs & Packs',
    packSize: '1 Litre Tub',
    price: 180,
    stock: 20,
    available: true,
    description: '1 Litre tub of smooth strawberry ice cream made with real dairy milk.',
    image: '/assets/arun-butterscotch-tub.jpg'
  },
  {
    id: 'tub-003',
    name: 'Arun Chocolate Indulgence Tub (1 Litre)',
    category: 'Family Tubs & Packs',
    packSize: '1 Litre Tub',
    price: 210,
    stock: 25,
    available: true,
    description: 'Rich dark and milk chocolate ice cream for chocolate lovers.',
    image: '/assets/arun-butterscotch-tub.jpg'
  },
  {
    id: 'tub-004',
    name: 'Arun Butterscotch Praline Tub (1 Litre)',
    category: 'Family Tubs & Packs',
    packSize: '1 Litre Tub',
    price: 210,
    stock: 25,
    available: true,
    description: 'Creamy butterscotch ice cream generously loaded with crunchy praline chunks.',
    image: '/assets/arun-butterscotch-tub.jpg'
  },
  {
    id: 'tub-005',
    name: 'Arun Blackcurrant Berry Tub (1 Litre)',
    category: 'Family Tubs & Packs',
    packSize: '1 Litre Tub',
    price: 230,
    stock: 20,
    available: true,
    description: 'Tangy sweet purple blackcurrant ice cream with whole berry pieces.',
    image: '/assets/arun-butterscotch-tub.jpg'
  },
  {
    id: 'tub-006',
    name: 'Arun Royal Kesar Pista Tub (1 Litre)',
    category: 'Family Tubs & Packs',
    packSize: '1 Litre Tub',
    price: 260,
    stock: 20,
    available: true,
    description: 'Authentic Kashmiri saffron and pistachios in a 1 Litre party pack.',
    image: '/assets/arun-butterscotch-tub.jpg'
  },
  {
    id: 'tub-007',
    name: 'Arun Alphonso Mango Tub (1 Litre)',
    category: 'Family Tubs & Packs',
    packSize: '1 Litre Tub',
    price: 220,
    stock: 20,
    available: true,
    description: 'Made with 100% Ratnagiri Alphonso mango pulp and pure milk.',
    image: '/assets/arun-butterscotch-tub.jpg'
  },
  {
    id: 'tub-008',
    name: 'Arun Exotic Red Velvet Tub (1 Litre)',
    category: 'Family Tubs & Packs',
    packSize: '1 Litre Tub',
    price: 280,
    stock: 15,
    available: true,
    description: 'Gourmet red velvet cake crumbs swirled in cream cheese ice cream.',
    image: '/assets/arun-butterscotch-tub.jpg'
  },
  {
    id: 'tub-009',
    name: 'Arun Brownie Banoffee Tub (1 Litre)',
    category: 'Family Tubs & Packs',
    packSize: '1 Litre Tub',
    price: 290,
    stock: 15,
    available: true,
    description: 'Fudgy brownie pieces, banana cream and caramel toffee swirl.',
    image: '/assets/arun-butterscotch-tub.jpg'
  },
  {
    id: 'tub-010',
    name: 'Arun Salted Caramel Crunch Tub (1 Litre)',
    category: 'Family Tubs & Packs',
    packSize: '1 Litre Tub',
    price: 270,
    stock: 15,
    available: true,
    description: 'Smooth sea-salt caramel with crunchy buttered toffee bits.',
    image: '/assets/arun-butterscotch-tub.jpg'
  },
  {
    id: 'tub-011',
    name: 'Arun Jackfruit Special Tub (1 Litre)',
    category: 'Family Tubs & Packs',
    packSize: '1 Litre Tub',
    price: 250,
    stock: 15,
    available: true,
    description: 'Traditional seasonal South Indian jackfruit (Pala Pazham) ice cream.',
    image: '/assets/arun-butterscotch-tub.jpg'
  },
  {
    id: 'tub-012',
    name: 'Arun Blueberry Cheesecake Tub (1 Litre)',
    category: 'Family Tubs & Packs',
    packSize: '1 Litre Tub',
    price: 295,
    stock: 15,
    available: true,
    description: 'New York style cheesecake ice cream with blueberry swirl and graham cracker crunch.',
    image: '/assets/arun-butterscotch-tub.jpg'
  },

  // -------------------------------------------------------------
  // CATEGORY 8: ICE CREAM CAKES (HANOBAR / HAP CAKES)
  // -------------------------------------------------------------
  {
    id: 'cake-001',
    name: 'Arun Signature Black Forest Ice Cream Cake (500g)',
    category: 'Ice Cream Cakes',
    packSize: '500g Cake',
    price: 450,
    stock: 10,
    available: true,
    description: 'Layers of rich chocolate sponge, vanilla ice cream, chocolate curls, and red cherries.',
    image: '/assets/arun-ice-cream-cake.jpg'
  },
  {
    id: 'cake-002',
    name: 'Arun Butterscotch Delight Cake (500g)',
    category: 'Ice Cream Cakes',
    packSize: '500g Cake',
    price: 450,
    stock: 10,
    available: true,
    description: 'Crunchy butterscotch ice cream cake topped with roasted almond flakes and caramel.',
    image: '/assets/arun-ice-cream-cake.jpg'
  },
  {
    id: 'cake-003',
    name: 'Arun Choco-Brownie Celebration Cake (1kg)',
    category: 'Ice Cream Cakes',
    packSize: '1kg Cake',
    price: 799,
    stock: 8,
    available: true,
    description: 'Double layer chocolate fudge brownie with Belgian dark chocolate ice cream.',
    image: '/assets/arun-ice-cream-cake.jpg'
  },
  {
    id: 'cake-004',
    name: 'Arun Cassata Celebration Cake (1kg)',
    category: 'Ice Cream Cakes',
    packSize: '1kg Cake',
    price: 750,
    stock: 8,
    available: true,
    description: 'Grand rainbow cassata cake with tutti frutti, sponge cake, and royal dry fruits.',
    image: '/assets/arun-ice-cream-cake.jpg'
  },
  {
    id: 'cake-005',
    name: 'Arun Mango Magic Ice Cream Cake (500g)',
    category: 'Ice Cream Cakes',
    packSize: '500g Cake',
    price: 480,
    stock: 10,
    available: true,
    description: 'Refreshing Alphonso mango ice cream cake decorated with white chocolate shavings.',
    image: '/assets/arun-ice-cream-cake.jpg'
  },
  {
    id: 'cake-006',
    name: 'Arun Strawberry Cream Dream Cake (500g)',
    category: 'Ice Cream Cakes',
    packSize: '500g Cake',
    price: 480,
    stock: 10,
    available: true,
    description: 'Fresh strawberry ice cream and vanilla sponge layered with strawberry glaze.',
    image: '/assets/arun-ice-cream-cake.jpg'
  },
  {
    id: 'cake-007',
    name: 'Arun Mini Ice Cream Log - Chocolate (250g)',
    category: 'Ice Cream Cakes',
    packSize: '250g Mini Log',
    price: 220,
    stock: 15,
    available: true,
    description: 'Dessert roll filled with dark chocolate fudge and vanilla ice cream.',
    image: '/assets/arun-ice-cream-cake.jpg'
  },
  {
    id: 'cake-008',
    name: 'Arun Mini Ice Cream Log - Vanilla Strawberry (250g)',
    category: 'Ice Cream Cakes',
    packSize: '250g Mini Log',
    price: 220,
    stock: 15,
    available: true,
    description: 'Swiss roll style ice cream log with strawberry swirl.',
    image: '/assets/arun-ice-cream-cake.jpg'
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SAMPLE_PRODUCTS };
}
