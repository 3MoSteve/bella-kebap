// pages/home.jsx
import React from 'react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-800 to-blue-400 text-white p-4">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-center">Bella Kebap Spezial</h1>
      <p className="text-lg sm:text-xl lg:text-2xl mb-8 text-center">Welcome to Bella Kebap Spezial! We offer delicious kebabs and more.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <div className="max-w-[200px] mb-2">
            <img src="/image1.jpg" alt="Image 1" className="max-w-full h-auto" />
          </div>
          <p className="text-lg text-center break-words mb-2">Delicious Kebabs</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="max-w-[200px] mb-2">
            <img src="/image2.jpg" alt="Image 2" className="max-w-full h-auto" />
          </div>
          <p className="text-lg text-center break-words mb-2">Fresh Ingredients</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="max-w-[200px] mb-2">
            <img src="/image3.jpg" alt="Image 3" className="max-w-full h-auto" />
          </div>
          <p className="text-lg text-center break-words mb-2">Cozy Atmosphere</p>
        </div>
      </div>

      <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mt-8">Order Now</button>
    </div>
  );
};

export default Home;
