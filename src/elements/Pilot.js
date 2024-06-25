import MyLoader from "../Core/MyLoader";
import { AnimatedSprite, Container } from "pixi.js";
import sound from 'pixi-sound';

export default class Pilot extends Container {

    constructor() {
        super();

        this.pilotTextures = [];

        for (let i = 1; i < 6; i++) {
            const val = i < 10 ? `0${i}` : i;
            const texture = MyLoader.getResource(`explosion_pilot_${val}`).texture;
            this.pilotTextures.push(texture);
        }

        this.createPilot();
    }

    createPilot() {
        const pilotWidth = 120;

        this.widthPilotExplosion = 120;
        const pilotTextures = [];

        for (let i = 1; i < 41; i++) {
            const val = i < 10 ? `0${i}` : i;
            const texture = MyLoader.getResource(`pilot_${val}`).texture;
            pilotTextures.push(texture);
        }
        this.pilot = new AnimatedSprite(pilotTextures);
        this.pilot.name = 'pilot';
        this.pilot.scale.set(0.6, 0.6);
        // const k = pilotWidth / this.pilot.width;
        // this.pilot.width = pilotWidth;
        // this.pilot.height = this.pilot.height * k;
        this.pilot.play();
        this.addChild(this.pilot);

        this.pilotExplosion = new AnimatedSprite(this.pilotTextures);
        this.pilotExplosion.name = 'bomb';
        this.pilotExplosion.animationSpeed = 0.3;
        this.pilotExplosion.scale.set(0.8, 0.8);
        // const kk = this.widthPilotExplosion / this.pilotExplosion.width;
        // this.pilotExplosion.scale.set(kk, kk);
        this.pilotExplosion.loop = false;
        this.pilotExplosion.alpha = 0;
        this.addChild(this.pilotExplosion);
    }

    async pilotCrash() {

        sound.stop('propeller_idle');
        sound.play('explosion_pilot');
        this.pilot.alpha = 0;
        this.pilotExplosion.alpha = 1;
        this.pilotExplosion.gotoAndPlay(0);

        return new Promise((resolve) => {
            this.pilotExplosion.onComplete = ()=>{resolve();};
        });
    }

    showPilot() {
        this.pilot.alpha = 1;
        this.pilotExplosion.stop();
        this.pilotExplosion.alpha = 0;
    }
}