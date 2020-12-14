import { format } from "path";
import { Howl } from 'howler';
export class SoundProvider {
    public static battleSound: any;
    public static hitSound: any;

    constructor() {
        SoundProvider.battleSound = new Howl({
            src: ['../../assets/battle.mp3'],
            volume: 0.5,
          });

          SoundProvider.hitSound = new Howl({
            src: ['../../assets/hit.wav'],
            volume: 1,
          });
    }
}