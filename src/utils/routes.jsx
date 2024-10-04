import {baseUrl} from "./constent";
import {Dashboard} from "../components/Dashboard/Dashboard";
import Announcements from "../components/Announcements/Announcements";
import Ideas from "../components/Ideas/Ideas";
import Roadmap from "../components/Roadmap/Roadmap";
import Customers from "../components/Customers/Customers";
import Widgets from "../components/Widgets/Widgets";
import Notification from "../components/Notification/Notification";
import Settings from "../components/Settings/Settings";
import PricingPlans from "../components/PricingPlan/PricingPlans";
import HelpSupport from "../components/HelpSupport/HelpSupport";
import InAppMessage from "../components/InAppMessage/InAppMessage";
import UpdateWidget from "../components/Widgets/UpdateWidget";
import UpdateInAppMessage from "../components/InAppMessage/UpdateInAppMessage";
import ImportExport from "../components/ImportExport/ImportExport";
import ImportIdea from "../components/ImportExport/ImportIdea";
import MessageTypes from "../components/InAppMessage/MessageTypes";
import WidgetsTypes from "../components/Widgets/WidgetsTypes";
import Articles from "../components/HelpCenter/Articles/Articles";
import Category from "../components/HelpCenter/Category/Category";
import ArticleDetail from "../components/HelpCenter/Articles/ArticleDetail";
import Comments from "../components/Dashboard/Comments";
import Reactions from "../components/Dashboard/Reactions";
import UpdateIdea from "../components/Ideas/UpdateIdea";
import UpdateAnnouncement from "../components/Announcements/UpdateAnnouncement";
import AnnouncementAnalyticsViews from "../components/Announcements/AnnouncementAnalyticsViews";

export const routes = [
     {path: `${baseUrl}/dashboard`, component: <Dashboard/>},
     {path: `${baseUrl}/dashboard/comments`, component: <Comments/>},
     {path: `${baseUrl}/dashboard/reactions`, component: <Reactions/>},
     {path: `${baseUrl}/announcements`, component: <Announcements/>},
     {path: `${baseUrl}/announcements/:id`, component: <UpdateAnnouncement/>},
     {path: `${baseUrl}/announcements/analytic-view`, component: <AnnouncementAnalyticsViews/>},
     {path: `${baseUrl}/ideas`, component: <Ideas/>},
     {path: `${baseUrl}/ideas/:id`, component: <UpdateIdea/>},
     {path: `${baseUrl}/roadmap`, component: <Roadmap/>},
     {path: `${baseUrl}/customers`, component: <Customers/>},
     {path: `${baseUrl}/widget`, component: <Widgets/>},
     {path: `${baseUrl}/widget/type`, component: <WidgetsTypes/>},
     {path: `${baseUrl}/widget/:type/:id`, component: <UpdateWidget/>},
     {path: `${baseUrl}/help/article`, component: <Articles/>},
     {path: `${baseUrl}/help/article/:id`, component: <ArticleDetail/>},
     {path: `${baseUrl}/help/category`, component: <Category/>},
     {path: `${baseUrl}/notification`, component: <Notification/>},
     {path: `${baseUrl}/help-support`, component: <HelpSupport/>},
     {path: `${baseUrl}/pricing-plan`, component: <PricingPlans/>},
     {path: `${baseUrl}/settings/:type`, component: <Settings/>},
     {path: `${baseUrl}/in-app-message`, component: <InAppMessage/>},
     {path: `${baseUrl}/in-app-message/type`, component: <MessageTypes/>},
     {path: `${baseUrl}/in-app-message/:type/:id`, component: <UpdateInAppMessage/>},
     {path: `${baseUrl}/import-export`, component: <ImportExport/>},
     {path: `${baseUrl}/settings/import-export/import`, component: <ImportIdea/>},
]