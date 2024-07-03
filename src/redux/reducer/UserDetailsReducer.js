import { SET_USER_DETAILS, } from '../constent';

const initialState = {
    id: "",
    user_browser: null,
    user_created_date: "",
    user_email_id: "",
    user_first_name: "",
    user_ip_address: null,
    user_job_title: "",
    user_last_name: "",
    user_photo: "",
    user_status: "",
    user_updated_date: "",
}
export default function userDetailsReducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER_DETAILS: {
            return {
                ...state,
                ...action.payload,
            }
        }
        default: {
            return state
        }
    }
}
