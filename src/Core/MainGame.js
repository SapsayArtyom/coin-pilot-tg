import * as PIXI from 'pixi.js';
import sound from 'pixi-sound';
import MyLoader from './MyLoader';
import MainScene from './MainScene';

export default class MainGame {
    
    constructor(options){

        this.width = options.width;
        this.height = options.height;
        this.waitAt = options.waitAt;
        this.deadlineAt = options.deadlineAt;
        this.nickName = options.nickName;
        this.isAuth = options.isAuth;
        this.baseWidth = 1125;
        this.baseHeight = 2436;

        this.mainContainer = new PIXI.Container();

        this.mainLoader = MyLoader.loader();

        this.createGame();
    }

    async createGame() {

        this.mainLoader
            .add('logo', './assets/logo.png')
            .add('bg', './assets/bg.png')
            .add('bg_startscreen', './assets/bg_startscreen.png')
            .add('coin_1', 'assets/coin_1.png')
            .add('coin_2', 'assets/coin_2.png')
            .add('coin_icon', 'assets/coin_icon.png')
            .add('btn_yes_inactive', './assets/btn_yes_inactive.png')
            .add('btn_yes_active', './assets/btn_yes_active.png')
            .add('btn_no_inactive', './assets/btn_no_inactive.png')
            .add('btn_no_active', './assets/btn_no_active.png')
            .add('btn_submit', './assets/btn_submit.png')
            .add('clouds_bottom', './assets/Clouds_Bottom.png')
            .add('ground', './assets/ground.png')
            .add('btn_sound_on', './assets/btn_sound_on.png')
            .add('btn_sound_off', './assets/btn_sound_off.png')
            .add('propeller_idle', './assets/sound/GC_Flappy_Propeller_idle.wav')
            .add('explosion_bomb', './assets/sound/GC_Flappy_Bomb.wav')
            .add('explosion_coin_1', './assets/sound/GC_Flappy_Coin.wav')
            .add('explosion_coin_2', './assets/sound/GC_Flappy_Coin_Large.wav')
            .add('explosion_pilot', './assets/sound/GC_Flappy_Crash.wav')
            .add('propeller_start', './assets/sound/GC_Flappy_Propeller_boost.wav');

        for (let i = 1; i < 41; i++) {
            const val = i < 10 ? `0${i}` : i;
            this.mainLoader.add(`pilot_${val}`, `./assets/pilot/pilot_${val}.png`);
        }

        for (let i = 0; i < 10; i++) {
            const val = i < 10 ? `0${i}` : i;
            this.mainLoader.add(`bomb_${val}`, `./assets/bomb/bomb_${val}.png`);
        }

        for (let i = 0; i < 6; i++) {
            const val = i < 10 ? `0${i}` : i;
            this.mainLoader.add(`explosion_pilot_${val}`, `./assets/explosion_pilot/Explosion_Crash_${val}.png`);
        }

        for (let i = 0; i < 7; i++) {
            const val = i < 10 ? `0${i}` : i;
            this.mainLoader.add(`explosion_bomb_${val}`, `./assets/explosion_bomb/Explosion_bomb_${val}.png`);
        }
        for (let i = 0; i < 6; i++) {
            const val = i < 10 ? `0${i}` : i;
            this.mainLoader.add(`coin_explosion_${val}`, `./assets/coin_explosion/coin_explosion_${val}.png`);
        }
        for (let i = 0; i < 7; i++) {
            const val = i < 10 ? `0${i}` : i;
            this.mainLoader.add(`coin_large_explosion_${val}`, `./assets/coin_large_explosion/coin_large_explosion_${val}.png`);
        }

        await MyLoader.loadAssets(this.mainLoader);

        this.init();
    }

    init() {
        this.app = new PIXI.Application({ 
            width: this.baseWidth,
            height: this.baseHeight,
            antialias: true
        });

        const div = document.createElement('div');
        div.style.width = `${this.width}px`;
        div.style.height = `${this.height}px`;
        div.style.position = 'relative';
        document.body.append(div);
        div.append(this.app.view);

        const clientWidth = this.width;
        const clientHeight = this.height;
        const screenProportions = clientHeight / clientWidth;
        this.screenHeight = this.baseWidth * screenProportions;
        this.shift = (this.baseHeight - this.screenHeight) / 2;

        const canvas = document.getElementsByTagName("canvas");
        // canvas[0].style.position = "absolute";
        // canvas[0].style.transform = "translate(-50%, -50%)";
        // canvas[0].style.top = "50%";
        // canvas[0].style.left = "50%";
        // canvas[0].style.maxHeight = "unset";
        // canvas[0].style.maxWidth = "100%";
        canvas[0].style.position = 'fixed';
        canvas[0].style.bottom = '0';
        canvas[0].style.transform = 'translate(-50%, 0)';
        canvas[0].style.top = 'unset';
        
        this.mainContainer.name = 'mainContainer';
        this.app.stage.addChild(this.mainContainer);
        sound.muteAll();
        this.game = new MainScene({
            game: this,
            container: this.mainContainer,
        });

        window.onblur = () => {
            if(this.game && this.game.startGame) {
                sound.stop('propeller_idle');
                this.app.ticker.stop();
                this.game.ticker.stop();
                this.game.managerTaco.stopTacos();
            }
        };
        window.onfocus = () => {
            if(this.game && this.game.startGame) {
                sound.play('propeller_idle', { loop: true });
                this.app.ticker.start();
                this.game.ticker.start();
                this.game.managerTaco.startTacos();
            }
        };
    }

    destroyGame() {
        console.log('destroyGame');
        if(this.game.managerTaco && this.game.managerTaco.createInterval) this.game.managerTaco.removeInterval();
        this.mainContainer.destroy();
        this.app.destroy(true);
        this.game = null;
        sound.removeAll();
    }

    getPlayerValue() {
        return this.game.getPlayerValue();
    }

    checkSize() {
        let scaleScene = 1;
        if (this.width < 380) scaleScene = 0.8;

        return scaleScene;
    }
}