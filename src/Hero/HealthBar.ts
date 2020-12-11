import { app } from '../index';
import { HeroType } from './HeroType';
export class HealthBar {
  private _hitPoints: number;
  private _currentHitPoints: number;
  private bar: PIXI.Graphics;
  private _type: HeroType;
  private _position: any = {
    startPoint: {
      x: 0,
      y: 0
    },
    endPoint: {
      x: 0,
      y: 0
    },
  };
  constructor(hitPoints: number, currentHitPoints: number) {
    this.bar = new PIXI.Graphics();
    this._hitPoints = hitPoints;
    this._currentHitPoints = currentHitPoints;
    this.createHpBar(this._currentHitPoints, this._hitPoints, 0x84F10F);
  };

  private createHpBar(currentHitPoints: number, hitPoints: number, color: any) {
    this.bar.beginFill(color);
    let hpPortion = this._currentHitPoints / this._hitPoints;
    this.bar.drawPolygon([
      50, 80,
      50 + (400 * hpPortion), 80,
      32 + (400 * hpPortion), 150,
      32, 150,
    ]);
    this.bar.endFill();
  };

  public async updateHitpoints(value: number): Promise<void> {
    this.createHpBar(this._currentHitPoints, this._hitPoints, 0xFF0000);
    this._currentHitPoints = value;
    await app.stage.removeChild(this.bar);
    await this.bar.beginFill(0x84F10F);

    let hpPortion = this._currentHitPoints / this._hitPoints;
    (hpPortion < 0) && (hpPortion = 0);

    await this.bar.drawPolygon([
      50, 80,
      50 + (400 * hpPortion), 80,
      32 + (400 * hpPortion), 150,
      32, 150,
    ]);
    await this.bar.endFill();
    await app.stage.addChild(this.bar)
  };
  public set type(type: HeroType) {
    this._type = type;
    this.bar.position.x =
      (this._type === HeroType.Player)
        ? app.view.width / 10
        : app.view.width * 6.5 / 10;
    this.bar.position.y = app.view.height * 8 / 10;
  };
  public toggleBar(state: boolean): void {
    state
      ? app.stage.addChild(this.bar)
      : app.stage.removeChild(this.bar);
  };
};