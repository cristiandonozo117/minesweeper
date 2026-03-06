export class Render{

    #gameBoard
    constructor(gameBoard){
        this.#gameBoard = gameBoard
    }

    // Renderizado de tablero
    renderBoard(){
        const board = document.createElement('div')
        let [rows, cols] = this.#gameBoard.getShape()
        board.className = 'board-game'
        board.style.gridTemplateRows = `repeat(${rows}, 1fr)`
        board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`
        let cell
        this.#gameBoard.board.forEach((row, i) => row.forEach((box, j) => {
            cell = document.createElement('div')
            cell.classList.add('cell')
            cell.id = `${i}-${j}` // Ej: 1-2
            cell.textContent = '-' // Hidden
            board.append(cell)
        }))
        // Para ignorar despliegue menú de contexto si se hace click izq.
        board.addEventListener('contextmenu', event => event.preventDefault())
        return board
    }

    showRevealedCells(){
        let cell
        this.#gameBoard.board.forEach((row, i) => row.forEach( (box, j) => {
            if (box.revealed){
                //console.log(box)
                cell = document.getElementById(`${i}-${j}`)
                cell.textContent = box.nearby_mines
                //console.log(`bombs-${box.nearby_mines}`)
                cell.classList.add(`bombs-${box.nearby_mines}`)
            }
        }))
    }

    switchFlagCellIn(i, j){
        const cell = document.getElementById(`${i}-${j}`)
        const box = this.#gameBoard.getBoxIn(i, j)
        // Si tiene bandera
        if (box.flag){
            cell.textContent = 'F'
        // Si no tiene bandera y aún no está revelada
        }else if (!box.flag && !box.revealed){
            cell.textContent = '-'
        }
    }

    // Muestra todas las minas del tablero y aquellas flags marcadas incorrectamente
    showAllMines(){
        this.#gameBoard.board.forEach((row, i) => row.forEach( (box, j) => {
            let cell = document.getElementById(`${i}-${j}`)
            if (box.is_mine && !box.flag){ // Mina revelada
                cell.textContent = 'B'
            }else if (box.flag && !box.is_mine){ // Banderas incorrectas
                cell.style.color = 'red'
            }
        }))
    }

    highlightMine(i, j){
        let cell = document.getElementById(`${i}-${j}`)
        cell.style.color = 'red'
    }

    highlightNeighboringMines(i, j){
        let sideCells = this.#gameBoard.getNeighbours(i, j)
        sideCells.forEach(box => {
            if (box.is_mine && !box.flag){
                this.highlightMine(...box.position)
            }
        })
    }
}