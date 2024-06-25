import { Container, Sprite, Text, Graphics } from "pixi.js";
import { EventEmitter } from "events";
import MyLoader from "../Core/MyLoader";
import SliderH from '../elements/SliderH';
import Timer from '../elements/Timer';

export default class ConfigScreens extends Container {

    get emitter() {
        return this._emitter;
    }

    constructor(options) {
        super();

        this.time = 0;
        this.timeMinute = 0;

        this.name = 'configScreen';
        this.game = options.game;
        this.scaleGame = this.game.scaleGame;
        this.mainContainer = options.container;
        this.waitAt = 0;
        this.deadlineAt = 0;
        this.deadlineAtTimer = 0;
        this.sc = 1;

        this.btnWidth = 300;

        this._emitter = new EventEmitter();

        const bg = new Sprite(MyLoader.getResource('bg_config').texture);
        const k = (this.game.app.screen.height / (bg.height));
        
        bg.scale.set(k, k);
        this.addChild(bg);

        this.createHighScoreScreen();
        this.createGameTimerConf();
        this.createConfigScreen();
        
        // this.resizeScene();
    }

    createHighScoreScreen() {

        this.scoreContainer = new Container();
        this.scoreContainer.name = 'board';
        this.scoreContainer.alpha = 0;
        this.scoreContainer.interactive = false;
        this.addChild(this.scoreContainer);

        const titleCont = new Container();
        this.scoreContainer.addChild(titleCont);

        this.logo = new Sprite(MyLoader.getResource('logo').texture);
        const kk = 70/this.logo.width;
        this.logo.scale.set(kk, kk);
        titleCont.addChild(this.logo);

        const labelConfig = new Text('Showing high scores', {
            fontFamily: 'LuckiestGuy',
            fill: 0x185201,
            fontWeight: 'bold',
            fontSize: 40,
            wordWrap: true,
            wordWrapWidth: 300,
            align: 'center',
        });
        labelConfig.y = this.logo.getBounds().height;
        titleCont.addChild(labelConfig);

        this.logo.x = (titleCont.width - this.logo.width) / 2;

        this.highScoreCont = new Container();
        this.highScoreCont.y = labelConfig.getBounds().bottom + 35;
        this.scoreContainer.addChild(this.highScoreCont);
        this.backScore = new Graphics();
        this.backScore.name = 'this.backScore';
        this.backScore
            .beginFill(0xffffff, 0.75)
            .drawRect(0, 0, this.game.app.screen.width, 100);
        this.highScoreCont.addChild(this.backScore);


        this.buttonScoreCont = new Container();
        this.buttonScoreCont.y = this.highScoreCont.getBounds().bottom + 35;
        this.scoreContainer.addChild(this.buttonScoreCont);
        this.buttonScore = new Sprite(MyLoader.getResource('btn_config').texture);
        const scaleBtn = this.btnWidth/this.buttonScore.width;
        this.buttonScore.scale.set(scaleBtn, scaleBtn);
        this.buttonScoreCont.addChild(this.buttonScore);
        this.buttonScoreCont.x = (this.scoreContainer.width - this.buttonScoreCont.width) / 2;
        this.buttonScore.interactive = false;
        this.buttonScore.buttonMode = true;
        this.buttonScore.on('pointerup', () => {
            this.highScoreCont.removeChildren();
            this.emitter.emit('settings');
            // this.buttonScore.interactive = false;
        });
        const btnText = new Text('STOP', {
            fontFamily: 'LuckiestGuy',
            fill: 0xffffff,
            fontSize: 40,
        });
        btnText.width = btnText.width/scaleBtn;
        btnText.height = btnText.height/scaleBtn;
        this.buttonScore.addChild(btnText);
        btnText.x = (this.buttonScore.getLocalBounds().width - btnText.width) / 2;

        titleCont.x = (this.scoreContainer.width - titleCont.width) / 2;
        this.scoreContainer.y = (this.game.app.screen.height - this.scoreContainer.height) / 2;

        this.scoreContainer.btnTrueClick = () => {
            this.buttonScore.interactive = true;
        };
        this.scoreContainer.btnFalseClick = () => {
            this.buttonScore.interactive = false;
        };
    }

