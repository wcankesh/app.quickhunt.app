import React from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {useTheme} from "../theme-provider";
import {Card} from "../ui/card";
import {Skeleton} from "../ui/skeleton";

const SkeletonTable = ({tableHeadings,arrayLength,numberOfCells}) => {
    const theme =useTheme();
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
                <TableBody>
                    {
                        [...Array(arrayLength)].map((x,index)=>{
                            return(
                                <TableRow key={index}>
                                    {
                                        [...Array(numberOfCells)].map((_, cellIndex) => (
                                            <TableCell className={"max-w-[373px]"} key={cellIndex}>
                                                <Skeleton className={"rounded-md w-full h-6"} />
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                            )
                        })
                    }
                </TableBody>

            </Table>
        </Card>
    );
};

export default SkeletonTable;