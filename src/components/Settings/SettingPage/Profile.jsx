import React, {useState, useEffect} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../ui/card";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";
import {Button} from "../../ui/button";
import {CircleX, Eye, EyeOff, Loader2, Upload} from "lucide-react";
import {useSelector, useDispatch} from "react-redux";
import {userDetailsAction} from "../../../redux/action/UserDetailAction";
import {toast} from "../../ui/use-toast";
import {apiService, DO_SPACES_ENDPOINT} from "../../../utils/constent";

const initialState = {
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    profileImage: "",
}

const initialStateError = {
    firstName: '',
    lastName: ''
}
const initialStateErrorPassWord = {
    currentPassword: '',
    password: '',
    passwordConfirmation: '',
}
const initialStatePassWord = {
    currentPassword: '',
    password: '',
    passwordConfirmation: '',
}

const Profile = () => {
    const dispatch = useDispatch();
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);

    const [userDetails, setUserDetails] = useState(initialState);
    const [formError, setFormError] = useState(initialStateError);
    const [formErrorPassword, setFormErrorPassword] = useState(initialStateErrorPassWord);
    const [passwordVisibility, setPasswordVisibility] = useState({
        userCurrentPassword: false,
        userPassword: false,
        userConfirmPassword: false
    });
    const [password, setPassword] = useState(initialStatePassWord);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPass, setIsLoadingPass] = useState(false);

    useEffect(() => {
        setUserDetails({...userDetailsReducer});
    }, [userDetailsReducer]);

    const onChange = (event) => {
        setUserDetails({...userDetails, [event.target.name]: event.target.value})
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

    const onBlurPassWord = (event) => {
        const {name, value} = event.target;
        setFormErrorPassword({
            ...formErrorPassword,
            [name]: formValidate(name, value)
        });
    }

    const onChangePassword = (event) => {
        setPassword({...password, [event.target.name]: event.target.value})
        setFormErrorPassword(formErrorPassword => ({
            ...formErrorPassword,
            [event.target.name]: formValidate(event.target.name, event.target.value)
        }));
    }

    const formValidate = (name, value) => {
        switch (name) {
            case "firstName":
                if (!value || value.trim() === "") {
                    return "First name is required";
                } else {
                    return "";
                }
            case "lastName":
                if (!value || value.trim() === "") {
                    return "Last name is required";
                } else {
                    return "";
                }
            case "email":
                if (!value || value.trim() === "") {
                    return "Email is required";
                } else if (!value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
                    return "Enter a valid email address";
                } else if (!value.endsWith(".com")) {
                    return "Email must end with .com";
                } else {
                    return "";
                }
            case "currentPassword":
                if (!value || value.trim() === "") {
                    return "Current password is required";
                } else {
                    return "";
                }
            case "password":
                if (!value || value.trim() === "") {
                    return "Password is required";
                }
                // else if (
                //     !value.match(
                //         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                //     )
                // ) {
                //     return "Password must be at least 8 characters with one uppercase letter, one lowercase letter, one number, and one special character";
                // }
                else {
                    return "";
                }
            case "passwordConfirmation":
                if (!value || value.trim() === "") {
                    return "Confirm password is required";
                } else if (value !== password.password) {
                    return "Passwords do not match";
                } else {
                    return "";
                }
            case "profileImage":
                if (value && value.size > 5 * 1024 * 1024) {
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
            profileImage: selectedFile
        });
        setFormError(formError => ({
            ...formError,
            'profileImage': formValidate('profileImage', selectedFile)
        }));
    };

    const onDeleteImg = async (name, value) => {
        if (userDetails && userDetails?.profileImage && userDetails.profileImage?.name) {
            setUserDetails({...userDetails, profileImage: ""})
        } else {
            setUserDetails({...userDetails, [name]: value, profileImage: ""})
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
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            profileImage: userDetails.profileImage,
            deleteImage: userDetails?.deleteImage || '',
        }
        Object.keys(obj).forEach((key) => {
            if (key === "deleteImage") {
                if (obj[key]) {
                    formData.append(key, obj[key]);
                }
            } else {
                formData.append(key, obj[key]);
            }
        });

        const data = await apiService.updateLoginUserDetails(formData, userDetailsReducer.id);
        setIsLoading(false);
        if (data.success) {
            dispatch(userDetailsAction({...data.data}));
            toast({description: data.message,});
        } else {
            toast({description: data?.error?.message, variant: "destructive"});
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
        let formData = new FormData();
        formData.append('currentPassword', password.currentPassword);
        formData.append('password', password.password);
        formData.append('passwordConfirmation', password.passwordConfirmation);
        const data = await apiService.updateLoginUserDetails(formData);
        setIsLoadingPass(false)
        if (data.success) {
            setPassword(initialStatePassWord);
            toast({description: data.message,})
        } else {
            toast({description: data?.error?.message, variant: "destructive"});
        }
    }

    return (
        <div className={"flex flex-col gap-6"}>
            <Card>
                <CardHeader className={"gap-1 border-b p-4 sm:px-5 sm:py-4"}>
                    <CardTitle className={"font-normal text-xl lg:text-2xl capitalize"}>Edit Profile</CardTitle>
                    <CardDescription className={" text-sm text-muted-foreground p-0"}>Manage your account
                        settings.</CardDescription>
                </CardHeader>
                <CardContent className={"py-4 px-4 sm:px-5 sm:py-4 border-b"}>
                    <div className={"flex gap-4 flex-wrap lg:flex-nowrap md:flex-nowrap sm:flex-wrap"}>
                        <div className="flex flex-col justify-center mt-2 relative">
                            {
                                userDetails?.profileImage ?
                                    <div className="w-[80px] h-[80px] sm:w-[132px] sm:h-[128px] relative border">
                                        <img
                                            className="h-full w-full rounded-md object-cover"
                                            src={userDetails?.profileImage?.name ? URL.createObjectURL(userDetails.profileImage) : `${DO_SPACES_ENDPOINT}/${userDetails.profileImage}`}
                                            alt="profile"
                                        />
                                        <CircleX
                                            size={20}
                                            className="stroke-gray-500 dark:stroke-white cursor-pointer absolute top-0 left-full translate-x-[-50%] translate-y-[-50%] z-10"
                                            onClick={() => onDeleteImg('deleteImage', userDetails?.profileImage?.name ? "" : userDetails?.profileImage)}
                                        />
                                    </div> :
                                    <div>
                                        <input
                                            id="pictureInput"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <label
                                            htmlFor="pictureInput"
                                            className="flex w-[80px] h-[80px] sm:w-[132px] sm:h-[128px] justify-center items-center border-dashed border border-gray-300 rounded cursor-pointer"
                                        >
                                            <Upload className="h-4 w-4 text-muted-foreground" />
                                        </label>
                                    </div>
                            }
                            {formError.profileImage &&
                            <div className={"text-xs text-destructive"}>{formError.profileImage}</div>}
                        </div>

                        <div className={"flex flex-col gap-4 w-full sm:w-full"}>
                            <div className={"flex gap-4 flex-wrap sm:flex-nowrap"}>
                                <div className={"basis-full space-y-0.5"}>
                                    <Label htmlFor="firstName" className={"font-normal"}>First Name</Label>
                                    <Input
                                        id="firstName"
                                        placeholder="First Name"
                                        value={userDetails.firstName}
                                        name={'firstName'}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className={"bg-card"}
                                    />
                                    <div className="grid gap-2">
                                        {
                                            formError.firstName &&
                                            <span className="text-destructive text-sm">{formError.firstName}</span>
                                        }
                                    </div>
                                </div>
                                <div className={"basis-full space-y-0.5"}>
                                    <Label htmlFor="lastName" className={"font-normal"}>Last Name</Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Last Name"
                                        value={userDetails.lastName}
                                        name={'lastName'}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className={"bg-card"}
                                    />
                                    <div className="grid gap-2">
                                        {
                                            formError.lastName &&
                                            <span className="text-destructive text-sm">{formError.lastName}</span>
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
                                        value={userDetails.email}
                                        name={'email'}
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
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Save Changes"}</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader className={"gap-1 border-b p-4 sm:px-5 sm:py-4"}>
                    <CardTitle className={"text-base font-normal"}>Change a password for your account</CardTitle>
                </CardHeader>
                <CardContent className={"py-4 px-4 sm:px-5 sm:py-4"}>
                    <div className={"flex flex-col gap-4"}>
                        <div className={"space-y-1"}>
                            <Label htmlFor="currentPassword" className={"font-normal"}>Current password</Label>
                            <div className={"relative"}>
                                <Input
                                    id="currentPassword"
                                    type={passwordVisibility.userCurrentPassword ? "text" : "password"}
                                    placeholder={"Current Password"}
                                    value={password.currentPassword}
                                    name="currentPassword"
                                    onChange={onChangePassword}
                                    onBlur={onBlurPassWord}
                                    className={"bg-card"}
                                />
                                <Button variant={"ghost hover:none"}
                                        onClick={() => togglePasswordVisibility('userCurrentPassword')}
                                        className={"absolute top-0 right-0"}>
                                    {passwordVisibility.userCurrentPassword ? <Eye className={"w-[16px] h-[16px]"}/> :
                                        <EyeOff className={"w-[16px] h-[16px]"}/>}
                                </Button>
                                {
                                    formErrorPassword.currentPassword &&
                                    <span
                                        className="text-destructive text-sm">{formErrorPassword.currentPassword}</span>
                                }
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="password" className={"font-normal"}>Password</Label>
                            <div className={"relative"}>
                                <Input
                                    id="password"
                                    type={passwordVisibility.userPassword ? "text" : "password"}
                                    placeholder={"Password"}
                                    value={password.password}
                                    name="password"
                                    onChange={onChangePassword}
                                    onBlur={onBlurPassWord}
                                    className={"bg-card"}
                                />
                                <Button variant={"ghost hover:none"}
                                        onClick={() => togglePasswordVisibility('userPassword')}
                                        className={"absolute top-0 right-0"}>
                                    {passwordVisibility.userPassword ? <Eye className={"w-[16px] h-[16px]"}/> :
                                        <EyeOff className={"w-[16px] h-[16px]"}/>}
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
                                    type={passwordVisibility.userConfirmPassword ? "text" : "password"}
                                    placeholder={"Confirm Password"}
                                    value={password.passwordConfirmation}
                                    name="passwordConfirmation"
                                    onChange={onChangePassword}
                                    onBlur={onBlurPassWord}
                                    className={"bg-card"}
                                />
                                <Button variant={"ghost hover:none"}
                                        onClick={() => togglePasswordVisibility('userConfirmPassword')}
                                        className={"absolute top-0 right-0"}>
                                    {passwordVisibility.userConfirmPassword ? <Eye className={"w-[16px] h-[16px]"}/> :
                                        <EyeOff className={"w-[16px] h-[16px]"}/>}
                                </Button>
                                {
                                    formErrorPassword.passwordConfirmation &&
                                    <span
                                        className="text-destructive text-sm">{formErrorPassword.passwordConfirmation}</span>
                                }
                            </div>
                        </div>

                    </div>
                </CardContent>
                <CardFooter className={"justify-end p-4 pt-0 sm:px-6"}>
                    <Button className={`w-[134px] text-sm font-medium hover:bg-primary`}
                            onClick={updatePassword}>{isLoadingPass ?
                        <Loader2 className="h-4 w-4 animate-spin"/> : "Update Password"}</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Profile;