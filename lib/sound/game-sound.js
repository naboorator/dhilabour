class SoundPool {
    /**
     * Audio
     * @type {Audio[]}
     */
    audioPool = [];
}


class Sound {

    /**
     *
     * @type {string}
     */
    file = '';

    /**
     * Audio
     * @type { HTMLAudioElement}
     */
    audio;


    constructor(file) {
        this.file = file;
        this.audio = new Audio(file);
    }


    play() {
        if (game.settings.sound) {
            this.audio.play();
        }
    }

    /**
     *
     * @param number
     * @returns {Sound}
     */
    volume(number) {
        this.audio.volume = number > 1 ? 1 : number;
        return this;
    }

    /**
     *
     * @param offsetInSeconds {number}
     * @returns {Sound}
     */
    setOffset(offsetInSeconds) {
        this.audio.currentTime = offsetInSeconds;
        return this;
    }
}
