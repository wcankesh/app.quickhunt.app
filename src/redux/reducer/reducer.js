import { combineReducers } from 'redux';
import projectDetailsReducer from "./ProjectDetailsReducer";
import userDetailsReducer from "./UserDetailsReducer";
import allStatusAndTypesReducer from "./AllStatusAndTypesReducer";
import allProjectReducer from "./AllProjectReducer";

const reducer = combineReducers({
    projectDetailsReducer : projectDetailsReducer,
    userDetailsReducer : userDetailsReducer,
    allStatusAndTypes : allStatusAndTypesReducer,
    allProjectReducer : allProjectReducer,
});

export default reducer