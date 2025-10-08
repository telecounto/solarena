# SolArena: Multiplayer Solana Pong Game

This project is a multiplayer Pong game built on the Solana blockchain, featuring wallet integration, wagering, and a smart contract-based escrow system. This document provides instructions for setting up and running the frontend application locally, and a guide for deploying the Solana smart contract.

## Frontend Application (Next.js with React)

### Local Setup and Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/telecounto/solarena.git
    cd solarena
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    *Note: If you encounter dependency resolution issues, you might need to try `npm install --force` or manually resolve peer dependency warnings.*

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Key Frontend Components

#### `app/page.tsx`

This is the main entry point of the application, responsible for setting up the Solana wallet context and conditionally rendering the `Lobby` or `GameScreen` components based on the game state.

```tsx
import React, { useState, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

import Lobby from './src/components/Lobby';
import GameScreen from './src/components/GameScreen';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

export default function Home() {
  const [currentGameId, setCurrentGameId] = useState(null);
  const [playerNumber, setPlayerNumber] = useState(null);

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
  };

  const handleCreateGame = (wagerAmount) => {
    // In a real scenario, this would create a game on the server
    // and get a gameId back. For now, we'll mock it.
    const newGameId = `game-${Date.now()}`;
    setCurrentGameId(newGameId);
    setPlayerNumber(1); // Creating player is player 1
    console.log(`Game created with ID: ${newGameId}, Wager: ${wagerAmount}`);
  };

  const handleGameEnd = (winner) => {
    console.log(`Game ${currentGameId} ended. Winner: Player ${winner}`);
    setCurrentGameId(null);
    setPlayerNumber(null);
    // TODO: Trigger payout logic and show results
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            {!currentGameId ? (
              <Lobby onJoinGame={handleJoinGame} onCreateGame={handleCreateGame} />
            ) : (
              <GameScreen gameId={currentGameId} playerNumber={playerNumber} onGameEnd={handleGameEnd} />
            )}
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

#### `src/components/Lobby.jsx`

This component displays available games, allows users to connect their Solana wallet, view their balance, create new games with a wager, and join existing games.

```jsx
import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';

const Lobby = ({ onJoinGame, onCreateGame }) => {
  const { publicKey, connected, signMessage } = useWallet();
  const [solBalance, setSolBalance] = useState(0);
  const [wagerAmount, setWagerAmount] = useState(0.1); // Default wager
  const [availableGames, setAvailableGames] = useState([]);

  // Placeholder for WebSocket connection to game server for lobby updates
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

    // TODO: Implement logic to create game via Vercel API route / game server
    // This would involve signing a transaction to lock wager in smart contract
    // and then notifying the game server.
    console.log(`Creating game with wager: ${wagerAmount} SOL`);
    onCreateGame(wagerAmount);
  };

  const handleJoinGame = async (gameId, wager) => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet.');
      return;
    }
    // TODO: Implement logic to join game via Vercel API route / game server
    // This would involve signing a transaction to lock wager in smart contract
    // and then notifying the game server.
    console.log(`Joining game ${gameId} with wager: ${wager} SOL`);
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
```

#### `src/components/GameScreen.jsx`

This component renders the Pong game canvas and handles game state updates and player input. It includes placeholder logic for game rendering and interaction.

```jsx
import React, { useState, useEffect, useRef } from 'react';

