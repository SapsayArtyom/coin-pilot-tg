import * as PIXI from 'pixi.js';
import { Container, Graphics, Text, Ticker } from "pixi.js";
import MyLoader from './MyLoader';
import ManagerTaco from './ManagerTaco';
import Score from './Score';
import StartScreen from '../UI/StartScreen';
import Pilot from '../elements/Pilot';
import MultiplyBar from '../UI/MultiplyBar';
import TweenMax from 'gsap';
import SoundManager from '../UI/SoundManager';
import sound from 'pixi-sound';
import Timer from '../elements/Timer';

export default class MainScene extends Container {

    constructor(option) {
        super();

        this.game = option.game;
        this.ticker = new Ticker();
        this.mainContainer = option.container;
        // this.scaleScene = option.scaleScene;

        this.startGame = false;
        this.player;
        this.managerTaco;
        this.rotRate = 0.01;
        this.totalBonus = 0;
        this.downRate = 0.02;
        // this.downRate = 0.01;
        this.upRatePilot = 50;
        // this.upRatePilot = 50;

        this.time = -2;
        this.timeMinute = 0;
        this.countdownMinute = 0;
        this.countdownSec = 0;

        this.soundNow = '';
        this.username = this.game.nickName || `Player${Math.ceil(Math.random() * 1000)}`;

        this.addSpecification();
    }

    addSpecification() {
        this.createBackground();
        this.createPlayer();
        this.createStartButton();
    }

    createBackground() {
        const bg = new PIXI.Sprite(MyLoader.getResource('bg').texture);
        bg.name = 'background';
        bg.width = this.game.app.screen.width;
        bg.height = this.game.app.screen.height;
        this.mainContainer.addChild(bg);

        const tileCloud = new PIXI.TilingSprite(MyLoader.getResource('clouds_bottom').texture, this.game.app.screen.width, 600);
        tileCloud.position.y = this.game.app.screen.height - tileCloud.height - this.game.shift;
        this.mainContainer.addChild(tileCloud);

        // this.ground = new PIXI.TilingSprite(MyLoader.getResource('ground').texture, this.game.app.screen.width, 140);
        this.ground = new PIXI.TilingSprite(MyLoader.getResource('ground').texture, this.game.app.screen.width, 130);
        this.ground.name = 'ground';
        this.ground.position.x = this.game.app.screen.width / 2;
        this.ground.position.y = this.game.baseHeight - this.ground.height  - this.game.shift + 3;
        this.ground.anchor.set(0.5, 0);
        this.ground.tileScale.set(0.5, 0.5);
        this.mainContainer.addChild(this.ground);

        this.ticker.add(()=>{
            tileCloud.tilePosition.x -= 7 * this.ticker.deltaTime; 
            this.ground.tilePosition.x -= 7.5 * this.ticker.deltaTime; 
        });
    }

    createStartButton() {
        const tintCont = new Container();
        tintCont.interactive = true;

        const graph = new Graphics();
        graph.beginFill(0x000000, 0.2);
        graph.drawRect(0, 0, this.game.app.screen.width, this.game.app.screen.height);
        tintCont.addChild(graph);

        this.startScreen = new StartScreen({
            game: this.game,
        });
        tintCont.addChild(this.startScreen);
        this.startScreen.emitter.on('countdown', () => {
            
            this.username = this.startScreen.valueInputName;
            tintCont.interactive = false;
            this.ticker.start();
            this.createScore();
            this.createSoundIcon();
            this.createMultiplyBar();
            // this.createTimer();
            this.startScreen.hideInput();
            tintCont.destroy();
            this.startPlayer();
            setTimeout(()=>{
                this.createTaco();
                this.playGame();
                this.startGame = true;
            }, 2000);
        });
        tintCont.x = -(tintCont.width - this.game.app.screen.width) / 2;
        this.mainContainer.addChild(tintCont);
    }
    
    startPlayer() {

        sound.play('propeller_start', {complete: ()=>{
            sound.play('propeller_idle', {loop: true, volume: 0.75});
            this.soundNow = 'propeller_idle';
        }});
        this.soundNow = 'propeller_start';
        this.player.position.set(-this.player.width, this.game.app.screen.height/ 2);
        TweenMax.to(this.player, 1, {
            x: 15,
            onComplete: ()=>{
                this.graph.position.set(this.player.position.x, this.player.position.y);
            }
        });
    }

