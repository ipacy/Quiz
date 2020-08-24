import DbManager from "../DbManager";

class OptionDbClass {
    updateOption = function (question) {
        return DbManager.callServer("PUT", `/v1/api/Option`, question);
    };
}

const OptionDb = new OptionDbClass();
export default OptionDb;
