import MainGame from './Core/MainGame';
new class Main {

    protected game: MainGame;
    protected initialization: boolean;


    constructor() {
        
        this.game;
        this.initialization = false;
        this.initGame();
    }

    // async initGame(option) {
    //     if(this.initialization) return;
    //     this.initialization = true;
    //     await this.loadFont();
    //     this.game = new MainGame({
    //         width: option.width,
    //         height: option.height,
    //         waitAt: option.waitAt,
    //         deadlineAt: option.deadlineAt,
    //         nickName: option.username,
    //         isAuth: option.isAuth,
    //     });
        
    // }

    destroyGame() { // remove Game and canvas from DOM
        if(this.game) {
            const playerObj =  this.game.getPlayerValue();
            this.game.destroyGame();
            this.initialization = false;
            return playerObj;
        }
    }

    async initGame() { 
        this.game = new MainGame({
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            nickName: 'Alex',
            waitAt: 3000,
            deadlineAt: 1585612500,
            isAuth: false,
        });
    }
};