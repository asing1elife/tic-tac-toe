import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

const COORDNATE_MAP = [
  '0,0', '0,1', '0,2',
  '1,0', '1,1', '1,2',
  '2,0', '2,1', '2,2'
]

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0;i < lines.length;i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }

  return null
}

function getLastCoordnate(previous, current) {
  for (let i = 0;i < current.length;i++) {
    const previousItem = previous[i]
    const item = current[i]

    if (!previousItem && item) return COORDNATE_MAP[i]
  }

  return null
}

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  render() {
    let row = []
    let index = 0
    for (let i = 0;i < 3;i++) {
      let column = []
      for (let j = 0;j < 3;j++) {
        column.push(this.renderSquare(index))
        index++
      }

      row.push((
        <div className="board-row" key={index}>
          {column}
        </div>
      ))
    }

    return row
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]

    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) return

    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{ squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  handleSort() {
    
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves = history.map((step, move) => {
      const previous = move === 0 ? Array(9).fill(null) : history[move - 1].squares
      const coordnate = getLastCoordnate(previous, history[move].squares)

      const desc = move ? `Go to move #${move} : ${coordnate}` : 'Go to game start'

      return (
        <li className={move === this.state.stepNumber ? 'is-active' : ''} key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status
    if (winner) {
      status = `Winner: ${winner}`
    } else {
      status = `Next player: ${(this.state.xIsNext ? 'X' : 'O')}`
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button className="sort-btn" onClick={() => this.handleSort()}>排序</button>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<Game />)
