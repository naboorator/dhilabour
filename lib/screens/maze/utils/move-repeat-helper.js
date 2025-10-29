class MoveRepeatHelper {
    /**
     * @type MazeMovementResolver
     */
    mazeMovementResolver;

    /**
     *
     * @type {Subject}
     */
    moveSuccess = new Subject(false);

    /**
     *
     * @type {Subject}
     */
    moveError = new Subject(false);


    /**
     *
     * @param mazeMovementResolver {MazeMovementResolver}
     */
    constructor(mazeMovementResolver) {
        this.mazeMovementResolver = mazeMovementResolver
    };

    /**
     *
     * @param mazeMovementResolver {MazeMovementResolver}
     * @param movesArray
     * @param item {BaseItem}
     * @param speed {number}
     * @returns {MoveRepeatResult}
     */
    repeatMoves(movesArray, item, speed) {
        let result = new MoveRepeatResult();

        let subscriptionError = this.moveError.subscribe(({successfulMoves}) => {
            if (successfulMoves.length > 0) {
                let reversOrder = this.makeContraMoves(successfulMoves.reverse());
                this._moveRepeat(reversOrder, item, speed);
                result.triggerError('could not complete sequence');
                subscriptionSuccess.unsubscribe();
                subscriptionError.unsubscribe();
            }
        });

        let subscriptionSuccess = this.moveSuccess.subscribe(({successfulMoves}) => {
            result.triggerSuccess('sequence completed');
            subscriptionSuccess.unsubscribe();
            subscriptionError.unsubscribe();
        });

        console.log(movesArray);
        this._moveRepeat(movesArray, item, speed);

        return result;

    }


    _moveRepeat(movesArray, item, speed) {
        let index = 0;
        let successfulMoves = [];
        if (movesArray.length > 0) {
            let intervalId = setInterval(() => {
                const move = movesArray[index];
                let hasMoved = false
                if (this.mazeMovementResolver[move]) {
                    hasMoved = this.mazeMovementResolver?.[move](item);
                } else {
                    console.error('mazeMovementResolver.' + move + ' not found');
                }


                if (!hasMoved) {
                    clearInterval(intervalId);
                    this.moveError.next({
                        successfulMoves,
                    })
                } else {
                    successfulMoves.push(move);
                    index++;
                }

                if (index >= movesArray.length) {
                    this.moveSuccess.next(successfulMoves)
                    clearInterval(intervalId);
                }
            }, speed)
        }
    }

    makeContraMoves(movesArray) {
        let reversed = [];
        movesArray.forEach((move) => {
            if (move === 'moveItemDown') {
                reversed.push('moveItemUp')
            }
            if (move === 'moveItemUp') {
                reversed.push('moveItemDown')
            }

            if (move === 'moveItemLeft') {
                reversed.push('moveItemRight')
            }

            if (move === 'moveItemRight') {
                reversed.push('moveItemLeft')
            }
        })

        return reversed;
    }
}


class MoveRepeatResult {

    _errorCallback = () => {

    }

    _successCallback = () => {
        console.log('moves completed succefully');
    }

    onError(callback) {
        this._errorCallback = callback;
        return this;
    }

    onSuccess(callback) {
        this._successCallback = callback;
        return this;
    }

    triggerError(msg) {
        this._errorCallback(msg);
    }

    triggerSuccess(msg) {
        this._successCallback(msg)
    }
}
