import { Container, Sprite } from "pixi.js";
import MyLoader from '../Core/MyLoader';
import sound from 'pixi-sound';

export default class SoundManager extends Container {

    constructor(option) {
        super();

        this.widthIcon = 140;

        this.flag = option.flag;

        this.createButton();
    }

    createButton() {
        this.soundIcon = new Sprite(MyLoader.getResource(`btn_sound_${this.flag}`).texture);
        const k = this.widthIcon / this.soundIcon.width;
        this.soundIcon.width = this.widthIcon;
        this.soundIcon.height = this.soundIcon.height * k;
        this.addChild(this.soundIcon);

        this.soundIcon.interactive = true;
        this.soundIcon.on('pointerup', () => {
            
            if(this.flag === 'on') {
                this.flag = 'off';
                ga('send', 'event', 'Game', 'user_audio_off', 'audio_off');
            }
            else {
                this.flag = 'on';
                ga('send', 'event', 'Game', 'user_audio_on', 'audio_on');
            }

            this.soundIcon.texture = MyLoader.getResource(`btn_sound_${this.flag}`).texture;            
            sound.toggleMuteAll();
        });
    }
}