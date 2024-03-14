"use client";
// AdminOrders.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({ item: '', description: '', price: '', extras: [], customSizes: [] });
  const [selectedImage, setSelectedImage] = useState(null);
  const [extras, setExtras] = useState([]);
  const [customSizes, setCustomSizes] = useState([]);
  const [password, setPassword] = useState("");

  const loadOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const addOrder = async () => {
    try {
      const formData = new FormData();
      formData.append('item', newOrder.item);
      formData.append('description', newOrder.description);
      formData.append('price', newOrder.price);
      formData.append('image', selectedImage);

      formData.append('extras', JSON.stringify(newOrder.extras || []));
      formData.append('customSizes', JSON.stringify(customSizes || []));

      await axios.post('/api/orders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": password
        }
      });
      setNewOrder({ item: '', description: '', price: '', extras: [], customSizes: [] });
      setSelectedImage(null);
      loadOrders();
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  const loadExtras = async () => {
    try {
      const response = await axios.get('/api/extras');
      setExtras(response.data);
    } catch (error) {
      console.error('Error fetching extras:', error);
    }
  };

  useEffect(() => {
    loadOrders();
    loadExtras();
  }, []);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!localStorage.pass) {

    Swal.fire({
        title: "Passwort",
        text: "Bitte geben Sie Admin passwort ein um fortzufahren",
        input: "text",
        inputPlaceholder: "Passwort eingeben",
        preConfirm: (value) => {
            axios.post("/api/verify", {pass: value}).then(res => {
                if (res.status == 200) {
                    setLoading(false);
                    localStorage.setItem("pass", value);

                    setPassword(value);
                }
            }).catch(e => {
                location.href = "/";

            })
        }
    })} else {
        axios.post("/api/verify", {pass: localStorage.pass}).then(res => {
            if (res.status == 200) {
                setLoading(false);
                setPassword(localStorage.pass);
            }
        }).catch(e => {
            localStorage.removeItem("pass");
            location.href = "/";

        })
    }
  }, []);
  function deleteOrder(id) {
    axios.delete("/api/orders/"+id, {
        headers: {
            "Authorization": password
        }
    }).then(res => {
        Swal.fire("Erfolgreisch", "Gericht wurde gelöscht.", "success");
    }).catch(e => {
        Swal.fire("Fehler", "Gericht konnte nicht gelöscht werden.", "error");

    })
  }
  return !loading && (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Order</h2>
      <div className="mb-4">
        <label className="block mb-1">Item:</label>
        <input type="text" value={newOrder.item} onChange={(e) => setNewOrder({ ...newOrder, item: e.target.value })} className="border border-gray-300 px-2 py-1 w-full rounded" />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Description:</label>
        <textarea value={newOrder.description} onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })} className="border border-gray-300 px-2 py-1 w-full rounded" />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Price:</label>
        <input type="text" value={newOrder.price} onChange={(e) => setNewOrder({ ...newOrder, price: e.target.value })} className="border border-gray-300 px-2 py-1 w-full rounded" />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Extras:</label>
        {extras.map((extra, index) => (
          <div key={index} className="mb-2">
            <input type="checkbox" id={`extra-${index}`} onChange={(e) => {
              if (e.target.checked) {
                setNewOrder({ ...newOrder, extras: [...newOrder.extras, extra] });
              } else {
                setNewOrder({ ...newOrder, extras: newOrder.extras.filter(item => item !== extra) });
              }
            }} className="mr-2" />
            <label htmlFor={`extra-${index}`}>{extra.name}</label>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label className="block mb-1">Custom Sizes:</label>
        <button onClick={() => setCustomSizes([...customSizes, { size: '', price: '' }])} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Add Size</button>
        {customSizes.map((size, index) => (
          <div key={index} className="mb-2">
            <input type="text" value={size.size} onChange={(e) => {
              const newSizes = [...customSizes];
              newSizes[index].size = e.target.value;
              setCustomSizes(newSizes);
            }} placeholder="Size" className="border border-gray-300 px-2 py-1 rounded mr-2" />
            <input type="text" value={size.price} onChange={(e) => {
              const newSizes = [...customSizes];
              newSizes[index].price = e.target.value;
              setCustomSizes(newSizes);
            }} placeholder="Price" className="border border-gray-300 px-2 py-1 rounded mr-2" />
            <button onClick={() => setCustomSizes(customSizes.filter((_, i) => i !== index))} className="bg-red-500 text-white px-2 py-1 rounded">Remove</button>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label className="block mb-1">Image:</label>
        <input type="file" onChange={(e) => setSelectedImage(e.target.files[0])} className="mb-2" />
        {selectedImage && <img src={URL.createObjectURL(selectedImage)} alt="Selected" className="max-w-xs" />}
      </div>
      <button onClick={addOrder} className="bg-green-500 text-white px-4 py-2 rounded">Add Order</button>

      <h2 className="text-2xl font-bold mt-8 mb-4">Orders</h2>
      {orders.map(order => (
        <div key={order.id} className="flex items-center border border-gray-300 rounded p-4 mb-4">
          <img src={"http://localhost:5000"+order.image} alt={order.item} className="w-16 h-16 object-cover rounded-full mr-4" />
          <div>
            <h3 className="text-lg font-bold mb-1">{order.item}</h3>
            <p className="mb-2">{order.description}</p>
            <p className="mb-2">Price: {order.price}</p>
            <p className="mb-2">Extras: {order.extras.map(extra => extra.name).join(', ')}</p>
            <p>Custom Sizes: {order.customSizes.map(size => `${size.size} ($${size.price})`).join(', ')}</p>
          </div>
          <button onClick={() => {deleteOrder(order.id);}} className="bg-red-500 text-white px-3 py-1.5 rounded">Löschen</button>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
