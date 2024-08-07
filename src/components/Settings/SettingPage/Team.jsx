import React, {Fragment, useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../ui/card";
import {Button} from "../../ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../../ui/tabs";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "../../ui/avatar";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import {Ellipsis, Loader2, X} from "lucide-react";
import {useTheme} from "../../theme-provider";
import {Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetOverlay, SheetTitle} from "../../ui/sheet";
import {ApiService} from "../../../utils/ApiService";
import {useSelector} from "react-redux";
import {Badge} from "../../ui/badge";
import moment from "moment";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../../ui/dropdown-menu";
import {toast} from "../../ui/use-toast";
import {Skeleton} from "../../ui/skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../ui/alert-dialog"
import NoDataThumbnail from "../../../img/Frame.png";
import {Separator} from "../../ui/separator";
import EmptyData from "../../Comman/EmptyData";

const initialState = {
    email: "",
}
const initialStateError = {
    email: "",
}

const Team = () => {
    const {theme,onProModal} = useTheme();
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [inviteTeamDetails, setInviteTeamDetails] = useState(initialState)
    const [formError, setFormError] = useState(initialStateError);
    const [memberList, setMemberList] = useState([])
    const [invitationList, setInvitationList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSave, setIsSave] = useState(false);
    const [deleteObj, setDeleteObj] = useState({});
    const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);

    useEffect(() => {
        getMember()
        getInvitations(true)
    }, [projectDetailsReducer.id]);

    const getMember = async () => {
        setIsLoading(true)
        const data = await apiService.getMember({project_id: projectDetailsReducer.id})
        if (data.status === 200) {
            setMemberList(data.data);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    const getInvitations = async (loading) => {
        setIsLoading(loading);
        const data = await apiService.getInvitation({project_id: projectDetailsReducer.id})
        if (data.status === 200) {
            setInvitationList(data.data)
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    const openSheet = () => {
        let length = memberList?.length;
        if(userDetailsReducer.plan === 0){
            if(length < 1){
                setSheetOpen(true)
                onProModal(false)
            }  else{
                onProModal(true)
            }
        } else if(userDetailsReducer.plan === 1){
            setSheetOpen(true)
            onProModal(false)
        }

    };

    const closeSheet = () => {
        setSheetOpen(false);
    };

    const formValidate = (name, value) => {
        switch (name) {
            case "email":
                if (!value || value.trim() === "") {
                    return "Email is required";
                } else if (!value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
                    return "Enter a valid email address";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const onInviteUser = async () => {
        let validationErrors = {};
        Object.keys(inviteTeamDetails).forEach(name => {
            const error = formValidate(name, inviteTeamDetails[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsSave(true)
        const payload = {
            project_id: projectDetailsReducer.id,
            email: inviteTeamDetails.email,
            type: '1'
        }
        const data = await apiService.inviteUser(payload)
        if (data.status === 200) {
            setInviteTeamDetails(initialState)
            setIsSave(false);
            toast({
                description: "Invitation sent successfully.",
            });
            await getInvitations(true);
            closeSheet();
        } else {
            setIsSave(false);
            toast({
                description: data.error,
                variant: "destructive"
            })

        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmitInvite();
        }
    };

    const onResendUser = async (x) => {
        const payload = {
            project_id: x.project_id,
            email: x.member_email,
            type: '2'
        }
        const data = await apiService.inviteUser(payload)
        if (data.status === 200) {
            toast({
                description: "Resend invitation successfully"
            })
        } else {
            toast({
                description: "Something went wrong",
                variant: "destructive"
            })
        }
    }

    const onChange = (event) => {
        setInviteTeamDetails({...inviteTeamDetails, [event.target.name]: event.target.value});
        setFormError(formError => ({...formError, [event.target.name]: ""}));
    }
    const onBlur = (event) => {
        const {name, value} = event.target;
        setFormError({
            ...formError,
            [name]: formValidate(name, value)
        });
    };

    const onDelete = async () => {
        const payload = {
            project_id: deleteObj.project_id,
            email: deleteObj.member_email,
            type: '3',
            id: deleteObj.id
        }
        const data = await apiService.inviteUser(payload)
        if (data.status === 200) {
            const clone = [...invitationList];
            const index = clone.findIndex((y) => y.id === deleteObj.id)
            if (index !== -1) {
                clone.splice(index, 1);
                setInvitationList(clone);
            }
            toast({
                description: "Revoke invitation successfully"
            });
        } else {
            toast({
                description: "Something went wrong."
            });
        }

    }

    const revokePopup = (record) => {
        setDeleteObj(record);
        setIsOpenDeleteAlert(true);
    }

    return (
        <Fragment>
            <AlertDialog open={isOpenDeleteAlert} onOpenChange={setIsOpenDeleteAlert}>
                <AlertDialogContent className={"w-[310px] md:w-full rounded-lg"}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>You really want revoke invitation?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action can't be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className={"flex justify-end gap-2"}>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className={"bg-red-600 hover:bg-red-600"} onClick={onDelete}>Revoke</AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
            <Card>
                <CardHeader className={"flex flex-row flex-wrap md:flex-nowrap justify-between gap-x-6 items-center p-4 sm:p-6"}>
                    <div>
                        <CardTitle className={"text-lg sm:text-2xl font-medium"}>Invite Team</CardTitle>
                        <CardDescription className={"text-sm text-muted-foreground p-0"}>Add members to your company to
                            help manage ideas.</CardDescription>
                    </div>
                    <div className={"mt-1 md:m-0"}>
                        <Button className={"text-sm font-semibold"} onClick={openSheet}>Invite Team</Button>
                    </div>
                </CardHeader>
                <CardContent className={"p-0"}>
                    <Tabs defaultValue="users" className="space-y-6">
                        <div className={"px-4 sm:px-6"}>
                            <TabsList className="grid w-[141px] grid-cols-2 bg-card border">
                                <TabsTrigger value="users"
                                             className={`text-sm font-medium team-tab-active team-tab-text-active ${theme === "dark" ? "text-card-foreground" : ""}`}>Users</TabsTrigger>
                                <TabsTrigger value="invites"
                                             className={`text-sm font-medium team-tab-active team-tab-text-active ${theme === "dark" ? "text-card-foreground" : ""}`}>Invites</TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="users">
                            <div className={"grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                                    <Table>
                                        <TableHeader className={"p-0"}>
                                            <TableRow className={""}>
                                                {
                                                    ["Team", "Role"].map((x, i) => {
                                                        return (
                                                            <TableHead key={x} className={`h-[22px] sm:pl-6 pb-2 text-sm font-medium ${i === 1 ? "text-end" : ""} ${theme === "dark" ? "" : "text-card-foreground"}`}>{x}</TableHead>
                                                        )
                                                    })
                                                }
                                            </TableRow>
                                        </TableHeader>
                                        {isLoading ? <TableBody>
                                            {
                                                [...Array(4)].map((_, index) => {
                                                    return (
                                                        <TableRow key={index}>
                                                            {
                                                                [...Array(2)].map((_, i) => {
                                                                    return (
                                                                        <TableCell key={i} className={""}>
                                                                            <Skeleton className={"rounded-md  w-full h-[24px]"}/>
                                                                        </TableCell>
                                                                    )
                                                                })
                                                            }
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                        </TableBody>:<TableBody>
                                            {
                                                (memberList || []).map((x) => {
                                                    {console.log("memberList", memberList)}
                                                    return (
                                                        <TableRow key={x.id}>
                                                            <TableCell className={"py-[10px]"}>
                                                                <div className={"flex gap-2 items-center"}>
                                                                    <Avatar className={"w-[30px] h-[30px]"}>
                                                                        {
                                                                            x.user_photo ?
                                                                                <AvatarImage src={x.user_photo}
                                                                                             alt={x && x?.user_first_name?.substring(0, 1)?.toUpperCase() && x?.user_last_name?.substring(0, 1)?.toUpperCase()}
                                                                                />
                                                                                :
                                                                                <AvatarFallback className={"bg-primary/10 border-primary border text-sm text-primary font-semibold"}>{x?.user_first_name?.substring(0, 1)?.toUpperCase()}{x?.user_last_name?.substring(0, 1)?.toUpperCase()}</AvatarFallback>
                                                                        }
                                                                    </Avatar>
                                                                    <div>
                                                                        <h3 className={"text-sm font-medium"}>{x.user_first_name} {x.user_last_name}</h3>
                                                                        <p className={"text-xs font-normal text-muted-foreground"}>{x.user_email_id}</p>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell
                                                                className={"flex justify-end items-center py-[10px] py-[17px]"}>
                                                                <Badge variant={"outline"} className={`h-[20px] py-0 px-2 text-xs rounded-[5px] ${x.role === 1 ? "text-[#63c8d9] border-[#63c8d9]" : "text-[#694949] border-[#694949]"}`}>{x?.role === 1 ? "Admin" : "Member"}</Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                        </TableBody>}
                                    </Table>
                                {isLoading === false && memberList.length === 0 && <div className={"flex flex-row justify-center py-[45px]"}>
                                    <div className={"flex flex-col items-center gap-2"}>
                                        <img src={NoDataThumbnail} className={"flex items-center"}/>
                                        <h5 className={`text-center text-2xl font-medium leading-8 ${theme === "dark" ? "" : "text-[#A4BBDB]"}`}>No Data</h5>
                                    </div>
                                </div>}
                            </div>
                        </TabsContent>
                        <TabsContent value="invites" className={""}>
                            <div className={"grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                                <Table className={""}>
                                    <TableHeader className={"p-0"}>
                                        <TableRow className={""}>
                                            {
                                                ["Email", "Status", "Invited", "Action"].map((x, i) => {
                                                    return (
                                                        <TableHead key={i} className={`h-[22px] b-2 text-sm font-medium ${i === 0 ? "sm:pl-6" : i === 3 ? "pr-3" : ""} ${theme === "dark" ? "" : "text-card-foreground"}`}>{x}</TableHead>
                                                    )
                                                })
                                            }
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(invitationList || []).map((x, i) => (
                                            <TableRow key={i}>
                                                <TableCell className="font-medium sm:pl-6">{x?.member_email}</TableCell>
                                                <TableCell>Expires in {moment(x?.expire_at).diff(moment(new Date()), 'days')} days</TableCell>
                                                <TableCell>Invited about {moment.utc(x.created_at).local().startOf('seconds').fromNow()}</TableCell>
                                                <TableCell className="pr-6 text-right">
                                                    <DropdownMenu className={"relative"} >
                                                        <DropdownMenuTrigger>
                                                            <Ellipsis className={`${theme === "dark" ? "" : "text-muted-foreground"}`} size={18}/>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent className={"hover:none absolute right-[-20px]"}>
                                                            <DropdownMenuItem className={"w-[130px]"} onClick={() => onResendUser(x)}>Resend Invitation</DropdownMenuItem>
                                                            <DropdownMenuItem className={"w-[130px]"} onClick={() => revokePopup(x)}>Revoke Invitation</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {isLoading ? null : (isLoading === false && invitationList?.length > 0 ? "" :
                                        <EmptyData/>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
            {isSheetOpen && (
                <Sheet open={isSheetOpen} onOpenChange={isSheetOpen ? closeSheet : openSheet}>
                    <SheetOverlay className={"inset-0"} />
                    <SheetContent className={"sm:max-w-[662px] sm:overflow-auto p-0"}>
                        <SheetHeader className={"px-3 py-4 sm:px-[32px] sm:py-[22px] border-b flex"}>
                            <SheetTitle className={"text-sm md:text-xl font-medium flex justify-between items-center"}>Invite Users
                                <Button className={"h-5 w-5 p-0"} onClick={closeSheet}  variant={"ghost"}><X size={18} className={"h-5 w-5"}/></Button>
                            </SheetTitle>
                        </SheetHeader>
                        <div className="grid gap-[24px] px-3 py-4 sm:px-[32px] sm:pt-[24px] ">
                            <div className="flex flex-col gap-2">
                                <div>
                                    <Label htmlFor="name" className="text-right">Add emails of users you want to invite to test, and click on Invite</Label>
                                    <Input
                                        type={"email"}
                                        id="inviteEmail"
                                        placeholder="user1@gmail.com"
                                        className={`${theme === "dark" ? "" : "placeholder:text-muted-foreground/75"}`}
                                        value={inviteTeamDetails.email}
                                        onKeyDown={handleKeyDown}
                                        onChange={onChange}
                                        name={"email"}
                                        onBlur={onBlur}
                                    />
                                </div>
                                {formError.email && <p className="text-red-500 text-xs mt-1">{formError.email}</p>}
                            </div>
                        </div>
                        <Separator/>
                        <div className={"flex px-3 py-4 sm:px-[32px] gap-[16px] sm:justify-start"}>
                            <Button className={"text-card text-sm font-semibold hover:bg-primary bg-primary"} type="submit" onClick={onInviteUser}>{isSave ?
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Invite"}</Button>
                            <SheetClose asChild onClick={closeSheet}>
                                <Button className={"text-primary text-sm font-semibold hover:bg-card border border-primary bg-card ml-0 m-inline-0"} type="submit">Cancel</Button>
                            </SheetClose>
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </Fragment>
    );
};

export default Team;