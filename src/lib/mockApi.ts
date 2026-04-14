import { Product, Order, Review } from './types';

// Initial Mock Data
let MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1', 
    name: 'MacBook Pro M3 Max', 
    description: 'Apple Silicon M3 Max chip, 36GB Unified Memory, 1TB SSD. The most powerful laptop for pros.', 
    price: 3499.00, 
    stock: 15, 
    image: 'https://images.unsplash.com/photo-1517336714460-4c50193c63e1?w=800&q=80', 
    category: 'Laptops', 
    brand: 'Apple', 
    sellerId: 's1', 
    rating: 4.9, 
    reviewsCount: 42
  },
  {
    id: 'p2', 
    name: 'iPhone 15 Pro Max', 
    description: 'Titanium design, A17 Pro chip, 48MP Main camera. The ultimate iPhone.', 
    price: 1199.00, 
    stock: 25, 
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80', 
    category: 'Smartphones', 
    brand: 'Apple', 
    sellerId: 's1', 
    rating: 4.8, 
    reviewsCount: 156
  },
  {
    id: 'p3', 
    name: 'Samsung Galaxy S24 Ultra', 
    description: 'Galaxy AI is here. 200MP camera, S Pen included, Titanium frame.', 
    price: 1299.99, 
    stock: 20, 
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80', 
    category: 'Smartphones', 
    brand: 'Samsung', 
    sellerId: 's2', 
    rating: 4.7, 
    reviewsCount: 89
  },
  {
    id: 'p4', 
    name: 'Apple Watch Ultra 2', 
    description: 'The most rugged and capable Apple Watch. 36-hour battery life, 3000 nits display.', 
    price: 799.00, 
    stock: 10, 
    image: 'https://images.unsplash.com/photo-1434493907317-a46b53779483?w=800&q=80', 
    category: 'Wearables', 
    brand: 'Apple', 
    sellerId: 's1', 
    rating: 4.9, 
    reviewsCount: 34
  },
  {
    id: 'p5', 
    name: 'Sony WH-1000XM5', 
    description: 'Industry-leading noise canceling with two processors controlling 8 microphones.', 
    price: 399.99, 
    stock: 30, 
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 
    category: 'Audio', 
    brand: 'Sony', 
    sellerId: 's3', 
    rating: 4.8, 
    reviewsCount: 210
  },
  {
    id: 'p6', 
    name: 'iPad Pro M2', 
    description: 'Astonishing performance. Incredibly advanced displays. Superfast wireless connectivity.', 
    price: 799.00, 
    stock: 12, 
    image: 'https://images.unsplash.com/photo-1544244015-0cd4b3ffad20?w=800&q=80', 
    category: 'Tablets', 
    brand: 'Apple', 
    sellerId: 's1', 
    rating: 4.8, 
    reviewsCount: 75
  },
  {
    id: 'p7', 
    name: 'ROG Strix G16 Gaming Laptop', 
    description: 'Intel Core i9-13980HX, NVIDIA GeForce RTX 4080, 16GB DDR5, 1TB PCIe 4.0 SSD.', 
    price: 1999.99, 
    stock: 8, 
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80', 
    category: 'Laptops', 
    brand: 'ASUS', 
    sellerId: 's4', 
    rating: 4.6, 
    reviewsCount: 12
  },
  {
    id: 'p8',
    name: 'Dell XPS 15',
    description: '13th Gen Intel Core i9, NVIDIA RTX 4070, 3.5K OLED Touch Display. Elegance meets power.',
    price: 2399.00,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
    category: 'Laptops',
    brand: 'Dell',
    sellerId: 's1',
    rating: 4.7,
    reviewsCount: 28
  },
  {
    id: 'p9',
    name: 'Google Pixel 8 Pro',
    description: 'The all-pro phone engineered by Google. It’s sleek, sophisticated, and has the best Pixel camera yet.',
    price: 999.00,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1696423602143-df9bc6f69d31?w=800&q=80',
    category: 'Smartphones',
    brand: 'Google',
    sellerId: 's2',
    rating: 4.8,
    reviewsCount: 64
  },
  {
    id: 'p10',
    name: 'Samsung QN900D Neo QLED 8K 85"',
    description: 'Neo QLED 8K with NQ8 AI Gen3 processor. Quantum Matrix Technology Pro, Real Depth Enhancer, 8K AI Upscaling. The pinnacle of Samsung TV technology.',
    price: 7999.99,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=800&q=80',
    category: 'TVs',
    brand: 'Samsung',
    sellerId: 's2',
    rating: 4.9,
    reviewsCount: 38
  },
  {
    id: 'p11',
    name: 'LG G4 OLED evo 77"',
    description: 'OLED evo Gallery Edition with MLA technology. α11 AI Processor 4K, Brightness Booster Ultimate, Dolby Vision IQ & Atmos. Perfect blacks, infinite contrast.',
    price: 3499.99,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&q=80',
    category: 'TVs',
    brand: 'LG',
    sellerId: 's3',
    rating: 4.9,
    reviewsCount: 72
  },
  {
    id: 'p12',
    name: 'Sony BRAVIA XR A95L QD-OLED 65"',
    description: 'QD-OLED with Cognitive Processor XR. XR Triluminos Max, Acoustic Surface Audio+, HDMI 2.1 for 4K 120Hz gaming. The most lifelike picture Sony has ever made.',
    price: 2999.99,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800&q=80',
    category: 'TVs',
    brand: 'Sony',
    sellerId: 's3',
    rating: 4.8,
    reviewsCount: 95
  },
  {
    id: 'p13',
    name: 'Samsung S95D QD-OLED 55"',
    description: 'QD-OLED with NQ4 AI Gen2 processor. Glare-Free technology, 144Hz refresh rate, AMD FreeSync Premium Pro. Ideal for gaming and cinematic content.',
    price: 1799.99,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80',
    category: 'TVs',
    brand: 'Samsung',
    sellerId: 's2',
    rating: 4.8,
    reviewsCount: 54
  },
  {
    id: 'p14',
    name: 'LG C4 OLED 65"',
    description: 'OLED evo with α9 AI Processor 4K Gen7. 120Hz, G-Sync & FreeSync, Dolby Vision & Atmos, 4 HDMI 2.1 ports. Best-in-class OLED for gamers and movie lovers.',
    price: 1599.99,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80',
    category: 'TVs',
    brand: 'LG',
    sellerId: 's3',
    rating: 4.9,
    reviewsCount: 187
  },
  {
    id: 'p15',
    name: 'TCL QM891G Mini-LED QLED 75"',
    description: '4K Mini-LED QLED with AiPQ Ultra Engine. 5000 nits peak brightness, 240Hz, Dolby Vision IQ, Google TV. Premium performance at an unbeatable price.',
    price: 1299.99,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'TVs',
    brand: 'TCL',
    sellerId: 's4',
    rating: 4.7,
    reviewsCount: 43
  },
  // ── Smartphones ──
  {
    id: 'p16',
    name: 'iPhone 15 Pro',
    description: 'A17 Pro chip, titanium design, Action button, USB-C with USB 3 speeds.',
    price: 999.00,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
    category: 'iOS',
    brand: 'Apple',
    sellerId: 's1',
    rating: 4.8,
    reviewsCount: 210
  },
  {
    id: 'p17',
    name: 'Xiaomi 14 Pro',
    description: 'Snapdragon 8 Gen 3, Leica optics, 50MP triple camera, 120W HyperCharge.',
    price: 899.00,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
    category: 'Android',
    brand: 'Xiaomi',
    sellerId: 's2',
    rating: 4.7,
    reviewsCount: 88
  },
  {
    id: 'p18',
    name: 'Redmi Note 13 Pro+',
    description: 'Dimensity 7200 Ultra, 200MP camera, 120W turbo charging, IP68 water resistance.',
    price: 449.00,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    category: 'Android',
    brand: 'Xiaomi',
    sellerId: 's2',
    rating: 4.6,
    reviewsCount: 134
  },
  {
    id: 'p19',
    name: 'OnePlus 12',
    description: 'Snapdragon 8 Gen 3, Hasselblad camera, 100W SUPERVOOC, 5400mAh battery.',
    price: 799.00,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80',
    category: 'Android',
    brand: 'OnePlus',
    sellerId: 's3',
    rating: 4.7,
    reviewsCount: 76
  },
  // ── Smart Watches ──
  {
    id: 'p20',
    name: 'Apple Watch Series 9',
    description: 'S9 chip, Double Tap gesture, Always-On Retina display, carbon neutral.',
    price: 399.00,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&q=80',
    category: 'Smartwatches',
    brand: 'Apple',
    sellerId: 's1',
    rating: 4.8,
    reviewsCount: 95
  },
  {
    id: 'p21',
    name: 'Samsung Galaxy Watch 6',
    description: 'Advanced sleep coaching, body composition analysis, Wear OS 4.',
    price: 299.00,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    category: 'Smartwatches',
    brand: 'Samsung',
    sellerId: 's2',
    rating: 4.6,
    reviewsCount: 67
  },
  {
    id: 'p22',
    name: 'Huawei Watch GT 4',
    description: '14-day battery life, ECG monitoring, GPS, elegant design.',
    price: 249.00,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
    category: 'Smartwatches',
    brand: 'Huawei',
    sellerId: 's3',
    rating: 4.5,
    reviewsCount: 43
  },
  {
    id: 'p23',
    name: 'Xiaomi Watch 2 Pro',
    description: 'Wear OS, Snapdragon W5+ Gen 1, 65-hour battery, LTE support.',
    price: 199.00,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=800&q=80',
    category: 'Smartwatches',
    brand: 'Xiaomi',
    sellerId: 's2',
    rating: 4.4,
    reviewsCount: 31
  },
  // ── TVs ──
  {
    id: 'p24',
    name: 'Samsung QLED 4K 65"',
    description: 'Quantum Dot technology, Neo QLED processor, 120Hz, Gaming Hub.',
    price: 1499.99,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=800&q=80',
    category: 'QLED TVs',
    brand: 'Samsung',
    sellerId: 's2',
    rating: 4.7,
    reviewsCount: 58
  },
  {
    id: 'p25',
    name: 'Xiaomi TV A Pro 55"',
    description: '4K QLED, Dolby Vision, HDMI 2.1, Google TV, 60Hz.',
    price: 599.00,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80',
    category: 'QLED TVs',
    brand: 'Xiaomi',
    sellerId: 's2',
    rating: 4.5,
    reviewsCount: 39
  },
  // ── Audio / Accessories ──
  {
    id: 'p26',
    name: 'AirPods Pro 2',
    description: 'Active Noise Cancellation, Adaptive Audio, USB-C, H2 chip.',
    price: 249.00,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80',
    category: 'Earbuds',
    brand: 'Apple',
    sellerId: 's1',
    rating: 4.9,
    reviewsCount: 312
  },
  {
    id: 'p27',
    name: 'Samsung Galaxy Buds 2 Pro',
    description: '24-bit Hi-Fi sound, ANC, 360 Audio, IPX7 water resistance.',
    price: 179.00,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    category: 'Earbuds',
    brand: 'Samsung',
    sellerId: 's2',
    rating: 4.6,
    reviewsCount: 145
  },
  {
    id: 'p28',
    name: 'JBL Tune 770NC',
    description: 'Adaptive Noise Cancelling, 70-hour battery, foldable design, multipoint connection.',
    price: 129.00,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    category: 'Headphones',
    brand: 'JBL',
    sellerId: 's3',
    rating: 4.5,
    reviewsCount: 98
  },
  {
    id: 'p29',
    name: 'Powerbank 20000mAh',
    description: '65W PD fast charging, dual USB-A + USB-C, LED display, compact design.',
    price: 49.99,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80',
    category: 'Accessories',
    brand: 'Anker',
    sellerId: 's4',
    rating: 4.7,
    reviewsCount: 220
  },
  {
    id: 'p30',
    name: 'Wireless Charger 15W',
    description: 'Qi2 certified, 15W fast wireless charging, compatible with iPhone & Android.',
    price: 29.99,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80',
    category: 'Chargers',
    brand: 'Belkin',
    sellerId: 's4',
    rating: 4.5,
    reviewsCount: 87
  },
  {
    id: 'p31',
    name: 'USB-C Cable 2m (240W)',
    description: '240W fast charging, 40Gbps data transfer, braided nylon, USB4 certified.',
    price: 19.99,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'Cables',
    brand: 'Anker',
    sellerId: 's4',
    rating: 4.6,
    reviewsCount: 156
  },
  // ── Laptops ──
  {
    id: 'p32',
    name: 'MacBook Air M2',
    description: 'M2 chip, 13.6" Liquid Retina, 18-hour battery, fanless design, MagSafe.',
    price: 1099.00,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1611186871525-9c4a1e5e7b5e?w=800&q=80',
    category: 'Ultrabooks',
    brand: 'Apple',
    sellerId: 's1',
    rating: 4.9,
    reviewsCount: 178
  },
  {
    id: 'p33',
    name: 'Lenovo Legion 5 Pro',
    description: 'AMD Ryzen 7 7745HX, RTX 4070, 16" 2560x1600 165Hz, 32GB DDR5.',
    price: 1599.00,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
    category: 'Gaming Laptops',
    brand: 'Lenovo',
    sellerId: 's4',
    rating: 4.7,
    reviewsCount: 54
  },
  {
    id: 'p34',
    name: 'HP Pavilion 15',
    description: 'Intel Core i7-1355U, Intel Iris Xe, 16GB RAM, 512GB SSD, FHD IPS.',
    price: 749.00,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
    category: 'Ultrabooks',
    brand: 'HP',
    sellerId: 's4',
    rating: 4.4,
    reviewsCount: 32
  },
  // ── Gaming ──
  {
    id: 'p35',
    name: 'PlayStation 5',
    description: 'Custom AMD CPU & GPU, 825GB SSD, 4K gaming, ray tracing, DualSense controller.',
    price: 499.00,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&q=80',
    category: 'Gaming Consoles',
    brand: 'Sony',
    sellerId: 's3',
    rating: 4.9,
    reviewsCount: 445
  },
  {
    id: 'p36',
    name: 'Xbox Series X',
    description: '12 teraflops GPU, 1TB NVMe SSD, 4K 120fps, Quick Resume, Game Pass.',
    price: 499.00,
    stock: 7,
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80',
    category: 'Gaming Consoles',
    brand: 'Microsoft',
    sellerId: 's3',
    rating: 4.8,
    reviewsCount: 312
  },
  {
    id: 'p37',
    name: 'Meta Quest 3 VR Headset',
    description: 'Mixed reality, Snapdragon XR2 Gen 2, 4K+ display, 40% thinner than Quest 2.',
    price: 499.00,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80',
    category: 'VR & AR',
    brand: 'Meta',
    sellerId: 's3',
    rating: 4.7,
    reviewsCount: 189
  },
  {
    id: 'p38',
    name: 'Gaming Joystick Pro',
    description: 'Hall effect sensors, 6-axis gyro, programmable buttons, PC & console compatible.',
    price: 79.99,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=800&q=80',
    category: 'Gaming Accessories',
    brand: 'Razer',
    sellerId: 's4',
    rating: 4.5,
    reviewsCount: 67
  },
  // ── Computer Accessories ──
  {
    id: 'p39',
    name: 'Gaming Keyboard RGB',
    description: 'Mechanical switches, per-key RGB, N-key rollover, USB passthrough.',
    price: 129.00,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&q=80',
    category: 'Computer Accessories',
    brand: 'Corsair',
    sellerId: 's4',
    rating: 4.7,
    reviewsCount: 143
  },
  {
    id: 'p40',
    name: 'Gaming Mouse 25600 DPI',
    description: '25600 DPI optical sensor, 11 programmable buttons, RGB, 90-hour battery.',
    price: 89.00,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
    category: 'Computer Accessories',
    brand: 'Logitech',
    sellerId: 's4',
    rating: 4.8,
    reviewsCount: 201
  },
  {
    id: 'p41',
    name: 'Monitor 27" 165Hz QHD',
    description: 'IPS panel, 2560x1440, 165Hz, 1ms GTG, HDR400, FreeSync Premium.',
    price: 349.00,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
    category: 'Computer Accessories',
    brand: 'LG',
    sellerId: 's3',
    rating: 4.7,
    reviewsCount: 88
  },
  {
    id: 'p42',
    name: 'Webcam 4K Pro',
    description: '4K 30fps, autofocus, built-in mic, HDR, works with Zoom & Teams.',
    price: 149.00,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800&q=80',
    category: 'Computer Accessories',
    brand: 'Logitech',
    sellerId: 's4',
    rating: 4.6,
    reviewsCount: 72
  },
  {
    id: 'p43',
    name: 'USB Microphone Studio',
    description: 'Cardioid condenser, 192kHz/24-bit, zero-latency monitoring, plug & play.',
    price: 99.00,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80',
    category: 'Computer Accessories',
    brand: 'Blue',
    sellerId: 's4',
    rating: 4.7,
    reviewsCount: 115
  },
  // ── Smart Home ──
  {
    id: 'p44',
    name: 'Robot Vacuum Cleaner',
    description: 'LiDAR navigation, 5000Pa suction, auto-empty base, works with Alexa & Google.',
    price: 399.00,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'Smart Home',
    brand: 'Xiaomi',
    sellerId: 's2',
    rating: 4.6,
    reviewsCount: 134
  },
  {
    id: 'p45',
    name: 'Smart LED Bulb Pack (4x)',
    description: 'RGB+W, 16M colors, voice control, app control, 10W = 75W equivalent.',
    price: 39.99,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80',
    category: 'Smart Home',
    brand: 'Philips Hue',
    sellerId: 's3',
    rating: 4.7,
    reviewsCount: 198
  },
  {
    id: 'p46',
    name: 'Smart Power Strip',
    description: '4 smart outlets + 4 USB, energy monitoring, surge protection, voice control.',
    price: 49.99,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'Smart Home',
    brand: 'TP-Link',
    sellerId: 's3',
    rating: 4.5,
    reviewsCount: 87
  },
  {
    id: 'p47',
    name: 'Electric Kettle Smart',
    description: 'Temperature control, keep warm, app control, 1.7L, 1500W, BPA-free.',
    price: 59.99,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    category: 'Smart Home',
    brand: 'Xiaomi',
    sellerId: 's2',
    rating: 4.4,
    reviewsCount: 56
  },
  {
    id: 'p48',
    name: 'Blender Pro 1200W',
    description: '1200W motor, 6 stainless blades, 2L BPA-free jar, 10 speeds + pulse.',
    price: 79.99,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80',
    category: 'Smart Home',
    brand: 'Philips',
    sellerId: 's3',
    rating: 4.5,
    reviewsCount: 43
  },
  // ── Car Tech ──
  {
    id: 'p49',
    name: 'Dashcam 4K WiFi',
    description: '4K recording, 170° wide angle, night vision, GPS, parking mode, loop recording.',
    price: 129.00,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'Car Tech',
    brand: 'Vantrue',
    sellerId: 's4',
    rating: 4.6,
    reviewsCount: 78
  },
  {
    id: 'p50',
    name: 'Car Phone Holder Magnetic',
    description: 'MagSafe compatible, 360° rotation, dashboard & windshield mount, strong magnet.',
    price: 24.99,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'Car Tech',
    brand: 'Spigen',
    sellerId: 's4',
    rating: 4.5,
    reviewsCount: 234
  },
  {
    id: 'p51',
    name: 'Bluetooth FM Transmitter',
    description: 'Bluetooth 5.3, QC3.0 charging, hands-free calls, USB-C + USB-A ports.',
    price: 29.99,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'Car Tech',
    brand: 'Anker',
    sellerId: 's4',
    rating: 4.4,
    reviewsCount: 112
  },
  // ── Trending ──
  {
    id: 'p52',
    name: 'DJI Mini 4 Pro Drone',
    description: '4K/60fps, omnidirectional obstacle sensing, 34-min flight time, 20km range.',
    price: 759.00,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80',
    category: 'Trending',
    brand: 'DJI',
    sellerId: 's3',
    rating: 4.9,
    reviewsCount: 167
  },
  {
    id: 'p53',
    name: 'Electric Scooter 500W',
    description: '500W motor, 45km range, 25km/h max speed, app control, foldable.',
    price: 599.00,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'Trending',
    brand: 'Xiaomi',
    sellerId: 's2',
    rating: 4.6,
    reviewsCount: 89
  },
  {
    id: 'p54',
    name: 'Smart Speaker with Display',
    description: '10" HD display, 360° sound, video calls, smart home hub, Alexa built-in.',
    price: 249.00,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1512446816042-444d641267d4?w=800&q=80',
    category: 'Speakers',
    brand: 'Amazon',
    sellerId: 's3',
    rating: 4.5,
    reviewsCount: 203
  },
  {
    id: 'p55',
    name: 'Samsung Galaxy Tab S9',
    description: 'Snapdragon 8 Gen 2, 11" Dynamic AMOLED, S Pen included, IP68, DeX mode.',
    price: 799.00,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1544244015-0cd4b3ffad20?w=800&q=80',
    category: 'Android Tablets',
    brand: 'Samsung',
    sellerId: 's2',
    rating: 4.8,
    reviewsCount: 134
  },
  {
    id: 'p56',
    name: 'Kindle Paperwhite 11th Gen',
    description: '6.8" 300ppi display, adjustable warm light, 10-week battery, waterproof.',
    price: 139.00,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
    category: 'Trending',
    brand: 'Amazon',
    sellerId: 's3',
    rating: 4.8,
    reviewsCount: 289
  }
];


