import { app } from '../index';
import { App } from '../App';
export class AssetsHandler {
    public static heroesData: any;
    public static loadAssets(heroesData: any) {
        AssetsHandler.heroesData = heroesData;
        heroesData.forEach((hero: any) => {
            app.loader
                .add(`${hero.name}_front_default`, hero.sprites.front_default)
                .add(`${hero.name}_back_default`, hero.sprites.back_default)
        });

        app.loader.onProgress.add(this.showProgress);
        app.loader.onComplete.add(() => this.doneLoading());
        app.loader.onError.add(this.reportError);
        app.loader.load();
        app.stage.interactive = true;
    };

    private static doneLoading() {
        new App();
    };

    private static showProgress(e: any) {
        console.log(e.progress);
    };
    private static reportError(e: any) {
        console.log('ERROR : ' + e.message);
    };
};