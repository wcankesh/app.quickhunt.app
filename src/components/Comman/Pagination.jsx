import React, {useEffect, useState} from 'react';
import {Button} from "../ui/button";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from "lucide-react";
import {CardFooter} from "../ui/card";
import {useTheme} from "../theme-provider";
import {Input} from "../ui/input";

const Pagination = ({
                        pageNo,
                        totalPages,
                        isLoading,
                        handlePaginationClick,
                        stateLength,
                    }) => {
    const {theme} = useTheme();
    const [inputPage, setInputPage] = useState(pageNo);

    useEffect(() => {
        setInputPage(pageNo);
    }, [pageNo]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputPage(value);
        const page = Number(value);
        handlePaginationClick(page);
    };

    return (
        <CardFooter className={`p-0 ${theme === "dark" ? "border-t" : ""}`}>
            <div className={`w-full ${theme === 'dark' ? '' : 'bg-muted'} rounded-b-lg rounded-t-none flex justify-end p-2 md:px-3 md:py-[10px]`}>
                <div className={'w-full flex gap-2 items-center justify-between'}>
                    <div>
                        <h5 className={'text-sm font-medium'}>
                            Page {stateLength <= 0 ? 0 : pageNo} of {totalPages}
                        </h5>
                    </div>
                    <div className={'flex flex-row gap-2 items-center'}>
                        <Button
                            variant={'outline'}
                            className={'h-[30px] w-[30px] p-1.5'}
                            onClick={() => handlePaginationClick(1)}
                            disabled={pageNo === 1 || isLoading}
                        >
                            <ChevronsLeft className={pageNo === 1 || isLoading ? 'stroke-muted-foreground' : 'stroke-primary'} />
                        </Button>
                        <Button
                            variant={'outline'}
                            className={'h-[30px] w-[30px] p-1.5'}
                            onClick={() => handlePaginationClick(pageNo - 1)}
                            disabled={pageNo === 1 || isLoading}
                        >
                            <ChevronLeft className={pageNo === 1 || isLoading ? 'stroke-muted-foreground' : 'stroke-primary'} />
                        </Button>
                        <Input
                            type="number"
                            value={inputPage}
                            onChange={handleInputChange}
                            className="h-[30px] text-center border rounded p-1"
                            placeholder="0"
                            min={1}
                            max={totalPages}
                            disabled={isLoading}
                        />
                        <Button
                            variant={'outline'}
                            className={'h-[30px] w-[30px] p-1.5'}
                            onClick={() => handlePaginationClick(pageNo + 1)}
                            disabled={pageNo === totalPages || isLoading || stateLength <= 0}
                        >
                            <ChevronRight
                                className={pageNo === totalPages || isLoading || stateLength <= 0 ? 'stroke-muted-foreground' : 'stroke-primary'}
                            />
                        </Button>
                        <Button
                            variant={'outline'}
                            className={'h-[30px] w-[30px] p-1.5'}
                            onClick={() => handlePaginationClick(totalPages)}
                            disabled={pageNo === totalPages || isLoading || stateLength <= 0}
                        >
                            <ChevronsRight
                                className={pageNo === totalPages || isLoading || stateLength <= 0 ? 'stroke-muted-foreground' : 'stroke-primary'}
                            />
                        </Button>
                    </div>
                </div>
            </div>
        </CardFooter>
    );
};

export default Pagination;