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
        const gameBoard = new GameBoard(8, 8).board
        expect(gameBoard.length).toBe(8)
        gameBoard.forEach(row => expect(row.length).toBe(8))
    });

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

    test('Obtener celda en una posición específica', () => {
        const gameBoard = new GameBoard(5, 5)
        expect(gameBoard.getBoxIn(0, 0)).toBeInstanceOf(Box)
        expect(() => gameBoard.getBoxIn(-1, -1).toThrow(Error))
    })

    test('Setear una mina en una posición específica', () => {
        const gameBoard = new GameBoard(8, 8)
        gameBoard.setMineIn(1, 1)
        expect(gameBoard.board[1][1].is_mine).toBeTruthy()
    });

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
    });

    test('Error si el número total de minas aleatorias no es válido', () => {
        const gameBoard = new GameBoard(8, 8)
        totalMines = 8*8 + 1
        expect(() => gameBoard.setRandomMines(totalMines)).toThrow(Error);
    });

    test('Obtener vecinos', () => {
        const gameBoard = new GameBoard(5, 5)
        const neighbours = gameBoard.getNeighbours(2, 2)
        // Deben ser Array con objetos Box
        expect(neighbours).toEqual(expect.arrayOf(expect.any(Box)))
        expect(neighbours.length).toBe(8)
        // Una celda en un borde debe tener 5 vecinos
        expect(gameBoard.getNeighbours(2,0).length).toBe(5)
        // Una celda en una esquina debe tener 3 vecinos
        expect(gameBoard.getNeighbours(0,0).length).toBe(3)
        // Excepción indice fuera de rango
        expect(() => expect(gameBoard.getNeighbours(-1,-1))).toThrow(Error)
    });

    describe('Reveal Box feat', () => {
        test('Revelar casilla: Sin minas. Debe revelarse el tablero completo', () => {
            const gameBoard = new GameBoard(5, 5)
            gameBoard.revealBox(0, 0)
            // Todas las casillas deben haber sido reveladas
            gameBoard.board.forEach( row => {
                row.forEach( box => {
                    expect(box.revealed).toBeTruthy()
                })
            })
        });

        test('Revelar casilla: 1 mina. Vecinos no deben revelarse y en total haber solo una casilla revelada', () => {
            const minePosition = [2,2]
            const boxToReveal = [minePosition[0]+1, minePosition[1]+1]
            const gameBoard = new GameBoard(5, 5)
            gameBoard.setMineIn(...minePosition)
            gameBoard.revealBox(...boxToReveal)
            expect(gameBoard.getBoxIn(...boxToReveal).revealed).toBeTruthy()
            // Sus vecinos no deben haber sido revelados puesto que hay una mina en ellos
            const neighbours = gameBoard.getNeighbours(...boxToReveal)
            neighbours.forEach(box => expect(box.revealed).toBeFalsy())
            // Solo debe haber una casilla revelada en toda la matriz
            const board = gameBoard.board
            let revealedMines = 0
            board.forEach(row => row.forEach( box => {
                if (box.revealed){
                    revealedMines++
                }
            }))
            expect(revealedMines).toBe(1)
        });

        test('Revelar casilla: 1 mina. Caso recursion', () => {
            const gameBoard = new GameBoard(5, 5)
            const minePosition = [0, 0]
            gameBoard.setMineIn(...minePosition)
            gameBoard.revealBox(4, 4)
            // Deben haberse revelado todas las casillas en cascada, exceptuando la única mina
            expect(gameBoard.getBoxIn(...minePosition).revealed).toBeFalsy()
            const board = gameBoard.board
            board.forEach( row => row.forEach(box => expect(box.revealed).toBeTruthy))
        });

        test('Revelar casilla fuera de rango', () => {
            const gameBoard = new GameBoard(5, 5)
            expect(() => gameBoard.revealBox(-1, -1)).toThrow(Error)
        });

        test('Revelar casilla con minal. Juego perdido', () => {
            const gameBoard = new GameBoard(5, 5)
            gameBoard.setMineIn(0,0)
            expect(() => gameBoard.revealBox(0,0)).toThrow('Lost Game')
        })
    });
})