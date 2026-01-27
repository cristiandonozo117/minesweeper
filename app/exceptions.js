
export class GameOver extends Error {
    constructor(message = 'Game Over'){
        super(message)
        this.name = 'GameOver'
    }
}