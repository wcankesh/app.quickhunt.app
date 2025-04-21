import React, { Fragment, useEffect, useState } from 'react';
import { Navigate, Outlet } from "react-router-dom";
import {
    apiService,
    baseUrl,
    isTokenAboutToExpire,
    logout,
    removeProjectDetails,
    getTokenVerify,
    token,
} from "../../utils/constent";
import { Toaster } from "../ui/toaster";
import { useDispatch } from "react-redux";
import { userDetailsAction } from "../../redux/action/UserDetailAction";

const ProtectedRoutes = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isValidToken, setIsValidToken] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const checkToken = async () => {
            const currentToken = token();
            if (!currentToken || isTokenAboutToExpire()) {
                document.querySelectorAll(".quickhunt").forEach((x) => {
                    x.innerHTML = "";
                });
                removeProjectDetails();
                logout();
                setIsValidToken(false);
            } else {
                setIsValidToken(true);
            }
            setIsLoading(false);
        };
        checkToken();
    }, []);

    const loginUserDetails = async () => {
        try {
            const data = await apiService.getLoginUserDetails();
            if (data.success) {
                window.quickhuntSettings = {
                    name: `${data.data.firstName} ${data.data.lastName}`,
                    email: data.data.email,
                };
                dispatch(userDetailsAction({ ...data.data }));
                window.Quickhunt_In_App_Message_Config = window.Quickhunt_In_App_Message_Config || [];
                window.Quickhunt_In_App_Message_Config = [
                    { Quickhunt_In_App_Message_Key: "ZXhOK3JqVXFmZTJCS3gzRnI5MXJtZz09OjoxMjM0NTY3ODkxMDExMTIx" },
                    { Quickhunt_In_App_Message_Key: "ckgvb1QrcTljaVdhNkhCOGFaUU1idz09OjoxMjM0NTY3ODkxMDExMTIx" },
                ];
                window.QuickhuntScriptLoad();
            }
        } catch (error) {
            console.error("Failed to fetch user details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loginUserDetails();
    }, []);

    // Wait for loading to complete and validate token
    if (isLoading) return null;

    return (isValidToken || getTokenVerify()) ? (
        <Fragment>
            <Toaster />
            <Outlet />
        </Fragment>
    ) : (
        <Navigate to={`${baseUrl}/login`} />
    );
};

export default ProtectedRoutes;






// import React, {Fragment, useEffect, useState} from 'react';
// import {Navigate, Outlet} from "react-router-dom";
// import {
//     apiService,
//     baseUrl,
//     isTokenAboutToExpire,
//     logout,
//     removeProjectDetails,
//     getTokenVerify,
//     token
// } from "../../utils/constent";
// import {Toaster} from "../ui/toaster";
// import {useDispatch} from "react-redux";
// import {userDetailsAction} from "../../redux/action/UserDetailAction";
//
// const ProtectedRoutes = () => {
//     const [isLoading,setIsLoading] = useState(true)
//     const Token = isTokenAboutToExpire()
//     const dispatch = useDispatch();
//     useEffect(() => {
//         if(Token){
//             document.querySelectorAll(".quickhunt").forEach((x) => {
//                 x.innerHTML = ""
//             })
//             removeProjectDetails()
//             logout()
//         }
//
//     }, [Token])
//     const loginUserDetails = async () =>{
//         const data = await apiService.getLoginUserDetails()
//         if(data.status === 200){
//             window.quickhuntSettings = {
//                 name: `${data.data.firstName} ${data.data.lastName}`,
//                 email: data.data.email,
//             };
//             dispatch(userDetailsAction({...data.data}))
//             window.Quickhunt_In_App_Message_Config = window.Quickhunt_In_App_Message_Config || [];
//             window.Quickhunt_In_App_Message_Config = [{
//                 Quickhunt_In_App_Message_Key: "ZXhOK3JqVXFmZTJCS3gzRnI5MXJtZz09OjoxMjM0NTY3ODkxMDExMTIx"
//             },{ Quickhunt_In_App_Message_Key:  "ckgvb1QrcTljaVdhNkhCOGFaUU1idz09OjoxMjM0NTY3ODkxMDExMTIx"},
//
// ]
//             window.QuickhuntScriptLoad()
//             setIsLoading(false)
//         } else {
//             setIsLoading(false)
//         }
//     }
//
// useEffect(() => {
//     loginUserDetails()
// }, [])
//
//     return (token() && !Token) || getTokenVerify() ? <Fragment> <Toaster/><Outlet/></Fragment> : <Navigate to={`${baseUrl}/login`}/>
//     // return (token() && !Token) ? <Fragment> <Toaster/><Outlet/></Fragment> : getTokenVerify() ?<Navigate to={`${baseUrl}/on-boarding`}/>:  <Navigate to={`${baseUrl}/login`}/>
// };
//
// export default ProtectedRoutes;