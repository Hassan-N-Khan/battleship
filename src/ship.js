export class Ship {
    constructor(length) {
        this.length = length;
        this.hits = 0;
    }

    getLength() {
        return this.length;
    }

    hit() {
        this.hits++;
    }

    isSunk() {
        console.log(`${this.ship} has been hit ${this.hits} times.`);
        return this.hits >= this.length;
    }
}
 