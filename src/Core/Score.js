import { Container, Sprite, Text } from "pixi.js";
import MyLoader from "./MyLoader";

export default class Score extends Container {

    constructor() {
        super();

        this.name = 'score';
        this.widthTaco = 115;
        this.creteScore();
    }

    creteScore() {
        this.scoreIcon = new Sprite(MyLoader.getResource('coin_icon').texture);
        const k = this.widthTaco / this.scoreIcon.width;
        this.scoreIcon.width = this.widthTaco;
        this.scoreIcon.height = this.scoreIcon.height * k;
        // this.scoreIcon.rotation = -0.4;
        // this.scoreIcon.y = 20;
        this.addChild(this.scoreIcon);

        this.scoreLabel = new Text('0', {
            fill: 0xffffff,
            fontSize: 100,
            fontFamily: 'LuckiestGuy'
        });
        this.scoreLabel.x = this.scoreIcon.width + 15;
        // this.scoreLabel.y = (this.scoreIcon.getBounds().height - this.scoreLabel.getBounds().height);
        // this.scoreLabel.y = 20;
        this.addChild(this.scoreLabel);
    }

    counterScore(amount) {
        this.scoreLabel.text = amount;
    }
}