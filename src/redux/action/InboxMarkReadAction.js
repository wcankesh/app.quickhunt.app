import { SET_MARK_AS_READ, } from '../constent';

export const inboxMarkReadAction = (payload) => {
    return(
        {
            type: SET_MARK_AS_READ,
            payload
        }
    )
};