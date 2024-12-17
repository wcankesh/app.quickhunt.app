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
        <div className={"grid grid-cols-2 gap-4"}>
            {
                (data || []).map((x, i) => {
                    return (
                        <Card key={i}>
                            <CardContent className={"p-4 space-y-2"}>
                                <div>
                                    <div className={"font-medium"}>{x.title}</div>
                                    <div className={"text-sm text-muted-foreground"}>{x.description}</div>
                                </div>
                                <div className={"flex gap-2"}>
                                    {
                                        (x.btnText || []).map((y, j) => {
                                            return (
                                                // <Button variant={"link"} key={j} className={"font-medium p-0"} onClick={() => {
                                                //     if (y.redirect) {
                                                //         window.open(y.redirect, "_blank");
                                                //     } else if (onClick) {
                                                //         onClick();
                                                //     }
                                                // }}>
                                                //     {y.icon}{y.title}
                                                // </Button>
                                                <Button
                                                    variant={"link"}
                                                    key={j}
                                                    className={"font-medium p-0"}
                                                    onClick={() => {
                                                        if (y.redirect) {
                                                            window.open(y.redirect, "_blank");
                                                        }
                                                        if (y.openSheet) {
                                                            setSheetOpenCreate(true);
                                                        }
                                                        if (y.navigateTo) {
                                                            navigate(y.navigateTo);
                                                        }
                                                        if (onClick) {
                                                            onClick();
                                                        }
                                                    }}
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