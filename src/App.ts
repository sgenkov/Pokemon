import { app } from './index';
import { Hero } from './Hero/Hero';
import { HeroType } from './Hero/HeroType';
import { Button } from './Utils/Button';
import gsap from 'gsap';
import { AssetsHandler } from './Utils/AssetsHandler';
import { AnimationsProvider } from './Utils/AnimationsProvider';
import { SoundProvider } from './Utils/SoundProvider';
export class App {
    public static background1: PIXI.Sprite;
    private static _battleMode: boolean = false;
    public static timeline: any;
    private static playerHero: Hero;
    private static opponentHero: Hero;
    private static text: PIXI.Text = new PIXI.Text("default", {
        fontSize: 100,
        fill: 0x000000,
        align: "center",
        stroke: "#bbbbbb",
        strokeThickness: 0,
    });
    private static winner: string;

    constructor() {
        document.body.appendChild(app.view);
        App.background1 = PIXI.Sprite.from(app.loader.resources[`background1`].url);
        App.background1.width = app.view.width;
        App.background1.height = app.view.height +  app.view.height / 5.5;
        app.stage.addChild(App.background1)
        Hero.createHeroes(AssetsHandler.heroesData);
        App.timeline = gsap.timeline();
        App.text.position.x = app.view.width / 2;
        App.text.position.y = app.view.height / 3;
        App.text.anchor.set(0.5);
        this.init();
    };

    public static newGame(): void {
        for (let i = app.stage.children.length - 1; i >= 0; i--) {
            app.stage.removeChild(app.stage.children[i]);
        };
        new App();
    };

    private init(): void {
        Hero.heroes.forEach(hero => {
            hero.showYourself(Math.random() * app.view.width, Math.random() * app.view.height);
        });
        new SoundProvider();
        AnimationsProvider.previewHeroes();
        app.ticker.start();
    };
    public static readyForBattle(hero: Hero): void {
        App.toggleBattleMode(true);
        
        AnimationsProvider.hideHeroes();
        SoundProvider.battleSound.play();
        setTimeout(async () => {
            await Hero.heroes.forEach(hero => app.stage.removeChild(hero.sprite));
        }, 1001);
        setTimeout(async () => {
            hero.heroType = HeroType.Player;
            hero.setBattleMode(true);
            App.playerHero = hero;
            app.stage.addChild(hero.sprite);
            App.selectOpponent();
            app.stage.addChild(App.opponentHero.sprite);
            App.battle();
        }, 2000);
    };

    private static async battle() {
        const sequnce: Hero[] = App.determineSequence();
        const fasterCreature = sequnce[0];
        const slowerCreature = sequnce[1];
        fasterCreature.healthBar.toggleBar(true);
        slowerCreature.healthBar.toggleBar(true);


        while (fasterCreature.currentHitPoints > 0 && slowerCreature.currentHitPoints > 0) {
            if (fasterCreature.currentHitPoints > 0 && slowerCreature.currentHitPoints > 0) {
                await AnimationsProvider.creatureAttackAnimation(fasterCreature);
            } else {
                break;
            };
            const fasterCreatureDamage: number = fasterCreature.attack(slowerCreature);

            if (slowerCreature.currentHitPoints > 0 && fasterCreatureDamage > 0 && fasterCreature.currentHitPoints > 0) {
                await AnimationsProvider.creatureBlinkAnimation(slowerCreature);
            } else {
                break;
            };

            if (slowerCreature.currentHitPoints > 0 && fasterCreature.currentHitPoints > 0) {
                await AnimationsProvider.creatureAttackAnimation(slowerCreature);
            } else {
                break;
            };
            const slowerCreatureDamage: number = slowerCreature.attack(fasterCreature);

            if (fasterCreature.currentHitPoints > 0 && slowerCreatureDamage > 0 && slowerCreature.currentHitPoints > 0) {
                await AnimationsProvider.creatureBlinkAnimation(fasterCreature);
            } else {
                break;
            };
        };
        if (fasterCreature.currentHitPoints <= 0) {
            fasterCreature.sprite.tint = 0x000000;
            App.winner = App.determineWinner(slowerCreature);
        };
        if (slowerCreature.currentHitPoints <= 0) {
            slowerCreature.sprite.tint = 0x000000;
            App.winner = App.determineWinner(fasterCreature);
        };

        App.text.text = App.winner;

        app.stage.addChild(App.text);

        new Button();
    };

    private static determineWinner(creature: Hero): string {
        return (creature.heroType === HeroType.Player) ? 'You Win' : 'You Lose';
    };

    private static determineSequence(): Hero[] {
        const sequence: Hero[] = [App.playerHero, App.opponentHero];
        if (App.playerHero._speed != App.opponentHero._speed) {
            sequence.sort((creature1: Hero, creature2: Hero) => creature2._speed - creature1._speed);
        } else {
            sequence.sort((creature1: Hero, creature2: Hero) => creature2.moral - creature1.moral);
        };
        return sequence;
    };
    private static selectOpponent(): void {
        let id: number = Math.random() * 19;
        App.opponentHero = Hero.heroes[Math.floor(id)];
        App.opponentHero.heroType = HeroType.Opponent;
        App.opponentHero.setBattleMode(true);
    };

    public static toggleBattleMode(value: boolean): void {
        App._battleMode = value;
    };
};