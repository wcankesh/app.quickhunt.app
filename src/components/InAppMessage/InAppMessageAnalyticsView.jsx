import React from 'react';
import BannerAnalyticsView from "./AnalyticsView/BannerAnalyticsView";
import {useParams} from "react-router-dom";
import PostAnalyticsView from "./AnalyticsView/PostAnalyticsView";
import SurveysAnalyticsView from "./AnalyticsView/SurveysAnalyticsView";
import CheckListAnalyticsView from "./AnalyticsView/CheckListAnalyticsView";

const InAppMessageAnalyticsView = () => {
    const {type} = useParams();

    return (
        <div>
            {type == 1 && <PostAnalyticsView/>}
            {type == 2 && <BannerAnalyticsView/>}
            {type == 3 && <SurveysAnalyticsView/>}
            {type == 4 && <CheckListAnalyticsView/>}
        </div>
    );
};

export default InAppMessageAnalyticsView;