    drawHighScore(array) {
        this.backScore.clear();
        this.highScoreCont.removeChildren();
        // this.backScore.name = 'this.backScore';
        this.highScoreCont.addChild(this.backScore);

        if (array) {
            for (let i = 0; i < array.length; i++) {
                if (i === 8) break;
                const element = array[i];
                const lineScore = new Container();
                this.highScoreCont.addChild(lineScore);
                const name = new Text(`${element.username}`, {
                    fontFamily: 'LuckiestGuy',
                    fill: 0x185201,
                    fontSize: 30,
                });
                name.x = 50;
                lineScore.addChild(name);
                const score = new Text(`${element.score}`, {
                    fontFamily: 'LuckiestGuy',
                    fill: 0x185201,
                    fontSize: 30,
                });
                score.x = this.game.app.screen.width/this.sc - score.width - 50;
                lineScore.addChild(score);
                lineScore.y = lineScore.height * i + 10 * i;

                if (this.game.app.screen.width > 600) {
                    name.x = (this.game.app.screen.width / 2 - 275) / this.sc;
                    score.x = (this.game.app.screen.width / 2 + 275 - score.getBounds().width) / this.sc;
                } else if (this.game.app.screen.width > 380) {
                    name.x = (this.game.app.screen.width / 2 - 95) / this.sc;
                    score.x = (this.game.app.screen.width / 2 + 95 - score.getBounds().width) / this.sc;
                }
            }
        }

        this.backScore
            .beginFill(0xffffff, 0.75)
            .drawRect(0, 0, this.game.app.screen.width/this.sc, this.highScoreCont.getBounds().height / this.sc);
        

        this.buttonScoreCont.y = this.highScoreCont.getBounds().height / this.sc + this.highScoreCont.y + 35;

        this.scoreContainer.y = (this.game.app.screen.height - this.scoreContainer.height) / 2;
    }

    createGameTimerConf() {
        this.timerContainer = new Container();
        this.timerContainer.name = 'game';
        this.timerContainer.alpha = 0;
        this.timerContainer.interactive = false;
        this.addChild(this.timerContainer);

        const titleCont = new Container();
        this.timerContainer.addChild(titleCont);

        this.logo = new Sprite(MyLoader.getResource('logo').texture);
        const kk = 70/this.logo.width;
        this.logo.scale.set(kk, kk);
        titleCont.addChild(this.logo);

        this.timerCont = new Container();
        this.timerContainer.addChild(this.timerCont);
        this.timer = new Timer({
            deadlineAt: this.deadlineAtTimer,
            fontSize: 60,
            strokeThickness: 3,
            stroke: 0x185201
        });
        this.timerCont.addChild(this.timer);
        // this.timer.countdownTimer();

        const labelConfig = new Text('Minutes left', {
            fontFamily: 'LuckiestGuy',
            fill: 0x185201,
            fontWeight: 'bold',
            fontSize: 40,
        });
        labelConfig.y = this.timer.getBounds().height + 25;
        this.timerCont.addChild(labelConfig);
        this.timer.x = (this.timerCont.width - this.timer.width) / 2;
        this.timerCont.x = (this.game.app.screen.width - this.timerCont.width) / 2;
        this.timerCont.y = titleCont.getBounds().height + 50;

        // this.timerCont = new Container();
        // this.timerContainer.addChild(this.timerCont);
        // this.timer = new Text(`00:00`, {
        //     fill: 0x185201,
        //     fontSize: 80,
        //     fontFamily: 'LuckiestGuy',
        //     fontWeight: 'bold'
        // });
        // this.timerCont.addChild(this.timer);
        // const labelConfig = new Text('Minutes left', {
        //     fontFamily: 'LuckiestGuy',
        //     fill: 0x185201,
        //     fontWeight: 'bold',
        //     fontSize: 40,
        // });
        // labelConfig.y = this.timer.getBounds().height + 10;
        // this.timerCont.addChild(labelConfig);
        // this.timer.x = (this.timerCont.width - this.timer.width) / 2;

        // this.timerCont.x = (this.game.app.screen.width - this.timerCont.width) / 2;
        // this.timerCont.y = titleCont.getBounds().height + 60;

        // setInterval(()=>{
        //     this.time++;
        //     this.updateTimer(this.time);
        // }, 1000);


        const buttonCont = new Container();
        buttonCont.y = this.timerCont.getBounds().bottom + 50;
        this.timerContainer.addChild(buttonCont);
        this.buttonTimer = new Sprite(MyLoader.getResource('btn_config').texture);
        const scaleBtn = this.btnWidth/this.buttonTimer.width;
        this.buttonTimer.scale.set(scaleBtn, scaleBtn);
        buttonCont.addChild(this.buttonTimer);
        buttonCont.x = (this.scoreContainer.width - buttonCont.width) / 2;
        this.buttonTimer.interactive = false;
        this.buttonTimer.buttonMode = true;
        this.buttonTimer.on('pointerup', () => {
            this.emitter.emit('board');
            // this.buttonTimer.interactive = false;
            // this.timerContainer.alpha = 0;
            // this.timerContainer.interactive = false;

            // this.scoreContainer.alpha = 1;
            // this.scoreContainer.interactive = true;
            // this.buttonScore.interactive = true;
        });
        const btnText = new Text('HIGH SCORE', {
            fontFamily: 'LuckiestGuy',
            fill: 0xffffff,
            fontSize: 40,
        });
        btnText.width = btnText.width/scaleBtn;
        btnText.height = btnText.height/scaleBtn;
        this.buttonTimer.addChild(btnText);
        btnText.x = (this.buttonTimer.getLocalBounds().width - btnText.width) / 2;

        titleCont.x = (this.game.app.screen.width - titleCont.width) / 2;
        this.timerContainer.y = (this.game.app.screen.height - this.timerContainer.height) / 2;

        this.timerContainer.btnTrueClick = () => {
            this.buttonTimer.interactive = true;
        };
        this.timerContainer.btnFalseClick = () => {
            this.buttonTimer.interactive = false;
        };
    }

