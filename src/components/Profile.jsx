
'use client';
import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const Profile = () => {
  const { publicKey, connected } = useWallet();

  // Placeholder for user profile data
  const userName = "PlayerOne";
  const profilePicture = "https://via.placeholder.com/150"; // Placeholder image
  const totalGames = 10;
  const wins = 7;
  const losses = 3;

  return (
    <div className="profile-container p-4 bg-gray-800 rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4">Player Profile</h2>
      <img src={profilePicture} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4" />
      <p className="text-xl font-semibold">{userName}</p>
      {connected && <p className="text-sm text-gray-400">Wallet: {publicKey.toBase58().substring(0, 8)}...{publicKey.toBase58().substring(publicKey.toBase58().length - 8)}</p>}
      <div className="mt-4">
        <p>Total Games: {totalGames}</p>
        <p>Wins: {wins}</p>
        <p>Losses: {losses}</p>
        {/* Add more profile details as needed */}
      </div>
    </div>
  );
};

export default Profile;


