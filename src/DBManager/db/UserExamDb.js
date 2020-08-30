import DbManager from "../DbManager";

class UserExamDbClass {

    updateUserExamStatus = function (userExamId) {
        return DbManager.callServer("PUT", `/v1/api/UserExam/UpdateUserExamStatus?userExamId=${userExamId}`);
    };
}

const UserExamDb = new UserExamDbClass();
export default UserExamDb;
