import React, {Fragment} from 'react';
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Dialog} from "../ui/dialog";
import {Button} from "../ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
import {Copy, Loader2, X} from "lucide-react";

const CopyCode = ({ open, onOpenChange, title, description, onClick, embedLink, iFrame, callback, codeString, theme, isCopyLoading, handleCopyCode, isWidget }) => {
    return (
        open && (
            <Fragment>
                <Dialog open onOpenChange={onOpenChange}>
                    <DialogContent className="max-w-[350px] w-full sm:max-w-[580px] bg-white rounded-lg p-3 md:p-6">
                        <DialogHeader className={"flex flex-row justify-between gap-2"}>
                            <div className={"flex flex-col gap-2"}>
                                <DialogTitle className={`text-left font-medium ${theme === "dark" ? "text-card" : ""}`}>
                                    {title}
                                </DialogTitle>
                                <DialogDescription className={"text-left"}>
                                    {description}
                                </DialogDescription>
                            </div>
                            <X size={16} className={`${theme === "dark" ? "text-card" : ""} m-0 cursor-pointer`}
                               onClick={onClick}/>
                        </DialogHeader>
                        {
                            isWidget ?
                                <Tabs defaultValue="script" className={""}>
                                    <TabsList className="grid grid-cols-4 w-full bg-white mb-2 h-auto sm:h-10">
                                        <TabsTrigger value="script" className={"font-normal"}>Script</TabsTrigger>
                                        <TabsTrigger className={"whitespace-normal sm:whitespace-nowrap font-normal"} value="embedlink">Embed Link</TabsTrigger>
                                        <TabsTrigger value="iframe" className={"font-normal"}>iFrame</TabsTrigger>
                                        <TabsTrigger className={"whitespace-normal sm:whitespace-nowrap font-normal"} value="callback">Callback function</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="script" className={"flex flex-col gap-2 m-0"}>
                                        <h4 className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-sm`}>
                                            Place the code below before the closing body tag on your site.
                                        </h4>
                                        <div>
                                            <div className={"relative px-6 rounded-md bg-black mb-2"}>
                                                <div className={"relative"}>
                                                <pre id="text"
                                                     className={"py-4 whitespace-pre overflow-x-auto scrollbars-none text-[10px] text-text-invert text-white max-w-[230px] w-full md:max-w-[450px]"}>
                                                      {codeString}
                                                  </pre>

                                                    <Button
                                                        variant={"ghost hover:none"}
                                                        className={`${isCopyLoading === true ? "absolute top-0 right-0 px-0" : "absolute top-0 right-0 px-0"}`}
                                                        onClick={() => handleCopyCode(codeString)}
                                                    >
                                                        {isCopyLoading ? <Loader2 size={16} className={"animate-spin"}
                                                                                  color={"white"}/> :
                                                            <Copy size={16} color={"white"}/>}
                                                    </Button>

                                                </div>
                                            </div>

                                            <p className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-xs`}>Read
                                                the {" "}
                                                <Button variant={"ghost hover:none"}
                                                        className={"p-0 h-auto text-xs text-primary font-medium"}>
                                                    Setup Guide
                                                </Button>
                                                {" "}for more information or {" "}
                                                <Button
                                                    variant={"ghost hover:none"}
                                                    className={"p-0 h-auto text-xs text-primary font-medium"}
                                                >
                                                    download the HTML example.
                                                </Button>
                                            </p>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="embedlink" className={"space-y-2 m-0"}>
                                        <div className={"space-y-2"}>
                                            <div
                                                className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-sm`}>
                                                Follow these simple steps to embed the widget on any {" "}
                                                <Button
                                                    variant={"ghost hover:none"}
                                                    className={"p-0 h-auto text-xs text-primary font-medium"}
                                                >
                                                    supported website.
                                                </Button>
                                            </div>
                                            <div>
                                                <p className={`text-xs ${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} pb-1`}>1.
                                                    Copy the link below</p>
                                                <p className={`text-xs ${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} pb-1`}>2.
                                                    Paste the link on any site where you want the widget to show.</p>
                                                <p className={`text-xs ${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} pb-1`}>3.
                                                    That's it!</p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className={"relative px-6 rounded-md bg-black mb-2"}>
                                                <div className={"relative"}>
                                                <pre id="text"
                                                     className={"py-4 whitespace-pre overflow-x-auto scrollbars-none text-[10px] text-text-invert text-white max-w-[230px] w-full md:max-w-[450px]"}>
                                                    {embedLink}
                                                  </pre>

                                                    <Button
                                                        variant={"ghost hover:none"}
                                                        className={`${isCopyLoading === true ? "absolute top-0 right-0 px-0" : "absolute top-0 right-0 px-0"}`}
                                                        onClick={() => handleCopyCode(embedLink)}
                                                    >
                                                        {isCopyLoading ? <Loader2 size={16} className={"animate-spin"}
                                                                                  color={"white"}/> :
                                                            <Copy size={16} color={"white"}/>}
                                                    </Button>

                                                </div>
                                            </div>
                                            <p className={`text-xs ${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"}`}>Read
                                                the {" "}
                                                <Button
                                                    variant={"ghost hover:none"}
                                                    className={"p-0 h-auto text-xs text-primary font-medium"}
                                                >
                                                    Setup Guide
                                                </Button>
                                                {" "}for more information.
                                            </p>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="iframe" className={"flex flex-col gap-2 m-0"}>
                                        <div
                                            className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-sm`}>
                                            Place the code below before the closing body tag on your site.
                                        </div>
                                        <div>
                                            <div className={"relative px-6 rounded-md bg-black"}>
                                                <div className={"relative"}>
                                                <pre id="text"
                                                     className={"py-4 whitespace-pre overflow-x-auto scrollbars-none text-[10px] text-text-invert text-white max-w-[230px] w-full md:max-w-[450px]"}>
                                                      {iFrame}
                                                  </pre>

                                                    <Button
                                                        variant={"ghost hover:none"}
                                                        className={`${isCopyLoading === true ? "absolute top-0 right-0 px-0" : "absolute top-0 right-0 px-0"}`}
                                                        onClick={() => handleCopyCode(iFrame)}
                                                    >
                                                        {isCopyLoading ? <Loader2 size={16} className={"animate-spin"}
                                                                                  color={"white"}/> :
                                                            <Copy size={16} color={"white"}/>}
                                                    </Button>

                                                </div>
                                            </div>
                                        </div>
                                        <p className={`text-xs ${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"}`}>Read
                                            the {" "}
                                            <Button
                                                variant={"ghost hover:none"}
                                                className={"p-0 h-auto text-xs text-primary font-medium"}
                                            >
                                                Setup Guide
                                            </Button>
                                            for more information.
                                        </p>
                                    </TabsContent>
                                    <TabsContent value="callback" className={"flex flex-col gap-2 m-0"}>
                                        <h4 className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-sm`}>
                                            Place the code below before the closing body tag on your site.
                                        </h4>
                                        <div>
                                            <div className={"relative px-6 rounded-md bg-black mb-2"}>
                                                <div className={"relative"}>
                                                <pre id="text"
                                                     className={"py-4 whitespace-pre overflow-x-auto scrollbars-none text-[10px] text-text-invert text-white max-w-[230px] w-full md:max-w-[450px]"}>
                                                      {callback}
                                                  </pre>
                                                    <Button
                                                        variant={"ghost hover:none"}
                                                        className={`absolute top-0 right-0 px-0`}
                                                        onClick={() => handleCopyCode(callback)}
                                                    >
                                                        {isCopyLoading ? <Loader2 size={16} className={"animate-spin"}
                                                                                  color={"white"}/> :
                                                            <Copy size={16} color={"white"}/>}
                                                    </Button>

                                                </div>
                                            </div>

                                            <p className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-xs`}>Read
                                                the {" "}
                                                <Button variant={"ghost hover:none"}
                                                        className={"p-0 h-auto text-xs text-primary font-medium"}>
                                                    Setup Guide
                                                </Button>
                                                {" "}for more information or {" "}
                                                <Button
                                                    variant={"ghost hover:none"}
                                                    className={"p-0 h-auto text-xs text-primary font-medium"}
                                                >
                                                    download the HTML example.
                                                </Button>
                                            </p>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                                : <div className={"space-y-2"}>
                                    <h4 className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-sm`}>
                                        Place the code below before the closing body tag on your site.
                                    </h4>
                                    <div>
                                        <div className={"relative px-6 rounded-md bg-black mb-2"}>
                                            <div className={"relative"}>
                                                <pre id="text"
                                                     className={"py-4 whitespace-pre overflow-x-auto scrollbars-none text-[10px] text-text-invert text-white max-w-[230px] w-full md:max-w-[450px]"}>
                                                      {codeString}
                                                  </pre>

                                                <Button
                                                    variant={"ghost hover:none"}
                                                    className={`${isCopyLoading === true ? "absolute top-0 right-0 px-0" : "absolute top-0 right-0 px-0"}`}
                                                    onClick={() => handleCopyCode(codeString)}
                                                >
                                                    {isCopyLoading ? <Loader2 size={16} className={"animate-spin"}
                                                                              color={"white"}/> :
                                                        <Copy size={16} color={"white"}/>}
                                                </Button>

                                            </div>
                                        </div>

                                        <p className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-xs`}>Read
                                            the {" "}
                                            <Button variant={"ghost hover:none"}
                                                    className={"p-0 h-auto text-xs text-primary font-medium"}>
                                                Setup Guide
                                            </Button>
                                            {" "}for more information or {" "}
                                            <Button
                                                variant={"ghost hover:none"}
                                                className={"p-0 h-auto text-xs text-primary font-medium"}
                                            >
                                                download the HTML example.
                                            </Button>
                                        </p>
                                    </div>
                                </div>
                        }
                        <DialogFooter>
                            <Button variant={"outline hover:none"}
                                    className={`text-sm font-medium border ${theme === "dark" ? "text-card" : "text-card-foreground"}`}
                                    onClick={onClick}>Cancel</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    );
};