export const mockApi = {
  getProducts: async (): Promise<Product[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_PRODUCTS), 800));
  },
  
  getProductById: async (id: string): Promise<Product | undefined> => {
    return new Promise((resolve) => setTimeout(() => {
      resolve(MOCK_PRODUCTS.find(p => p.id === id));
    }, 500));
  },

  getReviewsByProductId: async (productId: string): Promise<Review[]> => {
    return new Promise((resolve) => setTimeout(() => {
      resolve([
        { id: 'r1', productId, userId: 'u1', userName: 'John D.', rating: 5, comment: 'Amazing product!', createdAt: new Date().toISOString() }
      ]);
    }, 400));
  },

  createOrder: async (orderPayload: Partial<Order>): Promise<Order> => {
    return new Promise((resolve) => setTimeout(() => {
      resolve({
        id: `ord_${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        ...orderPayload
      } as Order);
    }, 1000));
  },

  addProduct: async (product: Partial<Product>): Promise<string> => {
    return new Promise((resolve) => setTimeout(() => {
      const newProduct = {
        id: `p${Date.now()}`,
        rating: 0,
        reviewsCount: 0,
        ...product
      } as Product;
      MOCK_PRODUCTS = [...MOCK_PRODUCTS, newProduct];
      resolve(newProduct.id);
    }, 600));
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => {
      MOCK_PRODUCTS = MOCK_PRODUCTS.map(p => p.id === id ? { ...p, ...data } : p);
      resolve();
    }, 600));
  },

  deleteProduct: async (id: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => {
      MOCK_PRODUCTS = MOCK_PRODUCTS.filter(p => p.id !== id);
      resolve();
    }, 400));
  }
};