    createTimerDeadline(timeEnd) {
        this.timer.deadlineAt = timeEnd;
        this.timer.countdownTimer();
    }

    updateTimer(time) {
        
        if (time === 60) {
            this.timeMinute++;
            this.time = 0;
        };
        const sec = Math.abs(this.time) < 10 ? `0${Math.abs(this.time)}` : `${Math.abs(this.time)}`;
        const minute = this.timeMinute < 10 ? `0${this.timeMinute}` : `${this.timeMinute}`;
        this.timer.text = `${minute}:${sec}`;
    }

    createConfigScreen() {
        this.screenContainer = new Container();
        this.screenContainer.name = 'settings';
        this.screenContainer.alpha = 0;
        this.screenContainer.interactive = false;
        this.addChild(this.screenContainer);

        const titleCont = new Container();
        this.screenContainer.addChild(titleCont);

        this.logo = new Sprite(MyLoader.getResource('logo').texture);
        // this.logo.anchor.set(0.5, 0.5)
        const kk = 70/this.logo.width;
        this.logo.scale.set(kk, kk);
        titleCont.x = (this.game.app.screen.width - titleCont.getBounds().width) / 2;
        titleCont.addChild(this.logo);

        const sliderCont = new Container();
        this.screenContainer.addChild(sliderCont);

        const timeLabel = new Text('Game Time: 0 minute', {
            fontFamily: 'LuckiestGuy',
            fill: 0x185201,
            fontSize: 45,
        });
        
        timeLabel.x = (this.game.app.screen.width - timeLabel.width) / 2;
        sliderCont.addChild(timeLabel);
        const slider = new SliderH({
            sliderWidth: 400,
            sliderHeight: 25,
            radiusButton: 25,
            radiusBorder: 10,
            minPercent: 1,
            colorFill: 0x066a19,
            colorBorder: 0xffffff,
            colorBack: 0xcccccc
        });
        slider.x = (this.game.app.screen.width - slider.width) / 2;
        slider.y = timeLabel.getBounds().bottom + 25;
        timeLabel.text = `Game Time: ${slider.value} minute`;
        this.deadlineAt = slider.value;
        sliderCont.addChild(slider);

        slider.emitter.on('drawSlider', () => {
            const value = Math.round(slider.value);
            timeLabel.text = `Game Time: ${value} minute`;
            this.deadlineAt = value;
        });

        const countDownLabel = new Text('Countdown Time: 0 sec.', {
            fontFamily: 'LuckiestGuy',
            fill: 0x185201,
            fontSize: 45,
        });
        countDownLabel.y = slider.getBounds().bottom + 30;
        countDownLabel.x = (this.game.app.screen.width - countDownLabel.width) / 2;
        sliderCont.addChild(countDownLabel);

        const sliderTwo = new SliderH({
            sliderWidth: 400,
            sliderHeight: 25,
            radiusButton: 25,
            radiusBorder: 10,
            maxPercent: 120,
            minPercent: 1,
            colorFill: 0x066a19,
            colorBorder: 0xffffff,
            colorBack: 0xcccccc
        });
        sliderTwo.x = (this.game.app.screen.width - sliderTwo.width) / 2;
        sliderTwo.y = countDownLabel.getBounds().bottom + 25;
        countDownLabel.text = `Countdown Time: ${sliderTwo.value} sec.`;
        this.waitAt = sliderTwo.value;
        sliderCont.addChild(sliderTwo);

        sliderTwo.emitter.on('drawSlider', () => {
            const value = Math.round(sliderTwo.value);
            countDownLabel.text = `Countdown Time: ${value} sec.`;
            this.waitAt = value;
        });
        sliderCont.y = titleCont.getBounds().bottom + 50;

        const buttonCont = new Container();
        buttonCont.y = sliderCont.getBounds().bottom + 40;
        this.screenContainer.addChild(buttonCont);
        const button = new Sprite(MyLoader.getResource('btn_config').texture);
        const scaleBtn = this.btnWidth/button.width;
        button.scale.set(scaleBtn, scaleBtn);
        buttonCont.addChild(button);
        buttonCont.x = (this.scoreContainer.width - buttonCont.width) / 2;
        button.interactive = false;
        button.buttonMode = true;
        button.on('pointerup', () => {
            this.emitter.emit('startGame');
            button.interactive = false;
            // this.screenContainer.alpha = 0;
            // this.screenContainer.interactive = false;
            // this.screenContainer.interactiveChildren = false;

            // this.timerContainer.alpha = 1;
            // this.timerContainer.interactive = true;
            // this.timerContainer.interactiveChildren = true;
            // this.buttonTimer.interactive = true;
        });
        const btnText = new Text('START', {
            fontFamily: 'LuckiestGuy',
            fill: 0xffffff,
            fontSize: 40,
        });
        btnText.width = btnText.width/scaleBtn;
        btnText.height = btnText.height/scaleBtn;
        button.addChild(btnText);
        btnText.x = (button.getLocalBounds().width - btnText.width) / 2;

        this.screenContainer.y = (this.game.app.screen.height - this.screenContainer.height) / 2;

        this.screenContainer.btnTrueClick = () => {
            button.interactive = true;
        };
        this.screenContainer.btnFalseClick = () => {
            button.interactive = false;
        };
    }

