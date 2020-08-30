import {EventEmitter} from "events";
import AppDispatcher from "../AppDispatcher";
import actionTypes from "../actionTypes";

const CHANGE_EVENT = "change";
let _data = {
    messages: undefined,
    token: "",
    expireDate: ""
};

class LoginStore extends EventEmitter {
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    checkUser() {
        return _data;
    }
}

const loginStore = new LoginStore();

AppDispatcher.register((action) => {
    switch (action.actionTypes) {
        case actionTypes.CHECK_USER:
            _data = action.data;
            loginStore.emitChange();
            break;
        default:
            break;
    }
});

export default loginStore;
