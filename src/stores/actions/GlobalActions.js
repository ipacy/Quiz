import QuestionDispatcher from "../AppDispatcher";
import actionTypes from "../actionTypes";
import APIManager from "../APIManager";


/**
 * @function
 * Get Dashboard
 */
export async function getDashBoard() {
    //const dashboard = await APIManager.callServer("GET", "/v1/api/Global/GetDashboard");
    APIManager.callServer("GET", "/v1/api/Global/GetDashboard").then((response) => {
        QuestionDispatcher.dispatch({
            actionTypes: actionTypes.GET_DASHBOARD,
            data: response['data'],
            error: null
        });
    }).catch(e => {
        QuestionDispatcher.dispatch({
            actionTypes: actionTypes.GET_DASHBOARD,
            error: e['status'],
            data: []
        });
    });
}
