import UserExamDispatcher from "../AppDispatcher";
import actionTypes from "../actionTypes";
import APIManager from "../APIManager";


export async function getExamsByUser() {
    const exams = await APIManager.callServer("GET", "/v1/api/UserExam/GetExamByUser");
    UserExamDispatcher.dispatch({
        actionTypes: actionTypes.GET_EXAMS_BY_USER,
        exams: exams['data'],
        messages: []
    });
}


export async function enrollUserExam(data) {
    const enrolled = await APIManager.callServer("POST", "/v1/api/UserExam/EnrollUserExam", data);
    UserExamDispatcher.dispatch({
        actionTypes: actionTypes.ENROLL_USER_EXAM,
        enrolled: enrolled['data'],
        messages: enrolled['messages']
    });
}

export async function deleteUserExam(sId, examId) {
    const deleted = await APIManager.callServer("DELETE", `/v1/api/UserExam/DeleteUserExam?id=${sId}&examId=${examId}`);
    await getExamsByUser();
    UserExamDispatcher.dispatch({
        actionTypes: actionTypes.DELETE_USER_EXAM,
        messages: deleted['messages']
    });
}


export async function getUserExamById(sId, examId) {
    const exams = await APIManager.callServer("GET", `/v1/api/UserExam/GetUserExamById?id=${sId}&examId=${examId}`);
    UserExamDispatcher.dispatch({
        actionTypes: actionTypes.GET_USEREXAM_BY_ID,
        exams: exams['data']
    });
}

export async function updateUserExamStatus(userExamId) {
    return await APIManager.callServer("PUT", `/v1/api/UserExam/UpdateUserExamStatus?userExamId=${userExamId}`);
}


export async function submitUserAnswer(data) {
    return await APIManager.callServer("POST", '/v1/api/UserAnswer/SubmitUserAnswer', data);
}
