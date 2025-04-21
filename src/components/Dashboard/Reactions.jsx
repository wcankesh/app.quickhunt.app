import React from 'react';
import {baseUrl} from "../../utils/constent";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {commonLoad} from "../Comman/CommSkel";
import {CardContent} from "../ui/card";
import {Avatar, AvatarImage} from "../ui/avatar";
import Pagination from "../Comman/Pagination";
import PageLayout from "./CommonDashboard/PageLayout";

const perPageLimit = 10

const Reactions = () => {
    const navigate = useNavigate();
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);

    const renderItem = (x, i) => {
        const emoji = allStatusAndTypes.emoji.find((e) => e.id === x.reaction_id) || { emoji_url: "" };
        return (
            <CardContent key={i} className="p-2 sm:p-3 lg:p-6 border-b">
                <div className="flex gap-4">
                    <Avatar className="w-[35px] h-[35px]">
                        <AvatarImage src={emoji.emoji_url} />
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <div className="flex gap-1 items-center">
                            <h4
                                className="text-sm font-semibold cursor-pointer"
                                onClick={() => navigate(`${baseUrl}/announcements/analytic-view?postId=${x.post_id}`)}
                            >
                                {x.customer_name}
                            </h4>
                            <p className="text-xs font-medium text-muted-foreground">Reacted To</p>
                        </div>
                        <p className="text-xs font-semibold text-foreground">"{x.post_title}"</p>
                    </div>
                </div>
            </CardContent>
        );
    };

    return (
        <PageLayout
            title="Reactions"
            apiMethod="dashboardDataReactions"
            perPageLimit={perPageLimit}
            renderItem={renderItem}
            loadingSkeleton={commonLoad.reactionsPageLoading}
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

export default Reactions;