    resizeScene() {
        this.sc = 0.5;
        this.screenContainer.scale.set(this.sc, this.sc);
        this.screenContainer.y = (this.game.app.screen.height - this.screenContainer.height) / 2;
        for (let i = 0; i < this.screenContainer.children.length; i++) {
            const el = this.screenContainer.children[i];
            for (let t = 0; t < el.children.length; t++) {
                const element = el.children[t];
                element.x = (this.game.app.screen.width / this.sc - element.getBounds().width / this.sc) / 2;
            }
            el.x = 0;
        }
        this.timerContainer.scale.set(this.sc, this.sc);
        this.timerContainer.y = (this.game.app.screen.height - this.timerContainer.height) / 2;
        for (let i = 0; i < this.timerContainer.children.length; i++) {
            const el = this.timerContainer.children[i];
            for (let t = 0; t < el.children.length; t++) {
                const element = el.children[t];
                element.x = (this.game.app.screen.width / this.sc - element.getBounds().width / this.sc) / 2;
            }
            el.x = 0;
        }
        this.scoreContainer.scale.set(this.sc, this.sc);
        this.scoreContainer.y = (this.game.app.screen.height - this.scoreContainer.height) / 2;
        for (let i = 0; i < this.scoreContainer.children.length; i++) {
            const el = this.scoreContainer.children[i];
            for (let t = 0; t < el.children.length; t++) {
                const element = el.children[t];
                element.x = (this.game.app.screen.width / this.sc - element.getBounds().width / this.sc) / 2;
            }
            el.x = 0;
        }

        this.backScore.clear();
        this.backScore
            .beginFill(0xffffff, 0.75)
            .drawRect(0, 0, this.game.app.screen.width / this.sc, 100);
        this.backScore.x = 0;
    }
}