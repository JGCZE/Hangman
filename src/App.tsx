import { useState, useEffect, useCallback } from "react"
import HangmanDrawing from "./components/HangmanDrawing"
import {HangmanWord} from "./components/HangmanWord"
import {Keyboard} from "./components/Keyboard"
import words from "./wordList.json"

function getWord(){
  return words[Math.floor(Math.random() * words.length)]
}

const App = () => {
  const [wordToGuess, setWordToGuess] = useState(getWord)

  const [guessedLetters, setGuessedLetters] = useState<string[]>([])

  const inCorrectLetter = guessedLetters.filter(
    letter => !wordToGuess.includes(letter)
  )

  const isLoser = inCorrectLetter.length >= 6
  const isWinner = wordToGuess
    .split("")
    .every(letter => guessedLetters.includes(letter))

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return
  
      setGuessedLetters(currentLetters => [...currentLetters, letter])
    },
   [guessedLetters, isWinner, isLoser])


  useEffect(() => {
   const handler = (e: KeyboardEvent) => {
     const key = e.key
     if (!key.match(/^[a-z]$/)) return 
     
     e.preventDefault()
     addGuessedLetter(key)
   }
    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessedLetters])


  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
 
      if (key !== "Enter") return 
      
      e.preventDefault()
      setGuessedLetters([])
      setWordToGuess(getWord())
    }
     document.addEventListener("keypress", handler)
 
     return () => {
       document.removeEventListener("keypress", handler)
    
    }
  }, [])

  return (
    <div style={{
      maxWidth: "800px",
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      margin: "0 auto",
      alignItems: "center",
      
    }}>
      
    <div style={{ fontSize: "3.5rem", textAlign: "center", position: "absolute", top: 150, zIndex: "100", color: "red"}}>
      {isWinner && "Winnner! - Refresh to try again"}
      {isLoser && "Nice Try - Refresh to try again"}
    </div>
      <HangmanDrawing numberOfGuesses={inCorrectLetter.length} /> 
      <HangmanWord reveal={isLoser} guessedLetters={guessedLetters} wordToGuess={wordToGuess} />
      <div style={{ alignSelf: "stretch"}}>
        <Keyboard 
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter(letter => 
          wordToGuess.includes(letter)
          )}
          inactiveLetters={inCorrectLetter}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  )
}

export default App
