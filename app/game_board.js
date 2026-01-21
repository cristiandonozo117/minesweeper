import { Box } from "./box.js"

export class GameBoard {
    #rows
    #cols
    #board
    constructor(rows, cols){
        this.#rows = rows
        this.#cols = cols
        this.#board = this.#createBoard(0.5)
    }

    getShape(){
        return [this.#rows, this.#cols]
    }

    get board(){
        return [...this.#board]
    }

    #createBoard(prob){
        const board = []
        let box, isMine
        for (let i=0; i<this.#rows; i++){
            let i = []
            for (let j=0; j<this.#cols; j++){
                isMine = false
                if (Math.random() > prob){
                    isMine = true
                }
                box = new Box(isMine)
                i.push(box)
            }
            board.push(i)
        }
        return board
    }

    revealBox(i, j){
        if ((i < 0 || i >= this.#rows) || (j < 0 || j >= this.#cols) ){
            throw Error(`Index out of range: [${i}, ${j}]`)
        }
        let box = this.#board[i][j]
        box.reveal()
        if (!box.is_mine){
            // Check neighboring cells for counting bombs
            let sideCells = this.getNeighbours(i, j)
            let bombsCount = 0
            // for (let k = 0; k<=sideCells.length; k++){
            //     if (sideCells[k].is_mine){
            //         bombsCount++
            //     }
            // }
            sideCells.forEach( cell => {
                if(cell.is_mine)
                    {bombsCount++}
            })
            // Recursion
            if (bombsCount == 0){
                sideCells.forEach( cell  => this.revealBox(...cell.position))
            }
        }else{
            // Lose Game
        }
    }

    getNeighbours(i, j){
        if ((i < 0 || i >= this.#rows) || (j < 0 || j >= this.#cols) ){
            throw Error(`Index out of range: [${i}, ${j}]`)
        }
        let cells = []
        for (let di= -1; di<=1; di++){
            for (let dj= -1; dj<=1; dj++){
                if (di == 0 && dj == 0){
                    continue // skip self cell [i,j]
                }
                try{
                    // Le agrego una propiedad a la instancia del objeto
                    let sideCell = this.#board[i+di][j+dj]
                    sideCell.position = [i+di, j+dj]
                    cells.push(sideCell)
                }catch{
                    // omitir este error. Quizás sea buena idea definir una excepción personalizada "IndexOutOfRange"
                }
            }
        }
        return cells
    }

    showBoard(){
        console.log(this.#board)
    }
}

// const myBoard = new GameBoard(8, 8)
// console.log(myBoard)
// myBoard.revealBox(1, 1)
// myBoard.showBoard()
