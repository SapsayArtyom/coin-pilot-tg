import { Container, Sprite, Text } from "pixi.js";
import MyLoader from "../Core/MyLoader";
import { EventEmitter } from "events";
import sound from 'pixi-sound';
import GameInput from "../elements/GameInput";

export default class StartScreen extends Container {

    constructor(option) {
        super();

        this.name = 'startScreen';
        this.game = option.game;
        this.sceneScale = option.scale;
        this._emitter = new EventEmitter();
        
        this.countdownValue = this.game.waitAt;
        this.soundFlag = 'off';
        this.valueInputName = this.game.nickName || 'Player';

        this.startScreen();
    }

    get emitter() {
        return this._emitter;
    }

    startScreen() {
        const bg = new Sprite(MyLoader.getResource('bg_startscreen').texture);
        const k = this.game.app.screen.width / bg.width;
        bg.scale.set(k, k);
        this.addChild(bg);

        this.screenContainer = new Container();
        this.addChild(this.screenContainer);

        this.timerCont = new Container();
        this.screenContainer.addChild(this.timerCont);
        
        this.startGameText = new Text('GAME STARTS IN:', {
            fontSize: 120,
            fontFamily: 'LuckiestGuy',
            fill: 0x185201,
            fontWeight: 'bold'
        });
        this.startGameText.x = (this.width - this.startGameText.width) / 2;
        this.timerCont.addChild(this.startGameText);

        this.turnSound = new Text('TURN SOUND ON?:', {
            fontSize: 120,
            fontFamily: 'LuckiestGuy',
            fill: 0x185201,
            fontWeight: 'bold'
        });
        this.turnSound.position.y = 400;
        this.timerCont.addChild(this.turnSound);
        this.turnSound.x = (this.width - this.turnSound.width) / 2;

        
        this.countdownText = new Text(`${this.countdownValue}`, {
            fontSize: 180,
            fontFamily: 'LuckiestGuy',
            fill: 0x185201,
            fontWeight: 'bold'
        });
        this.countdownText.x = (this.width - this.countdownText.width) / 2;
        this.countdownText.y = (this.timerCont.height - this.countdownText.height) / 2;
        this.timerCont.addChild(this.countdownText);

        this.btnCont = new Container();
        this.screenContainer.addChild(this.btnCont);

        this.btnYes = new Sprite(MyLoader.getResource('btn_yes_inactive').texture);
        this.btnYes.scale.set(0.7, 0.7);
        this.btnYes.interactive = true;
        this.btnYes.on('pointerup', ()=>{
            sound.unmuteAll();
            this.btnYes.texture = MyLoader.getResource('btn_yes_active').texture;
            this.btnNo.texture = MyLoader.getResource('btn_no_inactive').texture;
            this.btnYes.interactive = false;
            this.btnNo.interactive = true;
            this.soundFlag = 'on';
        });
        this.btnCont.addChild(this.btnYes);       
        
        this.btnNo = new Sprite(MyLoader.getResource('btn_no_active').texture);
        this.btnNo.scale.set(0.7, 0.7);
        this.btnNo.x = this.btnYes.getBounds().width + 20;
        this.btnNo.interactive = false;
        this.btnNo.on('pointerup', ()=>{
            sound.muteAll();
            this.btnYes.texture = MyLoader.getResource('btn_yes_inactive').texture;
            this.btnNo.texture = MyLoader.getResource('btn_no_active').texture;
            this.btnNo.interactive = false;
            this.btnYes.interactive = true;
            this.soundFlag = 'off';
        });
        this.btnCont.addChild(this.btnNo);
        this.btnCont.x = (this.width - this.btnCont.width) / 2;
        this.btnCont.y = this.timerCont.getBounds().bottom + 80;

        if(!this.game.isAuth) {
            this.nameCont = new Container();
            this.nameCont.y = this.btnCont.getBounds().bottom + 20;
            this.screenContainer.addChild(this.nameCont);
    
            this.userName = new Text('USERNAME', {
                fontSize: 120,
                fontFamily: 'LuckiestGuy',
                fill: 0x185201,
                fontWeight: 'bold'
            });
            this.userName.x = (this.width - this.userName.width) / 2;
            this.nameCont.addChild(this.userName);
    
            this.input = new GameInput({
                placeholder: this.valueInputName,
                fontFamily: 'LuckiestGuy',
                width: 250,
                height: 50,
                fontSize: 40,
                game: this.game
            });
    
            this.input.pixiObject.position.x = ( this.width - this.input.pixiObject.width) / 2;
            this.input.pixiObject.position.y = this.userName.getBounds().height + 20;

            this.valueInputName = this.game.nickName;
            this.input.checkLength();

            this.btnSubmit = new Sprite(MyLoader.getResource('btn_submit').texture);
            this.btnSubmit.x = ( this.width - this.btnSubmit.width) / 2;
            this.btnSubmit.y = this.input.pixiObject.y + this.input.pixiObject.getBounds().height + 20;
            this.btnSubmit.interactive = true;
            this.btnSubmit.buttonMode = true;
            this.btnSubmit.on('pointerdown', ()=>{
                this.input.setInactive();
                this.btnSubmit.interactive = false;
                this.btnSubmit.destroy();
                this.valueInputName = this.input.text.text;
                this.emitter.emit('countdown');
            });
            this.nameCont.addChild(this.btnSubmit);
            // }        
    
            this.screenContainer.y = (this.game.app.screen.height - this.screenContainer.height) / 2;
            this.input.setPosition(this.input.pixiObject.getGlobalPosition().x, this.input.pixiObject.getGlobalPosition().y);
    
            this.interactive = true;
            this.on('pointerdown', ()=>{
                this.input.domField.blur();
            });
        } else this.screenContainer.y = (this.game.app.screen.height - this.screenContainer.height) / 2;

        const widthProportional = this.game.baseWidth / this.game.width;
        const resizeBoardHeight = this.screenContainer.getBounds().height / widthProportional;

        if(this.game.height < resizeBoardHeight) {
            const resizeHeightScreen = this.game.height * widthProportional;
            const newHeight = resizeHeightScreen - 100;
            const newSc = newHeight /this.screenContainer.getLocalBounds().height;

            this.drawScene(newSc);
        } 

        this.countdown();
    }

