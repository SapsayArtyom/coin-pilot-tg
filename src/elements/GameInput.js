import { Container, Sprite, Text, Graphics } from "pixi.js";

export default class GameInput extends Container {

    constructor(options) {
        
        super();

        this.options = options;
        this.fontFamily = options.fontFamily || 'Arial';
        this.game = options.game;
        this.ratioWidth = this.game.app.renderer.width / this.game.width;
        this.ratioHeight = this.game.app.renderer.height / this.game.height;
        this.createInput();
    }

    createInput() {       
  
        this.pixiObject = new Container();
        this.text = new Text(this.options.placeholder, {
            "fill": "#caffba",
            fontSize: this.options.fontSize,
            fontFamily: this.fontFamily,
        });
        this.text.x = 5;
        this.background = new Graphics();
        this.background
            .lineStyle(4, 0x3ac55c)
            .beginFill(0x004110)
            .drawRoundedRect(0,0,this.options.width * this.ratioWidth, this.options.height * this.ratioWidth, 10)
            .endFill();
        this.background.cacheAsBitmap = true;
        
        this.backgroundFocused = new Graphics();
        this.backgroundFocused
            .lineStyle(4, 0x3ac55c)
            .beginFill(0x038a25)
            .drawRoundedRect(0,0,this.options.width * this.ratioWidth, this.options.height * this.ratioWidth, 10)
            .endFill();
        this.backgroundFocused.cacheAsBitmap = true;
        this.backgroundFocused.visible = false;
        
        this.domField = document.createElement("input");
        this.domField.type = "text";
        this.domField.style.position = "absolute";
        document.body.appendChild(this.domField);
        this.domField.style.width = `${this.options.width}px`;
        this.domField.style.height = `${this.options.height}px`;
        this.domField.style.top = 0;
        this.domField.style.left = 0;
        this.domField.style.opacity = 1;
        // this.domField.style.opacity = 0;
        this.domField.style.fontSize = this.options.fontSize + 'px';
        this.domField.style.fontFamily = this.fontFamily;
        this.domField.style.textAlign = 'center';
        this.domField.style.border = '1px solid #3ac55c';
        this.domField.style.background = '#004110';
        this.domField.style.color = "#caffba";
        // this.domField.setAttribute('maxLength', 9);
        this.domField.zIndex = -1;
        
        this.focused = false;
        
        this.pixiObject.addChild(this.background);
        this.pixiObject.addChild(this.backgroundFocused);
        // this.pixiObject.addChild(this.text);
        
        this.background.interactive = true;
        this.backgroundFocused.interactive = true;
        this.pixiObject.interactive = true;
        var _this = this;
        
        function click() {
            _this.domField.focus();
        }
        function onFocus() {
            _this.backgroundFocused.visible = true;
            // if(_this.text.text === 'First name') _this.text.text = '';
            _this.domField.style.background = '#038a25';
        }
        function onBlur() {
            _this.backgroundFocused.visible = false;
            // if(_this.text.text === '') _this.text.text = 'First name';
            _this.domField.style.background = '#004110';
        }
        
        this.background.mousedown = click;
        this.background.touchstart = click;
        
        _this.domField.onfocus = onFocus;
        _this.domField.onblur = onBlur;
        
        _this.domField.onkeyup = function() {
            _this.text.text = _this.domField.value;
        };
        _this.domField.onkeydown = function() {
            _this.text.text = _this.domField.value;
        };
    }

    setInactive() {
        this.domField.disabled = true;
    }

    setPosition(x, y) {
        const canvas = document.getElementsByTagName('canvas')[0];
        const div = document.getElementsByTagName('canvas')[0];
        // this.domField.style.top = canvas.offsetTop - ((this.game.height / 2)) + y / this.ratioWidth - (this.game.shift / this.ratioWidth) + 'px';
        this.domField.style.top = div.getBoundingClientRect().y + y / this.ratioWidth + 'px';
        this.domField.style.left = div.getBoundingClientRect().x + x / this.ratioWidth + 'px';
        // this.domField.style.left = canvas.offsetLeft - (this.game.width / 2) + x / this.ratioWidth + 'px';
    }

    checkLength() {
        const el = this.text.text.split('');
        let word = '';
        this.text.text = word;
        el.forEach((item)=>{

            if( this.text.width < this.options.width-60) {
                word = word + item;
                this.text.text = word;
                
            } else {
                this.text.text = word + '...';
            }

        });
        
    }

    drawInput(scale) {
        this.domField.style.width = `${this.options.width * scale}px`;
        this.domField.style.height = `${this.options.height * scale}px`;
        this.domField.style.fontSize = Math.round(this.options.fontSize * scale) + 'px';
    }
}