    createSoundIcon() {
        this.sound = new SoundManager({
            flag: this.startScreen.soundFlag
        });
        this.sound.position.set(20, this.game.shift + 20);
        this.mainContainer.addChild(this.sound);
    }

    createScore() {
        this.score = new Score();
        this.score.y = this.game.shift + 20;
        this.score.x = this.game.app.screen.width - this.score.width - 50;
        this.mainContainer.addChild(this.score);
    }

    createMultiplyBar() {
        this.multiplyBar = new MultiplyBar();
        this.multiplyBar.x = this.game.app.screen.width - this.multiplyBar.width - 50;
        this.multiplyBar.y = this.score.getBounds().bottom;
        this.mainContainer.addChild(this.multiplyBar);
    }

    createTimer() {
        this.timer = new Timer({
            deadlineAt: this.game.deadlineAt,
        });
        this.timer.x = (this.game.app.screen.width - this.timer.width) / 2;
        this.timer.y = this.game.shift + 130;
        this.mainContainer.addChild(this.timer);
        this.timer.createTimer();
    }

    createPlayer() {
        this.player = new Pilot();
        this.player.position.set(-this.player.width, this.game.app.screen.height/ 2);
        this.mainContainer.addChild(this.player);
        this.graph = new Graphics();
        // this.graph.beginFill(0xff00ff, 0.4);
        this.graph.beginFill(0x16b3f2, 0.0000001);
        this.graph.drawRect(20, 30, this.player.pilot.getBounds().width - 60, this.player.pilot.getBounds().height - 50);
        this.graph.position.set(this.player.position.x, this.player.position.y);
        this.mainContainer.addChild(this.graph);
        this.upRate = 0;
        this.mainContainer.interactive = true;
        this.mainContainer.on('pointerdown', ()=>{
            this.upRate = this.upRatePilot;
            // this.rotRate = -0.25;
            this.rotRate = -0.35;
            this.downRate = 0.02;
            // this.downRate = 0.01;
        });

        // this.widthPilotExplosion = 150;
        this.pilotTextures = [];

        for (let i = 1; i < 6; i++) {
            const val = i < 10 ? `0${i}` : i;
            const texture = MyLoader.getResource(`explosion_pilot_${val}`).texture;
            this.pilotTextures.push(texture);
        }
    }

    showPlayer() {
        this.player.position.set(-this.player.width, this.game.app.screen.height/ 2);
        this.player.showPilot();
        sound.play('propeller_start', {complete: ()=>{
            sound.play('propeller_idle', {loop: true, volume: 0.75});
            this.soundNow = 'propeller_idle';
        }});
        this.soundNow = 'propeller_start';
        TweenMax.to(this.player, 1, {
            x: 15,
            onComplete: ()=>{
                this.graph.position.set(this.player.position.x, this.player.position.y);
                this.ticker.start();
            }
        });
    }

    restartPlayer() {
        this.rotRate = 0.01;
        this.downRate = 0.02;
        // this.downRate = 0.01;
        this.upRate = 0;
        this.player.rotation = this.rotRate;
        this.graph.rotation = this.rotRate;
    }

    createTaco() {
        this.managerTaco = new ManagerTaco({
            game: this.game
        });
        this.managerTaco.position.set(0, 0);
        this.mainContainer.addChild(this.managerTaco);

        // window.onblur = () => {
        //     trace('this.game.app ::', this.game.app)
        //     if(this.game.app) {
        //         sound.stop('propeller_idle');
        //         this.game.app.ticker.stop();
        //         this.ticker.stop();
        //         this.managerTaco.stopTacos();
        //     }
        // }
        // window.onfocus = () => {
        //     if(this.game.app) {
        //         sound.play('propeller_idle', { loop: true });
        //         this.game.app.ticker.start();
        //         this.ticker.start();
        //         this.managerTaco.startTacos();
        //     }
        // }
    }

    playGame() {
        this.ticker.add(()=>{
            if(this.upRate > 0) {
                this.moveUp();
            } else {
                this.moveDown();
            }
            this.checkCrashPlayer();
            this.checkCollision();
        });
    }

