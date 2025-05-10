import React, { Fragment, useEffect, useState } from 'react';
import { Navigate, Outlet } from "react-router-dom";
import {apiService, baseUrl, isTokenAboutToExpire, logout, removeProjectDetails, getTokenVerify, token,} from "../../utils/constent";
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
                dispatch(userDetailsAction({ ...data.data }));
                // window.quickhuntSettings = {
                //     name: `${data.data.firstName} ${data.data.lastName}`,
                //     email: data.data.email,
                // };
                // window.Quickhunt_In_App_Message_Config = window.Quickhunt_In_App_Message_Config || [];
                // window.Quickhunt_In_App_Message_Config = [
                //     { Quickhunt_In_App_Message_Key: "NGQ2Z1VMQUNjUW9rbGJrMjZMMFZIQT09Ojpqdjd2dGxMWWFpY28wR1ptSVVtdmNnPT0=" },
                //     { Quickhunt_In_App_Message_Key: "dytrQXZlT25JVW5DN2VkeWxZUXdhZz09OjptYkVYYjNjWFRObFUzanRhSXRRb3RnPT0=" },
                // ];
                // window.QuickhuntScriptLoad();
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
