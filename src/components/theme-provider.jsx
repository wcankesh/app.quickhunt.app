import React, { createContext, useContext, useEffect, useState } from "react"
import { CircleCheck } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import {Button} from "./ui/button";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../utils/constent";
const ThemeProviderContext = createContext();


export function ThemeProvider({children, defaultTheme = "system", storageKey = "vite-ui-theme", ...props}) {
    const [theme, setTheme] = useState(() => (localStorage.getItem(storageKey)) || defaultTheme)
    const [isProModal, setIsProModal] = useState(false);
    let navigate = useNavigate();
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
            root?.classList?.add(systemTheme)
            return
        }

        root.classList.add(theme)
    }, [theme])

    const value = {
        theme,
        setTheme: (theme) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme)
        },
        onProModal: (value) =>{
            setIsProModal(value)
        },
    }
    const onRedirect = () => {
        navigate(`${baseUrl}/pricing-plan`);
        setIsProModal(false)


    }

    const planList = ['Custom Domain + SSL', 'Remove Branding', 'Post Scheduling', 'Post Expiring', 'Comment and Reactions', 'Integration']
    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
            <Dialog open={isProModal}  onOpenChange={() => setIsProModal(false)}>
                <DialogContent className={"max-w-[600px]"}>
                    <DialogHeader >
                        <DialogTitle className={"text-center mb-5"}>
                            You discovered a Pro feature!
                        </DialogTitle>
                        <div className={"grid grid-cols-2 gap-4 mt-0 pb-4"}>
                            {
                                planList.map((x) => {
                                    return(
                                        <div className={"flex  gap-2 items-center text-sm text-muted-foreground"}> <CircleCheck size={16}/> {x}</div>
                                    )
                                })
                            }
                        </div>
                        <Button onClick={onRedirect}>Upgrade Now</Button>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}
