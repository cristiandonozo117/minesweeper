import { GameBoard } from "./game_board.js"
import { Render } from "./render.js"
import { RevealedMine, WrongFlags } from "./exceptions.js"

const container = document.getElementById('container')
// Nota: Probablemente no sea necesario reconocer los estados del juego
let diff
let configDiff
let gameBoard
let renderer
let time = 0
let timeCounterID
let state = 'PLAYING'

// Renderizar menú inicial
prepareMenu()
container.addEventListener('mousedown', event => {
    const target = event.target

    // SELECCIÓN DIFICULTAD
    if (target.classList.contains('btn-difficulty')){
        diff = target.dataset.level
        
        // Elimino los botones y creamos otras opciones
        document.getElementsByClassName('difficulty-selection').item(0).remove()
        headOptions()

        configDiff = getConfigDiffculty(diff)
        initializeGame(configDiff)
        timeCounterID = startTimeCounter()
        state = 'PLAYING'
    }

    // ACCIÓN DE JUEGO
    if (target.classList.contains('cell') && state == 'PLAYING'){
        const position = target.id.split('-').map(pos => parseInt(pos))
        try{
            const box = gameBoard.getBoxIn(...position)
            const click = event.button
            switch (click){
                case 0: // Click izq.
                    if (!box.revealed){
                        gameBoard.revealBox(...position)
                    }else{
                        gameBoard.revealNeighbours(...position)
                    }
                    renderer.showRevealedCells()
                    break
                case 2: // Click der.
                    gameBoard.switchFlagBoxIn(...position)
                    renderer.switchFlagCellIn(...position)
                    break
            }

            // Si se ha completado el juego
            if (gameBoard.gameCompleted()){
                state = 'GAMEOVER'
                stopTimeCounter(timeCounterID)
                alert(`Congratulations! You have finsihed the game! Time: ${time} seconds`)
            }
        }catch (exception){
            state = 'GAMEOVER'
            renderer.showAllMines(...position)
            if (exception instanceof RevealedMine){
                renderer.highlightMine(...position)
            }else if (exception instanceof WrongFlags){
                renderer.highlightNeighboringMines(...position)
            }
            stopTimeCounter(timeCounterID)
            alert(`${exception.message}. Time: ${time} seconds`)
        }
    }

    // REINICIO DE JUEGO
    if (target.classList.contains('btn-restart')){
        if (confirmRestart()){
            document.getElementById('tablero').remove()
            initializeGame(configDiff)
            stopTimeCounter(timeCounterID)
            timeCounterID = startTimeCounter()
            state = 'PLAYING'
        }
    }

    // CAMBIO DE DIFICULTAD
    if (target.classList.contains('btn-change-diff')){
        if (confirmRestart()){
            prepareMenu()
            stopTimeCounter(timeCounterID)
        }
    }
})

function prepareMenu(){
    container.innerHTML = `
        <div class="difficulty-selection">
            <h3>Select difficulty</h3>
            <button class="btn-difficulty" data-level="easy">Easy</button>
            <button class="btn-difficulty" data-level="medium">Medium</button>
            <button class="btn-difficulty" data-level="hard">Hard</button>
        </div>
    `
}

function getConfigDiffculty(diff){
    const config = {
        easy: {rows: 8, cols: 8, mines: 10},
        medium: {rows: 16, cols: 16, mines: 40},
        hard: {rows: 30, cols: 16, mines: 99}
    }  
    return config[diff]
}

function initializeGame(configDiff){
    gameBoard = new GameBoard(configDiff.rows, configDiff.cols)
    gameBoard.setRandomMines(configDiff.mines)
    // renderer = new Renderer(gameBoard, container)
    renderer = new Render(gameBoard)
    container.append(renderer.renderBoard())
}

function headOptions(){
    container.innerHTML = `
        <div class="head-options">
            <button class="btn-restart">Restart</button>
            <button class="btn-change-diff">Change difficulty</button>
            <p class="time-counter"></p>
        </div>
    `
}

function confirmRestart(){
    return window.confirm('Are you sure you want to restart to a new game?')
}

function startTimeCounter(){
    time = 0
    updateTimeCounterDisplayer()
    return setInterval(() => {
        time += 1
        updateTimeCounterDisplayer()
    }, 1000)
}

function stopTimeCounter(intervalID){
    clearInterval(intervalID)
}

function updateTimeCounterDisplayer(){
    const displayTimeCounter = document.getElementsByClassName("time-counter").item(0)
    // Muestro en formato: minutos:segundos
    let minutes = Math.floor(time/60)
    let seconds = time - minutes*60
    minutes = minutes < 10 ? `0${minutes}` : minutes
    seconds = seconds < 10 ? `0${seconds}` : seconds
    displayTimeCounter.innerText = `Time: ${minutes}:${seconds}`
}
