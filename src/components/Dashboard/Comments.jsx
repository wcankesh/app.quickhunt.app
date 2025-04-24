import React from 'react';
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/constent";
import {CardContent} from "../ui/card";
import {commonLoad} from "../Comman/CommSkel";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {Badge} from "../ui/badge";
import ReadMoreText from "../Comman/ReadMoreText";
import Pagination from "../Comman/Pagination";
import PageLayout from "./CommonDashboard/PageLayout";

const perPageLimit = 10

const Comments = () => {
    const navigate = useNavigate();

    const renderItem = (x, i) => (
        <CardContent key={i} className="flex flex-col gap-4 border-b p-2 sm:p-3 lg:p-6">
            <div className="flex gap-2 items-center justify-between">
                <div
                    className="flex gap-2 items-center cursor-pointer"
                    onClick={() => {
                        if (x.type == 1) navigate(`${baseUrl}/announcements/${x.postId}`);
                        else if (x.type == 2) navigate(`${baseUrl}/ideas/${x.postId}`);
                    }}
                >
                    <Avatar className="w-[20px] h-[20px]">
                        {x.user_photo ? (
                            <AvatarImage src={x.user_photo} alt="" />
                        ) : (
                            <AvatarFallback>{x.customerName?.substring(0, 1).toUpperCase()}</AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex items-center flex-wrap gap-1 md:gap-2">
                        <h4 className="text-sm font-semibold">{x.customerName}</h4>
                        <p className="text-xs font-medium text-muted-foreground">{x.customerEmail}</p>
                    </div>
                </div>
                <Badge
                    variant="outline"
                    className={`text-xs font-medium text-muted-foreground ${x.type == 1 ? "text-[#3b82f6] border-[#3b82f6]" : "text-[#63c8d9] border-[#63c8d9]"}`}
                >
                    {x.type == 1 ? "Announcement" : "Idea"}
                </Badge>
            </div>
            <div className="text-xs font-medium text-foreground">
                <ReadMoreText html={x.comment} />
            </div>
        </CardContent>
    );

    return (
        <PageLayout
            title="Comments"
            apiMethod="dashboardDataFeed"
            perPageLimit={perPageLimit}
            renderItem={renderItem}
            loadingSkeleton={commonLoad.commonParagraphFourComments}
        >
            {({ pageNo, setPageNo, totalRecord, isLoading, chartList }) => {
                const totalPages = Math.ceil(totalRecord / perPageLimit);
                const handlePaginationClick = async (newPage) => {
                    if (newPage >= 1 && newPage <= totalPages) {
                        setPageNo(newPage);
                    }
                };

                return chartList.length > 0 ? (
                    <Pagination
                        pageNo={pageNo}
                        totalPages={totalPages}
                        isLoading={isLoading}
                        handlePaginationClick={handlePaginationClick}
                        stateLength={chartList.length}
                    />
                ) : null;
            }}
        </PageLayout>
    );
};

export default Comments;