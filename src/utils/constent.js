import {ApiService} from "./ApiService";

export const baseUrl = '';

const TOKEN_KEY = 'token';
const PROJECT_KEY = 'currentProject';

export const login = () => {
    localStorage.setItem(TOKEN_KEY, 'TestLogin');
}

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
}

export const token = () => {
    return localStorage.getItem(TOKEN_KEY);
}

export const setProjectDetails = (projectDetails) => {
    return localStorage.setItem(PROJECT_KEY, JSON.stringify(projectDetails));
}
export const getProjectDetails = (key) => {
    let projectDetails = JSON.parse(localStorage.getItem(PROJECT_KEY));
    return key ? projectDetails && projectDetails[key] : projectDetails;
}

export const removeProjectDetails = () => {
    return localStorage.removeItem(PROJECT_KEY);
}

export const isLogin = () => {
    if (localStorage.getItem(TOKEN_KEY)) {
        return true;
    }
    return false;
}

export const apiService = new ApiService();