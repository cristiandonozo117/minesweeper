import { Box } from "../app/box.js"

describe('Test Clase Box (Celda/Casilla)', () => {
    test('Instancia', () => {
        const box = new Box(true)
        expect(box).toBeInstanceOf(Box)
    });
    
    test('Lectura atributos', () => {
        const box = new Box(true)
        expect(box.is_mine).toBeTruthy()
        expect(box.revealed).toBeFalsy()
        expect(box.flag).toBeFalsy()
    });

    test('Revelar celda', () => {
        const box = new Box(true)
        box.reveal()
        expect(box.revealed).toBeTruthy()
    });

    test('Cambiar bandera', () => {
        const box = new Box(true)
        expect(box.flag).toBeFalsy()
        box.switch_flag()
        expect(box.flag).toBeTruthy()
        box.switch_flag()
        expect(box.flag).toBeFalsy()
    });

    test('Intento de revelar celda con bandera colocada', () => {
        const box = new Box(true)
        box.switch_flag()
        box.reveal()
        expect(box.revealed).not.toBeTruthy()
    });

    test('Intento de colocar bandera con celda ya revelada', () => {
        const box = new Box(true)
        box.reveal()
        box.switch_flag()
        expect(box.flag).not.toBeTruthy()
    });
})
