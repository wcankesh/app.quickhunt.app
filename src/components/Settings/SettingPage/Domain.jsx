import React, {useState, useEffect,} from 'react';
import {Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription} from "../../ui/card";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";
import {Button} from "../../ui/button";
import {ApiService} from "../../../utils/ApiService";
import {useSelector} from "react-redux";
import {toast} from "../../ui/use-toast";
import {Loader2} from "lucide-react";
import {useTheme} from "../../theme-provider";

const initialState = {
    accentColor: '#8b54f3',
    title: '',
    metaTitle: '',
    metaDescription: '',
    customDomain: '',
    googleAnalyticsId: '',
    customJavascript: '',
    hideFromSearchEngine: '',
    privateMode: '',
    isActive: '',
    domain: '',
    isLogin: 0,
    id: ''
}

const Domain = () => {
    const apiService = new ApiService();
    const {onProModal} = useTheme()
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);

    const [settingData, setSettingData] = useState(initialState);
    const [isSave, setIsSave] = useState(false);

    useEffect(() => {
        if (projectDetailsReducer.id) {
            getPortalSetting()
        }
    }, [projectDetailsReducer.id]);

    const onChange = (event) => {
        if (userDetailsReducer.plan !== 0) {
            const {name, value} = event.target;
            setSettingData({...settingData, [name]: value});
        }
    };

    const getPortalSetting = async () => {
        const data = await apiService.getPortalSetting(projectDetailsReducer.id)
        if (data.success) {
            setSettingData({...data.data.data})
        }
    }

    const onUpdatePortal = async () => {
        if (userDetailsReducer.plan === 0) {
            onProModal(true)
        } else {
            const payload = {
                project_id: projectDetailsReducer.id,
                customDomain: settingData.customDomain || null,
                googleAnalyticsId: settingData.googleAnalyticsId,
                privateMode: settingData.privateMode,
                hideFromSearchEngine: settingData.hideFromSearchEngine,
                isLogin: settingData.isLogin,
            }
            setIsSave(true)
            const data = await apiService.updatePortalSetting(settingData.id, payload)
            setIsSave(false)
            if (data.success) {
                toast({description: "Domain update successfully"})
            } else {
                toast({description: "Something went wrong", variant: "destructive"})
            }
        }
    }

    return (
        <Card className={"divide-y"}>
            <CardHeader className={"p-4 sm:px-5 sm:py-4 gap-1"}>
                <CardTitle className={"text-xl lg:text-2xl font-normal capitalize"}>Domain Setting</CardTitle>
                <CardDescription className={"text-sm text-muted-foreground p-0"}>Customize your project page with a
                    personalized domain.</CardDescription>
            </CardHeader>
            <CardContent className={"p-4 sm:px-5 sm:py-4 flex flex-col gap-3"}>
                <div className="space-y-1 relative">
                    <Label htmlFor="domain" className={"text-right font-normal capitalize"}>Subdomain</Label>
                    <Input disabled value={settingData?.domain?.replace('.quickhunt.io', '')} id="domain"
                           placeholder="example.com" className={"pr-[115px] bg-card mt-1"}/>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="text" className={"font-normal capitalize"}>Custom Domain</Label>
                    <Input disabled={userDetailsReducer.plan === 0} value={settingData.customDomain}
                           name={"customDomain"} onChange={onChange} type="text" id="text" placeholder="example.com"/>
                </div>
                <p className={"text-sm font-normal text-muted-foreground"}>
                    <span className={"font-medium"}>Note:</span> Add a new
                    <span className={"font-medium"}> CNAME</span> record for the subdomain you decided on
                    <span className={"font-medium"}> (eg feedback in the example above)</span> to your
                    <span className={"font-medium"}> DNS</span> and point it at the domain
                    <span className={"font-medium"}> "cname.quickhunt.app"</span>.</p>
            </CardContent>
            <CardFooter className={"p-4 sm:px-5 sm:py-4 justify-end"}>
                <Button className={`w-[124px] text-sm font-medium hover:bg-primary capitalize`}
                        onClick={onUpdatePortal}>{isSave ?
                    <Loader2 className="h-4 w-4 animate-spin"/> : "Update Domain"} </Button>
            </CardFooter>
        </Card>
    );
};

export default Domain;