import { GameOver } from "./exceptions.js";
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
        if (event.target.id.match(/^[0-9]{1}-[0-9]{1}$/)){
            try{
                const position = event.target.id.split('-').map(pos => parseInt(pos))
                
                let click = event.button
                switch (click){
                    case 0: // Click izq.
                        gameBoard.revealBox(...position)
                        break
                    case 2: // Click der.
                        gameBoard.switchFlagBoxIn(...position)
                        render.switchFlagCellIn(...position)
                        break
                }

                //console.log(gameBoard.getBoxIn(...position))
                render.updateBoard()

                // Si se ha completado el juego
                if (gameBoard.gameCompleted()){
                    alert('Congratulations! You finished the game!')
                }

            }catch (exception){
                if (exception instanceof GameOver){
                    alert(exception.message)
                }
            }
        }
    })

    // Ignorar despliegue menu de contexto
    table.addEventListener('contextmenu', (event) => {
        event.preventDefault()
    })
})
