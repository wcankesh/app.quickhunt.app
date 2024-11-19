import React, {useState,useEffect} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../ui/card";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";
import {Button} from "../../ui/button";
import {CircleX, Eye, EyeOff, Loader2, Upload} from "lucide-react";
import {useSelector,useDispatch} from "react-redux";
import {ApiService} from "../../../utils/ApiService";
import {userDetailsAction} from "../../../redux/action/UserDetailAction";
import {toast} from "../../ui/use-toast";
import {useTheme} from "../../theme-provider";

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
    const dispatch = useDispatch();
    const apiSerVice = new ApiService();
    const {theme} = useTheme();
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

    useEffect(() => {
        setUserDetails({...userDetailsReducer});
    },[userDetailsReducer]);

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

    const onBlurPassWord = (event)=> {
        const {name, value} = event.target;
        setFormErrorPassword({
            ...formErrorPassword,
            [name]:formValidate(name,value)
        });
    }

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
            // case "user_email_id":
            //     if (!value || value.trim() === "") {
            //         return "Email is required";
            //     } else if (!value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
            //         return "Enter a valid email address";
            //     } else {
            //         return "";
            //     }
            case "user_email_id":
                if (!value || value.trim() === "") {
                    return "Email is required";
                }
                else if (!value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
                    return "Enter a valid email address";
                } else if (!value.endsWith(".com")) {
                    return "Email must end with .com";
                }
                else {
                    return "";
                }
            case "current_password":
                if (!value || value.trim() === "") {
                    return "Current password is required";
                } else {
                    return "";
                }
            case "password":
                if (!value || value.trim() === "") {
                    return "Password is required";
                } else if (
                    !value.match(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                    )
                ) {
                    return "Password must be at least 8 characters with one uppercase letter, one lowercase letter, one number, and one special character";
                } else {
                    return "";
                }
            case "confirm_password":
                if (!value || value.trim() === "") {
                    return "Confirm password is required";
                } else if (value !== password.password) {
                    return "Passwords do not match";
                } else {
                    return "";
                }
            case "user_photo":
                if (value && value.size > 5 * 1024 * 1024) { // 5 MB
                    return "Image size must be less than 5 MB.";
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
        const selectedFile = file.target.files[0];
        setUserDetails({
            ...userDetails,
            user_photo: selectedFile
        });
        setFormError(formError => ({
            ...formError,
            'user_photo': formValidate('user_photo', selectedFile)
        }));
    };

    const onDeleteImg = async (name, value) => {
        if(userDetails && userDetails?.user_photo && userDetails.user_photo?.name){
            setUserDetails({...userDetails, user_photo: ""})
        } else {
            setUserDetails({...userDetails, [name]: value, user_photo: ""})
        }
    }

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
        const obj = {
            user_first_name: userDetails.user_first_name,
            user_last_name: userDetails.user_last_name,
            user_email_id: userDetails.user_email_id,
            user_photo: userDetails.user_photo,
            user_job_title: userDetails.user_job_title,
            delete_image: userDetails?.delete_image || '',
        }
        Object.keys(obj).map((x) => {
            if(x === "delete_image" && obj?.user_photo?.name){

            }  else {
                formData.append(x,obj[x]);
            }
        })

        const data = await apiSerVice.updateLoginUserDetails(formData, userDetailsReducer.id);
        if(data.status === 200){
            dispatch(userDetailsAction({...data.data}));
            setIsLoading(false);
            toast({
                description: data.message,
            });
        } else {
            setIsLoading(false);
            toast({
                description: data.message,
                variant:"destructive"
            });
        }
    }

    const updatePassword = async () => {
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
            setPassword(initialStatePassWord);
            toast({
                description: data.message,
            })
        }else {
            setIsLoadingPass(false);
            toast({
                description: data.message,
                variant:"destructive"
            });
        }
    }

    return (
        <div className={"flex flex-col gap-6"}>
            <Card>
                <CardHeader className={"gap-1 border-b p-4 sm:px-5 sm:py-4"}>
                    <CardTitle className={"font-normal text-lg sm:text-2xl capitalize"}>Edit Profile</CardTitle>
                    <CardDescription className={" text-sm text-muted-foreground p-0"}>Manage your account settings.</CardDescription>
                </CardHeader>
                <CardContent className={"py-4 px-4 sm:px-5 sm:py-4 border-b"}>
                    <div className={"flex gap-4 flex-wrap lg:flex-nowrap md:flex-nowrap sm:flex-wrap"}>
                        <div className="flex flex-col justify-center mt-2 relative">
                            {
                                userDetails?.user_photo ?
                                    <div>
                                        {userDetails && userDetails.user_photo && userDetails.user_photo.name ?
                                            <div className={"w-[80px] h-[80px] sm:w-[132px] sm:h-[128px] relative border"}>
                                                <img
                                                    className="h-full w-full rounded-md object-cover"
                                                    src={userDetails && userDetails.user_photo && userDetails.user_photo.name ? URL.createObjectURL(userDetails.user_photo) : userDetails.user_photo}
                                                    alt=""
                                                />
                                                <CircleX
                                                    size={20}
                                                    className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                    onClick={() => onDeleteImg('delete_image', userDetails && userDetails?.user_photo && userDetails.user_photo?.name ? "" : userDetails.user_photo.replace("https://code.quickhunt.app/public/storage/user/", ""))}
                                                />
                                            </div> : userDetails.user_photo ?
                                                <div className={"w-[80px] h-[80px] sm:w-[132px] sm:h-[128px] relative border"}>
                                                    <img
                                                        className="h-full w-full rounded-md object-cover"
                                                        src={userDetails.user_photo}
                                                        alt=""/>
                                                    <CircleX
                                                        size={20}
                                                        className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                        onClick={() => onDeleteImg('delete_image', userDetails && userDetails?.user_photo && userDetails.user_photo?.name ? "" : userDetails.user_photo.replace("https://code.quickhunt.app/public/storage/user/", ""))}
                                                    />
                                                </div>
                                                : ''}
                                    </div> :
                                    <div>
                                        <input
                                            id="pictureInput"
                                            type="file"
                                            className="hidden"
                                            accept={"images/*"}
                                            onChange={handleFileChange}
                                        />
                                        <label
                                            htmlFor="pictureInput"
                                            className="flex w-[80px] h-[80px] sm:w-[132px] sm:h-[128px] py-0 justify-center items-center flex-shrink-0 border-dashed border-[1px] border-gray-300 rounded cursor-pointer"
                                        >
                                            <Upload className="h-4 w-4 text-muted-foreground" />
                                        </label>
                                    </div>
                            }
                                        {formError.user_photo && <div className={"text-xs text-destructive"}>{formError.user_photo}</div>}
                        </div>

                        <div className={"flex flex-col gap-4 w-full sm:w-full"}>
                            <div className={"flex gap-4 flex-wrap sm:flex-nowrap"}>
                                <div className={"basis-full space-y-0.5"}>
                                    <Label htmlFor="user_first_name" className={"font-normal"}>First Name</Label>
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
                                            <span className="text-destructive text-sm">{formError.user_first_name}</span>
                                        }
                                    </div>
                                </div>
                                <div className={"basis-full space-y-0.5"}>
                                    <Label htmlFor="user_last_name" className={"font-normal"}>Last Name</Label>
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
                                            <span className="text-destructive text-sm">{formError.user_last_name}</span>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className={"flex gap-4 lg:flex-nowrap md:flex-wrap"}>
                                <div className={"w-full sm:w-[49%] space-y-0.5"}>
                                    <Label htmlFor="email" className={"font-normal"}>Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="youremail@gmail.com"
                                        value={userDetails.user_email_id}
                                        name={'user_email_id'}
                                        onChange={onChange}
                                        className={"bg-card"}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className={"flex items-center p-4 sm:px-5 sm:py-4 justify-end"}>
                    <Button onClick={onUpdateUser}
                            className={`w-[111px] text-sm font-medium hover:bg-primary`}
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader className={"gap-1 border-b p-4 sm:px-5 sm:py-4"}>
                    <CardTitle className={"text-base font-normal"}>Change a password for your account</CardTitle>
                </CardHeader>
                <CardContent className={"py-4 px-4 sm:px-5 sm:py-4"}>
                    <div className={"flex flex-col gap-4"}>
                        <div className={"space-y-1"}>
                        <Label htmlFor="current_password" className={"font-normal"}>Current password</Label>
                        <div className={"relative"}>
                            <Input
                                id="current_password"
                                type={passwordVisibility.user_current_password ? "text" : "password"}
                                placeholder={"Current Password"}
                                value={password.current_password}
                                name="current_password"
                                onChange={onChangePassword}
                                onBlur={onBlurPassWord}
                                className={"bg-card"}
                            />
                            <Button variant={"ghost hover:none"} onClick={() => togglePasswordVisibility('user_current_password')}
                                    className={"absolute top-0 right-0"}>
                                {passwordVisibility.user_current_password ? <Eye className={"w-[16px] h-[16px]"}/> : <EyeOff className={"w-[16px] h-[16px]"}/>}
                            </Button>
                            {
                                formErrorPassword.current_password &&
                                <span className="text-destructive text-sm">{formErrorPassword.current_password}</span>
                            }
                        </div>
                        </div>

                        <div>
                        <Label htmlFor="password" className={"font-normal"}>Password</Label>
                        <div className={"relative"}>
                            <Input
                                id="password"
                                type={passwordVisibility.user_password ? "text" : "password"}
                                placeholder={"Password"}
                                value={password.password}
                                name="password"
                                onChange={onChangePassword}
                                onBlur={onBlurPassWord}
                                className={"bg-card"}
                            />
                            <Button variant={"ghost hover:none"} onClick={() => togglePasswordVisibility('user_password')}
                                    className={"absolute top-0 right-0"}>
                                {passwordVisibility.user_password ? <Eye className={"w-[16px] h-[16px]"}/> : <EyeOff className={"w-[16px] h-[16px]"}/>}
                            </Button>
                            {
                                formErrorPassword.password &&
                                <span className="text-destructive text-sm">{formErrorPassword.password}</span>
                            }
                        </div>
                        </div>

                        <div>
                        <Label htmlFor="password_confirm" className={"font-normal"}>Password confirmation</Label>
                        <div className={"relative"}>
                            <Input
                                id="password_confirm"
                                type={passwordVisibility.user_confirm_password ? "text" : "password"}
                                placeholder={"Confirm Password"}
                                value={password.confirm_password}
                                name="confirm_password"
                                onChange={onChangePassword}
                                onBlur={onBlurPassWord}
                                className={"bg-card"}
                            />
                            <Button variant={"ghost hover:none"} onClick={() => togglePasswordVisibility('user_confirm_password')}
                                    className={"absolute top-0 right-0"}>
                                {passwordVisibility.user_confirm_password ? <Eye className={"w-[16px] h-[16px]"}/> : <EyeOff className={"w-[16px] h-[16px]"}/>}
                            </Button>
                            {
                                formErrorPassword.confirm_password &&
                                <span className="text-destructive text-sm">{formErrorPassword.confirm_password}</span>
                            }
                        </div>
                        </div>

                    </div>
                </CardContent>
                <CardFooter className={"justify-end p-4 pt-0 sm:px-6"}>
                    <Button className={`w-[134px] text-sm font-medium hover:bg-primary`}
                            onClick={updatePassword}>{isLoadingPass ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Profile;