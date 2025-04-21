import { SET_PROJECT_DETAILS, } from '../constent';

const initialState = {
    Link: "",
    Title: "",
    icon: "",
    id: '',
    apiKey: "",
    browser: "",
    createdAt: "",
    favicon: null,
    ipAddress: "",
    languageId: "",
    logo: null,
    project_modified_date: "",
    name: "",
    status: "",
    timezoneId: "",
    website: "",
    selected: false,
    userId: "",
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
