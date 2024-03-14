"use client";
// pages/orders.jsx
// pages/orders.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import CartContext from '../contexts/CartContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios.get('/api/orders')
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  const handleAddToCart = (order) => {
    // Öffne ein Modal mit SweetAlert2, um Extras, Größe und Menge auszuwählen
    Swal.fire({
      title: 'Bestellung anpassen',
      html: `
        <div>
          <p class="mb-2">Wähle Extras:</p>
          ${order.extras.map(extra => `
            <div class="mb-2">
              <input type="checkbox" id="${extra.name}" class="mr-2" />
              <label for="${extra.name}">${extra.name}<span class="text-sm text-blue-400">${extra.price}€</span></label>
            </div>
          `).join('')}
          <p class="mb-2">Wähle Größe:</p>
          <select id="size" class="mb-2">
            ${order.customSizes.map(size => `
            <option value="${size.name}">${size.name} <span class="text-sm text-blue-400">${size.price}€</span></option>
            `).join('')}
          </select>
          <p class="mb-2">Ändere die Menge:</p>
          <input type="number" id="quantity" min="1" value="1" class="mb-4" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Fertig',
      preConfirm: () => {
        console.log(order);
        const extras = order.extras.filter(extra => document.getElementById(extra.name).checked);
        const size = document.getElementById('size').value;
        const quantity = document.getElementById('quantity').value;
        let price = order.customSizes.find(r => r.name == size).price;
        const customizedOrder = {
          ...order,
          extras,
          size,
          price,
          quantity: parseInt(quantity)
        };

        // Füge die Bestellung mit den ausgewählten Optionen zum Warenkorb hinzu
        addToCart(customizedOrder);

        // Zeige das Bestätigungsmodal an
        Swal.fire({
          title: 'Bestellung hinzugefügt',
          text: 'Ihre Bestellung wurde erfolgreich zum Warenkorb hinzugefügt.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      },
      cancelButtonText: 'Abbrechen',
      customClass: {
        container: 'swal2-container',
        confirmButton: 'swal2-confirm-btn',
        cancelButton: 'swal2-cancel-btn'
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-800 to-blue-400 text-white p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Bestellen</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {orders.map(order => (
          <div key={order.id} className="border border-gray-300 rounded-lg overflow-hidden relative">
            <img src={"http://localhost:5000"+order.image} alt={order.item} className="w-full h-auto object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-bold text-center mb-2">{order.item}</h2>
              <p className="text-sm text-center mb-2">{order.description}</p>
              <button onClick={() => handleAddToCart(order)} className="w-full bg-blue-600 text-white py-2 rounded">Zum Warenkorb</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
