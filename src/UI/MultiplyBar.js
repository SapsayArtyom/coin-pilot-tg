import { Container, Text } from "pixi.js";

export default class MultiplyBar extends Container {

    constructor() {
        super();

        this.name = 'multiplyBar';
        this.value = 1;
        this.creteBar();
    }

    creteBar() {
        this.multiplyLabel = new Text(`X${this.value}`, {
            fill: 0xffffff,
            fontSize: 80,
            fontWeight: 'bold',
            fontFamily: 'LuckiestGuy'
        });

        this.addChild(this.multiplyLabel);
    }

    amountMultiply(value) {
        value > 0 ? this.increaseMultiply() : this.reloadMultiply()
    }

    increaseMultiply() {
        this.value += 1;
        if (this.value >= 11) this.value = 1;
        this.multiplyLabel.text = `X${this.value}`;
    }

    reloadMultiply() {
        this.value = 1;
        this.multiplyLabel.text = `X${this.value}`;
    }
}
