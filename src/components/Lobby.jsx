
'use client';
import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';

const Lobby = ({ onJoinGame, onCreateGame }) => {
  const { publicKey, connected } = useWallet();
  const [solBalance, setSolBalance] = useState(0);
  const [wagerAmount, setWagerAmount] = useState(0.1); // Default wager
  const [availableGames, setAvailableGames] = useState([]);

  useEffect(() => {
    if (!connected) return;

    // Fetch SOL balance
    const connection = new Connection('https://api.devnet.solana.com'); // Use appropriate Solana network
    connection.getBalance(publicKey).then(balance => {
      setSolBalance(balance / 10**9); // Convert lamports to SOL
    });

    // TODO: Establish WebSocket connection to game server for real-time lobby updates
    // const ws = new WebSocket('ws://your-game-server-url/lobby');
    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type === 'LOBBY_UPDATE') {
    //     setAvailableGames(data.games);
    //   }
    // };
    // return () => ws.close();

    // Mock available games for demonstration
    setAvailableGames([
      { id: 'game1', wager: 0.5, players: 1, status: 'waiting' },
      { id: 'game2', wager: 0.2, players: 1, status: 'waiting' },
    ]);

  }, [connected, publicKey]);

  const handleCreateGame = async () => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet.');
      return;
    }
    if (wagerAmount <= 0) {
      alert('Wager amount must be greater than 0.');
      return;
    }

    // Frontend-only: Mock game creation. Smart contract interaction removed.
    console.log(`Creating game with wager: ${wagerAmount} SOL (frontend mock)`);
    onCreateGame(wagerAmount);
  };

  const handleJoinGame = async (gameId, wager) => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet.');
      return;
    }
    // Frontend-only: Mock game joining. Smart contract interaction removed.
    console.log(`Joining game ${gameId} with wager: ${wager} SOL (frontend mock)`);
    onJoinGame(gameId);
  };

  return (
    <div className="lobby-container">
      <h1>Pong Lobby</h1>
      {!connected ? (
        <p>Connect your Solana wallet to play.</p>
      ) : (
        <div className="wallet-info">
          <p>Wallet: {publicKey.toBase58()}</p>
          <p>Balance: {solBalance.toFixed(4)} SOL</p>
          <div className="create-game-section">
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={wagerAmount}
              onChange={(e) => setWagerAmount(parseFloat(e.target.value))}
              placeholder="Wager amount (SOL)"
            />
            <button onClick={handleCreateGame}>Create Game</button>
          </div>
        </div>
      )}

      <h2>Available Games</h2>
      {availableGames.length === 0 ? (
        <p>No games available. Create one!</p>
      ) : (
        <ul className="game-list">
          {availableGames.map((game) => (
            <li key={game.id}>
              Game ID: {game.id} | Wager: {game.wager} SOL | Players: {game.players}/2
              {game.status === 'waiting' && (
                <button onClick={() => handleJoinGame(game.id, game.wager)}>Join Game</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Lobby;


