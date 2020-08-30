import {EventEmitter} from "events";
import AppDispatcher from "../AppDispatcher";
import actionTypes from "../actionTypes";

const CHANGE_EVENT = "change";
let newQuestionItem = {
    id: '',
    title: '',
    entryType: 'newlyAdded',
    ratePolicy: 0,
    answerTypes: [
        {key: '0', text: 'Single Select'},
        {key: '1', text: 'Multi Select'}],
    options: [
        {'createdDate': '', 'id': '', 'title': '', imageUrl: '', isCorrect: false, score: 0},
        {'createdDate': '', 'id': '', 'title': '', imageUrl: '', isCorrect: false, score: 0},
        {'createdDate': '', 'id': '', 'title': '', imageUrl: '', isCorrect: false, score: 0},
        {'createdDate': '', 'id': '', 'title': '', imageUrl: '', isCorrect: false, score: 0}
    ],
    type: '0'
};
let _messages = [];
let _questions = [];
let _questionItem = {...newQuestionItem};

class QuestionStore extends EventEmitter {
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    getQuestionsByExam() {
        return _questions;
    }

    getMessages() {
        return _messages
    }

    getQuestionItem() {
        return _questionItem;
    }

    getOptionByQuestion() {
        return _questionItem;
    }

}

const questionStore = new QuestionStore();

AppDispatcher.register((action) => {
    switch (action.actionTypes) {
        case actionTypes.GET_QUESTIONS_BY_EXAM:
            _questions = action.questions;
            _messages = [];
            questionStore.emitChange();
            break;
        case actionTypes.ADD_QUESTION:
            _messages = action.messages;
            questionStore.emitChange();
            break;
        case actionTypes.GET_QUESTION_BY_ID:
            _questionItem = action.questionItem;
            questionStore.emitChange();
            break;
        case actionTypes.DELETE_QUESTION:
            _messages = action.messages;
            _questionItem = {...newQuestionItem};
            questionStore.emitChange();
            break;
        case actionTypes.UPDATE_QUESTION:
            _messages = action.messages;
            questionStore.emitChange();
            break;
        default:
            break;
    }
});

export default questionStore;
