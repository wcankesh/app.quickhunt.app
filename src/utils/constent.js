import {ApiService} from "./ApiService";
import moment from "moment"
export const baseUrl = '';
export const urlParams = new URLSearchParams(window.location.search);
export const googleClientId = "637779819102-5mjjs6cdp723t5cm8nsb7vrop370sam2.apps.googleusercontent.com";
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

export const getDateFormat = (date) => {
    const now = moment();
    let localDatetime = moment(date + '+00:00').local();
    let NewDate = localDatetime || new Date();

    const diffInSeconds = now.diff(NewDate, 'seconds');
    const diffInMinutes = now.diff(NewDate, 'minutes');
    const diffInHours = now.diff(NewDate, 'hours');
    const diffInDays = now.diff(NewDate, 'days');
    const currentYear = moment().year();

    if (diffInSeconds < 30) {
        return 'a few seconds ago';
    } else if (diffInSeconds < 60) {
        return 'Less than a minute ago';
    } else if (diffInMinutes === 1) {
        return '1 minute ago';
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
    } else if (diffInHours === 1) {
        return '1 hour ago';
    } else if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
    } else if (diffInDays === 1) {
        return '1 day ago';
    } else if(diffInDays < 30){
        return `${diffInDays} days ago`;
    } else if(NewDate.year() === currentYear){
        NewDate = moment(NewDate).format('DD MMM');
    }else{
        NewDate = moment(NewDate).format('DD MMM, YYYY');
    }
    return NewDate;
};