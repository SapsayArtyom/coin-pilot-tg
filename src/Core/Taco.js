import { Container, Sprite, Ticker, AnimatedSprite, Text, Graphics } from "pixi.js";
import MyLoader from './MyLoader';
import TweenMax from 'gsap';
import sound from 'pixi-sound';

export default class Taco extends Container {

    constructor(option) {
        super(option);

        this.res = option.resource;
        this.posX = option.x;
        this.posY = option.y;
        this.widthTaco = option.widthTaco;
        this.bonus = option.bonus;

        this.coinExplosionTexture = [];
        this.bombExplosionTexture = [];
        this.coinLargeExplosionTexture = [];  

        this.res === 'bomb' ? this.createBomb() : this.createTaco();
    }

    createTaco() {
        this.coinTexture = [];
        this.coinLargeTexture = [];
        this.taco = new Sprite(MyLoader.getResource(this.res).texture);
        const k = this.widthTaco / this.taco.width;
        this.taco.scale.set(k, k);
        // this.taco.width = this.widthTaco;
        // this.taco.height = this.taco.height * k;
        this.position.set(this.posX, this.posY);
        this.addChild(this.taco);

        for (let i = 1; i < 6; i++) {
            const val = i < 10 ? `0${i}` : i;
            const texture = MyLoader.getResource(`coin_explosion_${val}`).texture;
            this.coinExplosionTexture.push(texture);
        }
        for (let i = 1; i < 7; i++) {
            const val = i < 10 ? `0${i}` : i;
            const texture = MyLoader.getResource(`coin_large_explosion_${val}`).texture;
            this.coinLargeExplosionTexture.push(texture);
        }
    };

    createBomb() {
        this.bombTextures = [];

        for (let i = 0; i < 10; i++) {
            const val = i < 10 ? `0${i}` : i;
            const texture = MyLoader.getResource(`bomb_${val}`).texture;
            this.bombTextures.push(texture);
        }
        for (let i = 1; i < 7; i++) {
            const val = i < 10 ? `0${i}` : i;
            const texture = MyLoader.getResource(`explosion_bomb_${val}`).texture;
            this.bombExplosionTexture.push(texture);
        }

        this.taco = new AnimatedSprite(this.bombTextures);
        this.taco.name = 'bomb';
        const k = this.widthTaco / this.taco.width;
        this.taco.scale.set(k, k);
        // this.taco.width = this.widthTaco;
        // this.taco.height = this.taco.height * k;
        this.taco.play();
        this.position.set(this.posX, this.posY);
        // this.taco.anchor.set(0.5, 0.5);
        this.addChild(this.taco);
    }

    moveTaco() {

        this.ticker = new Ticker();
        this.ticker.add(() => {
            // this.position.x -= 3.8;
            this.position.x -= 7 * this.ticker.deltaTime;
        });
        this.ticker.start();  
    }

    showBonusTaco() {
        this.ticker.stop();
        this.ticker.remove();
        this.taco.alpha = 0;
        const labelBonus = new Text(`${this.bonus}`, {
            fill: this.res === 'bomb'? 0xff0000 : 0xfffb94,
            fontSize: 100,
            // fontSize: 38,
            fontWeight: 'bold',
            fontFamily: 'LuckiestGuy'
        });
        labelBonus.rotation = -0.2;
        labelBonus.position.y = -100;
        labelBonus.position.x = 50;
        this.addChild(labelBonus);
        TweenMax.to(labelBonus, .2, {
            y: -165,
            onComplete: () => {
                labelBonus.destroy()
                this.destroy();
            }
        });

        const texture = this.res === 'bomb' ? this.bombExplosionTexture : 
                    this.res === 'coin_1' ? this.coinExplosionTexture : this.coinLargeExplosionTexture;
        
        sound.play(`explosion_${this.res}`);
        this.coinExplosion = new AnimatedSprite(texture);
        // const k = 100 / this.coinExplosion.width;
        // this.coinExplosion.scale.set(k, k);
        this.coinExplosion.anchor.set(0.5, 0.5);
        this.coinExplosion.animationSpeed = 0.3;
        this.coinExplosion.play();
        this.addChild(this.coinExplosion);
    }

    destroyTaco() {
        this.ticker.stop();
        this.ticker.remove();
        this.destroy();
    }

}