import React,{Fragment} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {useTheme} from "../theme-provider";
import NoDataThumbnail from "../../img/Frame.png";


const SettingEmptyDataTable = ({tableHeadings}) => {
    let theme = useTheme();
    return (
        <Fragment>
            <Table>
                <TableHeader className={""}>
                    <TableRow>
                        {
                            (tableHeadings || []).map((x,index)=>{
                                return(
                                        <TableHead className={`w-2/5 pl-4 ${theme === "dark" ? "" : "text-card-foreground"} ${index === 1 ? "text-center" : index ? "text-end" : ""}`}>{x.label}</TableHead>
                                    )
                            })
                        }
                    </TableRow>
                </TableHeader>
            </Table>
            <div className={"flex flex-row justify-center py-[45px]"}>
                <div className={"flex flex-col items-center gap-2"}>
                    <img src={NoDataThumbnail} className={"flex items-center"}/>
                    <h5 className={`text-center text-2xl font-medium leading-8 ${theme === "dark" ? "" : "text-[#A4BBDB]"}`}>No Data</h5>
                </div>
            </div>
        </Fragment>
    );
};

export default SettingEmptyDataTable;