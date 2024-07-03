import { SET_All_PROJECT, } from '../constent';

export const allProjectAction = (objValues) => {

    return(
        {
            type: SET_All_PROJECT,
            payload: objValues
        }

    )

};
