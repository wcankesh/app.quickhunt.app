import React, {useState} from 'react';
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
import {ApiService} from "../../utils/ApiService";
import {useSelector} from "react-redux";
import {toast} from "../ui/use-toast";

const initialState = {
    project_id: '',
    customer_name: '',
    customer_email_id: '',
    customer_email_notification: false,
    customer_first_seen: '',
    customer_last_seen: '',
    user_browser: '',
    user_ip_address : '',
}

const NewCustomerSheet = ({isOpen,onOpen,onClose,callback}) => {
    const [customerDetails, setCustomerDetails] = useState(initialState);
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const onChangeText = (event) => {
        setCustomerDetails({...customerDetails, [event.target.name]: event.target.value})
    }

    const createCustomers = async () => {
        const payload = {
            ...customerDetails,
            project_id: projectDetailsReducer.id,
            customer_first_seen: new Date(),
            customer_last_seen: new Date(),

        }
        console.log(payload);
        const data = await apiService.createCustomers(payload)
        if(data.status === 200) {
            setCustomerDetails(initialState);
            toast({
                title: "Customer created successfully",
            });
        } else {

        }
        callback();
        onClose();
    }

    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
             <SheetContent className={"pt-[24px] p-0 max-h-screen overflow-y-auto  lg:max-w-[662px] h-full sm:max-w-[520px] p-0"} >
                 <SheetHeader className={"px-8 py-6 flex flex-row justify-between items-center"}>
                     <h5 className={"text-xl font-medium leading-5"}>Add New Customer</h5>
                     <Button className={"h-5 w-5 p-0"} onClick={onClose} variant={"ghost"}><X className={"h-4 w-4"} size={18}/></Button>
                 </SheetHeader>
                 <Separator className={"text-muted-foreground"}/>
                 <div className={"px-8 py-6"}>
                     <div className="grid w-full gap-2">
                         <Label htmlFor="name">Name</Label>
                         <Input value={customerDetails.customer_name} name="customer_name" onChange={onChangeText} type="text" id="name" className={"h-9 text-muted-foreground"} placeholder={"Enter the full name of customer..."}/>
                     </div>

                     <div className="grid w-full gap-2 mt-6">
                         <Label htmlFor="email">E-mail</Label>
                         <Input value={customerDetails.customer_email_id} name="customer_email_id" onChange={onChangeText} type="email" id="email" className={"h-9 text-muted-foreground"} placeholder={"Enter the email of customer"}/>
                     </div>

                     <div className={"mt-6 flex"}>
                         <Switch checked={customerDetails.customer_email_notification == 1} onCheckedChange={(checked) => onChangeText({target: {name: "customer_email_notification", value:checked}})} htmlFor={"switch"} />
                         <Label id={"switch"} className={"ml-[9px] text-sm font-medium"}>Receive Notifications</Label>
                     </div>
                 </div>
                 <Separator className={"mb-8 text-muted-foreground"}/>
                 <div className={"px-8"}>
                     <Button onClick={createCustomers}>Add Customer</Button>
                 </div>
             </SheetContent>
        </Sheet>
    );
};

export default NewCustomerSheet;