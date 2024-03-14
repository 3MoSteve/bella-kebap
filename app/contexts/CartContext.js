import React, { createContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (order) => {
    setCart(prevCart => [...prevCart, order]);
  };

  const clearCart = () => {
    setCart([]);
  }

  const removeFromCart = (orderId) => {
    setCart(prevCart => prevCart.filter(order => order.id !== orderId));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
