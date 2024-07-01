import React, {Fragment, useState} from 'react';
import {Sheet, SheetContent, SheetHeader,} from "../ui/sheet";
import {Button} from "../ui/button";
import {ArrowBigUp, Circle, Dot, Lock, Paperclip, Pencil, Pin, Trash2, X} from "lucide-react";
import {RadioGroup, RadioGroupItem} from "../ui/radio-group";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {Textarea} from "../ui/textarea";
import {Switch} from "../ui/switch";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
import {useTheme} from "../theme-provider";
import {Card} from "../ui/card";

const filterByRoadMapStatus = [
    {name: "Under consideration", value: "underconsideration", fillColor: "#EB765D", strokeColor: "#EB765D",},
    {name: "Planned", value: "planned", fillColor: "#6392D9", strokeColor: "#6392D9",},
    {name: "In Development", value: "indevelopment", fillColor: "#D96363", strokeColor: "#D96363",},
    {name: "Shipped", value: "shipped", fillColor: "#63C8D9", strokeColor: "#63C8D9",},
    {name: "AC", value: "ac", fillColor: "#CEF291", strokeColor: "#CEF291",},
]

const ideasSheetStatus = [
    {id: "r1", name: "Under consideration", value: "underconsideration", fillColor: "#EB765D", strokeColor: "#EB765D",},
    {id: "r2", name: "Planned", value: "planned", fillColor: "#6392D9", strokeColor: "#6392D9",},
    {id: "r3", name: "In Development", value: "indevelopment", fillColor: "#D96363", strokeColor: "#D96363",},
    {id: "r4", name: "Shipped", value: "shipped", fillColor: "#63C8D9", strokeColor: "#63C8D9",},
    {id: "r5", name: "No Status", value: "nostatus", fillColor: "#64676B", strokeColor: "#64676B",},
]

const filterByTopic = [
    {name: "Welcome 👋  ", value: "welcome",},
    {name: "Improvement 👍 ", value: "improvement",},
    {name: "Integrations 🔗 ", value: "integrations",},
    {name: "Mics 🤷‍♀️", value: "mics",},
    {name: "Deal Breaker 💔 ", value: "dealbreaker",},
    {name: "Bug 🐛", value: "bug",},
]

