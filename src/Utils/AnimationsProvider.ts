import { Hero } from '../Hero/Hero';
import { HeroType } from '../Hero/HeroType';
import { App } from '../App';
import { app } from '../index';

export class AnimationsProvider {
    public static async creatureAttackAnimation(creature: Hero): Promise<void> {
        await App.timeline.to(creature.sprite, {
            x: (creature.heroType === HeroType.Player)
                ? app.view.width * 17 / 20
                : app.view.width * 4 / 20,
            duration: 0.5,
            repeat: 1,
            yoyo: true,
        });
    };

    public static async creatureBlinkAnimation(creature: Hero): Promise<void> {
        await App.timeline.to(creature.sprite, {
            alpha: 0,
            duration: 0.1,
            repeat: 5,
            yoyo: true,
        });
    };

    public static previewHeroes(): void {
        Hero.heroes.forEach(hero => {
            gsap.to(hero.sprite, {
                x: hero._appearance.x,
                y: hero._appearance.y,
                duration: 1.0,
                repeat: 0,
                yoyo: false,
                rotation: 2 * Math.PI,
            });
        })
    };

    public static hideHeroes(): void {
        Hero.heroes.forEach(hero => {
            gsap.to(hero.sprite, {
                x: Math.random() * app.view.width,
                y: Math.random() * app.view.height + app.view.height + 100,
                duration: 1.0,
                repeat: 0,
                yoyo: false,
                rotation: 2 * Math.PI,
            });
        });
    };
};