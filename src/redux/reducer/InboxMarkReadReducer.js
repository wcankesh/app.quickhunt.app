import {SET_MARK_AS_READ,} from '../constent';

export default function inboxMarkReadReducer (state = [], action) {
    switch (action.type) {
        case SET_MARK_AS_READ: {
            return [...action.payload]
        }
        default: {
            return state
        }
    }
}