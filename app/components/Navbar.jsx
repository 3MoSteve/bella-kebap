// components/Navbar.jsx
import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    
    <nav className="bg-blue-800 p-4 flex flex-wrap justify-center items-center">
      <Link href="/">
        <div className="flex items-center mr-4 mb-4 sm:mb-0">
          <img src="/logo.png" alt="Logo" className="h-8 mr-2" />
          <span className="text-white font-bold text-lg">Bella Kebap Spezial</span>
        </div>
      </Link>
      <div className="flex flex-wrap justify-center items-center">
        <NavItem href="/order">Bestellen</NavItem>
      </div>
      <NavItem href="/cart">Warenkorb</NavItem>
    </nav>
  );
};

const NavItem = ({ href, children }) => {
  return (
    <Link href={href}>
      <div className="flex items-center text-white mr-4 mb-4 sm:mb-0">
        <span className="border-b-2 border-transparent hover:border-blue-900 hover:text-black hover:bg-white bg-gradient-to-r from-transparent to-transparent px-3 py-2 rounded cursor-pointer transition duration-300">
          {children}
        </span>
      </div>
    </Link>
  );
};

export default Navbar;
