import { Product } from "./types/Product";
import { IProduct } from "./interface/productsInterfcae";
export const sampleProducts: Product[] = [
  {
    _id: "010101",
    name: "Smartwatch",
    slug: "smartwatch",
    image: "https://picsum.photos/800/800?random=1",
    category: "Wearables",
    brand: "Apple",
    price: 399.99,
    countInStock: 50,
    description:
      "Track your fitness and stay connected with this stylish smartwatch.",
    rating: 4.6,
    numReviews: 190,
  },
  {
    _id: "020202",
    name: "Gaming Laptop",
    slug: "gaming-laptop",
    image: "https://picsum.photos/800/800?random=2",
    category: "Computers",
    brand: "Alienware",
    price: 1999.99,
    countInStock: 0,
    description: "High-performance gaming laptop with advanced graphics.",
    rating: 4.8,
    numReviews: 320,
  },
  {
    _id: "030303",
    name: "Bluetooth Headphones",
    slug: "bluetooth-headphones",
    image: "https://picsum.photos/800/800?random=3",
    category: "Audio",
    brand: "Sony",
    price: 149.99,
    countInStock: 80,
    description: "Noise-cancelling headphones with rich sound quality.",
    rating: 2.5,
    numReviews: 240,
  },
  {
    _id: "040404",
    name: "4K Monitor",
    slug: "4k-monitor",
    image: "https://picsum.photos/800/800?random=5",
    category: "Displays",
    brand: "Samsung",
    price: 349.99,
    countInStock: 40,
    description: "Ultra HD monitor with vivid colors and wide viewing angles.",
    rating: 3.4,
    numReviews: 110,
  },
  {
    _id: "050505",
    name: "Wireless Mouse",
    slug: "wireless-mouse",
    image: "https://picsum.photos/800/800?random=1",
    category: "Accessories",
    brand: "Logitech",
    price: 29.99,
    countInStock: 0,
    description: "A sleek and ergonomic wireless mouse with long battery life.",
    rating: 1.5,
    numReviews: 10,
  },
];
