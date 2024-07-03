import { SET_PROJECT_DETAILS, } from '../constent';

const initialState = {
    Link: "",
    Title: "",
    icon: "",
    id: '',
    project_api_key: "",
    project_browser: "",
    project_created_date: "",
    project_favicon: null,
    project_ip_address: "",
    project_language_id: "",
    project_logo: null,
    project_modified_date: "",
    project_name: "",
    project_status: "",
    project_timezone_id: "",
    project_website: "",
    selected: false,
    user_id: "",
}
export default function projectDetailsReducer(state = initialState, action) {
    switch (action.type) {
        case SET_PROJECT_DETAILS: {
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
