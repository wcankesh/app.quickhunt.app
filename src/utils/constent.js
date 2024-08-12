import {ApiService} from "./ApiService";

export const baseUrl = '';
export const urlParams = new URLSearchParams(window.location.search);

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

// Check if the token is about to expire (within the next minute)
export const isTokenAboutToExpire = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return true;

    const tokenParts = JSON.parse(atob(token.split('.')[1]));
    const exp = tokenParts.exp;
    if (!exp) return true;
    return Date.now() >= exp * 1000;
};


export const apiService = new ApiService();