import { ResourcesProvider } from './Utils/ResourcesProvider';
import { AssetsHandler } from './Utils/AssetsHandler';
export const app: PIXI.Application = new PIXI.Application({
    width: window.innerWidth - 15,
    height: window.innerHeight - 25,
    backgroundColor: 0xAAFFFF,
});

ResourcesProvider.fetchUnits()
    .then(heroesData => AssetsHandler.loadAssets(heroesData))





