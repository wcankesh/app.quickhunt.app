import React, {Fragment} from 'react';
import {Navigate, Outlet} from "react-router-dom";
import {baseUrl, isLogin} from "../../utils/constent";
import {Toaster} from "../ui/toaster";

const ProtectedRoutes = () => {
    return isLogin() ? <Fragment><Toaster /><Outlet/></Fragment> : <Navigate to={`${baseUrl}/login`}/>
};

export default ProtectedRoutes;