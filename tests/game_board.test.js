import { GameBoard } from "../app/game_board.js"
import { Box } from "../app/box.js"
import { GameOver } from "../app/exceptions.js";

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

    test('Colocar bandera en una celda', () => {
        const gameBoard = new GameBoard(5, 5)
        const box = gameBoard.getBoxIn(2, 2)
        // Colocamos bandera
        gameBoard.switchFlagBoxIn(2, 2)
        expect(box.flag).toBeTruthy()
        // Quitamos bandera
        gameBoard.switchFlagBoxIn(2, 2)
        expect(box.flag).toBeFalsy()
    })

    test('Intento colocar bandera en celda revelada', () => {
        const gameBoard = new GameBoard(5, 5)
        const box = gameBoard.getBoxIn(2, 2)
        gameBoard.revealBox(2, 2)
        expect(box.flag).toBeFalsy()
        gameBoard.switchFlagBoxIn(2, 2)
        expect(box.flag).toBeFalsy() // Debe seguir sin tener bandera
    })

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
            expect(gameBoard.getBoxIn(...boxToReveal).revealed).toBeFalsy()
            gameBoard.revealBox(...boxToReveal)
            expect(gameBoard.getBoxIn(...boxToReveal).revealed).toBeTruthy()
            expect(gameBoard.getBoxIn(...boxToReveal).nearby_mines).toBe(1)
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

        test('Revelar casilla: 2 minas', () => {
            const gameBoard = new GameBoard(5, 5)
            gameBoard.setMineIn(1,1)
            gameBoard.setMineIn(1,2)
            gameBoard.revealBox(2,1)
            const boxRevealed = gameBoard.getBoxIn(2,1)
            expect(boxRevealed.revealed).toBeTruthy()
            //boxRevealed.nearby_mines += 1
            //console.log(boxRevealed.nearby_mines)
            expect(boxRevealed.nearby_mines).toBe(2)
        })

        test('Revelar casilla: 2 minas. Caso recursión: Verificación de número de minas cercanas de vecinos', () => {
            const gameBoard = new GameBoard(5, 5)
            gameBoard.setMineIn(0,2)
            gameBoard.setMineIn(0,3)
            gameBoard.revealBox(4,0)
            // Verificamos si las casillas vecinas liberadas por recursión de las minas indican número correcto de minas cercanas
            // Vecinos liberados de mina [0,2]
            expect(gameBoard.getBoxIn(0,1).nearby_mines).toBe(1)
            expect(gameBoard.getBoxIn(1,1).nearby_mines).toBe(1)
            expect(gameBoard.getBoxIn(1,2).nearby_mines).toBe(2)
            expect(gameBoard.getBoxIn(1,3).nearby_mines).toBe(2)
            // Vecinos liberados de mina [0,3]
            expect(gameBoard.getBoxIn(1,2).nearby_mines).toBe(2)
            expect(gameBoard.getBoxIn(1,3).nearby_mines).toBe(2)
            expect(gameBoard.getBoxIn(1,4).nearby_mines).toBe(1)
        })


        test('Revelar casilla fuera de rango', () => {
            const gameBoard = new GameBoard(5, 5)
            expect(() => gameBoard.revealBox(-1, -1)).toThrow(Error)
        });

        test('Revelar casilla con mina. Juego perdido', () => {
            const gameBoard = new GameBoard(5, 5)
            gameBoard.setMineIn(0,0)
            expect(() => gameBoard.revealBox(0,0)).toThrow(GameOver)
        });

        test('Revelar casilla. Debe completarse el juego', () => {
            const gameBoard = new GameBoard(5, 5)
            gameBoard.setMineIn(0,0)
            gameBoard.setMineIn(0,1)
             expect(gameBoard.gameCompleted()).toBeFalsy()
            gameBoard.revealBox(4,4)
            expect(gameBoard.gameCompleted()).toBeTruthy()
        });
    });

    describe('Banderas vecinas marcadas: Efecto en revelar vecinos', () => {
        test('Ninguna bandera', () => {
            const gameBoard = new GameBoard(5, 5)
            gameBoard.setMineIn(2, 2)
            // Revelamos una al costado
            gameBoard.revealBox(2, 3)
            // Ahora intentamos revelar sus vecinos, al no haber flag, no debe cambiar nada
            gameBoard.revealNeighbours(2, 3)
            // Revisamos todos sus vecinos, no deben haberse revelado
            gameBoard.getNeighbours(2, 3).forEach(sideCell => {
                expect(sideCell.revealed).toBeFalsy()
            })
        });

        // Revelar todos los vecinos!
        test('Banderas correctas', () => {
            const gameBoard = new GameBoard(5, 5)
            // Dos bombas
            gameBoard.setMineIn(2, 2)
            gameBoard.setMineIn(2, 3)
            // Revelamos una cercana
            gameBoard.revealBox(1, 2)
            // Marcamos banderas en la minas
            gameBoard.switchFlagBoxIn(2, 2)
            gameBoard.switchFlagBoxIn(2, 3)
            // Revelamos los vecinos de la ya revelada
            gameBoard.revealNeighbours(1, 2)
            gameBoard.getNeighbours(1, 2).forEach(sideCell => {
                // Si es mina, no debe haberse revelado, 
                if (sideCell.flag){
                    expect(sideCell.revealed).toBeFalsy()
                }else{  // si no lo es, sí
                    expect(sideCell.revealed).toBeTruthy()
                }
            })
        });

        test('Banderas incorrectas. Game Over', () => {
            const gameBoard = new GameBoard(5, 5)
            gameBoard.setMineIn(2, 2)
            // Revelamos un vecino de la mina
            gameBoard.revealBox(1, 2)
            // Marcamos bandera en una celda que no es mina
            gameBoard.switchFlagBoxIn(2, 3)
            // Al intentar revelar los vecinos, debe lanzarse excepción de GameOver
            expect(() => gameBoard.revealNeighbours(1, 2)).toThrow(GameOver)
        });

        test('Número faltante de banderas. Sin efecto', () => {
            const gameBoard = new GameBoard(5, 5)
            // Colocamos dos minas
            gameBoard.setMineIn(2, 2)
            gameBoard.setMineIn(2, 3)
            // Revelamos una
            gameBoard.revealBox(1, 2)
            // Marcamos una sola bandera
            gameBoard.switchFlagBoxIn(2, 2)
            // Revelamos vecinos de la ya revelada
            gameBoard.revealNeighbours(1, 2)
            gameBoard.getNeighbours(1, 2).forEach(sideCell => {
                // Puesto que faltan más banderas, ningun vecino debe haber sido revelado
                expect(sideCell.revealed).toBeFalsy()
            }) 
        });

        test('Número sobrante de banderas. Sin efecto', () => {
            const gameBoard = new GameBoard(5, 5)
            // Colocamos dos minas
            gameBoard.setMineIn(2, 2)
            gameBoard.setMineIn(2, 3)
            // Revelamos una
            gameBoard.revealBox(1, 2)
            // Marcamos más banderas
            gameBoard.switchFlagBoxIn(2, 2)
            gameBoard.switchFlagBoxIn(2, 3)
            gameBoard.switchFlagBoxIn(1, 3)
            // Revelamos vecinos de la ya revelada
            gameBoard.revealNeighbours(1, 2)
            gameBoard.getNeighbours(1, 2).forEach(sideCell => {
                // Puesto que sobran banderas, ningun vecino debe haber sido revelado
                expect(sideCell.revealed).toBeFalsy()
            }) 
        })
    })
})