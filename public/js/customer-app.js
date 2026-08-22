/**
 * Customer Portal Logic — Surya Agencies
 * 8 Official Categories, Fixed Product Cards, Cart, Checkout, Live Tracking & My Orders
 */

class CustomerApp {
  constructor() {
    this.products = [
  {
    "id": "arokya-full-cream-500ml",
    "name": "Arokya Full Cream Milk (500ml)",
    "category": "Dairy Products",
    "packSize": "500ml",
    "price": 36,
    "stock": 50,
    "available": 1,
    "description": "Fresh, pasteurized, rich full cream milk with 6.0% fat content for thick curd, tea, and coffee.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "arokya-full-cream-1l",
    "name": "Arokya Full Cream Milk (1 Litre)",
    "category": "Dairy Products",
    "packSize": "1 Litre",
    "price": 70,
    "stock": 40,
    "available": 1,
    "description": "Pure rich wholesome milk with high cream content, ideal for daily family consumption.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "arokya-toned-milk-500ml",
    "name": "Arokya Toned Milk (500ml)",
    "category": "Dairy Products",
    "packSize": "500ml",
    "price": 28,
    "stock": 60,
    "available": 1,
    "description": "Nutritious pasteurized toned milk with 3.0% fat, perfect for balanced everyday health.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "arokya-toned-milk-1l",
    "name": "Arokya Toned Milk (1 Litre)",
    "category": "Dairy Products",
    "packSize": "1 Litre",
    "price": 54,
    "stock": 45,
    "available": 1,
    "description": "Fresh homogenized toned milk packed with essential proteins and calcium.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "arokya-double-toned-500ml",
    "name": "Arokya Double Toned Milk (500ml)",
    "category": "Dairy Products",
    "packSize": "500ml",
    "price": 25,
    "stock": 35,
    "available": 1,
    "description": "Low-fat light double toned milk with 1.5% fat, ideal for fitness and low-calorie diets.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "hatsun-curd-pouch-200g",
    "name": "Hatsun Curd Pouch (200g)",
    "category": "Dairy Products",
    "packSize": "200g",
    "price": 18,
    "stock": 40,
    "available": 1,
    "description": "Traditional thick, creamy dahi made from farm-fresh pasteurized milk.",
    "image": "/assets/arun-matka-kulfi.jpg"
  },
  {
    "id": "hatsun-curd-pouch-400g",
    "name": "Hatsun Curd Pouch (400g)",
    "category": "Dairy Products",
    "packSize": "400g",
    "price": 34,
    "stock": 50,
    "available": 1,
    "description": "Smooth, naturally set thick curd pouch for everyday meals, curd rice, and raita.",
    "image": "/assets/arun-matka-kulfi.jpg"
  },
  {
    "id": "hatsun-curd-pouch-1kg",
    "name": "Hatsun Curd Pouch (1kg)",
    "category": "Dairy Products",
    "packSize": "1kg",
    "price": 80,
    "stock": 30,
    "available": 1,
    "description": "Family size pack of rich, thick, and delicious Hatsun farm curd.",
    "image": "/assets/arun-matka-kulfi.jpg"
  },
  {
    "id": "hatsun-curd-cup-200g",
    "name": "Hatsun Curd Cup (200g)",
    "category": "Dairy Products",
    "packSize": "200g",
    "price": 22,
    "stock": 35,
    "available": 1,
    "description": "Tamper-proof, spill-proof premium tub of naturally cultured creamy curd.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "hatsun-curd-cup-400g",
    "name": "Hatsun Curd Cup (400g)",
    "category": "Dairy Products",
    "packSize": "400g",
    "price": 42,
    "stock": 30,
    "available": 1,
    "description": "Convenient table tub of smooth, creamy curd made with natural active cultures.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "hatsun-fresh-paneer-200g",
    "name": "Hatsun Fresh Paneer (200g)",
    "category": "Dairy Products",
    "packSize": "200g",
    "price": 110,
    "stock": 30,
    "available": 1,
    "description": "Soft, melt-in-mouth cottage cheese made from 100% cow milk, perfect for curries and tikka.",
    "image": "/assets/arun-cassatta.jpg"
  },
  {
    "id": "hatsun-fresh-paneer-500g",
    "name": "Hatsun Fresh Paneer (500g)",
    "category": "Dairy Products",
    "packSize": "500g",
    "price": 260,
    "stock": 20,
    "available": 1,
    "description": "Premium fresh paneer block with high protein and tender texture.",
    "image": "/assets/arun-cassatta.jpg"
  },
  {
    "id": "hatsun-cooking-butter-100g",
    "name": "Hatsun Cooking Butter (100g)",
    "category": "Dairy Products",
    "packSize": "100g",
    "price": 60,
    "stock": 25,
    "available": 1,
    "description": "Unsalted pure white cooking butter for traditional sweets, baking, and clarified ghee.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "hatsun-cooking-butter-500g",
    "name": "Hatsun Cooking Butter (500g)",
    "category": "Dairy Products",
    "packSize": "500g",
    "price": 285,
    "stock": 20,
    "available": 1,
    "description": "Pure churned unsalted dairy butter block for cooking and baking.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "hatsun-table-butter-100g",
    "name": "Hatsun Table Butter (100g)",
    "category": "Dairy Products",
    "packSize": "100g",
    "price": 62,
    "stock": 30,
    "available": 1,
    "description": "Delicious salted golden table butter for morning toasts, parathas, and dosas.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "hatsun-table-butter-500g",
    "name": "Hatsun Table Butter (500g)",
    "category": "Dairy Products",
    "packSize": "500g",
    "price": 295,
    "stock": 15,
    "available": 1,
    "description": "Creamy salted table butter made from fresh dairy cream.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "hatsun-pure-ghee-pouch-200ml",
    "name": "Hatsun Pure Cow Ghee Pouch (200ml)",
    "category": "Dairy Products",
    "packSize": "200ml",
    "price": 150,
    "stock": 25,
    "available": 1,
    "description": "Traditional aroma-rich golden granular cow ghee in a convenient flexible pouch.",
    "image": "/assets/arun-matka-kulfi.jpg"
  },
  {
    "id": "hatsun-pure-ghee-pouch-500ml",
    "name": "Hatsun Pure Cow Ghee Pouch (500ml)",
    "category": "Dairy Products",
    "packSize": "500ml",
    "price": 360,
    "stock": 20,
    "available": 1,
    "description": "100% pure granular aromatic cow ghee for festival sweets and daily meals.",
    "image": "/assets/arun-matka-kulfi.jpg"
  },
  {
    "id": "hatsun-pure-ghee-jar-500ml",
    "name": "Hatsun Pure Cow Ghee Jar (500ml)",
    "category": "Dairy Products",
    "packSize": "500ml",
    "price": 375,
    "stock": 20,
    "available": 1,
    "description": "Pure cow ghee packed in a reusable, airtight hygienic jar.",
    "image": "/assets/arun-matka-kulfi.jpg"
  },
  {
    "id": "hatsun-pure-ghee-tin-1l",
    "name": "Hatsun Pure Cow Ghee Tin (1 Litre)",
    "category": "Dairy Products",
    "packSize": "1 Litre",
    "price": 740,
    "stock": 15,
    "available": 1,
    "description": "Premium sealed metal tin of aromatic granular pure cow ghee.",
    "image": "/assets/arun-matka-kulfi.jpg"
  },
  {
    "id": "hatsun-dairy-whitener-200g",
    "name": "Hatsun Dairy Whitener (200g)",
    "category": "Dairy Products",
    "packSize": "200g",
    "price": 85,
    "stock": 30,
    "available": 1,
    "description": "Instant dissolving dairy milk powder for rich, creamy tea and coffee anywhere.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "hatsun-dairy-whitener-500g",
    "name": "Hatsun Dairy Whitener (500g)",
    "category": "Dairy Products",
    "packSize": "500g",
    "price": 210,
    "stock": 20,
    "available": 1,
    "description": "Fine grade sweet dairy whitener powder made from fresh cow milk.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "hatsun-flavoured-milk-choco",
    "name": "Hatsun Flavoured Milk Chocolate (200ml)",
    "category": "Dairy Products",
    "packSize": "200ml",
    "price": 35,
    "stock": 45,
    "available": 1,
    "description": "Creamy chilled milk blended with rich cocoa chocolate flavour in an easy-sip bottle.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "hatsun-flavoured-milk-badam",
    "name": "Hatsun Flavoured Milk Badam (200ml)",
    "category": "Dairy Products",
    "packSize": "200ml",
    "price": 35,
    "stock": 45,
    "available": 1,
    "description": "Traditional almond badam infused chilled dairy drink with crushed nut flavor.",
    "image": "/assets/arun-kulfi-maharaj.jpg"
  },
  {
    "id": "hatsun-flavoured-milk-pista",
    "name": "Hatsun Flavoured Milk Pista (200ml)",
    "category": "Dairy Products",
    "packSize": "200ml",
    "price": 35,
    "stock": 40,
    "available": 1,
    "description": "Refreshing pistachio green flavoured milk with natural cardamom aroma.",
    "image": "/assets/arun-matka-kulfi.jpg"
  },
  {
    "id": "hatsun-flavoured-milk-strawberry",
    "name": "Hatsun Flavoured Milk Strawberry (200ml)",
    "category": "Dairy Products",
    "packSize": "200ml",
    "price": 35,
    "stock": 40,
    "available": 1,
    "description": "Sweet berry flavoured chilled dairy beverage.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "hatsun-lassi-200ml",
    "name": "Hatsun Lassi (200ml)",
    "category": "Dairy Products",
    "packSize": "200ml",
    "price": 25,
    "stock": 40,
    "available": 1,
    "description": "Sweet, thick churned refreshing Punjabi-style yogurt drink.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "hatsun-buttermilk-200ml",
    "name": "Hatsun Buttermilk (200ml)",
    "category": "Dairy Products",
    "packSize": "200ml",
    "price": 15,
    "stock": 50,
    "available": 1,
    "description": "Spiced cooling traditional moru buttermilk with ginger, curry leaves, and green chillies.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "hatsun-yogurt-shake-strawberry",
    "name": "Hatsun Yogurt Shake Strawberry (200ml)",
    "category": "Dairy Products",
    "packSize": "200ml",
    "price": 40,
    "stock": 35,
    "available": 1,
    "description": "Probiotic smooth yogurt shake infused with natural strawberry fruit puree.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "hatsun-yogurt-shake-mango",
    "name": "Hatsun Yogurt Shake Mango (200ml)",
    "category": "Dairy Products",
    "packSize": "200ml",
    "price": 40,
    "stock": 35,
    "available": 1,
    "description": "Delicious thick probiotic mango yogurt shake packed with tropical flavor.",
    "image": "/assets/arun-matka-kulfi.jpg"
  },
  {
    "id": "icone-premium-butterscotch",
    "name": "iCone Premium Butterscotch",
    "category": "Ice Cream Cones",
    "packSize": "110ml",
    "price": 55,
    "stock": 40,
    "available": 1,
    "description": "Crispy waffle cone filled with rich butterscotch ice cream, butterscotch drizzle, and cashew crunchies.",
    "image": "/assets/arun-spirals-cone.jpg"
  },
  {
    "id": "icone-premium-double-chocolate",
    "name": "iCone Premium Double Chocolate",
    "category": "Ice Cream Cones",
    "packSize": "110ml",
    "price": 60,
    "stock": 45,
    "available": 1,
    "description": "Baked chocolate waffle cone with dark chocolate swirl and chocolate chips.",
    "image": "/assets/arun-spirals-cone.jpg"
  },
  {
    "id": "icone-premium-blackcurrant",
    "name": "iCone Premium Blackcurrant",
    "category": "Ice Cream Cones",
    "packSize": "110ml",
    "price": 55,
    "stock": 35,
    "available": 1,
    "description": "Tangy exotic blackcurrant swirls in a crunchy cone crowned with berry chocolate disc.",
    "image": "/assets/arun-spirals-cone.jpg"
  },
  {
    "id": "icone-classic-vanilla",
    "name": "iCone Classic Vanilla",
    "category": "Ice Cream Cones",
    "packSize": "100ml",
    "price": 45,
    "stock": 40,
    "available": 1,
    "description": "Pure Bourbon vanilla ice cream in a crispy wafer cone with chocolate tip.",
    "image": "/assets/arun-spirals-cone.jpg"
  },
  {
    "id": "icone-classic-strawberry",
    "name": "iCone Classic Strawberry",
    "category": "Ice Cream Cones",
    "packSize": "100ml",
    "price": 45,
    "stock": 35,
    "available": 1,
    "description": "Creamy farm-fresh strawberry cream swirled in a crunchy baked waffle cone.",
    "image": "/assets/arun-spirals-cone.jpg"
  },
  {
    "id": "icone-choco-coffee",
    "name": "iCone Choco Coffee",
    "category": "Ice Cream Cones",
    "packSize": "110ml",
    "price": 55,
    "stock": 30,
    "available": 1,
    "description": "Aromatic roasted South Indian filter coffee ice cream paired with dark chocolate syrup.",
    "image": "/assets/arun-spirals-cone.jpg"
  },
  {
    "id": "icone-mini-chocolate",
    "name": "iCone Mini Chocolate",
    "category": "Ice Cream Cones",
    "packSize": "60ml",
    "price": 30,
    "stock": 45,
    "available": 1,
    "description": "Bite-sized crispy mini chocolate cone, ideal for quick treats.",
    "image": "/assets/arun-spirals-cone.jpg"
  },
  {
    "id": "icone-mini-butterscotch",
    "name": "iCone Mini Butterscotch",
    "category": "Ice Cream Cones",
    "packSize": "60ml",
    "price": 30,
    "stock": 45,
    "available": 1,
    "description": "Miniature crunch cone packed with sweet golden butterscotch.",
    "image": "/assets/arun-spirals-cone.jpg"
  },
  {
    "id": "arun-chocobar-classic",
    "name": "Arun Chocobar Classic",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "65ml",
    "price": 25,
    "stock": 60,
    "available": 1,
    "description": "The iconic classic vanilla ice cream bar dipped in crackling dark chocolate coating.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "arun-chocobar-premium-double-choco",
    "name": "Arun Chocobar Premium Double Choco",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "80ml",
    "price": 40,
    "stock": 50,
    "available": 1,
    "description": "Rich chocolate ice cream core dipped in thick Belgian chocolate shell with almond bits.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "ibar-mango-premium",
    "name": "iBar Mango Premium",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "75ml",
    "price": 35,
    "stock": 45,
    "available": 1,
    "description": "Real Alphonso mango pulp outer crust with a velvety dairy milk centre.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "ibar-raspberry-premium",
    "name": "iBar Raspberry Premium",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "75ml",
    "price": 35,
    "stock": 40,
    "available": 1,
    "description": "Zesty red raspberry fruit crust filled with smooth vanilla cream.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "ibar-choco-feast",
    "name": "iBar Choco Feast",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "90ml",
    "price": 45,
    "stock": 45,
    "available": 1,
    "description": "Heavy decadent chocolate fudge ice cream bar with crispy biscuit balls in chocolate shell.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "kulfi-king-classic-pista",
    "name": "Kulfi King Classic Pista",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "70ml",
    "price": 35,
    "stock": 45,
    "available": 1,
    "description": "Slow simmered malai kulfi enriched with green pistachio nuts and cardamom.",
    "image": "/assets/arun-kulfi-maharaj.jpg"
  },
  {
    "id": "kulfi-king-badam",
    "name": "Kulfi King Badam",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "70ml",
    "price": 35,
    "stock": 40,
    "available": 1,
    "description": "Traditional royal almond kulfi stick with authentic texture.",
    "image": "/assets/arun-kulfi-maharaj.jpg"
  },
  {
    "id": "kulfi-king-malai",
    "name": "Kulfi King Malai",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "70ml",
    "price": 35,
    "stock": 40,
    "available": 1,
    "description": "Pure thick clotted rabri malai kulfi stick with classic richness.",
    "image": "/assets/arun-kulfi-maharaj.jpg"
  },
  {
    "id": "likstick-mango-ice-lolly",
    "name": "Likstick Mango Ice Lolly",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "60ml",
    "price": 15,
    "stock": 50,
    "available": 1,
    "description": "Refreshing juicy frozen tropical mango water ice lolly.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "likstick-grape-ice-lolly",
    "name": "Likstick Grape Ice Lolly",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "60ml",
    "price": 15,
    "stock": 50,
    "available": 1,
    "description": "Sweet and tangy purple concord grape ice candy stick.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "likstick-orange-ice-lolly",
    "name": "Likstick Orange Ice Lolly",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "60ml",
    "price": 15,
    "stock": 50,
    "available": 1,
    "description": "Cooling tangy orange fruit juice ice pop.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "yummy-bear-vanilla-stick",
    "name": "Yummy Bear Vanilla Stick",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "55ml",
    "price": 20,
    "stock": 40,
    "available": 1,
    "description": "Fun bear-shaped creamy vanilla ice cream pop designed for kids.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "yummy-bear-chocolate-stick",
    "name": "Yummy Bear Chocolate Stick",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "55ml",
    "price": 20,
    "stock": 40,
    "available": 1,
    "description": "Playful bear-shaped milk chocolate ice cream bar.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "cotton-candy-stick",
    "name": "Cotton Candy Stick",
    "category": "Ice Cream Bars & Sticks",
    "packSize": "65ml",
    "price": 30,
    "stock": 35,
    "available": 1,
    "description": "Dual-swirled pink and sky-blue sweet cotton candy flavour ice cream bar.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "classic-vanilla-cup-50ml",
    "name": "Classic Vanilla Cup (50ml)",
    "category": "Ice Cream Cups & Duets",
    "packSize": "50ml",
    "price": 15,
    "stock": 60,
    "available": 1,
    "description": "Pure smooth vanilla cup, convenient mini portion with spoon.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "classic-vanilla-cup-100ml",
    "name": "Classic Vanilla Cup (100ml)",
    "category": "Ice Cream Cups & Duets",
    "packSize": "100ml",
    "price": 25,
    "stock": 60,
    "available": 1,
    "description": "All-time favourite rich dairy vanilla ice cream cup.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "classic-strawberry-cup-50ml",
    "name": "Classic Strawberry Cup (50ml)",
    "category": "Ice Cream Cups & Duets",
    "packSize": "50ml",
    "price": 15,
    "stock": 50,
    "available": 1,
    "description": "Refreshing sweet strawberry ice cream cup in small serving.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "classic-strawberry-cup-100ml",
    "name": "Classic Strawberry Cup (100ml)",
    "category": "Ice Cream Cups & Duets",
    "packSize": "100ml",
    "price": 25,
    "stock": 50,
    "available": 1,
    "description": "Silky smooth strawberry ice cream cup made from real milk.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "classic-chocolate-cup-100ml",
    "name": "Classic Chocolate Cup (100ml)",
    "category": "Ice Cream Cups & Duets",
    "packSize": "100ml",
    "price": 30,
    "stock": 55,
    "available": 1,
    "description": "Creamy cocoa chocolate ice cream cup with rich chocolate taste.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "premium-butterscotch-cup-100ml",
    "name": "Premium Butterscotch Cup (100ml)",
    "category": "Ice Cream Cups & Duets",
    "packSize": "100ml",
    "price": 35,
    "stock": 45,
    "available": 1,
    "description": "Sweet butterscotch ice cream cup loaded with crunchy cashew pralines.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "premium-blackcurrant-cup-100ml",
    "name": "Premium Blackcurrant Cup (100ml)",
    "category": "Ice Cream Cups & Duets",
    "packSize": "100ml",
    "price": 35,
    "stock": 40,
    "available": 1,
    "description": "Tangy exotic blackcurrant berry cup with rich fruit flavour.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "premium-kesar-pista-cup-100ml",
    "name": "Premium Kesar Pista Cup (100ml)",
    "category": "Ice Cream Cups & Duets",
    "packSize": "100ml",
    "price": 40,
    "stock": 40,
    "available": 1,
    "description": "Royal saffron kesar ice cream cup with real sliced pistachios.",
    "image": "/assets/arun-matka-kulfi.jpg"
  },
  {
    "id": "duet-vanilla-raspberry",
    "name": "Duet Vanilla & Raspberry Cup",
    "category": "Ice Cream Cups & Duets",
    "packSize": "110ml",
    "price": 40,
    "stock": 35,
    "available": 1,
    "description": "Two-in-one twin dessert cup pairing smooth vanilla with zesty raspberry.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "duet-vanilla-mango",
    "name": "Duet Vanilla & Mango Cup",
    "category": "Ice Cream Cups & Duets",
    "packSize": "110ml",
    "price": 40,
    "stock": 35,
    "available": 1,
    "description": "Harmonious duo of creamy vanilla and tropical sweet Alphonso mango.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "duet-chocolate-mint",
    "name": "Duet Chocolate & Mint Cup",
    "category": "Ice Cream Cups & Duets",
    "packSize": "110ml",
    "price": 40,
    "stock": 30,
    "available": 1,
    "description": "Refreshing cool green mint ice cream coupled with decadent dark chocolate.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "ice-cream-sandwich-vanilla",
    "name": "Ice Cream Sandwich Vanilla",
    "category": "Ice Cream Novelties & Slices",
    "packSize": "90ml",
    "price": 35,
    "stock": 35,
    "available": 1,
    "description": "Thick slab of creamy vanilla ice cream between two soft chocolate cookies.",
    "image": "/assets/arun-cassatta.jpg"
  },
  {
    "id": "ice-cream-sandwich-chocolate",
    "name": "Ice Cream Sandwich Chocolate",
    "category": "Ice Cream Novelties & Slices",
    "packSize": "90ml",
    "price": 40,
    "stock": 35,
    "available": 1,
    "description": "Double chocolate sandwich with chocolate ice cream in chocolate cookie biscuits.",
    "image": "/assets/arun-cassatta.jpg"
  },
  {
    "id": "cassata-premium-slice",
    "name": "Cassata Premium Slice",
    "category": "Ice Cream Novelties & Slices",
    "packSize": "100g",
    "price": 65,
    "stock": 40,
    "available": 1,
    "description": "Multi-layer sponge cake slice with strawberry, vanilla, and pistachio ice cream garnished with cashew praline.",
    "image": "/assets/arun-cassatta.jpg"
  },
  {
    "id": "cassata-ball",
    "name": "Cassata Ball",
    "category": "Ice Cream Novelties & Slices",
    "packSize": "110ml",
    "price": 55,
    "stock": 30,
    "available": 1,
    "description": "Spherical ball of three layered ice cream flavours filled with a dry fruit core.",
    "image": "/assets/arun-cassatta.jpg"
  },
  {
    "id": "arun-bites-kesar-peda",
    "name": "Arun Bites Kesar Peda Fusion Pack",
    "category": "Ice Cream Novelties & Slices",
    "packSize": "120ml (6 Pcs)",
    "price": 75,
    "stock": 25,
    "available": 1,
    "description": "Traditional Indian sweet fusion bite-sized ice cream cubes coated in saffron chocolate.",
    "image": "/assets/arun-matka-kulfi.jpg"
  },
  {
    "id": "arun-bites-motichoor",
    "name": "Arun Bites Motichoor Fusion Pack",
    "category": "Ice Cream Novelties & Slices",
    "packSize": "120ml (6 Pcs)",
    "price": 75,
    "stock": 25,
    "available": 1,
    "description": "Bite-sized festive ice cream morsels infused with golden motichoor ladoo pearls.",
    "image": "/assets/arun-matka-kulfi.jpg"
  },
  {
    "id": "arun-bites-kaju-katli",
    "name": "Arun Bites Kaju Katli Fusion Pack",
    "category": "Ice Cream Novelties & Slices",
    "packSize": "120ml (6 Pcs)",
    "price": 85,
    "stock": 25,
    "available": 1,
    "description": "Rich cashew kaju katli fudge blended into gourmet ice cream bite cubes.",
    "image": "/assets/arun-matka-kulfi.jpg"
  },
  {
    "id": "chocolate-fudge-sundae-cup",
    "name": "Chocolate Fudge Sundae Cup",
    "category": "Sundaes & In-Store Specials",
    "packSize": "140ml",
    "price": 60,
    "stock": 35,
    "available": 1,
    "description": "Rich vanilla ice cream drenched in warm gooey chocolate fudge and roasted peanuts.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "butterscotch-crunch-sundae-cup",
    "name": "Butterscotch Crunch Sundae Cup",
    "category": "Sundaes & In-Store Specials",
    "packSize": "140ml",
    "price": 60,
    "stock": 35,
    "available": 1,
    "description": "Butterscotch ice cream sundae layered with caramel toffee syrup and golden cashew nut crunch.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "mango-jelly-sundae-cup",
    "name": "Mango Jelly Sundae Cup",
    "category": "Sundaes & In-Store Specials",
    "packSize": "140ml",
    "price": 60,
    "stock": 30,
    "available": 1,
    "description": "Alphonso mango cream layered with chewy mango fruit jelly chunks and puree.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "strawberry-twist-sundae-cup",
    "name": "Strawberry Twist Sundae Cup",
    "category": "Sundaes & In-Store Specials",
    "packSize": "140ml",
    "price": 60,
    "stock": 30,
    "available": 1,
    "description": "Strawberry ripple sundae topped with berry syrup and white chocolate drops.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "cookie-cream-sundae-cup",
    "name": "Cookie Cream Sundae Cup",
    "category": "Sundaes & In-Store Specials",
    "packSize": "140ml",
    "price": 65,
    "stock": 30,
    "available": 1,
    "description": "Smooth sweet cream loaded with crushed dark chocolate sandwich cookies and chocolate drizzle.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "classic-vanilla-tub-1l",
    "name": "Classic Vanilla Tub (1L)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre",
    "price": 180,
    "stock": 25,
    "available": 1,
    "description": "Large family party tub of classic pure vanilla cream dessert.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "classic-strawberry-tub-1l",
    "name": "Classic Strawberry Tub (1L)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre",
    "price": 180,
    "stock": 20,
    "available": 1,
    "description": "Creamy refreshing strawberry ice cream family dessert tub.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "classic-chocolate-tub-1l",
    "name": "Classic Chocolate Tub (1L)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre",
    "price": 210,
    "stock": 25,
    "available": 1,
    "description": "Decadent rich milk chocolate family dessert tub.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "premium-butterscotch-tub-1l",
    "name": "Premium Butterscotch Tub (1L)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre",
    "price": 240,
    "stock": 25,
    "available": 1,
    "description": "Creamy rich butterscotch dessert tub packed with roasted cashew nut crunchies.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "premium-blackcurrant-tub-1l",
    "name": "Premium Blackcurrant Tub (1L)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre",
    "price": 250,
    "stock": 20,
    "available": 1,
    "description": "Gourmet blackcurrant berry tub with delicious fruit ripples.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "premium-kesar-pista-tub-1l",
    "name": "Premium Kesar Pista Tub (1L)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre",
    "price": 280,
    "stock": 20,
    "available": 1,
    "description": "Royal saffron kesar ice cream family tub loaded with Iranian pistachios and almonds.",
    "image": "/assets/arun-matka-kulfi.jpg"
  },
  {
    "id": "premium-mango-alfonso-tub-1l",
    "name": "Premium Mango Alfonso Tub (1L)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre",
    "price": 240,
    "stock": 20,
    "available": 1,
    "description": "Luscious tropical Ratnagiri Alphonso mango pulp churned into velvety ice cream.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "exotic-red-velvet-tub-1l",
    "name": "Exotic Red Velvet Tub (1L)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre",
    "price": 320,
    "stock": 15,
    "available": 1,
    "description": "Cream cheese ice cream folded with soft crimson red velvet cake crumbs and chocolate ripples.",
    "image": "/assets/arun-cassatta.jpg"
  },
  {
    "id": "exotic-brownie-banoffee-tub-1l",
    "name": "Exotic Brownie Banoffee Tub (1L)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre",
    "price": 330,
    "stock": 15,
    "available": 1,
    "description": "Banana toffee ice cream mixed with chewy chocolate fudge brownie chunks.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "exotic-salted-caramel-tub-1l",
    "name": "Exotic Salted Caramel Tub (1L)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre",
    "price": 320,
    "stock": 15,
    "available": 1,
    "description": "Sweet and buttery caramelized cream accented with gourmet sea salt crystals.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "exotic-jackfruit-tub-1l",
    "name": "Exotic Jackfruit Tub (1L)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre",
    "price": 310,
    "stock": 15,
    "available": 1,
    "description": "Traditional ripe sweet jackfruit (chakka) flavour blended into luscious dairy cream.",
    "image": "/assets/arun-matka-kulfi.jpg"
  },
  {
    "id": "exotic-blueberry-cheesecake-tub-1l",
    "name": "Exotic Blueberry Cheesecake Tub (1L)",
    "category": "Family Tubs & Packs",
    "packSize": "1 Litre",
    "price": 340,
    "stock": 15,
    "available": 1,
    "description": "Rich New York style cream cheesecake ice cream swirled with wild Canadian blueberry compote.",
    "image": "/assets/arun-cassatta.jpg"
  },
  {
    "id": "signature-black-forest-cake",
    "name": "Signature Black Forest Ice Cream Cake",
    "category": "Ice Cream Cakes",
    "packSize": "500g",
    "price": 390,
    "stock": 15,
    "available": 1,
    "description": "Chocolate sponge cake base layered with vanilla ice cream, dark chocolate curls, and red cherry compote.",
    "image": "/assets/arun-cassatta.jpg"
  },
  {
    "id": "signature-butterscotch-delight-cake",
    "name": "Signature Butterscotch Delight Ice Cream Cake",
    "category": "Ice Cream Cakes",
    "packSize": "500g",
    "price": 390,
    "stock": 15,
    "available": 1,
    "description": "Golden butterscotch cake with butterscotch crunch layers and toffee caramel glaze.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "signature-choco-brownie-cake",
    "name": "Signature Choco-Brownie Ice Cream Cake",
    "category": "Ice Cream Cakes",
    "packSize": "550g",
    "price": 430,
    "stock": 15,
    "available": 1,
    "description": "Fudge brownie base topped with decadent Belgian chocolate ice cream and dark chocolate truffle ganache.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "signature-cassata-celebration-cake",
    "name": "Signature Cassata Celebration Ice Cream Cake",
    "category": "Ice Cream Cakes",
    "packSize": "500g",
    "price": 420,
    "stock": 12,
    "available": 1,
    "description": "Royal 3-tier celebratory ice cream cake featuring strawberry, pistachio, and vanilla with cashew nuts.",
    "image": "/assets/arun-cassatta.jpg"
  },
  {
    "id": "signature-mango-magic-cake",
    "name": "Signature Mango Magic Ice Cream Cake",
    "category": "Ice Cream Cakes",
    "packSize": "500g",
    "price": 410,
    "stock": 12,
    "available": 1,
    "description": "Exotic tropical Alphonso mango ice cream cake with mango glaze and vanilla sponge.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "signature-strawberry-cream-cake",
    "name": "Signature Strawberry Cream Ice Cream Cake",
    "category": "Ice Cream Cakes",
    "packSize": "500g",
    "price": 390,
    "stock": 12,
    "available": 1,
    "description": "Tender pink strawberry ice cream cake adorned with white chocolate flakes.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "ice-cream-cake-mini-log-choco",
    "name": "Ice Cream Cake Mini Log Chocolate",
    "category": "Ice Cream Cakes",
    "packSize": "250g",
    "price": 220,
    "stock": 20,
    "available": 1,
    "description": "Individual swiss roll style chocolate ice cream dessert log coated in dark chocolate.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "ice-cream-cake-mini-log-vanilla",
    "name": "Ice Cream Cake Mini Log Vanilla",
    "category": "Ice Cream Cakes",
    "packSize": "250g",
    "price": 220,
    "stock": 20,
    "available": 1,
    "description": "Delicate vanilla sponge log filled with pure dairy vanilla ice cream and white chocolate drizzle.",
    "image": "/assets/arun-cassatta.jpg"
  }
];
    this.cart = [];
    this.selectedCategory = 'ALL';
    this.searchQuery = '';
    this.activeTrackedOrder = null;
    this.myOrders = [];
    this.isSubmittingOrder = false;
    this.currentView = 'catalog'; // 'catalog' | 'tracking' | 'orders'

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
    this.setupRealtimeListeners();
    this.render();
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

    // Real-Time stock updates when any order is placed or shopkeeper edits stock
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

    // Real-time product price/stock/availability update
    window.socketClient.on('product:updated', (updatedProd) => {
      const idx = this.products.findIndex(p => p.id === updatedProd.id);
      if (idx !== -1) {
        this.products[idx] = { ...this.products[idx], ...updatedProd };
      } else {
        this.products.push(updatedProd);
      }
      this.renderProductGrid();
    });

    // Real-time status update for active tracked order
    window.socketClient.on('order:status_updated', (updatedOrder) => {
      // Update in myOrders list
      const idx = this.myOrders.findIndex(o => o.id === updatedOrder.id || o.orderNumber === updatedOrder.orderNumber);
      if (idx !== -1) {
        this.myOrders[idx] = { ...this.myOrders[idx], ...updatedOrder };
        this.saveMyOrdersToStorage();
      }

      // Update in active tracked ticket
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
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
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

  // --- PRODUCT GRID (FIXED NON-COLLIDING CARDS) ---

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
            <!-- Rigid Image Box with Object Contain -->
            <div class="product-image-box cursor-pointer" onclick="customerApp.openProductDetail('${p.id}')">
              <img 
                src="${imageUrl}" 
                alt="${p.name}" 
                loading="lazy"
                onerror="this.src='/assets/arun-vanilla-cup.jpg'"
              />
              <div class="absolute top-2.5 left-2.5">
                <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm">
                  ${p.category}
                </span>
              </div>
              <div class="absolute top-2.5 right-2.5">
                ${stockBadge}
              </div>
            </div>

            <!-- Product Details -->
            <div class="p-4">
              <div class="flex items-center justify-between gap-1 mb-1">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-100 text-slate-600">
                  ${p.packSize || 'Standard Pack'}
                </span>
              </div>
              <h4 class="font-extrabold text-slate-900 text-sm leading-snug cursor-pointer hover:text-rose-600 transition-colors line-clamp-2" onclick="customerApp.openProductDetail('${p.id}')">
                ${p.name}
              </h4>
            </div>
          </div>

          <!-- Price & Add Button Bar -->
          <div class="p-4 pt-0">
            <div class="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
              <div>
                <span class="text-[9px] uppercase font-bold text-slate-400 block">Price</span>
                ${hasPrice 
                  ? `<span class="text-lg font-black text-slate-900 font-display">₹${p.price}</span>` 
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
    if (countEl) countEl.textContent = totalCount;
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
        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
          <div class="flex items-center space-x-3">
            <img src="${item.image || '/assets/arun-vanilla-cup.jpg'}" alt="${item.name}" class="w-12 h-12 object-contain rounded-xl bg-white p-1 border border-slate-100" />
            <div>
              <h5 class="font-extrabold text-slate-900 text-xs leading-tight line-clamp-1">${item.name}</h5>
              <span class="text-[10px] text-slate-500 font-semibold">${item.packSize} • ₹${item.price} each</span>
              <span class="text-xs font-black text-rose-600 block mt-0.5">₹${itemTotal}</span>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <div class="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-sm">
              <button type="button" onclick="customerApp.decrementCart('${item.productId}')" class="w-6 h-6 rounded-lg text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100">−</button>
              <span class="w-6 text-center text-xs font-black text-slate-900">${item.quantity}</span>
              <button type="button" onclick="customerApp.incrementCart('${item.productId}')" class="w-6 h-6 rounded-lg text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100">+</button>
            </div>
            <button type="button" onclick="customerApp.removeCartItem('${item.productId}')" class="text-slate-400 hover:text-rose-600 p-1 text-xs">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    if (subtotalEl) subtotalEl.textContent = `₹${total}`;
    if (totalEl) totalEl.textContent = `₹${total}`;
  }

  // --- CHECKOUT & ORDER CREATION ---

  openCheckoutModal() {
    this.closeCartDrawer();

    const container = document.getElementById('checkout-modal-container');
    if (!container) return;

    const user = (window.appController && window.appController.customerUser) || { name: '', phone: '', email: '' };
    const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    container.innerHTML = `
      <div id="checkout-modal-backdrop" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onclick="customerApp.closeCheckoutModal(event)">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 class="text-lg font-black text-slate-900 font-display">Surya Agencies Checkout</h3>
              <p class="text-xs text-slate-500">Pick up fresh at the parlour counter</p>
            </div>
            <button type="button" onclick="customerApp.closeCheckoutModal()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200">✕</button>
          </div>

          <form id="checkout-form" onsubmit="customerApp.submitOrder(event)" class="mt-6 space-y-4">
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Customer Name *</label>
              <input type="text" id="checkout-name" value="${user.name || ''}" required placeholder="Your Full Name" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium" />
            </div>

            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Phone Number (For Order Tracking)</label>
              <input type="tel" id="checkout-phone" value="${user.phone || ''}" placeholder="98400 12345" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium" />
            </div>

            <!-- Payment Method Choice -->
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-2">Choose Payment Option</label>
              <div class="grid grid-cols-2 gap-3">
                <label class="border-2 border-rose-600 bg-rose-50/60 rounded-2xl p-3 flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="checkout-payment" value="upi" checked class="text-rose-600 focus:ring-rose-500" />
                  <span class="text-xs font-extrabold text-slate-800">📱 UPI Payment</span>
                </label>
                <label class="border border-slate-300 rounded-2xl p-3 flex items-center space-x-2 cursor-pointer hover:border-slate-400">
                  <input type="radio" name="checkout-payment" value="pay_at_shop" class="text-rose-600 focus:ring-rose-500" />
                  <span class="text-xs font-extrabold text-slate-800">💵 Pay at Shop</span>
                </label>
              </div>
            </div>

            <!-- Order Summary Box -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div class="flex justify-between text-xs text-slate-600">
                <span>Items in Order</span>
                <span class="font-bold">${this.cart.reduce((s, i) => s + i.quantity, 0)} items</span>
              </div>
              <div class="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-2">
                <span>Total Amount</span>
                <span class="text-rose-600 font-mono">₹${total}</span>
              </div>
            </div>

            <button 
              type="submit" 
              id="submit-order-btn"
              class="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-sm shadow-xl shadow-rose-600/25 active:scale-98 transition-all flex items-center justify-center space-x-2"
            >
              <span>Confirm & Place Order →</span>
            </button>
          </form>
        </div>
      </div>
    `;
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
          paymentStatus: paymentMethod === 'upi' ? 'PENDING' : 'PENDING'
        })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      const placedOrder = data.order;

      // Add to personal orders
      this.myOrders.unshift(placedOrder);
      this.saveMyOrdersToStorage();

      // Clear Cart
      this.cart = [];
      this.saveCartToStorage();

      // Subscribe socket to order room
      if (window.socketClient) {
        window.socketClient.subscribeToOrder(placedOrder.id);
        window.socketClient.subscribeToOrder(placedOrder.orderNumber);
      }

      this.closeCheckoutModal();
      if (window.appController) window.appController.showToast(`Order ${placedOrder.orderNumber} placed successfully!`, 'success');

      // Switch to Live Tracking View
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

  // --- LIVE ORDER TRACKING (DIGITAL PICKUP TICKET) ---

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
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <!-- Ticket Header -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">LIVE PICKUP TICKET</span>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 font-display mt-1">${order.orderNumber}</h2>
          </div>
          <button type="button" onclick="customerApp.showCatalogView()" class="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs">
            ← Back to Store
          </button>
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
          <div class="py-4">
            <div class="flex items-center justify-between relative">
              <div class="stepper-step">
                <div class="stepper-circle ${currentStatus.step >= 1 ? (currentStatus.step === 1 ? 'active' : 'completed') : ''}">1</div>
                <span class="text-[10px] font-bold text-slate-600 mt-2">Received</span>
              </div>
              <div class="stepper-step">
                <div class="stepper-circle ${currentStatus.step >= 2 ? (currentStatus.step === 2 ? 'active' : 'completed') : ''}">2</div>
                <span class="text-[10px] font-bold text-slate-600 mt-2">Accepted</span>
              </div>
              <div class="stepper-step">
                <div class="stepper-circle ${currentStatus.step >= 3 ? (currentStatus.step === 3 ? 'active' : 'completed') : ''}">3</div>
                <span class="text-[10px] font-bold text-slate-600 mt-2">Preparing</span>
              </div>
              <div class="stepper-step">
                <div class="stepper-circle ${currentStatus.step >= 4 ? (currentStatus.step === 4 ? 'active' : 'completed') : ''}">4</div>
                <span class="text-[10px] font-bold text-slate-600 mt-2">Ready</span>
              </div>
              <div class="stepper-step">
                <div class="stepper-circle ${currentStatus.step >= 5 ? 'completed' : ''}">5</div>
                <span class="text-[10px] font-bold text-slate-600 mt-2">Picked Up</span>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- QR Code Display -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
          <div id="tracking-qrcode-container" class="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center min-w-[128px] min-h-[128px]"></div>
          <div class="text-center sm:text-left space-y-1">
            <span class="text-xs font-bold text-slate-500">Show this QR code at the counter</span>
            <h4 class="font-extrabold text-slate-900 text-sm">Surya Agencies Counter Pickup</h4>
            <p class="text-xs text-slate-500">Customer: ${order.customerName} (${order.customerPhone || 'Counter Pickup'})</p>
            <span class="inline-block px-2 py-0.5 rounded text-[10px] font-black bg-slate-200 text-slate-700">Payment: ${order.paymentMethod === 'upi' ? 'UPI' : 'Pay at Shop'} (${order.paymentStatus})</span>
          </div>
        </div>

        <!-- Order Items List -->
        <div class="space-y-2 border-t border-slate-100 pt-4">
          <h4 class="font-bold text-xs text-slate-400 uppercase">Ordered Items</h4>
          <div class="space-y-2">
            ${order.items.map(item => `
              <div class="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                <span class="font-semibold text-slate-800">${item.name} (${item.packSize}) × ${item.quantity}</span>
                <span class="font-mono font-bold text-slate-900">₹${item.itemTotal || (item.price * item.quantity)}</span>
              </div>
            `).join('')}
          </div>
          <div class="flex justify-between items-center text-sm font-black text-slate-900 pt-2">
            <span>Total Payable</span>
            <span class="text-rose-600 font-mono text-base">₹${order.total}</span>
          </div>
        </div>
      </div>
    `;

    // Render local QRCode
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
        <div class="max-w-2xl mx-auto text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <span class="text-4xl block mb-2">📦</span>
          <h3 class="font-black text-lg text-slate-900 font-display">No Orders Yet</h3>
          <p class="text-xs text-slate-500 mt-1">Browse our 8 categories and place your first delicious order!</p>
          <button type="button" onclick="customerApp.showCatalogView()" class="mt-6 px-6 py-3 rounded-2xl bg-rose-600 text-white font-extrabold text-xs shadow-md">Browse Catalog →</button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="max-w-3xl mx-auto space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 class="text-xl font-black text-slate-900 font-display">My Orders History</h3>
            <p class="text-xs text-slate-500 font-semibold">${this.myOrders.length} order(s) placed</p>
          </div>
          <button type="button" onclick="customerApp.showCatalogView()" class="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs">
            ← Back to Store
          </button>
        </div>

        <div class="space-y-3">
          ${this.myOrders.map(order => {
            const isCompleted = order.orderStatus === 'COMPLETED';
            const isReady = order.orderStatus === 'READY_FOR_PICKUP';

            return `
              <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:border-rose-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-black text-slate-900 font-display text-base">${order.orderNumber}</span>
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
                    class="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm"
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
