'use client';
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


