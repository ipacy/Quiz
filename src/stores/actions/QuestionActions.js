import QuestionDispatcher from "../AppDispatcher";
import actionTypes from "../actionTypes";
import APIManager from "../APIManager";

/**
 * @param   {string} examId  Exam Id
 * @function
 * Get Questions by exam
 */
export async function getQuestionsByExam(examId) {
    const questions = await APIManager.callServer("GET", `/v1/api/Question/GetQuestionsByExam?examId=${examId}`);
    QuestionDispatcher.dispatch({
        actionTypes: actionTypes.GET_QUESTIONS_BY_EXAM,
        questions: questions['data'],
        messages: []
    });
}

/**
 * @param   {string} examId  Exam Id
 * @param   {Object} question Question Data
 * @function
 * Add questions
 */
export async function addQuestion(question, examId) {
    await APIManager.callServer("POST", `/v1/api/Question/AddQuestion?examId=${examId}`, question);
    await getQuestionsByExam(examId);
    QuestionDispatcher.dispatch({
        actionTypes: actionTypes.ADD_QUESTION,
        messages: []
    });
}

/**
 * @param   {string} examId  Exam Id
 * @function
 * Get Questions by Id
 */
export async function getQuestionById(examId) {
    let data = [], error = null;
    await APIManager.callServer("GET", `/v1/api/Question/GetQuestionById?examId=${examId}`).then(response => {
        data = response['data'];
        error = null;
    }).catch(e => {
        data = [];
        error = e['status'];
    });
    QuestionDispatcher.dispatch({
        actionTypes: actionTypes.GET_QUESTION_BY_ID,
        questionItem: data,
        error: error,
    });
}

/**
 * @param   {string} sId  Question Id
 * @param   {string} examId  Exam Id
 * @function
 * Get Questions by Id
 */
export async function deleteQuestion(sId, examId) {
    const questions = await APIManager.callServer("DELETE", `/v1/api/Question/DeleteQuestion?id=${sId}`);
    await getQuestionsByExam(examId)
    QuestionDispatcher.dispatch({
        actionTypes: actionTypes.DELETE_QUESTION,
        messages: questions.messages ? questions.messages : []
    });
}

/**
 * @param   {Object} question  Question Payload
 * @param   {string} examId  Exam Id
 * @function
 * Get Questions by Id
 */
export async function updateQuestion(question, examId) {
    const questions = await APIManager.callServer("PUT", `/v1/api/Question/UpdateQuestion`, question);
    await getQuestionsByExam(examId)
    QuestionDispatcher.dispatch({
        actionTypes: actionTypes.UPDATE_QUESTION,
        messages: questions.messages ? questions.messages : []
    });
}

/**
 * @param   {string} questionId  Question Id
 * @param   {string} userExamId  User Exam Id
 * @function
 * Get Questions by question Id
 */
export async function getOptionByQuestion(questionId, userExamId) {
    return await APIManager.callServer("GET", `/v1/api/Question/GetOptionsByQuestion?questionId=${questionId}&userExamId=${userExamId}`);
}

/**
 * @param   {Object} question  Question Payload
 * @function
 * Get Questions by Id
 */
export async function updateOption(question) {
    return await APIManager.callServer("PUT", `/v1/api/Option/UpdateOption`, question);
}


export async function getAllQuestions() {
    const questions = await APIManager.callServer("GET", '/v1/api/Question/GetAllQuestions');
    QuestionDispatcher.dispatch({
        actionTypes: actionTypes.GET_ALL_QUESTION,
        allQuestions: questions['data']
    });
}
