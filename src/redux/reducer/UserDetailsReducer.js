import { SET_USER_DETAILS, } from '../constent';

const initialState = {
    id: "",
    browser: null,
    createdAt: "",
    email: "",
    firstName: "",
    ipAddress: null,
    jobTitle: "",
    lastName: "",
    profileImage: "",
    status: "",
    updatedAt: "",
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