    moveUp() {
        this.rotRate += 0.02 * this.ticker.deltaTime;  
        this.player.position.y -= 6.5 * this.ticker.deltaTime;
        this.graph.position.y -= 6.5 * this.ticker.deltaTime;
        // this.player.position.y -= 3.5;
        // this.graph.position.y -= 3.5;
        this.upRate -= 3.5 * this.ticker.deltaTime;
        this.player.rotation = this.rotRate;
        this.graph.rotation = this.rotRate;
    }

    moveDown() {
        this.rotRate += 0.02 * this.ticker.deltaTime;
        this.downRate += 0.1 * this.ticker.deltaTime;
        this.player.position.y += (4.5 + this.downRate) * this.ticker.deltaTime;
        this.graph.position.y += (4.5 + this.downRate) * this.ticker.deltaTime;
        if( this.rotRate <= 0.5) {
            this.player.rotation = this.rotRate;
            this.graph.rotation = this.rotRate;
        } else {
            this.player.rotation = 0.5;
            this.graph.rotation = 0.5;
        }
    }

    async checkCrashPlayer() {
        if(this.player.position.y + this.player.getBounds().height > this.game.baseHeight + 210 - this.game.shift) {
        // if(this.player.position.y + this.player.height > this.game.height - this.ground.height/8) {
            this.ticker.stop();
            this.showBonusCrash();
            await this.player.pilotCrash();
            this.restartPlayer();
            this.showPlayer();
            this.multiplyBar.reloadMultiply();
            this.totalBonus += -500;
            this.updateCounter(this.totalBonus);
        } 
    }

    showBonusCrash() {
        const labelBonus = new Text(`-500`, {
            fill:  0xff0000,
            fontSize: 100,
            // fontSize: 38,
            fontWeight: 'bold',
            fontFamily: 'LuckiestGuy'
        });
        labelBonus.rotation = -0.2;
        labelBonus.position.set(this.player.position.x, this.player.position.y);
        this.mainContainer.addChild(labelBonus);
        TweenMax.to(labelBonus, .2, {
            y: this.player.position.y - 65,
            onComplete: () => {
                labelBonus.destroy();
            }
        });
    }

    checkCollision() {
        for (let i = 0; i < this.managerTaco.tacoArr.length; i++) {
            const element = this.managerTaco.tacoArr[i];
            const elBounds = element.getBounds();
            const elPosX = elBounds.x;
            const elPosY = elBounds.y;
            const pointUp = new PIXI.Point(elPosX, elPosY);
            const pointUpWidth = new PIXI.Point(elPosX + elBounds.width, elPosY);
            const pointDown = new PIXI.Point(elPosX, elPosY + elBounds.height);
            const pointDownWidth = new PIXI.Point(elBounds.right, elPosY + elBounds.height);

            const collisionUp = this.graph.containsPoint(pointUp);
            const collisionUpWidth = this.graph.containsPoint(pointUpWidth);

            const collisionDown = this.graph.containsPoint(pointDown);
            const collisionDownWidth = this.graph.containsPoint(pointDownWidth);

            if (collisionUp || collisionUpWidth) {
                this.managerTaco.tacoArr.splice(i, 1);
                element.showBonusTaco();
                if(+element.bonus < 0) this.totalBonus += +element.bonus;
                else this.totalBonus += +element.bonus * this.multiplyBar.value;
                this.multiplyBar.amountMultiply(element.bonus);
                // this.score.counterScore(`${this.totalBonus}`);
                this.updateCounter(this.totalBonus);
            } else if (collisionDown || collisionDownWidth) {
                this.managerTaco.tacoArr.splice(i, 1);
                element.showBonusTaco();
                if(+element.bonus < 0) this.totalBonus += +element.bonus;
                else this.totalBonus += +element.bonus * this.multiplyBar.value;
                this.multiplyBar.amountMultiply(element.bonus);
                // this.score.counterScore(`${this.totalBonus}`);
                this.updateCounter(this.totalBonus);
            }
            if (elBounds.right <= 0) {
                this.managerTaco.tacoArr.splice(i, 1);
                element.destroyTaco();
            }
        }
    }

    updateCounter(value) {
        this.score.counterScore(`${value}`);
        this.score.x = this.game.app.screen.width - this.score.width - 30;
    }

    getPlayerValue() {
        return { 
            username: this.username, 
            score: this.totalBonus
        };
    }
}