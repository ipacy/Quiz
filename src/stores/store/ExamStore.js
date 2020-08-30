import {EventEmitter} from "events";
import AppDispatcher from "../AppDispatcher";
import actionTypes from "../actionTypes";

const CHANGE_EVENT = "change";
let _exams = [];

class ExamStore extends EventEmitter {
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    getExams() {
        return _exams;
    }
}

const examStore = new ExamStore();

AppDispatcher.register((action, a) => {
    switch (action.actionTypes) {
        case actionTypes.GET_EXAMS:
            _exams = action.exams;
            examStore.emitChange();
            break;
        case  actionTypes.ADD_EXAM:
            examStore.emitChange();
            break;
        case actionTypes.UPDATE_EXAM:
            examStore.emitChange();
            break;
        default:
            break;
    }
});

export default examStore;
