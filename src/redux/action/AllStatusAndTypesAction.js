import { SET_All_STATUS_TYPE, } from '../constent';

export const allStatusAndTypesAction = (objValues) => {

    return(
        {
            type: SET_All_STATUS_TYPE,
            payload: objValues
        }

    )

};
