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
        const el = document.createElement('audio');
        el.src = path
        this.assetsList.audio.push(el);
    }


    loadAll() {
        this.assetsList.images.forEach(image => {
            image.onload = (status) => {

                this.numOfLoaded = (this.numOfLoaded === null) ? 1 : this.numOfLoaded + 1

                this.checkIfComplete(image)
            }
        })

        this.assetsList.audio.forEach(audio => {
            audio.onload = (status) => {

                this.numOfLoaded = (this.numOfLoaded === null) ? 1 : this.numOfLoaded + 1

                this.checkIfComplete(audio)
            }
        })
    }


    checkIfComplete(asset) {
        if (this.numOfLoaded === this.totalItems) {
            this.onLoadAll(this);
        } else {
            this.onLoadUpdate(asset);
        }
    }

}
