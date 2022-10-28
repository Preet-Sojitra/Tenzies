import React from "react"
import "./App.css"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {
  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [move, setMove] = React.useState(0)
  const [bestMove, setBestMove] = React.useState(
    localStorage.getItem("bestMove")
  )

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld)
    const firstValue = dice[0].value
    const allValueSame = dice.every((die) => die.value === firstValue)

    if (allHeld && allValueSame) {
      setTenzies(true)
    }
  }, [dice])

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }
  }

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }

  function rollDice() {
    if (tenzies) {
      setDice(allNewDice())
      setTenzies(false)
      if (bestMove == null) {
        localStorage.setItem("bestMove", bestMove)
        setBestMove(move)
      } else if (move <= bestMove) {
        setBestMove(move)
        localStorage.setItem("bestMove", bestMove)
      }
      setMove(0)
    } else {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie()
        })
      )
      setMove((preMov) => preMov + 1)
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? {...die, isHeld: !die.isHeld} : die
      })
    )
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ))

  return (
    <main>
      {tenzies && <Confetti numberOfPieces={200} />}
      <h1 className="title">Tenzies</h1>
      <div className="score">
        <h3>Best Moves: {bestMove}</h3>
        {/* <h3>Time taken: 00:03:00</h3> */}
      </div>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button onClick={rollDice} className="roll-dice">
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  )
}
