import QuestionDispatcher from "../AppDispatcher";
import actionTypes from "../actionTypes";
import APIManager from "../APIManager";


/**
 * @function
 * Get Dashboard
 */
export async function checkUser(user) {
    try {
        const checkUser = await APIManager.callServer("POST", "/v1/api/Auth/Login", user);
        QuestionDispatcher.dispatch({
            actionTypes: actionTypes.CHECK_USER,
            data: checkUser
        });
    } catch (e) {
        QuestionDispatcher.dispatch({
            actionTypes: actionTypes.CHECK_USER,
            data: e
        });
    }


}

