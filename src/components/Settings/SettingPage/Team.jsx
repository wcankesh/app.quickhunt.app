import React, {Fragment, useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../ui/card";
import {Button} from "../../ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../../ui/tabs";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "../../ui/avatar";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import {Ellipsis, Loader2, Trash2, X} from "lucide-react";
import {useTheme} from "../../theme-provider";
import {Sheet,SheetContent, SheetHeader, SheetTitle} from "../../ui/sheet";
import {useSelector} from "react-redux";
import {Badge} from "../../ui/badge";
import moment from "moment";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../../ui/dropdown-menu";
import {toast} from "../../ui/use-toast";
import {Skeleton} from "../../ui/skeleton";
import EmptyData from "../../Comman/EmptyData";
import DeleteDialog from "../../Comman/DeleteDialog";
import {apiService, DO_SPACES_ENDPOINT} from "../../../utils/constent";

const initialState = {
    email: "",
}
const initialStateError = {
    email: "",
}

const Team = () => {
    const {theme, onProModal} = useTheme();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);

    const [inviteTeamDetails, setInviteTeamDetails] = useState(initialState)
    const [formError, setFormError] = useState(initialStateError);
    const [memberList, setMemberList] = useState([])
    const [invitationList, setInvitationList] = useState([])
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [isSave, setIsSave] = useState(false);
    const [deleteObj, setDeleteObj] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [openDelete,setOpenDelete] =useState(false);
    const [isLoadingDelete,setIsLoadingDelete] = useState(false);

    useEffect(() => {
        if(projectDetailsReducer.id){
            getAllMember()
            getInvitations(true)
        }
    }, [projectDetailsReducer.id]);

    const getAllMember = async () => {
        setIsLoading(true)
        const data = await apiService.getAllMember(projectDetailsReducer.id)
        if (data.success) {
            setMemberList(data.data.data);
            setIsAdmin(data.data.isAdmin)
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    const getInvitations = async (loading) => {
        setIsLoading(loading);
        const data = await apiService.getInvitation(projectDetailsReducer.id)
        if (data.success) {
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
        setInviteTeamDetails(initialState)
        setFormError(initialStateError)
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
            projectId: projectDetailsReducer.id,
            email: inviteTeamDetails.email,
            type: '1'
        }
        const data = await apiService.inviteUser(payload)
        if (data.success) {
            setInviteTeamDetails(initialState)
            setIsSave(false);
            toast({
                description: data.message,
            });
            await getInvitations(true);
            closeSheet();
        } else {
            setIsSave(false);
            toast({
                description: data?.error.message,
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
            projectId: projectDetailsReducer.id,
            email: x.email,
            type: '2',
            id: x.id
        }
        const data = await apiService.inviteUser(payload)
        if (data.success) {
            getInvitations(true)
            // const updatedExpirationDate = moment().add(7, 'days').toISOString();
            // const updatedCreatedAt = moment().toISOString();
            // const updatedList = invitationList.map((item) => {
            //     if (item.id === x.id) {
            //         return {
            //             ...item,
            //             expireAt: updatedExpirationDate,
            //             createdAt: updatedCreatedAt,
            //             updatedAt: Date.now(),
            //         };
            //     }
            //     return item;
            // });
            // setInvitationList(updatedList);
            toast({
                description: data.message
            })
        } else {
            toast({
                description: data.error.message,
                variant: "destructive"
            })
        }
    }

    const onChange = (event) => {
        setInviteTeamDetails({...inviteTeamDetails, [event.target.name]: event.target.value});
        setFormError(formError => ({...formError, [event.target.name]: ""}));
    }

    const onDelete = async () => {
        setIsLoadingDelete(true);
        const payload = {
            projectId: projectDetailsReducer.id,
            email: deleteObj.email,
            type: '3',
            id: deleteObj.id
        }
        const data = await apiService.inviteUser(payload)
        if (data.success) {
            const clone = [...invitationList];
            const index = clone.findIndex((y) => y.id === deleteObj.id)
            if (index !== -1) {
                clone.splice(index, 1);
                setInvitationList(clone);
            }
            toast({
                description: data.message
            });
            setIsLoadingDelete(false);
        } else {
            toast({ variant: "destructive",
                description: data.error.message
            });
            setIsLoadingDelete(false);
        }
        setOpenDelete(false);
    }

    const removeMember = async (id) => {
        const data = await apiService.removeMember(id)
        if (data.success) {
            const clone = [...memberList];
            const index = clone.findIndex((x) => x.id == id)
            if (index !== -1) {
                clone.splice(index, 1)
                setMemberList(clone)
            }
            toast({description: data.message,});
        } else {
            toast({variant: "destructive", description: data?.error.message,});
        }
    }

    const revokePopup = (record,id) => {
        setDeleteObj(record);
        setOpenDelete(true);
    }

    return (
        <Fragment>
            {
                openDelete &&
                <DeleteDialog
                    title={"You really want to delete this Member?"}
                    isOpen={openDelete}
                    onOpenChange={() => setOpenDelete(false)}
                    onDelete={onDelete}
                    isDeleteLoading={isLoadingDelete}
                    // deleteRecord={deleteId}
                />
            }

            <Card>
                <CardHeader className={"flex flex-row flex-wrap md:flex-nowrap justify-between gap-2 items-center p-4 sm:px-5 sm:py-4"}>
                    <div>
                        <CardTitle className={"text-xl lg:text-2xl font-medium capitalize"}>Invite Team</CardTitle>
                        <CardDescription className={"text-sm text-muted-foreground p-0"}>Add members to your project to collaborate on managing ideas.</CardDescription>
                    </div>
                    <Button className={"text-sm font-medium hover:bg-primary m-0"} onClick={openSheet}>Invite Team</Button>
                </CardHeader>
                <CardContent className={"p-0"}>
                    <Tabs defaultValue="users" className="space-y-3">
                        <div className={"px-4 sm:px-5"}>
                            <TabsList className="grid h-auto w-[141px] grid-cols-2 bg-card border">
                                <TabsTrigger value="users"
                                             className={`text-sm font-normal team-tab-active team-tab-text-active ${theme === "dark" ? "text-card-foreground" : ""}`}>Users</TabsTrigger>
                                <TabsTrigger value="invites"
                                             className={`text-sm font-normal team-tab-active team-tab-text-active ${theme === "dark" ? "text-card-foreground" : ""}`}>Invites</TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="users">
                            <div className={"grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                                    <Table>
                                        <TableHeader className={`${theme === "dark" ? "" : "bg-muted"}`}>
                                            <TableRow>
                                                {
                                                    ["Team", "Role" ,"Action"].map((x, i) => {
                                                        return (
                                                           <TableHead key={x} className={`h-[22px] px-2 py-[10px] md:px-3 text-sm font-medium ${i === 2 ? "text-end" : ""} ${theme === "dark" ? "border-t" : "text-card-foreground"}`}>{x}</TableHead>
                                                        )
                                                    })
                                                }
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isLoading ?
                                                (
                                                    [...Array(4)].map((_, index) => {
                                                        return (
                                                            <TableRow key={index}>
                                                                {
                                                                    [...Array(3)].map((_, i) => {
                                                                        return (
                                                                            <TableCell key={i} className={"py-[10px] px-[12px]"}>
                                                                                <Skeleton
                                                                                    className={"rounded-md  w-full h-[24px]"}/>
                                                                            </TableCell>
                                                                        )
                                                                    })
                                                                }
                                                            </TableRow>
                                                        )
                                                    })
                                                )
                                                : memberList?.length > 0 ? <>
                                                    {
                                                        (memberList || []).map((x, i) => {
                                                            return (
                                                                <TableRow key={i}>
                                                                    <TableCell className={"py-[10px] px-[12px]"}>
                                                                        <div className={"flex gap-2 items-center"}>
                                                                            <Avatar className={"w-[30px] h-[30px]"}>
                                                                                <AvatarImage
                                                                                    src={x?.profileImage ? `${DO_SPACES_ENDPOINT}/${x?.profileImage}` : null}
                                                                                    alt={x && x?.firstName?.substring(0, 1)?.toUpperCase() && x?.lastName?.substring(0, 1)?.toUpperCase()}
                                                                                />
                                                                                <AvatarFallback
                                                                                    className={"bg-primary/10 border-primary border text-[11px] text-primary font-medium"}>
                                                                                    {x?.firstName?.substring(0, 1)?.toUpperCase()}{x?.lastName?.substring(0, 1)?.toUpperCase()}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                            <div>
                                                                                <h3 className={"text-sm font-normal"}>{x?.firstName} {x?.lastName}</h3>
                                                                                <p className={"text-xs font-normal text-muted-foreground"}>{x?.email}</p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell
                                                                        className={`py-[10px] px-[12px]`}>
                                                                        <Badge variant={"outline"}
                                                                               className={`h-[20px] py-0 px-2 text-xs rounded-[5px] ${x.role === 1 ? "text-[#63c8d9] border-[#63c8d9]" : "text-[#694949] border-[#694949]"}`}>{x?.role === 1 ? "Admin" : "Member"}</Badge>

                                                                    </TableCell>
                                                                        <TableCell className="flex justify-end py-[10px] px-[12px]">
                                                                            {(isAdmin && x.role === 2) && (
                                                                                    <Button
                                                                                        variant="outline hover:bg-transparent"
                                                                                        className="p-1 border w-[30px] h-[30px]"
                                                                                        onClick={() => removeMember(x.id)}
                                                                                    >
                                                                                        <Trash2 size={16}/>
                                                                                    </Button>
                                                                            )}
                                                                        </TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                    }
                                                </> : <TableRow>
                                                    <TableCell colSpan={3}>
                                                        <EmptyData/>
                                                    </TableCell>
                                                </TableRow>
                                            }
                                        </TableBody>
                                    </Table>
                            </div>
                        </TabsContent>
                        <TabsContent value="invites" className={""}>
                            <div className={"grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                                <Table>
                                    <TableHeader className={`${theme === "dark" ? "" : "bg-muted"}`}>
                                        <TableRow>
                                            {
                                                ["Email", "Status", "Invited", "Action"].map((x, i) => {
                                                    return (
                                                        <TableHead key={i} className={`h-[22px] px-2 py-[10px] md:px-3 text-sm font-medium ${i === 0 ? "sm:pl-6" : i === 3 ? "text-right" : ""} ${theme === "dark" ? "border-t" : "text-card-foreground"}`}>{x}</TableHead>
                                                    )
                                                })
                                            }
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                    {
                                        isLoading ? (

                                                [...Array(4)].map((_, index) => {
                                                    return (
                                                        <TableRow key={index}>
                                                            {
                                                                [...Array(4)].map((_, i) => {
                                                                    return (
                                                                        <TableCell key={i} className={"py-[10px] px-[12px]"}>
                                                                            <Skeleton className={"rounded-md  w-full h-[24px]"}/>
                                                                        </TableCell>
                                                                    )
                                                                })
                                                            }
                                                        </TableRow>
                                                    )
                                                })

                                        )
                                        : invitationList?.length > 0 ? <>
                                                {(invitationList || []).map((x, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell className="font-normal py-[10px] px-[12px]">{x?.email}</TableCell>
                                                        <TableCell className={"py-[10px] px-[12px]"}>
                                                            {moment().startOf('day').isSameOrAfter(moment(x?.expireAt).startOf('day')) ? (
                                                                <span>Expired</span>
                                                            ) : (
                                                                <span>Expires in {moment(x?.expireAt).diff(moment().startOf('day'), 'days')} days</span>
                                                            )}
                                                        </TableCell>
                                                        {/*<TableCell className={"py-[10px] px-[12px]"}>*/}
                                                        {/*    Expires in {Math.max(moment(x?.expireAt).diff(moment(new Date()), 'days'), 0)} days*/}
                                                        {/*</TableCell>*/}
                                                        {/*<TableCell className={"py-[10px] px-[12px]"}>Invited about {moment.utc(x.createdAt).local().startOf('seconds').fromNow()}</TableCell>*/}
                                                        <TableCell className={"py-[10px] px-[12px]"}>
                                                            Invited about{" "}
                                                            {x.updatedAt && x.updatedAt !== x.createdAt ? (
                                                                <>{moment.utc(x.updatedAt).local().startOf("seconds").fromNow()}</>
                                                            ) : (
                                                                <>{moment.utc(x.createdAt).local().startOf("seconds").fromNow()}</>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="py-[10px] px-[12px] text-right">
                                                            <DropdownMenu className={"relative"} >
                                                                <DropdownMenuTrigger>
                                                                    <Ellipsis className={`${theme === "dark" ? "" : "text-muted-foreground"}`} size={18}/>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent className={"hover:none absolute right-[-20px]"}>
                                                                    <DropdownMenuItem className={"cursor-pointer w-[130px]"} onClick={() => onResendUser(x)}>Resend Invitation</DropdownMenuItem>
                                                                    <DropdownMenuItem className={"cursor-pointer w-[130px]"} onClick={() => revokePopup(x,x.id)}>Revoke Invitation</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </> : <TableRow>
                                                <TableCell colSpan={4}>
                                                    <EmptyData/>
                                                </TableCell>
                                            </TableRow>
                                    }
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
            {isSheetOpen && (
                <Sheet open={isSheetOpen} onOpenChange={isSheetOpen ? closeSheet : openSheet}>
                    {/*<SheetOverlay className={"inset-0"} />*/}
                    <SheetContent className={"sm:max-w-[662px] p-0"}>
                        <SheetHeader className={"px-4 py-3 md:py-5 lg:px-8 lg:py-[20px] border-b flex flex-row justify-between items-center"}>
                            <SheetTitle className={"text-base md:text-xl font-medium flex justify-between items-center"}>
                                Invite Users
                            </SheetTitle>
                            <X className={"cursor-pointer m-0"} onClick={closeSheet}/>
                        </SheetHeader>
                        <div className="overflow-auto comm-sheet-height">
                        <div className="grid gap-6 px-3 py-4 sm:px-8 sm:py-6 border-b">
                            <div className="flex flex-col gap-2">
                                <div className={"space-y-1"}>
                                    <Label htmlFor="inviteEmail" className={"text-right font-medium"}>Add emails of users you want to invite to test, and click on Invite</Label>
                                    <Input
                                        type={"email"}
                                        id="inviteEmail"
                                        placeholder="user1@gmail.com"
                                        className={`${theme === "dark" ? "" : "placeholder:text-muted-foreground/75"}`}
                                        value={inviteTeamDetails.email}
                                        onKeyDown={handleKeyDown}
                                        onChange={onChange}
                                        name={"email"}
                                    />
                                </div>
                                {formError.email && <p className="text-destructive text-sm">{formError.email}</p>}
                            </div>
                        </div>
                        <div className={"flex px-3 py-4 sm:px-[32px] gap-[16px] sm:justify-start"}>
                            <Button
                                className={`w-[69px] text-sm font-medium hover:bg-primary`}
                                onClick={onInviteUser}
                            >
                                {isSave ? <Loader2 className="h-4 w-4 animate-spin"/> : "Invite"}
                            </Button>
                                <Button
                                    variant={"ghost hover:bg-none"}
                                    onClick={closeSheet}
                                    className={`text-sm font-medium border border-primary text-primary`}
                                >Cancel</Button>

                        </div>
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </Fragment>
    );
};

export default Team;