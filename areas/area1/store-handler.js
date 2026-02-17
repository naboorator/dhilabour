GameStore.onReady(() => {
    store.actions.onActions.subscribe(action => {
        if (action.name === area1Actions.acceptIntoTask) {
            updateArea1Task1Response(action.data)
        }
    });
})

function updateArea1Task1Response(status) {
    let state = GameStore.getState()
    GameStore.changeStates(GameStore.getState(), {
        ...state,
        areas: {
            ...state.areas,
            area1: {
                ...state.areas.area1,
                tasks: {
                    ...state.areas.area1.tasks,
                    task1: {
                        accepted: status
                    }
                }
            }

        }
    });
}


function updateArea1BoxLifted(status) {
    let state = GameStore.getState()
    GameStore.changeStates(GameStore.getState(), {
        ...state,
        areas: {
            ...state.areas,
            area1: {
                ...state.areas.area1,
                tasks: {
                    ...state.areas.area1.tasks,
                    boxCanBeLiftedNoticedShowed: status
                }
            }

        }
    });
}


function isGameArea1Task1Accepted() {
    return GameStore.getState().areas.area1.tasks.task1.accepted;
}

function shouldShowBoxCanBeLifted() {
    return !GameStore.getState().areas.area1.tasks.boxCanBeLiftedNoticedShowed
}
