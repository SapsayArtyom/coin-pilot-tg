import { Container, Sprite, Text, Graphics } from "pixi.js";
import { EventEmitter } from "events";
import MyLoader from "../Core/MyLoader";
import SliderH from '../elements/SliderH';

export default class Config extends Container {

    get emitter() {
        return this._emitter;
    }

    constructor(options) {
        super();

        this.time = 0;
        this.timeMinute = 0;

        this.name = 'configScreen';
        this.game = options.game;

        this._emitter = new EventEmitter();

        const bg = new Sprite(MyLoader.getResource('bg_startscreen').texture);
        const k = this.game.app.screen.width / bg.width;
        bg.scale.set(k, k);
        this.addChild(bg);

        // this.createBackground();
        // this.createGameTimerConf();
        this.createConfigScreen();
    }

    createBackground() {  

        // const bg = new Sprite(MyLoader.getResource('bg_startscreen').texture);
        // const k = this.game.app.screen.width / bg.width;
        // bg.scale.set(k, k);
        // this.addChild(bg);

        this.screenContainer = new Container();
        this.addChild(this.screenContainer);

        const titleCont = new Container();
        this.screenContainer.addChild(titleCont);

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

        const highScoreCont = new Container();
        highScoreCont.y = labelConfig.getBounds().bottom + 10;
        this.screenContainer.addChild(highScoreCont);
        this.backScore = new Graphics();
        this.backScore.name = 'this.backScore';
        this.backScore
                .beginFill(0xffffff, 0.75)
                .drawRect(0, 0, this.game.app.screen.width, 300);
        highScoreCont.addChild(this.backScore);


        this.buttonCont = new Container();
        this.buttonCont.y = highScoreCont.getBounds().bottom + 10;
        this.screenContainer.addChild(this.buttonCont);
        const button = new Sprite(MyLoader.getResource('btn_submit').texture);
        const scaleBtn = 200/button.width;
        button.scale.set(scaleBtn, scaleBtn);
        this.buttonCont.addChild(button);
        this.buttonCont.x = (this.screenContainer.width - this.buttonCont.width) / 2;

        titleCont.x = (this.screenContainer.width - titleCont.width) / 2;
        // this.screenContainer.x = (this.game.app.screen.width - this.screenContainer.width) / 2;
        this.screenContainer.y = (this.game.app.screen.height - this.screenContainer.height) / 2;

    }

    createGameTimerConf() {
        this.screenContainer = new Container();
        this.addChild(this.screenContainer);

        const titleCont = new Container();
        this.screenContainer.addChild(titleCont);

        this.logo = new Sprite(MyLoader.getResource('logo').texture);
        const kk = 70/this.logo.width;
        this.logo.scale.set(kk, kk);
        titleCont.addChild(this.logo);


        this.timerCont = new Container();
        this.screenContainer.addChild(this.timerCont);
        this.timer = new Text(`00:00`, {
            fill: 0x185201,
            fontSize: 80,
            fontFamily: 'LuckiestGuy',
            fontWeight: 'bold'
        });
        this.timerCont.addChild(this.timer);
        const labelConfig = new Text('Minutes left', {
            fontFamily: 'LuckiestGuy',
            fill: 0x185201,
            fontWeight: 'bold',
            fontSize: 40,
        });
        labelConfig.y = this.timer.getBounds().height + 10;
        this.timerCont.addChild(labelConfig);
        this.timer.x = (this.timerCont.width - this.timer.width) / 2;

        this.timerCont.x = (this.game.app.screen.width - this.timerCont.width) / 2;
        this.timerCont.y = titleCont.getBounds().height + 60;

        setInterval(()=>{
            this.time++;
            this.updateTimer(this.time);
        }, 1000);


        this.buttonCont = new Container();
        this.buttonCont.y = this.timerCont.getBounds().bottom + 50;
        this.screenContainer.addChild(this.buttonCont);
        const button = new Sprite(MyLoader.getResource('btn_submit').texture);
        const scaleBtn = 200 / button.width;
        button.scale.set(scaleBtn, scaleBtn);
        this.buttonCont.addChild(button);
        this.buttonCont.x = (this.game.app.screen.width - this.buttonCont.width) / 2;

        titleCont.x = (this.game.app.screen.width - titleCont.width) / 2;
        // this.screenContainer.x = (this.game.app.screen.width - this.screenContainer.width) / 2;
        this.screenContainer.y = (this.game.app.screen.height - this.screenContainer.height) / 2;

        
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
        this.addChild(this.screenContainer);

        const titleCont = new Container();
        this.screenContainer.addChild(titleCont);

        this.logo = new Sprite(MyLoader.getResource('logo').texture);
        this.logo.anchor.set(0.5, 0.5)
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
            radiusBorder: 10
        });
        slider.x = (this.game.app.screen.width - slider.width) / 2;
        slider.y = timeLabel.getBounds().bottom + 25;
        timeLabel.text = `Game Time: ${slider.value} minute`;
        sliderCont.addChild(slider);

        slider.emitter.on('drawSlider', () => {
            const value = Math.round(slider.value);
            timeLabel.text = `Game Time: ${value} minute`;
        })
        // sliderCont.y = titleCont.getBounds().bottom + 50;

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
            maxPercent: 120
        });
        sliderTwo.x = (this.game.app.screen.width - sliderTwo.width) / 2;
        sliderTwo.y = countDownLabel.getBounds().bottom + 25;
        countDownLabel.text = `Countdown Time: ${sliderTwo.value} sec.`;
        sliderCont.addChild(sliderTwo);

        sliderTwo.emitter.on('drawSlider', () => {
            const value = Math.round(sliderTwo.value);
            countDownLabel.text = `Countdown Time: ${value} sec.`;
        })
        sliderCont.y = titleCont.getBounds().bottom + 50;



        this.screenContainer.y = (this.game.app.screen.height - this.screenContainer.height) / 2;
    }
}