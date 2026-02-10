export class Render{

    #gameBoard
    constructor(gameBoard){
        this.#gameBoard = gameBoard
    }

    renderBoard(){
        // Renderizado del tablero
        const table = document.createElement('table')
        table.id = 'tablero'
        table.className = 'table'
        let line, cell
        this.#gameBoard.board.forEach((row, i) => {
            line = document.createElement('tr')
            row.forEach((box, j) => {
                cell = document.createElement('td')
                cell.id = `${i}-${j}` // Ej: 1-2
                cell.textContent = '-' // Hidden
                line.append(cell)

                // if (box.is_mine){
                //     cell.textContent = 'B'
                // }
            })
            table.append(line)
        })
        return table
    }

    updateBoard(){
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

}