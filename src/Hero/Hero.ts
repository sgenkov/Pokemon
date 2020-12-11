import { app } from '../index';
import { SpriteView } from '../SpriteView';
import { HeroInfo } from './HeroInfo';
import { HealthBar } from './HealthBar';
import { HeroType } from './HeroType';
import { App } from '../App';
export class Hero {
    public static heroes: Hero[] = [];
    private static _appearancePosition: any = { x: 0, y: 60 };
    private static _moral: number = 30;
    public _appearance: any;
    private _heroType: HeroType;
    private _id: number;
    private _name: string;
    private _ability: string;
    private _moves: string[];
    public _speed: number;
    private _special_defense: number;
    private _special_attack: number;
    private _defense: number;
    private _attack: number;
    public _hitPoints: number;
    private _currentHitPoints: number;
    private _moral: number;
    private _healthBar: HealthBar;

    private heroInfo: HeroInfo;

    private _battleMode: boolean = false;


    public sprite: PIXI.Sprite;
    private sprite_front_default: PIXI.Sprite;
    private _sprite_back_default: PIXI.Sprite;

    public constructor(heroStats: any) {
        this._id = heroStats.id - 1;
        this._name = heroStats.name;
        this._ability = heroStats.ability;
        this._moves = heroStats.moves;
        this._speed = heroStats.primaryStats.speed;
        this._special_defense = heroStats.primaryStats['special-defense'];
        this._special_attack = heroStats.primaryStats['special-attack'];
        this._defense = heroStats.primaryStats.defense;
        this._attack = heroStats.primaryStats.attack;
        this._hitPoints = heroStats.primaryStats.hp;
        this._currentHitPoints = this._hitPoints;
        this._appearance = { ...Hero.appearancePosition };
        this._moral = Hero.moral;
        this._heroType = HeroType.Opponent;
        heroStats.primaryStats.moral = this.moral;
        this._healthBar = new HealthBar(this._hitPoints, this._currentHitPoints);
        this._healthBar.type = HeroType.Opponent;

        this.sprite_front_default = PIXI.Sprite.from(app.loader.resources[`${this._name}_front_default`].url);
        this._sprite_back_default = PIXI.Sprite.from(app.loader.resources[`${this._name}_back_default`].url);
        this.heroInfo = new HeroInfo(heroStats, app.loader.resources[`${this._name}_front_default`].url);
    };

    public attack(victim: Hero): number {
        const damage: number = (this._attack / victim._defense) * Math.round(Math.random() * 30); // 200 is too much, isn't it?
        
        (damage > 0) && (victim.currentHitPoints -= damage);
        victim.healthBar.updateHitpoints(victim.currentHitPoints);
        return damage;
    };




    public showYourself(
        xPosition: number = app.view.width / 2,
        yPosition: number = app.view.height / 2,
        view: SpriteView = SpriteView.sprite_front_default,
        scaleX: number = 1,
        scaleY: number = 1
    ): void {
        switch (view) {
            case SpriteView.sprite_front_default:
                this.sprite = this.sprite_front_default;
                break;
            case SpriteView.sprite_back_default:
                this.sprite = this.sprite_back_default;
                break;
        };

        this.sprite.scale.x = scaleX;
        this.sprite.scale.y = scaleY;
        this.sprite.x = xPosition;
        this.sprite.y = yPosition;
        this.sprite.anchor.set(0.5);
        this.sprite.buttonMode = true;
        this.sprite.interactive = true;

        this.sprite.on("pointerdown", () => {
            this._battleMode = true;
            this.heroType = HeroType.Player;
            this._healthBar.type = HeroType.Player;
            App.readyForBattle(this);
            Hero.heroes = Hero.heroes.filter(hero => hero.id !== this.id);
        });
        this.sprite.on("pointerover", () => {
            this.sprite.tint = 0x1AE8EA;
            this.heroInfo.toggleVisible();
        });
        this.sprite.on("pointerout", () => {
            this.sprite.tint = 16777215;
            this.heroInfo.toggleVisible();
        });
        app.stage.addChild(this.sprite);
    };


