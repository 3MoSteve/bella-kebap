"use client";

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./contexts/CartContext";
import axios from "axios";


export default function RootLayout({ children }) {
  axios.defaults.baseURL = "http://localhost:5000";
  return (
    <html lang="en">
      <body className={inter.className}>
      <CartProvider>
      <Navbar />

     {children} 
</CartProvider>
<Footer />

</body>

    </html>
  );
}
