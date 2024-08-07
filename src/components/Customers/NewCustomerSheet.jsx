import React, {useState} from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader, SheetOverlay,
} from "../ui/sheet";
import {Separator} from "../ui/separator";
import {Button} from "../ui/button";
import {Loader2, X} from "lucide-react";
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
const initialStateError = {
    customer_name: "",
    customer_email_id: "",
}

const NewCustomerSheet = ({isOpen,onOpen,onClose}) => {
    const [customerDetails, setCustomerDetails] = useState(initialState);
    const [isSave,setIsSave]=useState(false);
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const [formError, setFormError] = useState(initialStateError);

    const formValidate = (name, value) => {
        switch (name) {
            case "customer_name":
                if (!value || value.trim() === "") {
                    return "Customer name is required.";
                } else {
                    return "";
                }
            case "customer_email_id":
                if (!value || value.trim() === "") {
                    return "Customer e-mail is required.";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const onChangeText = (event) => {
        setCustomerDetails({...customerDetails, [event.target.name]: event.target.value});
        setFormError(formError => ({...formError, [event.target.name]: formValidate(event.target.name, event.target.value)}));
    }

    const createCustomers = async () => {
        let validationErrors = {};
        Object.keys(customerDetails).forEach(name => {
            const error = formValidate(name, customerDetails[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsSave(true);
        const payload = {
            ...customerDetails,
            project_id: projectDetailsReducer.id,
            customer_first_seen: new Date(),
            customer_last_seen: new Date(),
        }
        const data = await apiService.createCustomers(payload)
        if(data.status === 200) {
            setIsSave(false);
            setCustomerDetails(initialState);
            toast({
                description: "Customer created successfully",
            });
        } else {
            setIsSave(false);
            toast({
                description:"Something went wrong",
                variant: "destructive",
            })
        }
        onClose(data.data);
    }

    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
            <SheetOverlay className={"inset-0"} />
             <SheetContent className={"pt-[24px] p-0 max-h-screen overflow-y-auto  lg:max-w-[662px] h-full sm:max-w-[520px] p-0"} >
                 <SheetHeader className={"sm:px-8 sm:py-6 px-3 py-4 flex flex-row justify-between items-center"}>
                     <h5 className={"text-sm md:text-xl font-medium leading-5"}>Add New Customer</h5>
                     <Button className={"h-5 w-5 p-0"} onClick={onClose} variant={"ghost"}><X size={18} className={"h-5 w-5"}/></Button>
                 </SheetHeader>
                 <Separator className={"text-muted-foreground"}/>
                 <div className={"sm:px-8 sm:py-6 px-3 py-4"}>
                     <div className="grid w-full gap-2">
                         <Label htmlFor="name">Name</Label>
                         <Input value={customerDetails.customer_name} name="customer_name" onChange={onChangeText} type="text" id="name" className={"h-9"} placeholder={"Enter the full name of customer..."}/>
                         {formError.customer_name && <span className="text-sm text-red-500">{formError.customer_name}</span>}
                     </div>

                     <div className="grid w-full gap-2 mt-6">
                         <Label htmlFor="email">E-mail</Label>
                         <Input value={customerDetails.customer_email_id} name="customer_email_id" onChange={onChangeText} type="email" id="email" className={"h-9"} placeholder={"Enter the email of customer"}/>
                         {formError.customer_email_id && <span className="text-sm text-red-500">{formError.customer_email_id}</span>}

                     </div>

                     <div className={"mt-6 flex"}>
                         <Switch checked={customerDetails.customer_email_notification == 1} onCheckedChange={(checked) => onChangeText({target: {name: "customer_email_notification", value:checked}})} htmlFor={"switch"} />
                         <Label id={"switch"} className={"ml-[9px] text-sm font-medium"}>Receive Notifications</Label>
                     </div>
                 </div>
                 <Separator className={"mb-8 text-muted-foreground"}/>
                 <div className={"px-3 sm:px-8"}>
                     <Button onClick={createCustomers}>{isSave ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add Customer"}</Button>
                 </div>
             </SheetContent>
        </Sheet>
    );
};

export default NewCustomerSheet;