    public setBattleMode(mode: boolean) {
        this._battleMode = mode;
        if (this._battleMode) {
            if (this._heroType === HeroType.Player) {
                this.sprite = this.sprite_back_default;
                this.sprite.x = app.view.width / 9;
                this.sprite.y = app.view.height / 2;
            } else if (this._heroType === HeroType.Opponent) {
                this.sprite.x = app.view.width * 9 / 10;
                this.sprite.y = app.view.height / 2;
            }
            this.sprite.anchor.set(0.5);
            this.sprite.scale.x = 3.4;
            this.sprite.scale.y = 3.4;
            this.sprite.buttonMode = false;
            this.sprite.interactive = false;
            this.sprite.visible = true;
        } else {
            this.sprite = this.sprite_front_default;
            this.sprite.scale.x = 1;
            this.sprite.scale.y = 1;
            this.sprite.visible = true;
        };
    };


    public static createHeroes(heroesData: any): void {
        Hero.heroes = [];
        heroesData.map((hero: any) => {
            Hero.heroes.push(new Hero(this.getHeroStats(hero)));
        });
        Hero._appearancePosition = { x: 0, y: 60 };
    };

    private static getHeroStats(heroFullStack: any): any {
        const id: number = heroFullStack.id;
        const ability: any = heroFullStack.abilities.find((ability: any) => {
            return ability.is_hidden === false;
        }).ability.name;
        const moves: any = heroFullStack.moves.slice().splice(0, 4).map((move: any) => {
            return move.move.name;
        });

        const primaryStats: any = heroFullStack.stats.reduce((heroStatsContainer: any, stat: any) => {
            heroStatsContainer = Object.assign({ ...heroStatsContainer }, { [stat.stat.name]: stat.base_stat });
            return heroStatsContainer;
        }, {});

        return {
            id,
            name: heroFullStack.name,
            ability,
            moves,
            primaryStats
        };
    };

    public getBounds(): any {
        return this.sprite_front_default.getBounds();
    };

    public removeHero(): void {
        app.stage.removeChild(this.sprite);
    };

    public static get appearancePosition(): any {
        if (Hero._appearancePosition.x > app.view.width * 18 / 20) {//* 9 / 10
            Hero._appearancePosition.x = 0;
            Hero._appearancePosition.y += app.view.height * 3 / 20   //+= 100;
        };
        Hero._appearancePosition.x += app.view.width / 11;

        return Hero._appearancePosition;
    };

    public static get moral(): number {
        const currentMoral: number = Hero._moral--;
        return currentMoral;
    };
    public get moral(): number {
        return this._moral;
    };
    public get id(): number {
        return this._id;
    };

    public get sprite_back_default(): PIXI.Sprite {
        return this._sprite_back_default;
    };
    public set heroType(type: HeroType) {
        this._heroType = type;
        this._healthBar.type = type;
    };

    public get heroType(): HeroType {
        return this._heroType;
    };

    public set x(value: number) {
        this.sprite.x = value;
    };
    public get x(): number {
        return this.sprite.x;
    };
    public set y(value: number) {
        this.sprite.y = value;
    };
    public get y(): number {
        return this.sprite.y;
    };

    public get movementSpeed(): number {
        return this._speed;
    };

    public get hitPoints(): number {
        return this._hitPoints;
    };

    public set hitPoints(value: number) {
        this._hitPoints = value;
    };

    public get currentHitPoints(): number {
        return this._currentHitPoints;
    };

    public set currentHitPoints(value: number) {
        this._currentHitPoints = value;
    };

    public get name(): string {
        return this._name;
    };

    public get healthBar(): HealthBar {
        return this._healthBar;
    };


};