export default CopyCode;


// sorter code
// import React, { Fragment } from 'react';
// import {
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     Dialog
// } from "../ui/dialog";
// import { Button } from "../ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
// import { Copy, Loader2, X } from "lucide-react";
//
// const CopyCode = ({
//                       open,
//                       onOpenChange,
//                       title,
//                       description,
//                       onClick,
//                       embedLink,
//                       iFrame,
//                       callback,
//                       codeString,
//                       theme,
//                       isCopyLoading,
//                       handleCopyCode,
//                       isWidget
//                   }) => {
//     const renderCopyButton = (code) => (
//         <Button
//             variant="ghost hover:none"
//             className="absolute top-0 right-0 px-0"
//             onClick={() => handleCopyCode(code)}
//         >
//             {isCopyLoading ? (
//                 <Loader2 size={16} className="animate-spin" color="white" />
//             ) : (
//                 <Copy size={16} color="white" />
//             )}
//         </Button>
//     );
//
//     const renderTabsContent = (value, content) => (
//         <TabsContent value={value} className="flex flex-col gap-2 m-0">
//             {content}
//         </TabsContent>
//     );
//
//     const renderCodeBlock = (code) => (
//         <div className="relative px-6 rounded-md bg-black mb-2">
//             <pre
//                 className="py-4 whitespace-pre overflow-x-auto scrollbars-none text-[10px] text-text-invert text-white max-w-[230px] w-full md:max-w-[450px]"
//             >
//                 {code}
//             </pre>
//             {renderCopyButton(code)}
//         </div>
//     );
//
//     return (
//         open && (
//             <Fragment>
//                 <Dialog open onOpenChange={onOpenChange}>
//                     <DialogContent className="max-w-[350px] w-full sm:max-w-[580px] bg-white rounded-lg p-3 md:p-6">
//                         <DialogHeader className="flex flex-row justify-between gap-2">
//                             <div className="flex flex-col gap-2">
//                                 <DialogTitle className={`text-left font-medium ${theme === "dark" ? "text-card" : ""}`}>
//                                     {title}
//                                 </DialogTitle>
//                                 <DialogDescription className="text-left">
//                                     {description}
//                                 </DialogDescription>
//                             </div>
//                             <X size={16} className={`${theme === "dark" ? "text-card" : ""} m-0 cursor-pointer`} onClick={onClick} />
//                         </DialogHeader>
//                         {isWidget ? (
//                             <Tabs defaultValue="script">
//                                 <TabsList className="grid grid-cols-4 w-full bg-white mb-2 h-auto sm:h-10">
//                                     <TabsTrigger value="script" className="font-normal">Script</TabsTrigger>
//                                     <TabsTrigger value="embedlink" className="whitespace-normal sm:whitespace-nowrap font-normal">Embed Link</TabsTrigger>
//                                     <TabsTrigger value="iframe" className="font-normal">iFrame</TabsTrigger>
//                                     <TabsTrigger value="callback" className="whitespace-normal sm:whitespace-nowrap font-normal">Callback function</TabsTrigger>
//                                 </TabsList>
//                                 {renderTabsContent("script", (
//                                     <>
//                                         <h4 className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-sm`}>
//                                             Place the code below before the closing body tag on your site.
//                                         </h4>
//                                         {renderCodeBlock(codeString)}
//                                         <p className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-xs`}>
//                                             Read the <Button variant="ghost hover:none" className="p-0 h-auto text-xs text-primary font-medium">Setup Guide</Button> for more information or <Button variant="ghost hover:none" className="p-0 h-auto text-xs text-primary font-medium">download the HTML example.</Button>.
//                                         </p>
//                                     </>
//                                 ))}
//                                 {renderTabsContent("embedlink", (
//                                     <>
//                                         <div className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-sm`}>
//                                             Follow these simple steps to embed the widget on any <Button variant="ghost hover:none" className="p-0 h-auto text-xs text-primary font-medium">supported website.</Button>
//                                         </div>
//                                         <div>
//                                             <p className={`text-xs ${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} pb-1`}>1. Copy the link below</p>
//                                             <p className={`text-xs ${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} pb-1`}>2. Paste the link on any site where you want the widget to show.</p>
//                                             <p className={`text-xs ${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} pb-1`}>3. That's it!</p>
//                                         </div>
//                                         {renderCodeBlock(embedLink)}
//                                         <p className={`text-xs ${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"}`}>Read the <Button variant="ghost hover:none" className="p-0 h-auto text-xs text-primary font-medium">Setup Guide</Button> for more information.</p>
//                                     </>
//                                 ))}
//                                 {renderTabsContent("iframe", (
//                                     <>
//                                         <div className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-sm`}>
//                                             Place the code below before the closing body tag on your site.
//                                         </div>
//                                         {renderCodeBlock(iFrame)}
//                                         <p className={`text-xs ${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"}`}>Read the <Button variant="ghost hover:none" className="p-0 h-auto text-xs text-primary font-medium">Setup Guide</Button> for more information.</p>
//                                     </>
//                                 ))}
//                                 {renderTabsContent("callback", (
//                                     <>
//                                         <h4 className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-sm`}>
//                                             Place the code below before the closing body tag on your site.
//                                         </h4>
//                                         {renderCodeBlock(callback)}
//                                         <p className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-xs`}>
//                                             Read the <Button variant="ghost hover:none" className="p-0 h-auto text-xs text-primary font-medium">Setup Guide</Button> for more information or <Button variant="ghost hover:none" className="p-0 h-auto text-xs text-primary font-medium">download the HTML example.</Button>.
//                                         </p>
//                                     </>
//                                 ))}
//                             </Tabs>
//                         ) : (
//                             <div className="space-y-2">
//                                 <h4 className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-sm`}>
//                                     Place the code below before the closing body tag on your site.
//                                 </h4>
//                                 {renderCodeBlock(codeString)}
//                                 <p className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-xs`}>
//                                     Read the <Button variant="ghost hover:none" className="p-0 h-auto text-xs text-primary font-medium">Setup Guide</Button> for more information or <Button variant="ghost hover:none" className="p-0 h-auto text-xs text-primary font-medium">download the HTML example.</Button>.
//                                 </p>
//                             </div>
//                         )}
//                         <DialogFooter>
//                             <Button variant="outline hover:none" className={`text-sm font-medium border ${theme === "dark" ? "text-card" : "text-card-foreground"}`} onClick={onClick}>Cancel</Button>
//                         </DialogFooter>
//                     </DialogContent>
//                 </Dialog>
//             </Fragment>
//         )
//     );
// };
//
// export default CopyCode;