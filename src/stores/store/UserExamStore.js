import {EventEmitter} from "events";
import AppDispatcher from "../AppDispatcher";
import actionTypes from "../actionTypes";

const CHANGE_EVENT = "change";
let _exams = [];
let _messages = [];
let _enrolled = false;
let _examByUser = {};

class UserExamStore extends EventEmitter {
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    getExamsByUser() {
        return _exams;
    }

    getMessages() {
        return _messages
    }

    getEnrolled() {
        return _enrolled
    }

    getUserExamById() {
        return _examByUser;
    }
}

const userExamStore = new UserExamStore();

AppDispatcher.register((action, a) => {
    switch (action.actionTypes) {
        case actionTypes.GET_EXAMS_BY_USER:
            _exams = action.exams;
            _examByUser = null;
            _messages = action.messages;
            userExamStore.emitChange();
            break;
        case actionTypes.ENROLL_USER_EXAM:
            _enrolled = action.enrolled;
            _examByUser = null;
            _messages = action.messages;
            userExamStore.emitChange();
            break;
        case actionTypes.DELETE_USER_EXAM:
            _examByUser = null;
            _messages = action.messages;
            userExamStore.emitChange();
            break;
        case actionTypes.GET_USEREXAM_BY_ID:
            _exams = [];
            _examByUser = action.exams;
            _messages = action.messages;
            userExamStore.emitChange();
            break;
        // eslint-disable-next-line no-fallthrough
        default:
            break;
    }
});

export default userExamStore;
