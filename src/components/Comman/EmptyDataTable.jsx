import React from 'react';
import {Card} from "../ui/card";
import {Table, TableHead, TableHeader, TableRow} from "../ui/table"
import NoDataThumbnail from "../../img/Frame.png";
import {useTheme} from "../theme-provider";

const EmptyDataTable = ({tableHeadings}) => {
    const {theme}= useTheme();
    return (
        <Card>
            <Table>
                <TableHeader className={"py-8 px-5"}>
                    <TableRow className={""}>
                        {
                            (tableHeadings || []).map((x,i)=>{
                                return(
                                    <TableHead className={`text-base font-semibold py-5 ${theme === "dark"? "text-[]" : "bg-muted"} ${i == 0 ? "rounded-tl-lg" : i == 9 ? "rounded-tr-lg" : ""}`} key={x.label}>{x.label}</TableHead>
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
        </Card>
    );
};

export default EmptyDataTable;