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
    getHits() {
        return this.hits;
    }
    isSunk() {
        return this.hits >= this.length;
    }
}
 