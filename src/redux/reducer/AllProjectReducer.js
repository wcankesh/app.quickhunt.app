import {SET_All_PROJECT} from '../constent';

const initialState = {
    projectList: [],
}

export default function allProjectReducer(state = initialState, action) {
    switch (action.type) {
        case SET_All_PROJECT: {
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
