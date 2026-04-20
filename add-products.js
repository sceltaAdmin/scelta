const https = require("https");

const BASE_URL = "https://scelta-backend.onrender.com";

const newProducts = [
  // ── ELECTRONICS (5) ──────────────────────────────────────────
  {
    name: "boAt Rockerz 450 Bluetooth Headphones",
    description:
      "Over-ear wireless headphones with 15-hour battery, 40mm drivers, and foldable design. Perfect for music and calls.",
    price: 1299,
    originalPrice: 2999,
    discount: 57,
    category: "electronics",
    brand: "boAt",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    images: [],
    stock: 100,
    rating: 4.3,
    reviewCount: 18432,
    tags: ["headphones", "wireless", "bluetooth", "boat"],
    featured: true,
    badge: "Best Seller",
  },
  {
    name: "Redmi 12C Smartphone 4GB+64GB",
    description:
      "Budget Android smartphone with 6.71\" HD+ display, 5000mAh battery, and 50MP dual camera.",
    price: 7499,
    originalPrice: 9999,
    discount: 25,
    category: "electronics",
    brand: "Redmi",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    images: [],
    stock: 100,
    rating: 4.1,
    reviewCount: 9823,
    tags: ["smartphone", "redmi", "android", "budget"],
    featured: false,
    badge: "25% Off",
  },
  {
    name: "Portronics Toad 25 Wireless Mouse",
    description:
      "2.4GHz wireless mouse with USB nano receiver, 1600 DPI, and 12-month battery life. Ergonomic design.",
    price: 499,
    originalPrice: 999,
    discount: 50,
    category: "electronics",
    brand: "Portronics",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    images: [],
    stock: 100,
    rating: 4.2,
    reviewCount: 7341,
    tags: ["mouse", "wireless", "office", "computer"],
    featured: false,
    badge: "50% Off",
  },
  {
    name: "Zebronics Zeb-Sound Feast 700 Speaker",
    description:
      "40W Bluetooth tower speaker with RGB lighting, TWS support, USB/AUX/FM input, and remote control.",
    price: 2999,
    originalPrice: 5999,
    discount: 50,
    category: "electronics",
    brand: "Zebronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
    images: [],
    stock: 100,
    rating: 4.0,
    reviewCount: 3204,
    tags: ["speaker", "bluetooth", "tower", "rgb"],
    featured: false,
    badge: "",
  },
  {
    name: "Ambrane 20000mAh Power Bank",
    description:
      "20000mAh fast-charging power bank with dual USB output, Type-C input, and LED battery indicator.",
    price: 999,
    originalPrice: 1999,
    discount: 50,
    category: "electronics",
    brand: "Ambrane",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500",
    images: [],
    stock: 100,
    rating: 4.4,
    reviewCount: 11230,
    tags: ["power-bank", "fast-charging", "portable", "travel"],
    featured: true,
    badge: "Top Rated",
  },

  // ── BOOKS (4) ─────────────────────────────────────────────────
  {
    name: "Atomic Habits",
    description:
      "James Clear's guide to building good habits and breaking bad ones using tiny 1% improvements.",
    price: 449,
    originalPrice: 799,
    discount: 44,
    category: "books",
    brand: "Penguin",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
    images: [],
    stock: 100,
    rating: 4.9,
    reviewCount: 21450,
    tags: ["habits", "self-help", "productivity", "non-fiction"],
    featured: true,
    badge: "Bestseller",
  },
  {
    name: "The Alchemist",
    description:
      "Paulo Coelho's timeless fable about following your dreams and listening to your heart.",
    price: 199,
    originalPrice: 350,
    discount: 43,
    category: "books",
    brand: "HarperCollins",
    image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=500",
    images: [],
    stock: 100,
    rating: 4.7,
    reviewCount: 34210,
    tags: ["fiction", "philosophy", "classic", "coelho"],
    featured: false,
    badge: "",
  },
  {
    name: "Zero to One",
    description:
      "Peter Thiel's contrarian guide to building companies that create something new rather than copying.",
    price: 399,
    originalPrice: 599,
    discount: 33,
    category: "books",
    brand: "Currency",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
    images: [],
    stock: 100,
    rating: 4.6,
    reviewCount: 8920,
    tags: ["startup", "business", "entrepreneurship", "tech"],
    featured: false,
    badge: "",
  },
  {
    name: "Deep Work",
    description:
      "Cal Newport's rules for focused success in a distracted world — learn to master your attention.",
    price: 349,
    originalPrice: 599,
    discount: 42,
    category: "books",
    brand: "Piatkus",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500",
    images: [],
    stock: 100,
    rating: 4.7,
    reviewCount: 6782,
    tags: ["productivity", "focus", "self-help", "work"],
    featured: true,
    badge: "Top Rated",
  },

  // ── CLOTHING (4) ──────────────────────────────────────────────
  {
    name: "H&M Regular Fit Cotton T-Shirt",
    description:
      "100% combed cotton crew-neck tee. Pre-shrunk, breathable, and available in multiple colours.",
    price: 599,
    originalPrice: 999,
    discount: 40,
    category: "clothing",
    brand: "H&M",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    images: [],
    stock: 100,
    rating: 4.2,
    reviewCount: 5430,
    tags: ["tshirt", "cotton", "casual", "men"],
    featured: false,
    badge: "40% Off",
  },
  {
    name: "Puma Men's Running Shoes",
    description:
      "Lightweight mesh running shoes with EvoFOAM cushioning and rubber outsole for daily training.",
    price: 2799,
    originalPrice: 4999,
    discount: 44,
    category: "clothing",
    brand: "Puma",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    images: [],
    stock: 100,
    rating: 4.4,
    reviewCount: 8902,
    tags: ["shoes", "running", "puma", "men"],
    featured: true,
    badge: "Top Pick",
  },
  {
    name: "W Women's Kurta Set",
    description:
      "Elegant printed cotton kurta with palazzo pants. Comfortable for daily wear and festive occasions.",
    price: 1299,
    originalPrice: 2199,
    discount: 41,
    category: "clothing",
    brand: "W",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500",
    images: [],
    stock: 100,
    rating: 4.5,
    reviewCount: 3120,
    tags: ["kurta", "women", "ethnic", "cotton"],
    featured: false,
    badge: "",
  },
  {
    name: "Van Heusen Men's Formal Shirt",
    description:
      "Wrinkle-free formal shirt in 100% premium cotton. Slim fit with a spread collar — perfect for the office.",
    price: 1099,
    originalPrice: 1999,
    discount: 45,
    category: "clothing",
    brand: "Van Heusen",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
    images: [],
    stock: 100,
    rating: 4.3,
    reviewCount: 4210,
    tags: ["shirt", "formal", "men", "office-wear"],
    featured: false,
    badge: "",
  },

  // ── HOME & KITCHEN (4) ────────────────────────────────────────
  {
    name: "Prestige Iris 750W Mixer Grinder",
    description:
      "3-jar mixer grinder with 750W motor, stainless steel jars, and overload protection. 2-year warranty.",
    price: 2299,
    originalPrice: 3999,
    discount: 43,
    category: "home-kitchen",
    brand: "Prestige",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=500",
    images: [],
    stock: 100,
    rating: 4.5,
    reviewCount: 14320,
    tags: ["mixer", "grinder", "kitchen", "prestige"],
    featured: true,
    badge: "Best Seller",
  },
  {
    name: "Solimo Microfibre Bedsheet Set",
    description:
      "Double-bed microfibre bedsheet with 2 pillow covers. Fade-resistant, wrinkle-free, and ultra-soft.",
    price: 699,
    originalPrice: 1299,
    discount: 46,
    category: "home-kitchen",
    brand: "Solimo",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500",
    images: [],
    stock: 100,
    rating: 4.2,
    reviewCount: 6780,
    tags: ["bedsheet", "microfibre", "home", "bedroom"],
    featured: false,
    badge: "",
  },
  {
    name: "Pigeon Non-Stick Cookware Set (3-Piece)",
    description:
      "Induction-compatible 3-piece non-stick cookware — kadai, tawa, and saucepan. PFOA-free coating.",
    price: 1499,
    originalPrice: 2999,
    discount: 50,
    category: "home-kitchen",
    brand: "Pigeon",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
    images: [],
    stock: 100,
    rating: 4.3,
    reviewCount: 9210,
    tags: ["cookware", "non-stick", "induction", "kitchen"],
    featured: false,
    badge: "50% Off",
  },
  {
    name: "Philips HL1655 500W Hand Blender",
    description:
      "Powerful 500W hand blender with stainless steel blending rod, suitable for soups, shakes, and baby food.",
    price: 1199,
    originalPrice: 1995,
    discount: 40,
    category: "home-kitchen",
    brand: "Philips",
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500",
    images: [],
    stock: 100,
    rating: 4.4,
    reviewCount: 7650,
    tags: ["blender", "hand-blender", "philips", "kitchen"],
    featured: true,
    badge: "Top Rated",
  },

  // ── SPORTS (4) ────────────────────────────────────────────────
  {
    name: "Strauss Yoga Mat 6mm",
    description:
      "Anti-slip 6mm EVA foam yoga mat with carrying strap. Sweat-proof and eco-friendly. 183cm x 61cm.",
    price: 599,
    originalPrice: 999,
    discount: 40,
    category: "sports",
    brand: "Strauss",
    image: "https://images.unsplash.com/photo-1601925228086-6cd3f935b45e?w=500",
    images: [],
    stock: 100,
    rating: 4.4,
    reviewCount: 11230,
    tags: ["yoga", "mat", "fitness", "exercise"],
    featured: false,
    badge: "",
  },
  {
    name: "Nivia Storm Football Size 5",
    description:
      "FIFA-quality PU leather football, size 5. Reinforced bladder for consistent bounce and shape retention.",
    price: 699,
    originalPrice: 1299,
    discount: 46,
    category: "sports",
    brand: "Nivia",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500",
    images: [],
    stock: 100,
    rating: 4.3,
    reviewCount: 5430,
    tags: ["football", "soccer", "outdoor", "nivia"],
    featured: false,
    badge: "",
  },
  {
    name: "Boldfit Adjustable Dumbbell Set 20kg",
    description:
      "Cast iron adjustable dumbbell set with chrome-plated handles. Includes weight plates and locking collars.",
    price: 1999,
    originalPrice: 3499,
    discount: 43,
    category: "sports",
    brand: "Boldfit",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500",
    images: [],
    stock: 100,
    rating: 4.5,
    reviewCount: 4320,
    tags: ["dumbbell", "gym", "weights", "fitness"],
    featured: true,
    badge: "Top Pick",
  },
  {
    name: "Cosco Badminton Racket Combo",
    description:
      "Set of 2 aluminum badminton rackets with 3 nylon shuttlecocks and a carry bag. Great for beginners.",
    price: 899,
    originalPrice: 1499,
    discount: 40,
    category: "sports",
    brand: "Cosco",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500",
    images: [],
    stock: 100,
    rating: 4.2,
    reviewCount: 3210,
    tags: ["badminton", "racket", "outdoor", "combo"],
    featured: false,
    badge: "",
  },

  // ── TOYS (4) ──────────────────────────────────────────────────
  {
    name: "LEGO Classic Creative Bricks 900pcs",
    description:
      "900-piece LEGO classic set with bricks in 33 colours. Open-ended building for ages 4+.",
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    category: "toys",
    brand: "LEGO",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
    images: [],
    stock: 100,
    rating: 4.8,
    reviewCount: 15430,
    tags: ["lego", "building", "creative", "kids"],
    featured: true,
    badge: "Bestseller",
  },
  {
    name: "Funskool Candy Land Board Game",
    description:
      "Classic colour-matching board game for 2–4 players. Simple rules, great for ages 3 and up.",
    price: 499,
    originalPrice: 799,
    discount: 38,
    category: "toys",
    brand: "Funskool",
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500",
    images: [],
    stock: 100,
    rating: 4.3,
    reviewCount: 2890,
    tags: ["board-game", "family", "kids", "funskool"],
    featured: false,
    badge: "",
  },
  {
    name: "Hot Wheels 20-Car Gift Pack",
    description:
      "Pack of 20 Hot Wheels die-cast cars in 1:64 scale. Random assortment of styles and colours.",
    price: 999,
    originalPrice: 1499,
    discount: 33,
    category: "toys",
    brand: "Hot Wheels",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500",
    images: [],
    stock: 100,
    rating: 4.6,
    reviewCount: 8760,
    tags: ["hotwheels", "cars", "diecast", "kids"],
    featured: true,
    badge: "Top Pick",
  },
  {
    name: "Skillmatics Art & Craft Activity Box",
    description:
      "Educational art kit for ages 6–99 with 6 no-mess activities. Develops creativity and motor skills.",
    price: 799,
    originalPrice: 1299,
    discount: 38,
    category: "toys",
    brand: "Skillmatics",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500",
    images: [],
    stock: 100,
    rating: 4.5,
    reviewCount: 4320,
    tags: ["art", "craft", "educational", "kids"],
    featured: false,
    badge: "",
  },
];

// ─── POST helper ────────────────────────────────────────────────
function postProduct(product) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(product);
    const options = {
      hostname: "scelta-backend.onrender.com",
      path: "/api/products",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ name: product.name, status: res.statusCode, parsed });
        } catch {
          resolve({ name: product.name, status: res.statusCode, raw: data });
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🚀 Adding ${newProducts.length} products to Scelta...\n`);

  let success = 0;
  let failed = 0;

  for (const product of newProducts) {
    try {
      const result = await postProduct(product);
      if (result.status === 201 || result.status === 200) {
        console.log(`✅ [${result.status}] ${product.name}`);
        success++;
      } else {
        console.log(`❌ [${result.status}] ${product.name}`);
        console.log("   →", JSON.stringify(result.parsed || result.raw));
        failed++;
      }
    } catch (err) {
      console.log(`💥 ERROR: ${product.name} — ${err.message}`);
      failed++;
    }

    // Small delay to avoid overwhelming the server
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n─────────────────────────────────`);
  console.log(`✅ Success: ${success} products added`);
  if (failed > 0) console.log(`❌ Failed:  ${failed} products`);
  console.log(`─────────────────────────────────\n`);
}

main();
