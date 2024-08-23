import React from 'react';
import {CardHeader, CardTitle, Card, CardContent} from "../ui/card";
import {Button} from "../ui/button";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/constent";
import {useSelector} from "react-redux";


const ImportExport = () => {
    let navigate = useNavigate();
    const onRedirect = () => {
        navigate(`${baseUrl}/import`);
    };
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    return (
        <div
            className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
            <div className="flex items-center gap-4 mb-6 justify-between">
                <h1 className="text-2xl font-medium flex-initial w-auto">Import / Export</h1>
            </div>
            <div className={"max-w-[768px] sm:max-w-[639px]"}>
                <div className={"flex flex-col gap-5"}>
                    <Card>
                        <CardHeader className={"p-4 pb-0"}>
                            <CardTitle className={"text-base font-medium"}>Import Data</CardTitle>
                        </CardHeader>
                        <CardContent className={"flex flex-col gap-3 p-4 pt-1"}>
                            <p className={"text-muted-foreground text-sm"}>We've made it easy to import your data from other tools and spreadsheets.</p>
                            <div><Button className={"font-semibold"} onClick={onRedirect}>Import Data</Button></div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className={"p-4 pb-0"}>
                            <CardTitle className={"text-base font-medium"}>Export Data</CardTitle>
                        </CardHeader>
                        <CardContent className={"flex flex-col gap-3 p-4 pt-1"}>
                            <p className={"text-muted-foreground text-sm"}>You can export all your data in CSV format. (This can take up to 30 sec.)</p>
                            <div><Button className={"font-semibold"} onClick={() => window.open(`https://code.quickhunt.app/public/api/idea/export?project_id=${projectDetailsReducer.id}`, "_blank")}>Export Data</Button></div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ImportExport;