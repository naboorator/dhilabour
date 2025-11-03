class AssetsLoader {

    assetsList = {
        images: [],
        audio: [],
    }

    totalItems = 0;

    numOfLoaded = null;

    onLoadAll = (el) => {
        //  console.log('All assets loaded')
    }

    onLoadUpdate = (el) => {
        //   console.log('Asset loaded')
    }

    onError = (err) => {

    }

    addImage(path) {
        if (path instanceof Array) {
            path.forEach((pathToImage) => {
                const el = document.createElement('img');
                el.src = pathToImage;
                ++this.totalItems;
                this.assetsList.images.push(el);
            })
        } else {
            const el = document.createElement('img');
            el.src = path;
            this.assetsList.images.push(el);
            ++this.totalItems;
        }
    }

    addSound(path) {
        if (path instanceof Array) {
            path.forEach((pathToAudio) => {
                const el = document.createElement('audio');
                el.src = pathToAudio;
                ++this.totalItems;
                this.assetsList.audio.push(el);
            })
        } else {
            const el = document.createElement('audio');
            el.src = path
            this.assetsList.audio.push(el);
            ++this.totalItems;
        }

    }


    loadAll() {
        this.assetsList.images.forEach(image => {
            image.onload = (status) => {
                console.log('Image loaded', image);
                this.numOfLoaded = (this.numOfLoaded === null) ? 1 : this.numOfLoaded + 1
                this.checkIfComplete(image)
            }

            image.onerror = (status) => {
                this.onError('could not load image ' + image.src)
            }
        })

        this.assetsList.audio.forEach(audio => {
            audio.onloadeddata = (status) => {
                this.numOfLoaded = (this.numOfLoaded === null) ? 1 : this.numOfLoaded + 1
                this.checkIfComplete(audio)
            }

            audio.onerror = (status) => {
                this.onError('could not load audio ' + audio.src)
            }

        })
    }


    checkIfComplete(asset) {
        console.log(this.numOfLoaded, this.totalItems)
        if (this.numOfLoaded === this.totalItems) {
            this.onLoadAll(this);
        } else {
            this.onLoadUpdate(asset);
        }
    }

}
