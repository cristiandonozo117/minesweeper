
// const STATES
export class Box {

    constructor(is_mine){
        this.is_mine = is_mine
        this.revealed = false
        this.flag = false
        //this.nearby_mines = 0
    }

    reveal() {
        if (!this.flag){
            this.revealed = true
        }
    }

    switch_flag() {
        if (!this.revealed){
            this.flag = !this.flag
        }
    }
}

// const my_box = new Box(true)
// console.log(my_box)
// my_box.reveal()
// my_box.switch_flag()
// console.log(my_box)

