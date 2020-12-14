import { app } from '..';
import { App } from '../App';
import { SoundProvider } from './SoundProvider';
export class Button {
    private button: PIXI.Graphics = new PIXI.Graphics();
    private text: PIXI.Text = new PIXI.Text("New Game", {
        fontSize: 30,
        fill: 0x000000,
        align: "center",
        stroke: "#bbbbbb",
        strokeThickness: 0,
    });
    constructor() {
        SoundProvider.battleSound.stop();
        this.button.beginFill(0xff0000);
        this.button.lineStyle(5, 0x00ff00);
        this.button.drawRect(app.view.width / 2 - 90, app.view.height / 2 - 40, 180, 80);
        this.button.endFill();

        this.button.buttonMode = true;
        this.button.interactive = true;
        this.button.on("pointerdown", () => {
            App.newGame();
        });

        this.text.position.x = app.view.width / 2;
        this.text.position.y = app.view.height / 2;
        this.text.anchor.set(0.5);

        app.stage.addChild(this.button);
        app.stage.addChild(this.text);
    };

    public removeButton(): void {
        app.stage.removeChild(this.button);
        app.stage.removeChild(this.text);
    };
};