    countdown() {
        let timePassed = this.countdownValue;
        const timer = setInterval(()=> {
            
            timePassed--;
            this.checkCounter(timePassed);

            if (timePassed === 0) {
                if(!this.game.isAuth) {
                    if(this.input.text.text.trim() === '') this.valueInputName = this.game.nickName;
                    else this.valueInputName = this.input.text.text;
                } else this.valueInputName = this.game.nickName;
                this.emitter.emit('countdown');
                clearInterval(timer);
                return;
            }
        }, 1000);
    }

    checkCounter(timePassed) {
        this.countdownText.text = `${timePassed}`;
    }

    hideInput() {
        if(this.input) this.input.domField.style.visibility = 'hidden';
    }

    drawScene(scale) {
        this.screenContainer.scale.set(scale);
        this.screenContainer.y = (this.game.app.screen.height - this.screenContainer.getBounds().height) / 2;
        if(this.btnSubmit) this.btnSubmit.x = ((this.width - this.btnSubmit.getBounds().width) / 2) / scale;
        this.startGameText.x = ((this.width - this.startGameText.getBounds().width) / 2) / scale;
        this.turnSound.x = ((this.width - this.turnSound.getBounds().width) / 2) / scale;
        this.countdownText.x = ((this.width - this.countdownText.getBounds().width) / 2) / scale;
        this.btnCont.x = ((this.width - this.btnCont.getBounds().width) / 2) / scale;
        if(!this.game.isAuth) {
            this.userName.x = ((this.width - this.userName.getBounds().width) / 2) / scale;
            this.input.pixiObject.position.x = (( this.width - this.input.pixiObject.getBounds().width) / 2) / scale;
            this.input.setPosition(this.input.pixiObject.getGlobalPosition().x, this.input.pixiObject.getGlobalPosition().y);
            this.input.drawInput(scale);
        }
    }
}