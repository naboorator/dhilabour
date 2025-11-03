class GameSound {
    /**
     * Audio
     * @type {Audio[]}
     */
    audioPool = [];
}


class Sound {
    file = ''
    /**
     * Audio
     * @type { HTMLAudioElement[]}
     */
    audioPool = [];

    playedIndex = 0;

    loaded = new Subject();

    error = new Subject();

    constructor(file, poolSize) {
        const i = 0;
        this.file = file;
        this.loadFile(this.file);

        this.audioPool.push(new Audio(file))


    }

    loadFile(file) {
        const audio = new Audio(file);
        audio.onload = (status) => {
            this.loaded.next(true);
        };

        audio.onerror = (err) => {
            this.loaded.next(false);
            this.error.next(err);
        }
    }

    play() {
        this.audioPool[this.playedIndex].play();
    }

    volume(number) {
        this.audioPool[this.playedIndex].volume = number > 1 ? 1 : number;
        return this;
    }

    setOffset(offest) {
        this.audioPool[this.playedIndex].currentTime = offest;
        return this;
    }
}
