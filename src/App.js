import React, { useState, useCallback, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

import { wordsList } from './data/word';
import './App.css';

const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' },
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState('');
  const [pikedCategory, setPikedCategory] = useState('');
  const [letters, setLetters] = useState([]);

  const [guessedLetter, setGuessedLetter] = useState([]);
  const [wrongLetters, setWrongLetter] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);

  const pikedWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    const word = words[category][Math.floor(Math.random() * words[category].length)];
    return { word, category };
  }, [words]);

  const startGame = useCallback(() => {
    const { word, category } = pikedWordAndCategory();

    let wordLetter = word.split('');
    wordLetter = wordLetter.map((l) => l.toLowerCase())

    setPickedWord(word);
    setPikedCategory(category);
    setLetters(wordLetter);

    setGameStage(stages[1].name);
  }, [pikedWordAndCategory]);

  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase();


    if (guessedLetter.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return
    };

    if (letters.includes(normalizedLetter)) {
      setGuessedLetter((actualGuessedLetter) =>
        [...actualGuessedLetter,
          normalizedLetter,
        ]);
    } else {
      setWrongLetter((actualGuessedLetter) =>
        [...actualGuessedLetter,
          normalizedLetter,
        ]
      );
      setGuesses(guesses - 1)
    }
  }

  function clearLetterStates() {
    setGuessedLetter([]);
    setWrongLetter([]);
    setGuesses(3);
  }

  useEffect(() => {
    if (guesses <= 0) {
      setGameStage(stages[2].name);
      clearLetterStates();
    }
  }, [guesses]);


  useEffect(() => {
    console.log(guessedLetter)
    if (guessedLetter.length === 0) return;
    const uniqueLetter = [...new Set(letters)];

    if (guessedLetter.length === uniqueLetter.length) {
      setScore((scoreActual) => scoreActual + 100);
      startGame();
      clearLetterStates();
    }

  }, [guessedLetter, letters, startGame]);

  const retry = () => {
    setGuesses(3);
    setScore(0);
    setGameStage(stages[0].name);
  }

  const exit = () => {
    setGameStage(stages[2].name)
  };
  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && <Game
        verifyLetter={verifyLetter}
        pickedWord={pickedWord}
        pikedCategory={pikedCategory}
        letters={letters}
        guessedLetter={guessedLetter}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
        exit={exit}
      />}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
