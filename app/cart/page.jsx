"use client";

// cart.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import CartContext from '../contexts/CartContext';

const Cart = () => {
  const {cart, removeFromCart, clearCart} = useContext(CartContext);

  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    deliveryOption: 'pickup',
    pickupTime: '',
    address: '',
    houseNumber: '',
    postalCode: '',
    city: ''
  });

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Laden von Bestellungen aus dem localStorage
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      const parsedCartItems = JSON.parse(storedCartItems);
      setCartItems(parsedCartItems);
    }
  }, []);

  useEffect(() => {
    // Speichern von Bestellungen im localStorage
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }, [cart]);

  // Funktion zum Entfernen einer Bestellung aus dem Warenkorb
  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
  };


  const placeOrder = async () => {
    try {
      await axios.post('/api/bestellung', {
        cartItems,
        customerInfo
      });
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Bestellung erfolgreich aufgegeben!',
        text: 'Vielen Dank für Ihre Bestellung.'
      });
      // Clear cart and customer info after placing order
      setCartItems([]);
      clearCart();
      setCustomerInfo({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        deliveryOption: 'pickup',
        pickupTime: '',
        address: '',
        houseNumber: '',
        postalCode: '',
        city: ''
      });
    } catch (error) {
      console.error('Error placing order:', error);
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
      });
    }
  };
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(
        cartItems.reduce((total, item) => {
            
            let ext = item.extras?.reduce((a,b) => a+b.price,0);
            return (total + item.price * item.quantity)+ext;
          
        }, 0)
      );
  }, [cartItems])
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Warenkorb</h2>
      {cartItems.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-lg">Warenkorb ist leer.</p>
          </div>
        ) : (
          <div>
            {cartItems.map((item, index) => (
                
              <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4">
                
                <div className="flex justify-between items-center mb-2">
                  <img src={"http://localhost:5000"+item.image} alt={item.item} className="w-16 h-16 object-cover mr-4" />
                  <div>
                    <h2 className="text-xl font-bold">{item.item}</h2>
                    <p className="text-sm">{item.description}</p>
                    <p className="text-sm">Menge: {item.quantity}</p>
                    <p className="text-sm">Gesamt Preis: ${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button onClick={() => handleRemoveFromCart(item.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Entfernen</button>
                </div>
                <hr className="border-gray-300" />
                {item.extras && (
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-semibold">Extras:</p>
                    <ul className="ml-2">
                      {item.extras.map((extra, index) => (
                        <li key={index} className='text-sm'>{extra.name}<span className='text-sm text-blue-700'>{extra.price}€</span></li>
                      ))}
                    </ul>
                  </div>
                )}
                {item.size && (
                  <p className="text-sm mt-2">Größe: {item.size} <span className='text-sm text-blue-700'>{item.price}€</span></p>
                )}
              </div>
            ))}
            <p>Total Preis: {total}€</p>
          </div>
        )}
      
      {/* Customer information form */}
      <h2 className="text-xl font-bold mb-4">Kundendaten</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input type="text" value={customerInfo.firstName} onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })} placeholder="Vorname" className="border border-gray-300 px-2 py-1 rounded" />
        <input type="text" value={customerInfo.lastName} onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })} placeholder="Nachname" className="border border-gray-300 px-2 py-1 rounded" />
        <input type="text" value={customerInfo.phoneNumber} onChange={(e) => setCustomerInfo({ ...customerInfo, phoneNumber: e.target.value })} placeholder="Telefonnummer" className="border border-gray-300 px-2 py-1 rounded" />
      </div>

      {/* Delivery options */}
      <h2 className="text-xl font-bold mb-4">Lieferoption</h2>
      <div className="mb-4">
        <input type="radio" id="pickup" name="deliveryOption" value="pickup" checked={customerInfo.deliveryOption === 'pickup'} onChange={() => setCustomerInfo({ ...customerInfo, deliveryOption: 'pickup' })} />
        <label htmlFor="pickup" className="ml-2">Abholung</label>
      </div>
      <div className="mb-4">
        <input type="radio" id="delivery" name="deliveryOption" value="delivery" checked={customerInfo.deliveryOption === 'delivery'} onChange={() => setCustomerInfo({ ...customerInfo, deliveryOption: 'delivery' })} />
        <label htmlFor="delivery" className="ml-2">Lieferung</label>
      </div>

      {/* Additional fields for pickup or delivery */}
      {customerInfo.deliveryOption === 'pickup' ? (
        <div className="mb-4">
          <label htmlFor="pickupTime" className="block mb-1">Abholzeit:</label>
          <input type="text" value={customerInfo.pickupTime} onChange={(e) => setCustomerInfo({ ...customerInfo, pickupTime: e.target.value })} placeholder="Uhrzeit" className="border border-gray-300 px-2 py-1 rounded" />
        </div>
      ) : (
        <div>
          <input type="text" value={customerInfo.address} onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })} placeholder="Adresse" className="border border-gray-300 px-2 py-1 rounded mb-2" />
          <input type="text" value={customerInfo.houseNumber} onChange={(e) => setCustomerInfo({ ...customerInfo, houseNumber: e.target.value })} placeholder="Hausnummer" className="border border-gray-300 px-2 py-1 rounded mb-2" />
          <input type="text" value={customerInfo.postalCode} onChange={(e) => setCustomerInfo({ ...customerInfo, postalCode: e.target.value })} placeholder="PLZ" className="border border-gray-300 px-2 py-1 rounded mb-2" />
          <input type="text" value={customerInfo.city} onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })} placeholder="Stadt" className="border border-gray-300 px-2 py-1 rounded mb-4" />
        </div>
      )}

      {/* Submit button */}
      <button onClick={() => placeOrder()} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Bestätigen</button>
    </div>
  );
};

export default Cart;












// pages/cart.jsx
// import React, { useContext, useEffect, useState } from 'react';
// import CartContext from '../contexts/CartContext';

const Cart2 = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Laden von Bestellungen aus dem localStorage
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      const parsedCartItems = JSON.parse(storedCartItems);
      setCartItems(parsedCartItems);
    }
  }, []);

  useEffect(() => {
    // Speichern von Bestellungen im localStorage
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }, [cart]);

  // Funktion zum Entfernen einer Bestellung aus dem Warenkorb
  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto mt-8 flex-grow">
        <h1 className="text-4xl font-bold mb-4">Ihre Warenkorb</h1>
        {cartItems.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-lg">Warenkorb ist leer.</p>
          </div>
        ) : (
          <div>
            {cartItems.map((item, index) => (
                
              <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4">
                {console.log(item)}
                <div className="flex justify-between items-center mb-2">
                  <img src={"http://localhost:5000"+item.image} alt={item.item} className="w-16 h-16 object-cover mr-4" />
                  <div>
                    <h2 className="text-xl font-bold">{item.item}</h2>
                    <p className="text-sm">{item.description}</p>
                    <p className="text-sm">Menge: {item.quantity}</p>
                    <p className="text-sm">Gesamt Preis: ${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button onClick={() => handleRemoveFromCart(item.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Entfernen</button>
                </div>
                <hr className="border-gray-300" />
                {item.extras && (
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-semibold">Extras:</p>
                    <ul className="ml-2">
                      {item.extras.map((extra, index) => (
                        <li key={index} className='text-sm'>{extra.name}<span className='text-sm text-blue-700'>{extra.price}€</span></li>
                      ))}
                    </ul>
                    {console.log(item)}
                  </div>
                )}
                {item.size && (
                  <p className="text-sm mt-2">Größe: {item.size} <span className='text-sm text-blue-700'>{item.price}€</span></p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

// export default Cart;

