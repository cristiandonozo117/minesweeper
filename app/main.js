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
let bestTime
let state = 'PLAYING'

// Renderizar menú inicial
container.innerHTML = prepareMenu()
container.addEventListener('mousedown', event => {
    const target = event.target

    // SELECCIÓN DIFICULTAD -> Prepara y muestra tablero, opciones y estadísticas
    if (target.classList.contains('btn-difficulty')){
        diff = target.dataset.level
        bestTime = getBestScoreTimeByDiff(diff)
        
        // Elimino los botones y creamos otras opciones
        document.getElementsByClassName('difficulty-selection').item(0).remove()
        
        configDiff = getConfigDiffculty(diff)
        container.innerHTML += headOptions()
        container.append(initializeGame(configDiff))
        timeCounterID = startTimeCounter()
        state = 'PLAYING'

        // Establezco dos columnas y una fila
        // container.style.gridTemplateColumns = 'auto 30%'
        // container.style.gridTemplateColumns = 'min-content 1fr'
        container.style.gridTemplateColumns = 'minmax(0, 1fr) 20vw'
        container.style.gridTemplateRows = '1fr'
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
                stopTimeCounter(timeCounterID)
                renderer.showRemainingMinesAsFlags()
                state = 'GAMEOVER'
                let successMsg = `You have finished the game! Time: ${time} seconds.`

                if (bestTime == null || time < parseInt(bestTime)){
                    saveBestScoreTimeByDiff(diff, time)
                    successMsg += ' New Record!'
                }
                alert(successMsg)
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
            bestTime = getBestScoreTimeByDiff(diff)
            // Eliminamos y volvemos a crear el tablero
            document.getElementsByClassName('board-game').item(0).remove()
            container.append(initializeGame(configDiff))
            stopTimeCounter(timeCounterID)
            timeCounterID = startTimeCounter()
            state = 'PLAYING'
        }
    }

    // CAMBIO DE DIFICULTAD
    if (target.classList.contains('btn-change-diff')){
        if (confirmRestart()){
            stopTimeCounter(timeCounterID)
            container.innerHTML = prepareMenu()
            container.style.gridTemplateColumns = '1fr' // Vuelvo a establecer una fila
        }
    }
})

function prepareMenu(){
    // container.innerHTML = 
    return `
        <div class="difficulty-selection">
            <h3>Select difficulty</h3>
            <button class="btn-difficulty" data-level="easy">
                Easy <br>
                8x8 - 10 mines
            </button>
            <button class="btn-difficulty" data-level="medium">
                Medium <br>
                16x16 - 40 mines
            </button>
            <button class="btn-difficulty" data-level="hard">
                Hard <br>
                30x16 - 99 mines
            </button>
        </div>
    `
}

function getConfigDiffculty(diff){
    const config = {
        easy: {rows: 8, cols: 8, mines: 10},
        medium: {rows: 16, cols: 16, mines: 40},
        hard: {rows: 16, cols: 30, mines: 99}
    }  
    return config[diff]
}

function initializeGame(configDiff){
    gameBoard = new GameBoard(configDiff.rows, configDiff.cols)
    gameBoard.setRandomMines(configDiff.mines)
    renderer = new Render(gameBoard)
    return renderer.renderBoard()
}

function headOptions(){
    return `
        <div class="head-options">
            <button class="btn-restart">Restart</button>
            <button class="btn-change-diff">Change difficulty</button>
            <p class="best-time">Best time score (${diff} level): 
                ${bestTime ? formatTime(parseInt(bestTime)) : 'None'}
            </p>
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
    displayTimeCounter.innerText = 'Time: ' + formatTime(time)
}

function getBestScoreTimeByDiff(diff){
    return localStorage.getItem(`minesweeper-best-score-time-${diff}`)
}

function saveBestScoreTimeByDiff(diff, time){
    return localStorage.setItem(`minesweeper-best-score-time-${diff}`, time)
}

// Get time in the format mm:ss
function formatTime(time){
    let minutes = Math.floor(time/60)
    let seconds = time - minutes*60
    minutes = minutes < 10 ? `0${minutes}` : minutes
    seconds = seconds < 10 ? `0${seconds}` : seconds
    return `${minutes}:${seconds}`
}