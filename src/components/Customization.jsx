import React, { useState } from 'react';

const Customization = () => {
  const [profilePic, setProfilePic] = useState('https://via.placeholder.com/150');
  const [paddleColor, setPaddleColor] = useState('#007bff');
  const [ballColor, setBallColor] = useState('#ff0000');

  const handleProfilePicChange = (e) => {
    // In a real app, this would handle image upload and storage
    alert('Profile picture upload not yet implemented.');
    // For now, just update the state with a new placeholder or user-provided URL
    // setProfilePic(e.target.value);
  };

  return (
    <div className="customization-container p-4 bg-gray-800 rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4">Customize Your Game</h2>

      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Profile Picture:</label>
        <img src={profilePic} alt="Profile Preview" className="w-24 h-24 rounded-full mx-auto mb-2" />
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePicChange}
          className="block mx-auto text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Paddle Color:</label>
        <input
          type="color"
          value={paddleColor}
          onChange={(e) => setPaddleColor(e.target.value)}
          className="w-24 h-10 rounded-md border-none cursor-pointer"
        />
        <p className="text-sm text-gray-400">{paddleColor}</p>
      </div>

      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Ball Color:</label>
        <input
          type="color"
          value={ballColor}
          onChange={(e) => setBallColor(e.target.value)}
          className="w-24 h-10 rounded-md border-none cursor-pointer"
        />
        <p className="text-sm text-gray-400">{ballColor}</p>
      </div>

      {/* Add more customization options as needed */}
      <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
        Save Customizations
      </button>
    </div>
  );
};

export default Customization;


