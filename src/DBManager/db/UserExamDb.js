import DbManager from "../DbManager";

class UserExamDbClass {

    enrollUserExam = function (data) {
        return DbManager.callServer("POST", "/v1/api/UserExam", data);
    };

    deleteUserExam = function (sId, examId) {
        return DbManager.callServer("DELETE", `/v1/api/UserExam?id=${sId}&examId=${examId}`);
    };

    getUserExamById = function (sId, examId) {
        return DbManager.callServer("GET", `/v1/api/UserExam/GetUserExamById?id=${sId}&examId=${examId}`);
    };

    updateUserExamStatus = function (userExamId) {
        return DbManager.callServer("PUT", `/v1/api/UserExam/UpdateUserExamStatus?userExamId=${userExamId}`);
    };
}

const UserExamDb = new UserExamDbClass();
export default UserExamDb;
