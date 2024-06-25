import * as PIXI from 'pixi.js';
import { install } from '@pixi/unsafe-eval';
import MyLoader from '../Core/MyLoader';
import ConfigScreens from './ConfigScreens';

install(PIXI);
export default class ConfigManager {
    
    constructor(options){

        this.width = options.width;
        this.height = options.height;

        this.baseWidth = 600;
        this.baseHeight = 500;

        this.mainContainer = new PIXI.Container();

        // this.mainLoader = new MyLoader();
        this.mainLoader = MyLoader.loader();

        // this.createGame();
    }

    async createGame() {

        this.mainLoader
        .add('logo', './assets/logo.png')
        .add('bg', './assets/bg.png')
        .add('bg_config', './assets/bg_config.png')
        .add('btn_submit', './assets/btn_submit.png')
        .add('btn_config', './assets/btn_config.png')
        .add('btn_bar_tab', './assets/btn_bar_tab.png')

        await MyLoader.loadAssets(this.mainLoader);

        this.init();
    }

    init() {

        this.app = new PIXI.Application({ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight, antialias: true });
        document.body.appendChild(this.app.view);
        
        this.mainContainer.name = 'mainContainer';
        this.app.stage.addChild(this.mainContainer);
        this.sceneConfig = new ConfigScreens({
            game: this,
            container: this.mainContainer
        });
        this.mainContainer.addChild(this.sceneConfig);

        this.resizeScene();
    }

    resizeScene() {
        if(this.width < this.baseWidth) {
            this.sceneConfig.resizeScene();
        }
    }

    setScreen(obj) {

        for (let i = 1; i < this.sceneConfig.children.length; i++) {
            const element = this.sceneConfig.children[i];
            if(obj.type === element.name) {
                element.alpha = 1;
                element.interactiveChildren = true;
                element.btnTrueClick();
                if(obj.type === 'board') this.sceneConfig.drawHighScore(obj.scores);
                if(obj.type === 'game') this.sceneConfig.createTimerDeadline(obj.deadlineAt);
            } else {
                element.alpha = 0;
                element.interactiveChildren = false;
                element.btnFalseClick();
            }
        }
    }

    destroyConfig() {
        this.mainContainer.destroy();
        this.app.destroy(true);
    }
}