import React from 'react';
import {CardHeader, Card, CardContent, CardTitle, CardDescription} from "../ui/card";
import {Button} from "../ui/button";
import {useNavigate} from "react-router-dom";
import {baseUrl, BASE_URL_API} from "../../utils/constent";
import {useSelector} from "react-redux";

const ImportExport = () => {
    let navigate = useNavigate();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const onRedirect = () => {
        navigate(`${baseUrl}/settings/import-export/import`);
    };

    return (
        <Card className={"divide-y"}>
            <CardHeader className={"p-4 sm:px-5 sm:py-4"}>
                <CardTitle className={"text-xl lg:text-2xl font-normal capitalize"}>Import / Export</CardTitle>
                <CardDescription className={"text-sm text-muted-foreground p-0"}>Quickly import or export your data as needed.</CardDescription>
            </CardHeader>
            <CardContent className={"p-4 sm:px-5 sm:py-4 space-y-3"}>
                <div>
                    <h5 className={"text-base font-normal capitalize"}>Import Data</h5>
                    <p className={"text-muted-foreground text-sm"}>Seamlessly Import Ideas from any tool effortlessly in just a few minutes.</p>
                </div>
                <Button className={"font-medium hover:bg-primary"} onClick={onRedirect}>Import Data</Button>
            </CardContent>
            <CardContent className={"p-4 sm:px-5 sm:py-4 space-y-3"}>
                <div>
                    <h5 className={"text-base font-normal capitalize"}>Export Data</h5>
                    <p className={"text-muted-foreground text-sm"}>Export your ideas in CSV format! The process may take up to 30 seconds.</p>
                </div>
                <Button className={"font-medium hover:bg-primary"} onClick={() => window.open(`${BASE_URL_API}/idea/export?projectId=${projectDetailsReducer.id}`, "_blank")}>Export Data</Button>
            </CardContent>
        </Card>
    );
};

export default ImportExport;