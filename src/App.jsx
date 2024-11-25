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
import RestPassword from "./components/Auth/RestPassword";
import 'quill/dist/quill.snow.css'
import Setup from "./components/Auth/Setup";
import Project from "./components/Auth/Project";
import OnBoarding from "./components/OnBoarding/OnBoarding";

function App() {

  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route element={
                    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                        <ProtectedRoutes/>
                    </ThemeProvider>
                   }>
                    <Route exact path={`${baseUrl}/`} element={<DefaultLayout/>}>
                        {
                            (routes || []).map((x, i) => {
                                return <Route key={i} path={x.path} element={x.component}/>
                            })
                        }
                        <Route path={`${baseUrl}/`} element={<Navigate to={`${baseUrl}/dashboard`} replace/>}/>
                    </Route>
                    <Route path={`${baseUrl}/project`} element={<Project/>}/>
                    <Route path={`${baseUrl}/setup`} element={<Setup/>}/>
                </Route>
                <Route element={<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme"><PublicRoutes/></ThemeProvider>}>
                    <Route path={`${baseUrl}/register`} element={<Register/>}/>
                    <Route path={`${baseUrl}/on-bord`} element={<OnBoarding/>}/>
                    <Route path={`${baseUrl}/login`} element={<Login/>}/>
                    <Route path={`${baseUrl}/forgot-password`} element={<Forgot/>}/>
                    <Route path={`${baseUrl}/reset-verify`} element={<RestPassword/>}/>

                </Route>
                {/*<Route path="*" element={<PageNotFound/>}/>*/}
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
