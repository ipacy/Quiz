import DbManager from "../DbManager";

class GlobalDbClass {
    getDashBoard = function () {
        return DbManager.callServer("GET", "/v1/api/Global/GetDashboard");
    };
}

const GlobalDb = new GlobalDbClass();
export default GlobalDb;
