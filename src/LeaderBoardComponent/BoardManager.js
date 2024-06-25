import * as PIXI from 'pixi.js';
import MyLoader from '../Core/MyLoader';
import LeaderBoard from './LeaderBoard';

export default class BoardManager {
    
    constructor(options){

        this.width = options.width;
        this.height = options.height;
        this.scores = options.scores;

        this.baseWidth = 1125;
        this.baseHeight = 2436;

        this.mainContainer = new PIXI.Container();

        this.mainLoader = MyLoader.loader();

        this.createGame();
    }

    async createGame() {

        this.mainLoader
        .add('bg', './assets/bg.png')
        .add('bg_startscreen', './assets/bg_startscreen.png')
        .add('leaderBoard', './assets/leaderBoard.png')
        .add('clouds_bottom', './assets/Clouds_Bottom.png')

        await MyLoader.loadAssets(this.mainLoader);

        this.init();
    }

    updateBoard(score) {
        this.sceneLeaderBoard.showScores(score);
    }

    init() {

        this.app = new PIXI.Application({ 
            width: 1125, 
            height: 2436, 
            // width: this.width, 
            // height: this.height, 
            antialias: true,
        });
        
        // document.body.innerHTML = '';
        // document.body.appendChild(this.app.view);

        let div = document.createElement('div');
        div.style.width = `${this.width}px`;
        div.style.height = `${this.height}px`;
        div.style.position = 'relative';
        document.body.append(div);
        div.append(this.app.view);

        const clientWidth = this.width;
        const clientHeight = this.height;
        // const assetsProportion = this.baseHeight / this.baseWidth;
        const screenProportions = clientHeight / clientWidth;
        this.screenHeight = this.baseWidth * screenProportions;
        this.shift = (this.baseHeight - this.screenHeight) / 2;

        const canvas = document.getElementsByTagName("canvas");
        canvas[0].style.position = "absolute";
        canvas[0].style.transform = "translate(-50%, -50%)";
        canvas[0].style.top = "50%";
        canvas[0].style.left = "50%";
        canvas[0].style.maxHeight = "unset";
        canvas[0].style.maxWidth = "100%";
        
        this.mainContainer.name = 'mainContainer';
        this.app.stage.addChild(this.mainContainer);
        this.sceneLeaderBoard = new LeaderBoard({
            game: this,
            container: this.mainContainer
        });
        this.mainContainer.addChild(this.sceneLeaderBoard);
    }

    destroyBoard() {
        this.mainContainer.destroy();
        this.app.destroy(true);
    }
}