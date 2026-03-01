
export class GameOver extends Error {
    constructor(message = 'Game Over'){
        super(message)
        this.name = 'GameOver'
    }
}

export class RevealedMine extends GameOver{
    constructor(){
        super()
        this.message += '. That was a mine!'
        this.name = 'RevealedMine'
    }
}

export class WrongFlags extends GameOver{
    constructor(){
        super()
        this.message += '. Wrong marked flags!'
        this.name = 'WrongFlags'
    }
}