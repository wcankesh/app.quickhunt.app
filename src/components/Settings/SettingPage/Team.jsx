import React, {Fragment, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../ui/card";
import {Button} from "../../ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../../ui/tabs";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";
import {Avatar, AvatarFallback} from "../../ui/avatar";
import {Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "../../ui/select";
import {SelectGroup} from "@radix-ui/react-select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import {Trash2, X} from "lucide-react";
import {useTheme} from "../../theme-provider";
import {Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle} from "../../ui/sheet";

const initialStateTeam = [
    {
        email: "wc.darshan2003@gmail.com",
        status: "Expires in 6 days",
        invited: "Invited about A few seconds ago",
    },
    {
        email: "wc.darshan2003@gmail.com",
        status: "Expires in 6 days",
        invited: "Invited about A few seconds ago",
    },
    {
        email: "wc.darshan2003@gmail.com",
        status: "Expires in 6 days",
        invited: "Invited about A few seconds ago",
    },
]

const Team = () => {
    const { theme } = useTheme();
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [invitedUsers, setInvitedUsers] = useState(initialStateTeam);

    const openSheet = () => setSheetOpen(true);

    const closeSheet = () => {
        setSheetOpen(false);
        setInviteEmail('');
        setEmailError('');
    };

    const handleChange = (event) => {
        const {value} = event.target;
        setInviteEmail(value);
    }

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

    const handleSubmitInvite = () => {

        if (!inviteEmail || inviteEmail.trim() === "") {
            setEmailError("Email is required")
            return ;
        } else if (!inviteEmail.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
            setEmailError("Enter a valid email address")
            return ;
        } else {
            const newInvite = {
                email: inviteEmail,
                status: "Pending",
                invited: "Just now",
            };
            setInvitedUsers([...invitedUsers, newInvite]);
            closeSheet();
        }
    };

    const handleRemoveInvite = (index) => {
        const updatedInvites = [...invitedUsers];
        updatedInvites.splice(index, 1);
        setInvitedUsers(updatedInvites);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmitInvite();
        }
    };

    return (
        <Fragment>
        <Card>
            <CardHeader className={"flex flex-row justify-between items-center"}>
                <div>
                    <CardTitle className={"text-2xl font-medium"}>Invite Team</CardTitle>
                    <CardDescription className={"text-sm text-muted-foreground p-0"}>Add members to your company to help manage ideas.</CardDescription>
                </div>
                <div className={"m-0"}>
                    <Button className={"text-sm font-semibold"} onClick={openSheet}>Invite Team</Button>
                </div>
            </CardHeader>
            <CardContent className={"p-0"}>
                <Tabs defaultValue="users" className="space-y-6">
                    <div className={"px-6"}>
                    <TabsList className="grid w-[141px] grid-cols-2 bg-card border">
                        <TabsTrigger value="users" className={`text-sm font-medium team-tab-active team-tab-text-active ${theme === "dark" ? "text-card-foreground" : ""}`}>Users</TabsTrigger>
                        <TabsTrigger value="invites" className={`text-sm font-medium team-tab-active team-tab-text-active ${theme === "dark" ? "text-card-foreground" : ""}`}>Invites</TabsTrigger>
                    </TabsList>
                    </div>
                    <TabsContent value="users">
                        <div className={"px-6 pb-2 flex justify-between border-b"}>
                            <h3 className={"text-sm font-medium"}>Team</h3>
                            <h3 className={"text-sm font-medium"}>Role</h3>
                        </div>
                        <div className={"flex gap-2 px-6 py-2"}>
                            <div>
                                <Avatar className={"w-[30px] h-[30px]"}>
                                    <AvatarFallback className={"bg-primary/10 border-primary border text-sm text-primary font-semibold"}>D</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className={"flex justify-between w-full"}>
                                <div>
                                    <h3 className={"text-sm font-medium"}>Darshan Jiyani</h3>
                                    <p className={"text-xs font-normal text-muted-foreground"}>wc.darshan2003@gmail.com</p>
                                </div>
                                <div>
                                    <Select>
                                        <SelectTrigger className="w-[140px] bg-card">
                                            <SelectValue placeholder="Admin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="invites">
                        <div>
                            <Table>
                                <TableHeader className={"p-0"}>
                                    <TableRow className={""}>
                                        <TableHead className={`h-[22px] pl-6 pb-2 text-sm font-medium ${theme === "dark" ? "" : "text-card-foreground"}`}>Email</TableHead>
                                        <TableHead className={`h-[22px] pb-2 ${theme === "dark" ? "" : "text-card-foreground"}`}>Status</TableHead>
                                        <TableHead className={`h-[22px] pb-2 ${theme === "dark" ? "" : "text-card-foreground"}`}>Invited</TableHead>
                                        <TableHead className={`text-right h-[22px] pr-6 pb-2 ${theme === "dark" ? "" : "text-card-foreground"}`}>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invitedUsers.map((invite, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-medium pl-6">{invite.email}</TableCell>
                                            <TableCell>{invite.status}</TableCell>
                                            <TableCell>{invite.invited}</TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <Button
                                                    variant={"outline hover:bg-transparent"}
                                                    className={"p-1 border w-[30px] h-[30px]"}
                                                    onClick={() => handleRemoveInvite(i)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
            {isSheetOpen && (
                <Sheet open={isSheetOpen} onOpenChange={isSheetOpen ? closeSheet : openSheet}>
                    <SheetContent className={"sm:max-w-[662px] sm:overflow-auto p-0"}>
                        <SheetHeader className={"px-[32px] py-[22px] border-b flex"}>
                            <SheetTitle className={"text-xl font-medium flex justify-between items-center"}>Invite Users
                                <Button className={"bg-transparent hover:bg-transparent p-0 h-[24px]"}>
                                    <X className={"stroke-card-foreground"} onClick={closeSheet} />
                                </Button>
                            </SheetTitle>
                        </SheetHeader>
                        <div className="grid gap-[24px] px-[32px] pt-[24px] pb-[36px]">
                            <div className="flex flex-col gap-2">
                                <div>
                                    <Label htmlFor="name" className="text-right">Add emails of users you want to invite to test, and click on Invite</Label>
                                    <Input
                                        type={"email"}
                                        id="inviteEmail"
                                        placeholder="user1@gmail.com"
                                        className={`${theme === "dark" ? "" : "placeholder:text-muted-foreground/75"}`}
                                        value={inviteEmail}
                                        onKeyDown={handleKeyDown}
                                        onChange={handleChange}
                                    />
                                </div>
                                {emailError !== '' && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                            </div>
                        </div>
                        <SheetFooter className={"px-[32px] gap-[16px] sm:justify-start"}>
                                <Button className={"text-card text-sm font-semibold hover:bg-primary bg-primary"} type="submit" onClick={handleSubmitInvite}>Invite</Button>
                            <SheetClose asChild onClick={closeSheet}>
                                <Button className={"text-primary text-sm font-semibold hover:bg-card border border-primary bg-card ml-0 m-inline-0"} type="submit">Cancel</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            )}
        </Fragment>
    );
};

export default Team;