const SidebarSheet = ({ isOpen, onOpen, onClose , sheetType}) => {
    const { theme } = useTheme()
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [privateNote, setPrivateNote] = useState(false);
    const [openTextField, setOpenTextField] = useState(false);
    const [openReplyTextField, setOpenRreplyTextField] = useState(false);
    const [openPrivateReplyTextField, setOpenPrivateRreplyTextField] = useState(false);
    const [textareaValue, setTextareaValue] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const [comment, setComment] = useState('');
    const [commentsList, setCommentsList] = useState([]);

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleAddComments = () => {
        if (comment.trim() !== '') {
            setCommentsList([...commentsList, comment]);
            setComment('');
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedFile(file);
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setImagePreview(null);
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const handlePrivateNote = () => {setPrivateNote(!privateNote)};

    const handleOpenTextField = () => {setOpenTextField(!openTextField)};

    const handleOpenReply = () => {setOpenRreplyTextField(!openReplyTextField)};

    const handleOpenPrivateReply = () => {setOpenPrivateRreplyTextField(!openPrivateReplyTextField)};

    const handleSaveText = () => {setOpenTextField(false);};

    const handleTextareaChange = (e) => {setTextareaValue(e.target.value);};

    const handleEdit = () => {setIsEditing(true);};

    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
            <SheetContent className={"lg:max-w-[1101px] md:max-w-[720px] sm:max-w-[520px] p-0"}>
                <SheetHeader className={"px-[32px] py-[22px] border-b"}>
                    {
                        sheetType === "createNewIdeas" ?
                            <div className={"flex justify-between items-center w-full"}>
                                <h2 className={"text-xl font-medium"}>Tell us your Idea!</h2>
                                <X onClick={onClose} className={"cursor-pointer"}/>
                            </div>
                            : <X onClick={onClose} className={"cursor-pointer"}/>
                    }
                </SheetHeader>
                <div className={"lg:flex md:block overflow-auto h-[100vh]"}>
                    <div className={`basis-[440px] ${theme === "dark" ? "" : "bg-muted"} border-r overflow-auto pb-[100px]`}>
                        <div className={"border-b py-4 pl-8 pr-6 flex flex-col gap-3"}>
                            <div className={"flex flex-col gap-1"}>
                                <h3 className={"text-sm font-medium"}>Status</h3>
                                <p className={"text-muted-foreground text-xs font-normal"}>Apply a status to Manage this idea on roadmap.</p>
                            </div>
                            <div className={"flex flex-col "}>
                                <RadioGroup defaultValue={selectedStatus} onChange={handleStatusChange}>
                                    {
                                        (ideasSheetStatus || []).map((x, i) => {
                                            return (
                                                <div key={i} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={x.value} id={x.id}/>
                                                    <Label className={"text-secondary-foreground text-sm font-normal"} htmlFor={x.id}>{x.name}</Label>
                                                </div>
                                            )
                                        })
                                    }
                                </RadioGroup>
                            </div>
                        </div>
                        <div className={"border-b"}>
                            <div className="py-4 pl-8 pr-6 w-full items-center gap-1.5">
                                <Label htmlFor="picture">Featured image</Label>
                                <div className="w-[282px] h-[128px] relative">

                                    {selectedFile ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded" />
                                            <Button
                                                variant="outline"
                                                onClick={handleRemoveImage}
                                                className={`${theme === "light" ? "text-card" : ""} w-[129px] px-4 py-2 absolute top-[50%] left-[50%] origin-center translate-x-[-50%] translate-y-[-50%] border-0 flex justify-center items-center bg-primary hover:bg-primary hover:text-card text-sm font-semibold`}
                                            >
                                                Change image
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                id="pictureInput"
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                            <label
                                                htmlFor="pictureInput"
                                                className="border-dashed w-full h-full py-[52px] inset-0 flex items-center justify-center bg-muted border border-muted-foreground rounded cursor-pointer"
                                            >
                                                <h4 className={"text-sm font-semibold"}>Upload Image</h4>
                                            </label>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={"py-4 pl-8 pr-6 flex flex-col gap-[26px]"}>
                            <div className={"flex flex-wrap gap-1 justify-between"}>
                                <div className={"flex flex-col gap-1"}>
                                    <h4 className={"text-sm font-medium"}>Mark as bug</h4>
                                    <p className={"text-muted-foreground text-xs font-normal"}>Hides Idea from your users</p>
                                </div>
                                <Button variant={"outline"} className={`hover:bg-muted w-[132px] ${theme === "dark" ? "" : "border-card-foreground text-muted-foreground"} text-sm  font-semibold`}>Mark as bug</Button>
                            </div>
                            <div className={"flex flex-wrap gap-1 justify-between"}>
                                <div className={"flex flex-col gap-1"}>
                                    <h4 className={"text-sm font-medium"}>Archive</h4>
                                    <p className={"text-muted-foreground text-xs font-normal"}>Remove Idea from Board and Roadmap</p>
                                </div>
                                <Button variant={"outline"} className={`w-[100px] hover:bg-muted ${theme === "dark" ? "" : "border-card-foreground text-muted-foreground"} text-sm font-semibold`}>Archive</Button>
                            </div>
                        </div>
                    </div>
                    <div className={"basis-[661px] overflow-auto"}>
                        {
                            sheetType === "createNewIdeas" ?
                                <div className={"pb-100px"}>
                                    <div className={"py-6 px-8 flex flex-col gap-6 border-b"}>
                                        <div className="items-center gap-1.5">
                                            <Label htmlFor="text">Title</Label>
                                            <Input type="text" id="text" placeholder="" />
                                        </div>
                                        <div className="gap-1.5">
                                            <Label htmlFor="message">Description</Label>
                                            <Textarea placeholder="Start writing..." id="message" />
                                        </div>
                                    </div>
                                    <div className={"py-6 px-8 border-b"}>
                                        <Label>Choose Topics for this Idea (optional)</Label>
                                        <Select>
                                            <SelectTrigger className="">
                                                <SelectValue placeholder="Select topic" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {
                                                        (filterByTopic || []).map((x, i) => {
                                                            return (
                                                                <SelectItem key={i} value={x.value}>{x.name}</SelectItem>
                                                            )
                                                        })
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className={"p-8 flex gap-6"}>
                                        <Button className={"py-2 px-6 text-sm font-semibold"}>Create Idea</Button>
                                        <Button variant={"outline hover:bg-transparent"} className={"border border-primary py-2 px-6 text-sm font-semibold"} onClick={onClose}>Cancel</Button>
                                    </div>
                                </div>
                                :
                              <Fragment>
                                  <div className={"py-6 px-8"}>
                                      <div className={"flex flex-col gap-6"}>
                                          <div className={"flex justify-between items-center"}>
                                              <div className={"flex items-center gap-2"}>
                                                  <Button className={"p-[7px] bg-white shadow border hover:bg-white w-[42px] h-[42px]"} variant={"outline"}><ArrowBigUp className={"fill-primary stroke-primary"} /></Button>
                                                  <p className={"text-2xl font-medium"}>25</p>
                                              </div>
                                              <div className={"flex gap-2"}>
                                                  <Button variant={"outline"} className={"w-[30px] h-[30px] p-1"}><Pencil className={"w-[16px] h-[16px]"} /></Button>
                                                  <Button variant={"outline"} className={"w-[30px] h-[30px] p-1"}><Pin className={"w-[16px] h-[16px]"} /></Button>
                                                  <Button variant={"outline"} className={"w-[30px] h-[30px] p-1"}><Trash2 className={"w-[16px] h-[16px]"} /></Button>
                                              </div>
                                          </div>
                                          <div className={"flex flex-col gap-4"}>
                                              <h2 className={"text-xl font-medium"}>Welcome To Our Release Notes</h2>
                                              <p className={"text-sm font-normal text-muted-foreground"}>All great things around you were not built in a day, some took weeks, quite a few of them took months and a rare few even decades. As builders, our quest is to reach for that perfect product that solves your problems and adds value to your lives, and we too realise it will be a journey of minor and major improvements made day after day....<Button variant={"ghost hover:none"} className={"h-0 p-0 text-primary text-sm font-semibold"}>Read more</Button></p>
                                          </div>
                                          <div className={"flex items-center"}>
                                              <div className={"flex items-center gap-4"}>
                                                  <div className={"flex items-center gap-2"}>
                                                      <Avatar className={"w-[20px] h-[20px]"}>
                                                          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
                                                          <AvatarFallback>CN</AvatarFallback>
                                                      </Avatar>
                                                      <div className={"flex items-center"}>
                                                          <h4 className={"text-sm font-medium"}>Ankesh Ramani</h4>
                                                          <p className={"text-sm font-normal flex items-center text-muted-foreground"}><Dot className={"fill-text-card-foreground stroke-text-card-foreground"} />17 Jun</p>
                                                      </div>
                                                  </div>
                                                  <Select>
                                                      <SelectTrigger className="w-[234px] h-[24px] px-3 py-1">
                                                          <SelectValue className={"text-xs"} placeholder="Under consideration" />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                          <SelectGroup>
                                                              {
                                                                  (filterByRoadMapStatus || []).map((x, i) => {
                                                                      return (
                                                                          <Fragment key={i}>
                                                                              <SelectItem value={x.value}>
                                                                                  <div className={"flex items-center gap-2"}>
                                                                                      <Circle fill={x.fillColor} stroke={x.strokeColor} className={` w-[10px] h-[10px]`} />
                                                                                      {x.name}
                                                                                  </div>
                                                                              </SelectItem>
                                                                          </Fragment>
                                                                      )
                                                                  })
                                                              }
                                                          </SelectGroup>
                                                      </SelectContent>
                                                  </Select>
                                              </div>
                                          </div>
                                          <div className={"flex flex-col gap-2"}>
                                              <div className="grid w-full gap-1.5">
                                                  <Label htmlFor="message">Add comment</Label>
                                                  {
                                                      privateNote ?
                                                          <Card className={`shadow-none ${theme === "dark" ? "" : "border-amber-300"}`}>
                                                              <div className={`text-xs text-card-foreground font-normal py-1 px-3 ${theme === "dark" ? "" : "bg-orange-100"} rounded-tl-md rounded-tr-md`}>Add a private note for your team</div>
                                                              <Textarea
                                                                  className={"rounded-tl-none rounded-tr-none"}
                                                                  placeholder="Private Start writing..."
                                                                  id="message"
                                                              />
                                                          </Card>
                                                          :
                                                          <Textarea
                                                              className={""}
                                                              placeholder="Start writing..."
                                                              id="message"
                                                              value={comment}
                                                              onChange={handleCommentChange}
                                                          />
                                                  }
                                              </div>
                                              <div className={"flex justify-between gap-1"}>
                                                  <div className="flex items-center space-x-2">
                                                      <Switch id="airplane-mode" onCheckedChange={handlePrivateNote}/>
                                                      <Label htmlFor="airplane-mode" className={"text-sm font-medium"}>Private note</Label>
                                                  </div>
                                                  <div className={"flex gap-2 items-center"}>
                                                      <div className="p-2 max-w-sm relative w-[36px] h-[36px]">
                                                          <Input id="commentFileInput" type="file" className="hidden" />
                                                          <label htmlFor="commentFileInput" className="absolute inset-0 flex items-center justify-center bg-white border border-primary rounded cursor-pointer">
                                                              <Paperclip className={"stroke-primary"} />
                                                          </label>
                                                      </div>
                                                      <Button
                                                          className={"w-[128px] h-[36px] text-sm font-semibold"} onClick={handleAddComments}
                                                      >Add Comment</Button>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className={"pb-[100px]"}>
                                      <Tabs defaultValue="comment" className="">
                                          <div className={"px-8"}>
                                              <TabsList className="bg-transparent border-b-2 border-b-primary rounded-none">
                                                  <TabsTrigger value="comment">Comment</TabsTrigger>
                                              </TabsList>
                                          </div>

                                          {commentsList.map((comment, index) => (
                                              <div key={index}>{comment}</div>
                                          ))}

                                          {
                                              privateNote ?
                                                  <TabsContent value="comment" className={`${theme === "dark" ? "" : "bg-orange-100"}`}>
                                                      <div className={"flex gap-2 p-[32px]"}>
                                                          <Avatar className={"w-[20px] h-[20px]"}>
                                                              <AvatarImage src="https://github.com/shadcn.png"
                                                                           alt="@shadcn"/>
                                                              <AvatarFallback>CN</AvatarFallback>
                                                          </Avatar>
                                                          <div className={"w-full flex flex-col gap-3"}>
                                                              <div className={"flex justify-between"}>
                                                                  <div className={"flex items-center"}>
                                                                      <h4 className={"text-sm font-medium"}>Ankesh Ramani</h4>
                                                                      <p className={"text-sm font-normal flex items-center text-muted-foreground"}><Dot className={"fill-text-card-foreground stroke-text-card-foreground"}/>2 minutes ago</p>
                                                                  </div>
                                                                  <div className={"flex gap-2"}>
                                                                      <Button variant={"outline"} className={"w-[30px] h-[30px] p-1"}><Pencil className={"w-[16px] h-[16px]"} /></Button>
                                                                      <Button variant={"outline"} className={"w-[30px] h-[30px] p-1"}><Pin className={"w-[16px] h-[16px]"} /></Button>
                                                                      <Button variant={"outline"} className={"w-[30px] h-[30px] p-1"}><Trash2 className={"w-[16px] h-[16px]"} /></Button>
                                                                  </div>
                                                              </div>
                                                              <div>
                                                                  <p className={"text-sm font-normal text-muted-foreground"}>All great things around
                                                                      you were not built in a day, some took weeks, quite a
                                                                      few of them took months and a rare few even decades. As
                                                                      builders, our quest is to reach for that perfect product
                                                                      that solves your problems and adds value to your lives,
                                                                      and we too realise it will be a journey of minor and
                                                                      major improvements made day after day....<span
                                                                          className={"text-primary text-sm font-semibold"}>Read more</span>
                                                                  </p>
                                                              </div>
                                                              <div className={"flex justify-between"}>
                                                                  <Button variant={"ghost hover:bg-none"} onClick={handleOpenPrivateReply} className={"p-0 h-[25px] text-primary font-semibold text-sm"}>Reply</Button>
                                                                  <Button variant={"ghost hover:bg-none"} className={"p-0 h-[25px] font-normal text-sm flex gap-1"}><Lock className={"w-[16px] h-[16px]"} />Private note</Button>
                                                              </div>
                                                              {
                                                                  openPrivateReplyTextField && (
                                                                      <div className={"flex flex-col gap-2"}>
                                                                          <Textarea
                                                                              className={""}
                                                                              placeholder="Start writing..."
                                                                          />
                                                                          <div className={"flex gap-2 items-center"}>
                                                                              <Button className={"w-[70px] h-[30px] text-sm font-semibold"}>Reply</Button>
                                                                              <div className="p-2 max-w-sm relative w-[36px] h-[30px]">
                                                                                  <Input id="commentFileInput" type="file" className="hidden" /*onChange={handleFileChangeTextarea}*/ />
                                                                                  <label htmlFor="commentFileInput" className="absolute inset-0 flex items-center justify-center bg-white border border-primary rounded cursor-pointer">
                                                                                      <Paperclip className={"stroke-primary"} />
                                                                                  </label>
                                                                              </div>
                                                                          </div>
                                                                      </div>
                                                                  )
                                                              }
                                                          </div>
                                                      </div>
                                                  </TabsContent>
                                                  :
                                                  ""
                                          }
                                          <TabsContent value="comment" className={`${theme === "dark" ? "" : "bg-muted"}`}>
                                              <div className={"flex gap-2 p-[32px]"}>
                                                  <Avatar className={"w-[20px] h-[20px]"}>
                                                      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
                                                      <AvatarFallback>CN</AvatarFallback>
                                                  </Avatar>
                                                  <div className={"w-full flex flex-col gap-3"}>
                                                      <div className={"flex justify-between"}>
                                                          <div className={"flex items-center"}>
                                                              <h4 className={"text-sm font-medium"}>Ankesh Ramani</h4>
                                                              <p className={"text-sm font-normal flex items-center text-muted-foreground"}><Dot className={"fill-text-card-foreground stroke-text-card-foreground"}/>2 minutes ago</p>
                                                          </div>
                                                          <div className={"flex gap-2"}>
                                                              <Button variant={"outline"} className={"w-[30px] h-[30px] p-1"} onClick={handleOpenTextField}><Pencil className={"w-[16px] h-[16px]"} /></Button>
                                                              <Button variant={"outline"} className={"w-[30px] h-[30px] p-1"}><Pin className={"w-[16px] h-[16px]"} /></Button>
                                                              <Button variant={"outline"} className={"w-[30px] h-[30px] p-1"}><Trash2 className={"w-[16px] h-[16px]"} /></Button>
                                                          </div>
                                                      </div>
                                                      <div>
                                                          {
                                                              openTextField ?
                                                                  <div className={"flex flex-col gap-2"}>
                                                                  <Textarea
                                                                      className={""}
                                                                      placeholder="Start writing..."
                                                                      value={textareaValue}
                                                                      onChange={handleTextareaChange}
                                                                  />
                                                                      <div className={"flex gap-2 items-center"}>
                                                                          <Button className={"w-[70px] h-[30px] text-sm font-semibold"} onClick={handleSaveText}>Save</Button>
                                                                          <Button variant={"outline hover:transparent"} className={`border ${theme === "dark" ? "" : "border-primary"} w-[90px] h-[30px] text-sm font-semibold`} onClick={() => setIsEditing(false)}>Cancel</Button>
                                                                          <div className="p-2 max-w-sm relative w-[36px] h-[30px]">
                                                                              <Input id="commentFileInput" type="file" className="hidden" /*onChange={handleFileChangeTextarea}*/ />
                                                                              <label htmlFor="commentFileInput" className="absolute inset-0 flex items-center justify-center bg-white border border-primary rounded cursor-pointer">
                                                                                  <Paperclip className={"stroke-primary"} />
                                                                              </label>
                                                                          </div>
                                                                      </div>
                                                                  </div>
                                                              : <p className={"text-sm font-normal text-muted-foreground"}>
                                                                      {textareaValue || (
                                                                          <>
                                                                              All great things around you were not built in a day, some took weeks, quite a few of them
                                                                              took months and a rare few even decades. As builders, our quest is to reach for that
                                                                              perfect product that solves your problems and adds value to your lives, and we too realize
                                                                              it will be a journey of minor and major improvements made day after day....
                                                                              <span className="text-primary text-sm font-semibold">Read more</span>
                                                                          </>
                                                                      )}
                                                                  </p>
                                                          }
                                                      </div>
                                                      <div>
                                                          <Button variant={"ghost hover:bg-none"} onClick={handleOpenReply} className={"p-0 h-[25px] text-primary font-semibold text-sm"}>Reply</Button>
                                                      </div>
                                                      {
                                                          openReplyTextField && (
                                                              <div className={"flex flex-col gap-2"}>
                                                                  <Textarea
                                                                      className={""}
                                                                      placeholder="Start writing..."
                                                                  />
                                                                  <div className={"flex gap-2 items-center"}>
                                                                      <Button className={"w-[70px] h-[30px] text-sm font-semibold"}>Reply</Button>
                                                                      <div className="p-2 max-w-sm relative w-[36px] h-[30px]">
                                                                          <Input id="commentFileInput" type="file" className="hidden" /*onChange={handleFileChangeTextarea}*/ />
                                                                          <label htmlFor="commentFileInput" className="absolute inset-0 flex items-center justify-center bg-white border border-primary rounded cursor-pointer">
                                                                              <Paperclip className={"stroke-primary"} />
                                                                          </label>
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                          )
                                                      }
                                                  </div>
                                              </div>
                                          </TabsContent>
                                      </Tabs>
                                  </div>
                              </Fragment>
                        }
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default SidebarSheet;