const GameScreen = ({ gameId, playerNumber, onGameEnd }) => {
  const canvasRef = useRef(null);
  const [gameData, setGameData] = useState({
    paddle1Y: 150,
    paddle2Y: 150,
    ballX: 250,
    ballY: 150,
    score1: 0,
    score2: 0,
    status: 'waiting',
  });

  // Placeholder for WebSocket connection to game server for real-time game updates
  useEffect(() => {
    // TODO: Establish WebSocket connection to game server for real-time game updates
    // const ws = new WebSocket(`ws://your-game-server-url/game/${gameId}`);
    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   setGameData(data);
    //   if (data.status === 'ended') {
    //     onGameEnd(data.winner);
    //   }
    // };
    // return () => ws.close();

    // Mock game updates for demonstration
    const interval = setInterval(() => {
      setGameData(prevData => {
        const newBallX = prevData.ballX + 5;
        const newBallY = prevData.ballY + 2;
        let newScore1 = prevData.score1;
        let newScore2 = prevData.score2;
        let newStatus = prevData.status;

        if (newBallX > 500) {
          newScore1++;
          newBallX = 250;
          newBallY = 150;
        }
        if (newScore1 >= 10) {
          newStatus = 'ended';
          onGameEnd(1); // Player 1 wins
        }

        return {
          ...prevData,
          ballX: newBallX,
          ballY: newBallY,
          score1: newScore1,
          score2: newScore2,
          status: newStatus,
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameId, onGameEnd]);

  // Handle paddle movement input
  useEffect(() => {
    const handleKeyDown = (e) => {
      // TODO: Send paddle movement to game server via WebSocket
      if (e.key === 'ArrowUp') {
        console.log(`Player ${playerNumber} moved paddle up`);
      } else if (e.key === 'ArrowDown') {
        console.log(`Player ${playerNumber} moved paddle down`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerNumber]);

  // Render game on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillRect(10, gameData.paddle1Y, 10, 80);
    ctx.fillRect(canvas.width - 20, gameData.paddle2Y, 10, 80);

    // Draw ball
    ctx.beginPath();
    ctx.arc(gameData.ballX, gameData.ballY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw scores
    ctx.font = '24px Arial';
    ctx.fillText(gameData.score1, canvas.width / 4, 30);
    ctx.fillText(gameData.score2, canvas.width * 3 / 4, 30);
  }, [gameData]);

  return (
    <div className="game-screen-container">
      <h2>Game ID: {gameId}</h2>
      <canvas ref={canvasRef} width="500" height="300" style={{ border: '1px solid black' }}></canvas>
      <p>Player {playerNumber} - Score: {gameData.score1} vs {gameData.score2}</p>
      {gameData.status === 'ended' && <p>Game Over! Winner: Player {gameData.winner}</p>}
    </div>
  );
};

export default GameScreen;
```

## Solana Smart Contract Deployment

Deploying the Solana smart contract (Program) involves writing the contract in Rust, compiling it to BPF bytecode, and then deploying it to the Solana blockchain. This contract will handle the escrow of wagers and the payout logic.

### 1. Prerequisites

*   **Rust and Cargo:** Install Rust and Cargo using `rustup`.
*   **Solana CLI:** Install the Solana command-line tools.
*   **Anchor (Recommended):** For easier Solana program development, consider using the Anchor framework.

### 2. Smart Contract Development (Conceptual)

Here's a conceptual outline of the smart contract's structure:

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::{self, TokenAccount, Transfer};

declare_id!("YOUR_PROGRAM_ID_HERE"); // Replace with your program ID

#[program]
pub mod solana_pong_escrow {
    use super::*;

    pub fn initialize_game(
        ctx: Context<InitializeGame>,
        wager_amount: u64,
        game_id: String,
    ) -> Result<()> {
        // Logic to initialize game state on-chain
        // Create an escrow account (PDA) for the game
        // Transfer player 1's wager to the escrow account
        Ok(())
    }

    pub fn join_game(
        ctx: Context<JoinGame>,
        wager_amount: u64,
        game_id: String,
    ) -> Result<()> {
        // Logic for player 2 to join
        // Verify wager_amount matches player 1's wager
        // Transfer player 2's wager to the escrow account
        // Mark game as ready to start
        Ok(())
    }

    pub fn end_game(
        ctx: Context<EndGame>,
        game_id: String,
        winner_player_id: u8, // 1 or 2
    ) -> Result<()> {
        // Logic to determine winner and initiate payout
        // Transfer 90% of total wager to winner
        // Transfer 10% to platform fee wallet
        // Close escrow account
        Ok(())
    }

    // Other functions for error handling, timeouts, refunds, etc.
}

#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(mut)]
    pub player1: Signer<'info>,
    // Define other accounts like escrow PDA, system program, token program, etc.
}

#[derive(Accounts)]
pub struct JoinGame<'info> {
    #[account(mut)]
    pub player2: Signer<'info>,
    // Define other accounts like escrow PDA, system program, token program, etc.
}

#[derive(Accounts)]
pub struct EndGame<'info> {
    #[account(mut)]
    pub winner: SystemAccount<'info>,
    #[account(mut)]
    pub loser: SystemAccount<'info>,
    // Define other accounts like escrow PDA, platform fee wallet, system program, token program, etc.
}
```

### 3. Compilation and Deployment

1.  **Build the program:**
    ```bash
    cargo build-bpf
    # Or using Anchor:
    # anchor build
    ```

2.  **Deploy to Solana:**
    ```bash
    solana program deploy target/deploy/solana_pong_escrow.so
    # Or using Anchor:
    # anchor deploy
    ```

    This will deploy your program to the configured Solana cluster (e.g., **Testnet** for development and testing, or Devnet/Mainnet-beta for production) and provide you with the `Program ID`. This `Program ID` will be essential for your frontend and backend to interact with the smart contract.

### 4. Interacting with the Smart Contract

Your frontend and game server will interact with this deployed smart contract using the Solana Web3.js library (or Anchor client library) to:

*   Send transactions to `initialize_game`, `join_game`, and `end_game` functions.
*   Query the state of game accounts (PDAs) to verify wagers and game status.
*   Listen for program logs to track game events on-chain in real-time.

## Next Steps

With the frontend components provided and the smart contract deployment outlined, you can now proceed with:

1.  **Local Development:** Run the Next.js application locally to test the UI and wallet integration.
2.  **Backend Development:** Implement the dedicated game server (e.g., using WebSockets) to handle real-time game logic and communicate with the Solana smart contract.
3.  **Smart Contract Implementation:** Write the full Solana program in Rust, including all necessary account structures and error handling.
4.  **Integration:** Connect the frontend, game server, and smart contract to create a fully functional game.

