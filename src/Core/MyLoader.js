import {
    Loader,
    Texture,
    BaseTexture
} from 'pixi.js';

export default class MyLoader {

    static loaders = [];
    constructor() {
        
    }

    static loader() {
        const loader = new Loader();

        MyLoader.loaders.push(loader);

        return loader;
    }

    static async loadAssets(loader) {
        return new Promise((resolve) => {
            loader.load(() => {
                resolve();
            });
        });
    }

    static getResource(name) {
        let resource;

        for (let i = 0; i < MyLoader.loaders.length; i++) {
            if (MyLoader.loaders[i].resources[name]) {
                resource = MyLoader.loaders[i].resources[name];
                break;
            }
        }
        return resource;
    }

    static async loadTexture(url){
        return new Promise ((resolve) => {
            const img = new Image();
            img.crossOrigin = '';
            img.src = url;
            img.onload = () => {
                const base = new BaseTexture(img);
                resolve(new Texture(base));
            };
        });
    }

}