import QuestionDispatcher from "../AppDispatcher";
import actionTypes from "../actionTypes";
import APIManager from "../APIManager";


/**
 * @function
 * Get Dashboard
 */
export async function getDashBoard() {
    const dashboard = await APIManager.callServer("GET", "/v1/api/Global/GetDashboard");
    QuestionDispatcher.dispatch({
        actionTypes: actionTypes.GET_DASHBOARD,
        data: dashboard['data']
    });
}
