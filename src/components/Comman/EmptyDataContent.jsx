import React from 'react';
import {Ellipsis} from "lucide-react";
import {Card, CardContent} from "../ui/card";
import {Button} from "../ui/button";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../ui/dropdown-menu";
import {baseUrl} from "../../utils/constent";
import {useNavigate} from "react-router";

export const EmptyDataContent = ({data, onClose, onClick, setSheetOpenCreate}) => {
    const navigate = useNavigate();

    const btnFunctionality = (record) => {
        if (record.redirect) {
            window.open(record.redirect, "_blank");
        }
        if (record.openSheet) {
            setSheetOpenCreate(true);
        }
        if (record.navigateTo) {
            navigate(record.navigateTo);
        }
        if (onClick) {
            onClick();
        }
    }

    return (
        <Card className={"p-4 space-y-2"}>
            <div className={"text-end"}>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis className={`font-medium`} size={18}/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={"end"}>
                        <DropdownMenuItem className={"cursor-pointer"} onClick={() => navigate(`${baseUrl}/app-message/3/new`)}>Leave feedback</DropdownMenuItem>
                        <DropdownMenuItem className={"cursor-pointer"} onClick={onClose}>Close</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        <div className={"grid grid-cols-1 md:grid-cols-2 gap-4"}>
            {
                (data || []).map((x, i) => {
                    return (
                        <Card key={i}>
                            <CardContent className={"p-2 md:p-4 space-y-2"}>
                                <div>
                                    <div className={"font-medium"}>{x.title}</div>
                                    <div className={"text-sm text-muted-foreground"}>{x.description}</div>
                                </div>
                                <div className={"flex flex-wrap gap-1 md:gap-2"}>
                                    {
                                        (x.btnText || []).map((y, j) => {
                                            return (
                                                <Button
                                                    variant={"link"}
                                                    key={j}
                                                    className={"font-medium p-0 text-wrap"}
                                                    onClick={() => btnFunctionality(y)}
                                                >
                                                    {y.icon}{y.title}
                                                </Button>
                                            )
                                        })
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    )
                })
            }
        </div>
        </Card>
    );
};