import {EventEmitter} from "events";
import AppDispatcher from "../AppDispatcher";
import actionTypes from "../actionTypes";

const CHANGE_EVENT = "change";
let _data = {
    "allExams": 0,
    "questions": 0
};

class GlobalStore extends EventEmitter {
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    getDashBoard() {
        return _data;
    }
}

const globalStore = new GlobalStore();

AppDispatcher.register((action) => {
    switch (action.actionTypes) {
        case actionTypes.GET_DASHBOARD:
            _data = action.data;
            globalStore.emitChange();
            break;
        default:
            break;
    }
});

export default globalStore;
