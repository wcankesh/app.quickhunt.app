import { SET_USER_DETAILS, } from '../constent';

export const userDetailsAction = (objValues) => {
    return(
        {
            type: SET_USER_DETAILS,
            payload: objValues
        }

    )

};
