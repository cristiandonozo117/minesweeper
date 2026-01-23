import { GameBoard } from "../app/game_board.js"
import { Box } from "../app/box.js"

describe('Test Game Board', () => {
    test('Instancia', () => {
        expect(new GameBoard(8, 8)).toBeInstanceOf(GameBoard)
    });

    // test('Shape', () => {
    //     const board = new GameBoard(8, 8)
    //     expect(board.getShape()).toEqual([8, 8])
    // });

    test('Shape Board', () => {
        const board = new GameBoard(8, 8).board
        expect(board.length).toBe(8)
        board.forEach(row => expect(row.length).toBe(8))
    })

    test('El Tablero debe ser un Array, que debe contener Arrays de objetos del tipo Box', () => {
        const board = new GameBoard(8, 8).board
        expect(board).toBeInstanceOf(Array)
        expect(board).toEqual(expect.arrayOf(expect.any(Array)))
        board.forEach( row => {
            expect(row).toEqual(
                expect.arrayOf(expect.any(Box))
            )
        })
    });

    test('Setear una mina en una posición específica', () => {
        const gameBoard = new GameBoard(8, 8)
        gameBoard.setMineIn(1, 1)
        expect(gameBoard.board[1][1].is_mine).toBeTruthy()
    })

    test('El Tablero debe contener el número determinado de minas', () => {
        let totalMines = 20
        let mines = 0
        const gameBoard = new GameBoard(8,8)
        const board = gameBoard.board
        gameBoard.setRandomMines(totalMines)
        expect(gameBoard.totalMines).toBe(totalMines) // Test atributo
        // Test de conteo manual
        board.forEach( row => {
            row.forEach( box => {
                if (box.is_mine){
                    mines++
                }
            })
        })
        expect(mines).toBe(totalMines)
    })

    test('Error si el número total de minas aleatorias no es válido', () => {
        const gameBoard = new GameBoard(8, 8)
        totalMines = 8*8 + 1
        expect(() => gameBoard.setRandomMines(totalMines)).toThrow(Error);
    })

    // test('Revelar casilla', () => {
    //     const gameBoard = new GameBoard(5, 5, 1)
    //     const board = gameBoard.board
    //     const minePosition = board.find( row => row.find( box => box.is_mine ))
    //     console.log(minePosition)
    //     const i = board.findIndex( row => row.find( box => box.is_mine ))
    //     const j = board[j].findIndex( box => box.is_mine)
    //     // Testear excepción de juego perdido
    // })
})