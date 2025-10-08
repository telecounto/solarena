import React, { useState, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

import Lobby from '../src/components/Lobby';
import GameScreen from '../src/components/GameScreen';
import Profile from '../src/components/Profile';
import Customization from '../src/components/Customization';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

export default function Home() {
  const [currentGameId, setCurrentGameId] = useState(null);
  const [playerNumber, setPlayerNumber] = useState(null);
  const [currentView, setCurrentView] = useState('lobby'); // 'lobby', 'game', 'profile', 'customization'

  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
    ],
    [network]
  );

  const handleJoinGame = (gameId) => {
    setCurrentGameId(gameId);
    setPlayerNumber(2); // Assume joining player is player 2
    setCurrentView('game');
  };

  const handleCreateGame = (wagerAmount) => {
    // Mock game creation for frontend testing
    const newGameId = `game-${Date.now()}`;
    setCurrentGameId(newGameId);
    setPlayerNumber(1); // Creating player is player 1
    console.log(`Game created with ID: ${newGameId}, Wager: ${wagerAmount}`);
    setCurrentView('game');
  };

  const handleGameEnd = (winner) => {
    console.log(`Game ${currentGameId} ended. Winner: Player ${winner}`);
    setCurrentGameId(null);
    setPlayerNumber(null);
    setCurrentView('lobby'); // Go back to lobby after game ends
  };

  const renderView = () => {
    switch (currentView) {
      case 'lobby':
        return <Lobby onJoinGame={handleJoinGame} onCreateGame={handleCreateGame} />;
      case 'game':
        return <GameScreen gameId={currentGameId} playerNumber={playerNumber} onGameEnd={handleGameEnd} />;
      case 'profile':
        return <Profile />;
      case 'customization':
        return <Customization />;
      default:
        return <Lobby onJoinGame={handleJoinGame} onCreateGame={handleCreateGame} />;
    }
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <div className="absolute top-4 right-4 flex space-x-4">
              <WalletMultiButton />
              <button onClick={() => setCurrentView('lobby')} className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700">Lobby</button>
              <button onClick={() => setCurrentView('profile')} className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700">Profile</button>
              <button onClick={() => setCurrentView('customization')} className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700">Customization</button>
            </div>
            {renderView()}
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}


