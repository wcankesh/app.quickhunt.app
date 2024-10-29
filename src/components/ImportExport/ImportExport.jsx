import React from 'react';
import {CardHeader, Card, CardContent, CardTitle, CardDescription} from "../ui/card";
import {Button} from "../ui/button";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/constent";
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
                <CardTitle className={"text-lg sm:text-2xl font-normal capitalize"}>Import / Export</CardTitle>
                <CardDescription className={"text-sm text-muted-foreground p-0"}>Quickly import or export your data as needed.</CardDescription>
            </CardHeader>
            <CardContent className={"p-4 sm:px-5 sm:py-4 space-y-3"}>
                <div>
                    <h5 className={"text-base font-normal capitalize"}>Import Data</h5>
                    <p className={"text-muted-foreground text-sm"}>We've made it easy to import your data from other tools and spreadsheets.</p>
                </div>
                <Button className={"font-medium hover:bg-primary"} onClick={onRedirect}>Import Data</Button>
            </CardContent>
            <CardContent className={"p-4 sm:px-5 sm:py-4 space-y-3"}>
                <div>
                    <h5 className={"text-base font-normal capitalize"}>Export Data</h5>
                    <p className={"text-muted-foreground text-sm"}>You can export all your data in CSV format. (This can take up to 30 sec.)</p>
                </div>
                <Button className={"font-medium hover:bg-primary"} onClick={() => window.open(`https://code.quickhunt.app/public/api/idea/export?project_id=${projectDetailsReducer.id}`, "_blank")}>Export Data</Button>
            </CardContent>
        </Card>
    );
};

export default ImportExport;