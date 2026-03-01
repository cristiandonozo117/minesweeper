import { RevealedMine, WrongFlags } from "./exceptions.js";
import { GameBoard } from "./game_board.js";
import { Render } from "./render.js";

const container = document.querySelector('.container')
const gameContainer = document.createElement('div')
const startButton = document.createElement('button')
startButton.textContent = 'Start Game'
startButton.className = 'btn-start-game'
container.append(startButton)
container.append(gameContainer)

startButton.addEventListener('click', () => {
    // Preguntar si esta seguro de reinicar el juego...
    // ...
    startButton.textContent = 'Restart Game'
    if (gameContainer.hasChildNodes()){
        gameContainer.replaceChildren()
    }
    // Se crea el tablero
    const gameBoard = new GameBoard(8, 8)
    gameBoard.setRandomMines(10)
    // Renderizador
    const render = new Render(gameBoard)
    const table = render.renderBoard()
    gameContainer.appendChild(table)

    // Eventos del juego...
    table.addEventListener('mousedown', (event) => {
        event.preventDefault();
        // Si el id del elemento es justamente identificación de celda
        if (event.target.id.match(/^[0-9]+-[0-9]+$/)){
            const position = event.target.id.split('-').map(pos => parseInt(pos))
            try{
                const box = gameBoard.getBoxIn(...position)
                
                let click = event.button
                switch (click){
                    case 0: // Click izq.
                        if (!box.revealed){
                            gameBoard.revealBox(...position)
                        }else{
                            gameBoard.revealNeighbours(...position)
                        }
                        render.showRevealedCells()
                        break
                    case 2: // Click der.
                        gameBoard.switchFlagBoxIn(...position)
                        render.switchFlagCellIn(...position)
                        break
                }


                // Si se ha completado el juego
                if (gameBoard.gameCompleted()){
                    alert('Congratulations! You finished the game!')
                }

            }catch (exception){
                render.showAllMines(...position)
                if (exception instanceof RevealedMine){
                    render.highlightMine(...position)
                }else if (exception instanceof WrongFlags){
                    render.highlightNeigboringMines(...position)
                }
                alert(exception.message)
            }
        }
    })

    // Ignorar despliegue menu de contexto
    table.addEventListener('contextmenu', (event) => {
        event.preventDefault()
    })
})
