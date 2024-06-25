import * as PIXI from 'pixi.js';
import { Container } from "pixi.js";
import Taco from "./Taco";

export default class ManagerTaco extends Container {

    constructor(options) {
        super();

        this.name = 'taco_manager';
        this.game = options.game;
        this.tacoArr = [];

        this.createInterval = setInterval(() => {
            this.createTaco();
        }, 1100);
        this.initialization = true;
        // }, 900);

        // window.onblur = () => {
        //     this.removeInterval.bind(this);
        // }
    }

    createBomb() {
        this.bombTextures = [];

        for (let i = 1; i < 60; i++) {
            const texture = MyLoader.getResource(`bomb_${i}`).texture;
            bombTextures.push(texture);
        }
    }

    createTaco() {
        let randomRate = this.randomIntegerNumber(0, 100);
        let randomY = this.randomIntegerNumber(200 + this.game.shift, this.game.app.screen.height - 250 - this.game.shift);
        let index = randomRate < 60 ? 1 : randomRate < 90 ? 3 : 2;
        let taco;
        if (index !== 3) {
            taco = new Taco({
                resource: `coin_${index}`,
                widthTaco: index === 1 ? 130 : 200,
                bonus: index === 1 ? '+50' : '+250',
                // x: document.documentElement.clientWidth + 50,
                x: this.game.baseWidth + 50,
                y: randomY
            });
        } else {
            taco = new Taco({
                resource: 'bomb',
                widthTaco: 200,
                bonus: -50,
                // x: document.documentElement.clientWidth + 50,
                x: this.game.baseWidth + 50,
                y: randomY
            });
        }

        this.tacoArr.push(taco);
        this.addChild(taco);
        taco.moveTaco();
    }

    randomIntegerNumber(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    removeTacos() {
        for (let i = 0; i < this.tacoArr.length; i++) {
            this.tacoArr[i].destroy();
        }
    }

    stopTacos() {
        for (let i = 0; i < this.tacoArr.length; i++) {
            this.tacoArr[i].ticker.stop();
        }
        this.removeInterval.bind(this)();
    }
    
    removeInterval() {
        clearInterval(this.createInterval);
        this.initialization = false;
    }

    startTacos() {
        for (let i = 0; i < this.tacoArr.length; i++) {
            this.tacoArr[i].ticker.start();
        }
        if(!this.initialization) {
            this.createInterval = setInterval(() => {
                this.createTaco();
            }, 1100);
        }
    }
}