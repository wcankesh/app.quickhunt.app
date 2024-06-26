import React from 'react';
import {Sheet,
        SheetContent,
        SheetHeader,
} from "../ui/sheet";
import {Separator} from "../ui/separator";
import {Button} from "../ui/button";
import {X} from "lucide-react";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Switch} from "../ui/switch";

const NewCustomerSheet = ({isOpen,onOpen,onClose}) => {
    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
             <SheetContent className={"pt-[24px] p-0 max-h-screen overflow-y-auto w-[661px] lg:max-w-[662px]"} >
                 <SheetHeader className={"px-8 py-6 flex flex-row justify-between items-center"}>
                     <h5 className={"text-xl font-medium leading-5"}>Add New Customer</h5>
                     <Button className={"h-5 w-5 p-0"} onClick={onClose} variant={"ghost"}><X className={"h-4 w-4"} size={18}/></Button>
                 </SheetHeader>
                 <Separator className={"text-muted-foreground"}/>
                 <div className={"px-8 py-6"}>
                     <div className="grid w-full gap-2">
                         <Label htmlFor="name">Name</Label>
                         <Input type="text" id="name" className={"h-9 text-muted-foreground"} placeholder={"Enter the full name of customer..."}/>
                     </div>

                     <div className="grid w-full gap-2 mt-6">
                         <Label htmlFor="email">E-mail</Label>
                         <Input type="text" id="email" className={"h-9 text-muted-foreground"} placeholder={"Enter the email of customer"}/>
                     </div>

                     <div className={"mt-6 flex"}>
                         <Switch htmlFor={"switch"} />
                         <Label id={"switch"} className={"ml-[9px] text-sm font-medium"}>Receive Notifications</Label>
                     </div>
                 </div>
                 <Separator className={"mb-8 text-muted-foreground"}/>
                 <div className={"px-8"}>
                     <Button>Add Customer</Button>
                 </div>
             </SheetContent>
        </Sheet>
    );
};

export default NewCustomerSheet;