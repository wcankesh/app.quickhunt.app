import React from 'react';
import {SheetHeader, Sheet, SheetContent} from "../ui/sheet";

const SurveySheet = ({isOpen,onClose,onOpen}) => {
    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
            <SheetContent className={"sm:max-w-[1400px] sm:overflow-auto p-0"}>
                <SheetHeader className={"pl-8 pt-[17px] pb-[17px] pr-[33px]"}>
                    Survey sheet
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
};

export default SurveySheet;