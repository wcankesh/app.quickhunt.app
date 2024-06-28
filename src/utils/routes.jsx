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

export const routes = [
     {path: `${baseUrl}/dashboard`, component: <Dashboard/>},
     {path: `${baseUrl}/announcements`, component: <Announcements/>},
     {path: `${baseUrl}/ideas`, component: <Ideas/>},
     {path: `${baseUrl}/roadmap`, component: <Roadmap/>},
     {path: `${baseUrl}/customers`, component: <Customers/>},
     {path: `${baseUrl}/widgets`, component: <Widgets/>},
     {path: `${baseUrl}/notification`, component: <Notification/>},
     {path: `${baseUrl}/help-support`, component: <HelpSupport/>},
     {path: `${baseUrl}/pricing-plan`, component: <PricingPlans/>},
     {path: `${baseUrl}/settings/:type`, component: <Settings/>},
]