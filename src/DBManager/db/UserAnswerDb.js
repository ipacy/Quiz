import DbManager from "../DbManager";

class UserAnswerDbClass {
    submitUserAnswer = function (data) {
        return DbManager.callServer("POST", '/v1/api/UserAnswer/SubmitUserAnswer', data);
    };
}

const UserAnswerDb = new UserAnswerDbClass();
export default UserAnswerDb;
