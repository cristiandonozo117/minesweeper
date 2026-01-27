import { Box } from "./box.js"
import { GameOver } from "./exceptions.js"

export class GameBoard {
    #rows
    #cols
    #board
    #totalMines
    constructor(rows, cols){
        this.#rows = rows
        this.#cols = cols
        //this.#totalMines = totalMines
        this.#totalMines = 0
        this.#board = this.#createBoard()
    }

    getShape(){
        return [this.#rows, this.#cols]
    }

    get board(){
        // Return a copy just for testing it
        return [...this.#board]
    }

    get totalMines(){
        return this.#totalMines
    }

    #createBoard(){
        const board = []
        let row, box
        for (let i=0; i<this.#rows; i++){
            row = []
            for (let j=0; j<this.#cols; j++){
                box = new Box(false)
                row.push(box)
            }
            board.push(row)
        }
        return board
    }

    getBoxIn(i, j){
        if ((i < 0 || i >= this.#rows) || (j < 0 || j >= this.#cols) ){
            throw Error(`Index out of range: [${i}, ${j}]`)
        }
        return this.#board[i][j]
    }

    setMineIn(i, j){
        // if (!((i >= 0 && i < this.#rows) && (j >= 0 && j < this.#cols))){
        //     throw Error(`Index out of range: [${i}, ${j}]`)
        // }
        // const box = this.#board[i][j]
        const box = this.getBoxIn(i, j)
        if (!box.is_mine){
            box.is_mine = true
            this.#totalMines++
        }
    }

    setRandomMines(totalMines){
        // Validación
        if ((totalMines > this.#rows * this.#cols) || totalMines < 0){
            throw Error('Number of mines must be less than total number of cells.')
        }
        const randomIndex = []
        // Genero aleatoriamente los índices que tendrán minas 
        while (randomIndex.length < totalMines){
            let rand_i = getRandomIntInclusive(0, this.#rows - 1)
            let rand_j = getRandomIntInclusive(0, this.#cols - 1)
            if (!randomIndex.find(index => index[0]==rand_i && index[1]==rand_j)){
                randomIndex.push([rand_i, rand_j])
                this.setMineIn(rand_i, rand_j)
            }
        }
    }

    revealBox(i, j){
        const box = this.getBoxIn(i, j)
        if (!box.revealed){
            box.reveal()
            if (!box.is_mine){
                // Check neighboring cells for counting bombs
                let sideCells = this.getNeighbours(i, j)
                // Nos quedamos con aquellas aún no reveladas. Necesario para limitar la recursión
                sideCells = sideCells.filter( box => !box.revealed)
                sideCells.forEach( cell => {
                    if(cell.is_mine){
                        box.nearby_mines++
                    }
                })
                // Recursion, si no hay minas cercanas
                if (box.nearby_mines == 0){
                    sideCells.forEach( cell  => this.revealBox(...cell.position))
                }
            }else{
                // Lost Game
                throw new GameOver()
            }
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
                    let sideCell = this.getBoxIn(i+di, j+dj)
                    sideCell.position = [i+di, j+dj]
                    cells.push(sideCell)
                }catch{
                    // console.log('Encontre un undefined!')
                    // omitir este error. Quizás sea buena idea definir una excepción personalizada "IndexOutOfRange"
                }
            }
        }
        return cells
    }

    gameCompleted(){
        let revealedBoxes = 0
        this.#board.forEach( row => row.forEach( box => {
            if (box.revealed){ revealedBoxes++ }
        }))
        return revealedBoxes + this.#totalMines == this.#rows*this.#cols
    }
}

function getRandomIntInclusive(min, max) {
    // Get a random number from [min; max]
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
