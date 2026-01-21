import { GameBoard } from "../app/game_board.js"

describe('Test Game Board', () => {
    test('Instancia', () => {
        expect(new GameBoard(8, 8)).toBeInstanceOf(GameBoard)
    });

    test('Shape', () => {
        const board = new GameBoard(8, 8)
        expect(board.getShape()).toEqual([8, 8])
    });

    // test('Tamaño del tablero', () => {
    //     const board = new GameBoard(8, 8)
    //     expect(board.board.length).toEqual(8*8)
    // })

    test('Tablero debe contener objetos del tipo Box', () =>{
        const board = new GameBoard(8, 8).board
        board.forEach( row => {
            expect(row).toEqual(
                expect.arrayOf(
                    expect.objectContaining({
                        is_mine: expect.any(Boolean),
                        revealed: expect.any(Boolean),
                        flag: expect.any(Boolean)
                    })
                )
            )
        })
    });
})