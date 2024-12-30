import React, {Fragment} from 'react';
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../ui/dialog";
import {Button} from "../ui/button";
import {Loader2, X} from "lucide-react";
import {useTheme} from "../theme-provider";

const DeleteDialog = ({
                          isOpen,
                          onOpenChange,
                          onDelete,
                          isDeleteLoading,
                          deleteRecord,
                          title = "",
                          description = "This action can't be undone."
                      }) => {

    const {theme} =useTheme();

    return (
        <Fragment>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className={"max-w-[350px] w-full sm:max-w-[525px] p-3 md:p-6 rounded-lg"}>
                    <DialogHeader className={"flex flex-row justify-between gap-2 space-y-0"}>
                        <div className={"flex flex-col gap-2"}>
                            <DialogTitle className={"text-start font-medium"}>{title}</DialogTitle>
                            <DialogDescription className={"text-start"}>{description}</DialogDescription>
                        </div>
                        <div className={"w-[20px] h-[20px]"}>
                        <X size={16} className={"m-0 cursor-pointer"} onClick={() => onOpenChange(false)} />
                        </div>
                    </DialogHeader>
                    <DialogFooter className={"flex-row justify-end space-x-2"}>
                        <Button
                            variant={"outline"}
                            className={"text-sm font-medium border"}
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={"hover:bg-destructive"}
                            className={`${theme === "dark" ? "text-card-foreground" : "text-card"} w-[65px] text-sm font-medium bg-destructive`}
                            onClick={() => onDelete(deleteRecord)}
                        >
                            {isDeleteLoading ? <Loader2 size={16} className={"animate-spin"} /> : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};

export default DeleteDialog;