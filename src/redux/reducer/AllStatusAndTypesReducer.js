import {SET_All_STATUS_TYPE,} from '../constent';

const initialState = {
    categories: [],
    labels: [],
    members: [],
    roadmap_status: [],
    topics: [],
    projectList: [],
    emoji:[],
    boards:[]
}
export default function allStatusAndTypesReducer(state = initialState, action) {

    switch (action.type) {
        case SET_All_STATUS_TYPE: {
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
