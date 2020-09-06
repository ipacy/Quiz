import ExamDispatcher from "../AppDispatcher";
import actionTypes from "../actionTypes";
import APIManager from "../APIManager";

export async function getExams() {
    const exams = await APIManager.callServer("GET", "/v1/api/Exam/GetExams");
    ExamDispatcher.dispatch({
        actionTypes: actionTypes.GET_EXAMS,
        exams: exams['data'],
    });
}

export async function addExam(exam) {
    const addExam = await APIManager.callServer("POST", "/v1/api/Exam/AddExam", exam);
    if (!!addExam['data']) {
        await getExams();
    }
    ExamDispatcher.dispatch({
        actionTypes: actionTypes.ADD_EXAM,
        exams: addExam['data'],
    });
}

export async function updateExam(exam) {
    const addExam = await APIManager.callServer("PUT", "/v1/api/Exam/UpdateExam", exam);
    if (!!addExam['data']) {
        await getExams();
    }
    ExamDispatcher.dispatch({
        actionTypes: actionTypes.UPDATE_EXAM,
        exams: addExam['data'],
    });
}
