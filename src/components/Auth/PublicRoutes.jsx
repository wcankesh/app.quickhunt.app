import React, {Fragment, useEffect, useState} from 'react';
import {isLogin, baseUrl, getTokenVerify, token, apiService, isTokenAboutToExpire} from "../../utils/constent";
import {Navigate, Outlet} from "react-router-dom";
import {Toaster} from "../ui/toaster";


const PublicRoutes = () => {



    return isLogin() ? <Navigate to={`${baseUrl}/dashboard`}/>: <Fragment><Toaster/> <Outlet/></Fragment> ;
};

export default PublicRoutes;