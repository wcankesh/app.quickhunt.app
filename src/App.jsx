import React, { useEffect } from 'react';
import {ThemeProvider} from "./components/theme-provider";
import DefaultLayout from "./components/DefaultLayout/DefaultLayout";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import ProtectedRoutes from "./components/Auth/ProtectedRoutes";
import {routes} from "./utils/routes";
import {baseUrl} from "./utils/constent";
import PublicRoutes from "./components/Auth/PublicRoutes";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Forgot from "./components/Auth/Forgot";

function App() {

  return (
    <>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <BrowserRouter>
                <Routes>
                    <Route element={<ProtectedRoutes/>}>
                        <Route exact path={`${baseUrl}/`} element={<DefaultLayout/>}>
                            {
                                (routes || []).map((x, i) => {
                                    return <Route key={i} path={x.path} element={x.component}/>
                                })
                            }
                            <Route path={`${baseUrl}/`} element={<Navigate to={`${baseUrl}/dashboard`} replace/>}/>
                        </Route>
                    </Route>
                    <Route element={<PublicRoutes/>}>
                        <Route path={`${baseUrl}/register`} element={<Register/>}/>
                        <Route path={`${baseUrl}/login`} element={<Login/>}/>
                        <Route path={`${baseUrl}/forgot-password`} element={<Forgot/>}/>
                    </Route>
                    {/*<Route path="*" element={<PageNotFound/>}/>*/}
                </Routes>
            </BrowserRouter>
        </ThemeProvider>


    </>
  )
}

export default App
