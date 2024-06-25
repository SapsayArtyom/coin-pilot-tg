import { Container, Sprite, TilingSprite, Text } from "pixi.js";
import MyLoader from '../Core/MyLoader';

export default class LeaderBoard extends Container {

    constructor(option) {
        super();

        this.game = option.game;
        
        this.createBG();
        this.createBoard();
    }

    createBG() {
        const bg = new Sprite(MyLoader.getResource('bg').texture);
        bg.name = 'background';
        bg.width = this.game.app.screen.width;
        bg.height = this.game.app.screen.height;
        this.addChild(bg);

        const tileCloud = new TilingSprite(MyLoader.getResource('clouds_bottom').texture, this.game.app.screen.width, 600 );
        // const tileCloud = new TilingSprite(MyLoader.getResource('clouds_bottom').texture, this.game.app.screen.width, this.game.app.screen.height );
        tileCloud.position.y = this.game.app.screen.height - tileCloud.height;
        this.addChild(tileCloud);
    }

    createBoard() {

        this.leaderBoardCont = new Container();
        this.addChild(this.leaderBoardCont);

        this.boardCont = new Container();
        this.leaderBoardCont.addChild(this.boardCont);
        // this.addChild(this.boardCont);
        const board = new Sprite(MyLoader.getResource('leaderBoard').texture);
        board.name = 'leaderBoard';
        const scaleSet = 904 / board.width;
        board.scale.set(scaleSet, scaleSet);
        
        const widthProportional = this.game.baseWidth / this.game.width;
        const resizeBoardHeight = board.getBounds().height / widthProportional;

        this.boardCont.addChild(board);
        this.boardCont.name = 'boardCont';
        
        this.scoreCont = new Container();
        this.scoreCont.name = 'scoreCont';
        this.leaderBoardCont.addChild(this.scoreCont);
        // this.addChild(this.scoreCont);

        // this.boardCont.x = (this.game.app.screen.width - this.boardCont.getBounds().width) / 2;
        // this.boardCont.y = Math.floor(this.game.app.screen.height - this.boardCont.getBounds().height) / 2;

        this.showScores(this.game.scores);

        if(this.game.height < resizeBoardHeight) {
            const resizeHeightScreen = this.game.height * widthProportional;
            const newHeight = resizeHeightScreen - 40;
            const newSc = newHeight / board.getLocalBounds().height;

            this.leaderBoardCont.scale.set(newSc);
        }

        this.drawScoreCont();
    }

    showScores(score) {
        this.scoreCont.removeChildren();
        const scores = score;
        const posX =  this.boardCont.x;
        const posY =  this.boardCont.y - 6;
        for (let i = 0; i < scores.length; i++) {
            if(i === 22) break;
            const element = scores[i];
            const lineScore = new Container();
            this.scoreCont.addChild(lineScore);
            const name = new Text(`${element.username}`, {
                fontFamily: 'LuckiestGuy',
                fill: 0xffffff,
                fontSize: 60,
                letterSpacing: 1.5,
            });
            name.x = Math.floor(posX) + 55;
            lineScore.addChild(name);
            const score = new Text(`${element.score}`, {
                fontFamily: 'LuckiestGuy',
                fill: 0xffffff,
                fontSize: 60,
                letterSpacing: 1.5,
            });
            score.x = Math.floor(posX) + this.boardCont.getBounds().width - score.width - 45;
            // score.x = this.game.app.screen.width - score.width - Math.floor(posX) - 45;
            lineScore.addChild(score);
            lineScore.y = 72 * i + 282 + Math.floor(posY);
        }
    }

    drawScoreCont() {
        this.leaderBoardCont.x = (this.width - this.leaderBoardCont.getBounds().width) / 2;
        this.leaderBoardCont.y = (this.height - this.leaderBoardCont.getBounds().height) / 2;
    }
}