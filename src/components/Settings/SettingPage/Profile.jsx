import React, {useState,useEffect} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../ui/card";
import SettingProfile from "../../../img/settingprofile.png";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";
import {Button} from "../../ui/button";
import {Eye, EyeOff} from "lucide-react";
import {useSelector,useDispatch} from "react-redux";
import {ApiService} from "../../../utils/ApiService";
import {userDetailsAction} from "../../../redux/action/UserDetailAction";
import {toast} from "../../ui/use-toast";

const initialState = {
    id: "",
    user_browser: null,
    user_created_date: "",
    user_email_id: "",
    user_first_name: "",
    user_ip_address: null,
    user_job_title: "",
    user_last_name: "",
    user_photo: "",
    user_status: "",
    user_updated_date: "",
}

const initialStateError ={
    user_first_name:'',
    user_last_name:''
}
const initialStateErrorPassWord ={
    current_password:'',
    password:'',
    confirm_password:'',
}
const initialStatePassWord ={
    current_password:'',
    password:'',
    confirm_password:'',
}

const Profile = () => {
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);
    const [userDetails, setUserDetails] = useState(initialState);
    const [formError, setFormError] = useState(initialStateError);
    const [formErrorPassword, setFormErrorPassword] = useState(initialStateErrorPassWord);
    const [passwordVisibility, setPasswordVisibility] = useState({
        user_current_password: false,
        user_password: false,
        user_confirm_password: false
    });
    const [password, setPassword] = useState(initialStatePassWord);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPass, setIsLoadingPass] = useState(false);
    const dispatch = useDispatch();
    const apiSerVice = new ApiService();
    const [previewImage,setPreviewImage] = useState("");



    useEffect(() => {
        setUserDetails({...userDetailsReducer});
        setPreviewImage(userDetailsReducer.user_photo)
    },[userDetailsReducer]);
    console.log(userDetails);

    const onChange = (event) => {
        setUserDetails({...userDetails, [event.target.name] : event.target.value})
        setFormError(formError => ({
            ...formError,
            [event.target.name]: formValidate(event.target.name, event.target.value)
        }));
    };

    const onBlur = (event) => {
        const {name, value} = event.target;
        setFormError({
            ...formError,
            [name]: formValidate(name, value)
        });
    };

    const onChangePassword = (event) => {
        setPassword({...password, [event.target.name] : event.target.value})
        setFormErrorPassword(formErrorPassword => ({
            ...formErrorPassword,
            [event.target.name]: formValidate(event.target.name, event.target.value)
        }));
    }

    const formValidate = (name, value) => {
        switch (name) {
            case "user_first_name":
                if (!value || value.trim() === "") {
                    return "First name is required";
                } else {
                    return "";
                }
            case "user_last_name":
                if (!value || value.trim() === "") {
                    return "Last name is required";
                } else {
                    return "";
                }
            case "user_email_id":
                if (!value || value.trim() === "") {
                    return "Email is required";
                } else if (!value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
                    return "Enter a valid email address";
                } else {
                    return "";
                }
            case "user_current_password":
                if (!value || value.trim() === "") {
                    return "Current password is required";
                } else {
                    return "";
                }
            case "user_password":
                if (!value || value.trim() === "") {
                    return "Password is required";
                } else {
                    return "";
                }
            case "user_confirm_password":
                if (!value || value.trim() === "") {
                    return "Confirm password is required";
                } else if (value !== userDetails.user_password) {
                    return "Passwords do not match";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const togglePasswordVisibility = (fieldName) => {
        setPasswordVisibility({...passwordVisibility, [fieldName]: !passwordVisibility[fieldName]});
    };

    const handleFileChange = (file) => {
        setUserDetails({...userDetails, user_photo : file.target.files[0]});
        setPreviewImage(URL.createObjectURL(file.target.files[0]));
    };

    const onUpdateUser = async () => {
        let validationErrors = {};
        Object.keys(userDetails).forEach(name => {
            const error = formValidate(name, userDetails[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsLoading(true)
        let formData = new FormData();
        formData.append("user_first_name", userDetails.user_first_name);
        formData.append("user_last_name", userDetails.user_last_name);
        formData.append("user_email_id", userDetails.user_email_id);
        formData.append("user_photo", userDetails.user_photo);
        formData.append("user_job_title", userDetails.user_job_title);
        const data = await apiSerVice.updateLoginUserDetails(formData, userDetailsReducer.id);
        if(data.status === 200){
            dispatch(userDetailsAction({...data.data}));
            setIsLoading(false);
            toast({
                title: data.success,
            })
        } else {
            setIsLoading(false);
            toast({
                title: "Something went wrong!!!",
                variant:"destructive"
            })
        }
    }

    const changePassword = async () => {
        let validationErrors = {};
        Object.keys(password).forEach(name => {
            const error = formValidate(name, password[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormErrorPassword(validationErrors);
            return;
        }
        setIsLoadingPass(true)
        const payload = {
            ...password
        }
        const data = await apiSerVice.changePassword(payload);
        if(data.status === 200){
            setIsLoadingPass(false)
            toast({
                title: data.success,
            })
        }else {
            setIsLoadingPass(false);
            toast({
                title: "Something went wrong!!!",
                variant:"destructive"
            });
        }
    }

    return (
        <div className={"flex flex-col gap-6"}>
            <Card>
                <CardHeader className={"gap-1 border-b"}>
                    <CardTitle className={"text-2xl font-medium"}>Edit Profile</CardTitle>
                    <CardDescription className={"text-sm text-muted-foreground p-0"}>Manage your personal account settings.</CardDescription>
                </CardHeader>
                <CardContent className={"py-6 px-4 border-b"}>
                    <div className={"flex gap-4 lg:flex-nowrap md:flex-wrap sm:flex-wrap"}>
                        <div className="flex items-center justify-center">
                            <label
                                htmlFor="upload_image"
                                className="flex w-[132px] h-[128px] py-0 justify-center items-center flex-shrink-0 border-dashed border-[1px] border-gray-300 rounded cursor-pointer"
                            >
                                {previewImage ? <img className={"h-full w-full rounded-md object-cover"} src={previewImage} alt={"not_found"} /> : <span className="text-center text-muted-foreground font-semibold text-[14px]">Upload Image</span>}
                                <input
                                    id="upload_image"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                            </label>
                        </div>
                        <div className={"flex flex-col gap-4 md:w-full sm:w-full"}>
                            <div className={"flex gap-4 lg:flex-nowrap md:flex-wrap sm:flex-wrap"}>
                                <div className={"basis-1/2 md:basis-full sm:basis-full"}>
                                    <Label htmlFor="email" className={"font-medium"}>First Name</Label>
                                    <Input
                                        id="user_first_name"
                                        placeholder="First Name"
                                        value={userDetails.user_first_name}
                                        name={'user_first_name'}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className={"bg-card"}
                                    />
                                    <div className="grid gap-2">
                                        {
                                            formError.user_first_name &&
                                            <span className="text-red-500 text-sm">{formError.user_first_name}</span>
                                        }
                                    </div>
                                </div>
                                <div className={"basis-1/2 md:basis-full sm:basis-full"}>
                                    <Label htmlFor="email" className={"font-medium"}>Last Name</Label>
                                    <Input
                                        id="user_last_name"
                                        placeholder="Last Name"
                                        value={userDetails.user_last_name}
                                        name={'user_last_name'}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className={"bg-card"}
                                    />
                                    <div className="grid gap-2">
                                        {
                                            formError.user_last_name &&
                                            <span className="text-red-500 text-sm">{formError.user_last_name}</span>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className={"flex gap-4 lg:flex-nowrap md:flex-wrap"}>
                                <div className={"lg:w-[289px] md:w-full sm:w-full"}>
                                    <Label htmlFor="email" className={"font-medium"}>Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="wc.ankesh@gmail.com"
                                        value={userDetails.user_email_id}
                                        name={'user_email_id'}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className={"bg-card"}
                                    />
                                    {
                                        formError.user_email_id &&
                                        <span className="text-red-500 text-sm">{formError.user_email_id}</span>
                                    }
                                </div>
                                <div className={"w-[279px] hidden"}>
                                    <Label htmlFor="email" className={"font-medium"}>Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="wc.ankesh@gmail.com"
                                        value={userDetails.user_email_id}
                                        name={'user_email_id'}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className={"bg-card"}
                                    />
                                    {
                                        formError.user_email_id &&
                                        <span className="text-destructive text-sm">{formError.user_email_id}</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className={"p-6 justify-end"}>
                    <Button onClick={onUpdateUser} className={"text-sm font-semibold"}>Save Changes</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader className={"border-b"}>
                    <CardTitle className={"text-sm font-medium"}>Change a password for your account</CardTitle>
                </CardHeader>
                <CardContent className={"pt-4 "}>
                    <div className={"flex flex-col gap-4"}>
                        <div>
                        <Label htmlFor="email">Current password</Label>
                        <div className={"relative"}>
                            <Input
                                id="password"
                                type={passwordVisibility.user_current_password ? "text" : "password"}
                                placeholder={"Current Password"}
                                value={password.current_password}
                                name="current_password"
                                onChange={onChangePassword}
                                onBlur={onBlur}
                                className={"bg-card"}
                            />
                            <Button variant={"ghost hover:none"} onClick={() => togglePasswordVisibility('user_current_password')}
                                    className={"absolute top-0 right-0"}>
                                {passwordVisibility.user_current_password ? <Eye className={"w-[16px] h-[16px]"}/> : <EyeOff className={"w-[16px] h-[16px]"}/>}
                            </Button>
                        </div>
                        </div>
                        {
                            formError.user_current_password &&
                            <span className="text-destructive text-sm">{formError.user_current_password}</span>
                        }
                        <div>
                        <Label htmlFor="email">Password</Label>
                        <div className={"relative"}>
                            <Input
                                id="password"
                                type={passwordVisibility.user_password ? "text" : "password"}
                                placeholder={"Password"}
                                value={password.password}
                                name="password"
                                onChange={onChangePassword}
                                onBlur={onBlur}
                                className={"bg-card"}
                            />
                            <Button variant={"ghost hover:none"} onClick={() => togglePasswordVisibility('user_password')}
                                    className={"absolute top-0 right-0"}>
                                {passwordVisibility.user_password ? <Eye className={"w-[16px] h-[16px]"}/> : <EyeOff className={"w-[16px] h-[16px]"}/>}
                            </Button>
                        </div>
                        </div>
                        {
                            formError.user_password &&
                            <span className="text-destructive text-sm">{formError.user_password}</span>
                        }
                        <div>
                        <Label htmlFor="email">Password confirmation</Label>
                        <div className={"relative"}>
                            <Input
                                id="password"
                                type={passwordVisibility.user_confirm_password ? "text" : "password"}
                                placeholder={"Confirm Password"}
                                value={password.confirm_password}
                                name="confirm_password"
                                onChange={onChangePassword}
                                onBlur={onBlur}
                                className={"bg-card"}
                            />
                            <Button variant={"ghost hover:none"} onClick={() => togglePasswordVisibility('user_confirm_password')}
                                    className={"absolute top-0 right-0"}>
                                {passwordVisibility.user_confirm_password ? <Eye className={"w-[16px] h-[16px]"}/> : <EyeOff className={"w-[16px] h-[16px]"}/>}
                            </Button>
                        </div>
                        </div>
                        {
                            formError.user_confirm_password &&
                            <span className="text-destructive text-sm">{formError.user_confirm_password}</span>
                        }
                    </div>
                </CardContent>
                <CardFooter className={"p-6 pt-0 justify-end"}>
                    <Button className={"text-sm font-semibold"} onClick={changePassword}>Update Password</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Profile;