import ExamDispatcher from "../AppDispatcher";
import actionTypes from "../actionTypes";
import DbManager from "../DBManager";

export async function getExams() {
    const exams = await DbManager.callServer("GET", "/v1/api/Exam");
    ExamDispatcher.dispatch({
        actionTypes: actionTypes.GET_EXAMS,
        exams: exams['data'],
    });
}

export async function addExam(exam) {
    const addExam = await DbManager.callServer("POST", "/v1/api/Exam", exam);
    if (!!addExam['data']) {
        await getExams();
    }
    ExamDispatcher.dispatch({
        actionTypes: actionTypes.ADD_EXAM,
        exams: addExam['data'],
    });
}

export async function updateExam(exam) {
    const addExam = await DbManager.callServer("PUT", "/v1/api/Exam", exam);
    if (!!addExam['data']) {
        await getExams();
    }
    ExamDispatcher.dispatch({
        actionTypes: actionTypes.UPDATE_EXAM,
        exams: addExam['data'],
    });
}

/*export async function getExamsByUser() {
    const exams = await DbManager.callServer("GET", "/v1/api/UserExam/GetExamByUser");
    ExamDispatcher.dispatch({
        actionTypes: actionTypes.UPDATE_EXAM,
        myexam: exams['data'],
    });
}*/
