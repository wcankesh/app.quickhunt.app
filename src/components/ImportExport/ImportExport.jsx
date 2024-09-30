import React from 'react';
import {CardHeader, Card, CardContent} from "../ui/card";
import {Button} from "../ui/button";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/constent";
import {useSelector} from "react-redux";

const ImportExport = () => {
    let navigate = useNavigate();
    const onRedirect = () => {
        navigate(`${baseUrl}/settings/import-export/import`);
    };
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    return (
        <Card className={"divide-y"}>
            <CardHeader className={"p-4 sm:p-6"}>
                <h2 className={`text-lg sm:text-2xl font-medium leading-8`}>Import / Export</h2>
            </CardHeader>
            <CardContent className={"p-6 space-y-3"}>
                <div>
                    <h5 className={"text-base font-medium"}>Import Data</h5>
                    <p className={"text-muted-foreground text-sm"}>We've made it easy to import your data from other tools and spreadsheets.</p>
                </div>
                <div><Button className={"font-semibold hover:bg-primary"} onClick={onRedirect}>Import Data</Button></div>
            </CardContent>
            <CardContent className={"p-6 space-y-3"}>
                <div>
                    <h5 className={"text-base font-medium"}>Export Data</h5>
                    <p className={"text-muted-foreground text-sm"}>You can export all your data in CSV format. (This can take up to 30 sec.)</p>
                </div>
                <div><Button className={"font-semibold hover:bg-primary"} onClick={() => window.open(`https://code.quickhunt.app/public/api/idea/export?project_id=${projectDetailsReducer.id}`, "_blank")}>Export Data</Button></div>
            </CardContent>
        </Card>
    );
};

export default ImportExport;