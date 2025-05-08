import React, {Fragment, useState} from "react";
import Papa from "papaparse";
import {Button} from "../ui/button";
import {ScrollArea, ScrollBar} from "../ui/scroll-area";
import {Card, CardDescription, CardHeader, CardContent} from "../ui/Card";
import {ArrowLeft, ChevronsUpDown, Circle, FileUp, Loader2} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../ui/command";
import {useToast} from "../ui/use-toast";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {useSelector} from "react-redux";
import {apiService, baseUrl} from "../../utils/constent";
import {useNavigate} from "react-router-dom";

const initialColumnList = [
    {columnName: "Title (Required)", id: "title"},
    {columnName: "Description", id: "description"},
    {columnName: "Board", id: "board"},
    {columnName: "Vote", id: "vote"},
    {columnName: "Status (Roadmap)", id: "roadmapId"},
    {columnName: "Images", id: "images"},
    {columnName: "Created At", id: "createdAt"},
    {columnName: "Author Name", id: "authorName"},
    {columnName: "Author Email", id: "authorEmail"},
    {columnName: "Unselected", id: ""},
]

const ImportIdea = () => {
        const {toast} = useToast()
        let navigate = useNavigate();
        const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
        const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

        const [columnList, setColumnList] = useState(initialColumnList);
        const [tableData, setTableData] = useState([]);
        const [headers, setHeaders] = useState([]);
        const [selectedColumn, setSelectedColumn] = useState([]);
        const [csvRoadmap, setCsvRoadmap] = useState([]);
        const [csvBoard, setCsvBoard] = useState([]);
        const [step, setStep] = useState(1);
        const [selectedCSVFile, setSelectedCSVFile] = useState(null);
        const [isLoading, setIsLoading] = useState(false);
        const [isDirectImport, setIsDirectImport] = useState(true);


        const handleFileUpload = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    const rawData = results.data;

                    const cleanedData = rawData.map(row => {
                        const cleanedRow = {};
                        Object.keys(row).forEach(key => {
                            const cleanedKey = key.replace(/^"|"$/g, '').trim();
                            const value = row[key]?.replace(/^"|"$/g, '').trim();
                            cleanedRow[cleanedKey] = value;
                        });
                        return cleanedRow;
                    });

                    setSelectedCSVFile(cleanedData);
                    setHeaders(Object.keys(cleanedData[0] || {}));
                    setTableData(cleanedData);
                },
                error: function (error) {
                    console.error('CSV parsing error:', error);
                }
            });

            setSelectedColumn([]);
            setColumnList(initialColumnList);
            setCsvRoadmap([]);
            setCsvBoard([]);
            setStep(2);
        };

        const onSelectColumn = (column, csvColumn, index) => {
            const clone = [...selectedColumn];
            const findIndex = clone.findIndex((x) => x.csvColumn === csvColumn);
            if (findIndex === -1) {
                const obj = {...column, csvColumn, index};
                clone.push(obj);
                if (column.id === "board" || column.id === "roadmapId") {
                    setIsDirectImport(false)
                }
            } else {
                if (column.id === "") {
                    clone.splice(findIndex, 1);
                    if (clone.filter((x) => x.id === "board" || x.id === "roadmapId").length === 0) {
                        setIsDirectImport(true)
                    }
                } else {
                    clone[findIndex] = {...column, csvColumn, index};
                    if (column.id === "board" || column.id === "roadmapId") {
                        setIsDirectImport(false)
                    }
                }
            }
            setSelectedColumn(clone);
            const filterColumn = initialColumnList.filter(x => !clone.some(i => x.id === i.id));
            setColumnList(filterColumn)
        }

        const onNext = () => {
            const findTitle = selectedColumn.find((x) => x.id === "title") || {csvColumn: "", id: ""};
            const findBoard = selectedColumn.find((x) => x.id === "board") || {csvColumn: "", id: ""};
            const findRoadmap = selectedColumn.find((x) => x.id === "roadmapId") || {csvColumn: "", id: ""};
            if (!findTitle.id) {
                toast({description: "You need to select a title column", variant: "destructive"})
                return
            }

            // if (!findBoard.id) {
            //     toast({description: "You need to select a board column", variant: "destructive"})
            //     return
            // }

            if (findBoard.id) {
                const board = Array.from(new Set(tableData.map(item => item[findBoard.csvColumn]))).map(status => ({
                    csvBoard: status,
                    boardId: null
                }));
                setCsvBoard(board)
            }

            if (findRoadmap.id) {
                const roadmap = Array.from(new Set(tableData.map(item => item[findBoard.csvColumn]))).map(status => ({
                    csvRoadmap: status,
                    roadmapId: null
                }));
                setCsvRoadmap(roadmap)
            }
            setStep(3)
        }

        const handleStatusUpdate = async (value, index) => {
            const clone = [...csvRoadmap];
            clone[index].roadmapId = value;
            setCsvRoadmap(clone);
        };

        const handleBoardUpdate = async (value, index) => {
            const clone = [...csvBoard];
            clone[index].boardId = value;
            setCsvBoard(clone);
        };

        const importData = async () => {
            if (isDirectImport) {
                const findTitle = selectedColumn.find((x) => x.id === "title") || {csvColumn: "", id: ""};
                if (!findTitle.id) {
                    toast({description: "You need to select a title column", variant: "destructive"})
                    return
                }
            }
            let isRoadmapNotMap = false;
            csvRoadmap.some((x) => {
                if (x.roadmapId == null || x.roadmapId === "") {
                    isRoadmapNotMap = true;
                    return true;
                }
            });
            let isBoardNotMap = false;
            csvBoard.some((x) => {
                if (x.boardId == null || x.boardId === "") {
                    isBoardNotMap = true;
                    return true;
                }
            });

            if (isRoadmapNotMap) {
                toast({description: "All statuses need to be mapped before you can continue.", variant: "destructive"});
                return;
            }

            if (isBoardNotMap) {
                toast({description: "All boards need to be mapped before you can continue.", variant: "destructive"});
                return;
            }

            let columns = [];
            selectedColumn.some((x) => {
                columns.push({key: x.id, value: x.csvColumn})
            });

            const result = (selectedCSVFile || []).map(item => {
                const mappedItem = {};
                columns.forEach(col => {
                    mappedItem[col.value] = item[col.value];
                });
                return mappedItem;
            });

            const payload = {
                projectId: projectDetailsReducer.id,
                csvData: JSON.stringify(result),
                columns: JSON.stringify(columns),
                boardsMap: JSON.stringify(csvBoard),
                roadmapsMap: JSON.stringify(csvRoadmap),
            }

            setIsLoading(true)
            const data = await apiService.ideaImport(payload)
            setIsLoading(false)
            if (data.success) {
                toast({description: data.message})
                navigate(`${baseUrl}/ideas`);
            } else {
                toast({description: data?.error?.message, variant: "destructive"})
            }
        }

        return (
            <div
                className={"container xl:max-w-[1574px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
                <div className={"flex flex-row gap-x-4 flex-wrap justify-between gap-y-2 items-center"}>
                    <div className={"space-x-4 flex items-center"}>
                        <Button className={"h-8 w-8"} variant={"outline"} size={"icon"}
                                onClick={() => navigate(`${baseUrl}/settings/import-export`)}>
                            <ArrowLeft size={16}/>
                        </Button>
                        <h4 className={"font-normal text-lg sm:text-2xl"}>Import Data</h4>
                    </div>
                    {
                        step >= 2 && <div className={"flex items-center gap-2"}>
                            <Button variant={"outline"}
                                    className={'flex items-center h-9 justify-start text-sm font-medium'}
                                    onClick={() => setStep(step - 1)}>
                                Go Back
                            </Button>
                            {step === 2 && !isDirectImport ?
                                <Button disabled={selectedColumn.length <= 0}
                                        className={'flex items-center w-[54px] justify-start text-sm font-medium hover:bg-primary capitalize'}
                                        onClick={onNext}>
                                    Next
                                </Button> : <Button
                                    className={'flex items-center w-[122px] text-sm font-medium hover:bg-primary capitalize'}
                                    onClick={importData}>
                                    {
                                        isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Start importing"
                                    }
                                </Button>}
                        </div>
                    }
                </div>

                <div className={"pt-4 sm:pt-8"}>
                    {
                        step === 1 ?
                            <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                                <Card>
                                    <input
                                        id="pictureInput"
                                        type="file"
                                        className="hidden"
                                        accept=".csv"
                                        onChange={handleFileUpload}
                                    />
                                    <label
                                        htmlFor="pictureInput"
                                        className="border-dashed h-[187px] py-[52px] flex flex-col items-center justify-center border border-muted-foreground rounded cursor-pointer gap-2"
                                    > <FileUp/>
                                        <h4 className="text-xs font-medium">Upload your .CSV file</h4>
                                    </label>
                                </Card>
                                <Card>
                                    <CardHeader className={" border-b p-3"}>
                                        <h3 className={"font-normal text-lg"}>Switching from another tool?</h3>
                                        <CardDescription className={"text-sm text-muted-foreground p-0"}>Easily migrate your
                                            ideas to Quickhunt in just a few minutes!</CardDescription>
                                    </CardHeader>
                                    <CardContent className={"p-3"}>
                                        <div
                                            className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                                            <Button
                                                variant={"outline"}
                                                className={'flex items-center h-9 justify-start'}
                                            >
                                                Migrate from Canny
                                            </Button>
                                            <Button
                                                variant={"outline"}
                                                className={'flex items-center h-9 justify-start'}
                                            >
                                                Migrate from Upvoty
                                            </Button>
                                            <Button
                                                variant={"outline"}
                                                className={'flex items-center h-9 justify-start'}
                                            >
                                                Migrate from Nolt
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div> : step === 2 ?
                                <ScrollArea className="w-[1550px] whitespace-nowrap">
                                    <div className="flex w-max space-x-4">
                                        {headers.map((header, index) => {
                                            const findColumn = selectedColumn.find((x) => x.csvColumn === header) || {columnName: "Unselected"};
                                            return (
                                                <div key={index}>
                                                    <div className="p-2 border rounded-t-md">
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={'w-full flex items-center h-9 justify-between'}
                                                                    role="combobox"
                                                                >
                                                                    {findColumn.columnName}
                                                                    <ChevronsUpDown
                                                                        className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                                </Button>

                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-[200px] p-0">
                                                                <Command>
                                                                    <CommandInput placeholder="Search data type..."/>
                                                                    <CommandList>
                                                                        <CommandEmpty>No data type found</CommandEmpty>
                                                                        <CommandGroup>
                                                                            {(columnList || []).map((x, i) => {
                                                                                return (
                                                                                    <Fragment key={i}>
                                                                                        <CommandItem
                                                                                            value={x.id}
                                                                                            onSelect={() => onSelectColumn(x, header, index)}
                                                                                        >
                                                                        <span
                                                                            className={"flex justify-between items-center w-full text-sm font-normal cursor-pointer"}>
                                                                            {x.columnName}
                                                                        </span>
                                                                                        </CommandItem>
                                                                                    </Fragment>
                                                                                )
                                                                            })}

                                                                        </CommandGroup>
                                                                    </CommandList>
                                                                </Command>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                    <ScrollArea className={"h-[700px] w-52 rounded-b-md border border-t-0"}>
                                                        <div className={"border-b p-2 bg-muted/20"}>
                                                            <h4 className="text-xs font-medium">{header}</h4>
                                                        </div>
                                                        {tableData.map((row, rowIndex) => (
                                                            <div className={"border-b p-2 bg-muted/20"} key={rowIndex}>
                                                                <div className="text-xs text-nowrap">
                                                                    {row[header] ? row[header] : "-"}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </ScrollArea>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <ScrollBar orientation="horizontal"/>
                                </ScrollArea> : step === 3 ?
                                    <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                                        <Card>
                                            <CardHeader className={" border-b p-3"}>
                                                <h3 className={"font-normal text-lg"}>Map statuses</h3>
                                            </CardHeader>
                                            <CardContent className={"p-0"}>
                                                {
                                                    csvRoadmap.map((x, i) => {
                                                        return (
                                                            <div className={"p-3 border-b"}>
                                                                <div
                                                                    className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4 items-center">
                                                                    <div className={"text-sm"}>{x.csvRoadmap}</div>
                                                                    <Select
                                                                        onValueChange={(value) => handleStatusUpdate(value, i)}
                                                                        value={x.roadmapId}>
                                                                        <SelectTrigger
                                                                            className="bg-card">
                                                                            <SelectValue/>
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectGroup>
                                                                                <SelectItem value={null}>
                                                                                    <div className={"flex items-center gap-2"}>
                                                                                        Unmapped
                                                                                    </div>
                                                                                </SelectItem>
                                                                                {
                                                                                    (allStatusAndTypes.roadmapStatus || []).map((y, ind) => {
                                                                                        return (
                                                                                            <SelectItem key={ind}
                                                                                                        value={y.id}>
                                                                                                <div
                                                                                                    className={"flex items-center gap-2"}>
                                                                                                    <Circle
                                                                                                        fill={y.colorCode}
                                                                                                        stroke={y.colorCode}
                                                                                                        className={` w-[10px] h-[10px]`}/>
                                                                                                    {y.title || "No status"}
                                                                                                </div>
                                                                                            </SelectItem>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </SelectGroup>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className={" border-b p-3"}>
                                                <h3 className={"font-normal text-lg"}>Map boards</h3>
                                            </CardHeader>
                                            <CardContent className={"p-0"}>
                                                {
                                                    csvBoard.map((x, i) => {
                                                        return (
                                                            <div className={"p-3 border-b"} key={i}>
                                                                <div
                                                                    className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4 items-center">
                                                                    <div className={"text-sm"}>{x.csvBoard}</div>
                                                                    <Select
                                                                        onValueChange={(value) => handleBoardUpdate(value, i)}
                                                                        value={x.boardId}>
                                                                        <SelectTrigger
                                                                            className="bg-card">
                                                                            <SelectValue/>
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectGroup>
                                                                                <SelectItem value={null}>
                                                                                    <div className={"flex items-center gap-2"}>
                                                                                        Unmapped
                                                                                    </div>
                                                                                </SelectItem>
                                                                                {
                                                                                    (allStatusAndTypes.boards || []).map((y, ind) => {
                                                                                        return (
                                                                                            <SelectItem key={ind} value={y.id}>
                                                                                                {y.title || "No status"}
                                                                                            </SelectItem>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </SelectGroup>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </CardContent>
                                        </Card>
                                    </div> : ""
                    }
                </div>
            </div>
        );
    }
;

export default ImportIdea;