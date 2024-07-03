import { SET_PROJECT_DETAILS, } from '../constent';

export const projectDetailsAction = (objValues) => {
    return(
        {
            type: SET_PROJECT_DETAILS,
            payload: objValues
        }

    )

};
