import React from 'react';
import './GameOver.css';

const GameOver = ({ retry, score, palavra }) => {
    return (
        <div className='gameOver'>
            <h1>Fim de jogo</h1>
            <h2>A sua pontuação foi: <span>{score}</span></h2>
            <h2>A palavra era: {palavra}</h2>
            <button onClick={retry}>Resetar Jogo</button>
        </div>
    )
}

export default GameOver
