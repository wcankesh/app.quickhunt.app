import React,{Fragment, useState} from 'react';
import {Icon} from "../../../utils/Icon";
import {useSelector} from "react-redux";
import WidgetHeader from "./WidgetHeader";
import IdeaWidgetPreview from "./IdeaWidgetPreview";
import RoadmapWidgetPreview from "./RoadmapWidgetPreview";
import AnnouncementWidgetPreview from "./AnnouncementWidgetPreview";
import {useTheme} from "../../theme-provider";

const WidgetPreview = ({widgetsSetting, type, toggle,onToggle }) => {
    const {theme} = useTheme();
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);

    const [selected, setSelected] = useState("ideas")

    const renderContent = () => {
        return(
            <div className="flex flex-col h-full w-full">
                <WidgetHeader selected={selected} setSelected={setSelected} widgetsSetting={widgetsSetting}/>
                <main className="flex-1 block bg-slate-50 py-4 overflow-hidden">
                    {
                        selected === "ideas" && <IdeaWidgetPreview widgetsSetting={widgetsSetting}/>
                    }
                    {
                        selected === "roadmap" && <RoadmapWidgetPreview widgetsSetting={widgetsSetting}/>
                    }
                    {
                        selected === "announcements" && <AnnouncementWidgetPreview widgetsSetting={widgetsSetting}/>
                    }
                    <ul className="flex gap-2 mt-4 items-center justify-center">
                        {Object.entries(allStatusAndTypes?.social || {}).map(([social, url]) => {
                            if(url !== '' && url !== null){
                                return(
                                    <li key={social}>
                                        <a href={url} target="_blank" className="w-8 h-8 border rounded flex items-center justify-center" rel={social}>
                                            {Icon[social]}
                                        </a>
                                    </li>
                                )
                            }

                        })}
                    </ul>
                </main>
                {
                    (allStatusAndTypes?.setting?.isBranding === 1) &&
                    <section className={`py-4 ${theme == "dark" ? "bg-card-foreground text-card" : "bg-card"} `}>
                        <h6 className="text-sm font-medium text-end mr-2">Powered by {" "}
                            <a className="text-primary" href="https://quickhunt.app" target="_blank">quickhunt</a>
                        </h6>
                    </section>
                }
            </div>
        )
    }
    return (
        <Fragment>
            {
                type === "popover" &&
                <div className={`QH-popover-admin ${toggle ? "QH-popover-open-admin" : ""}`} style={{
                    left: (widgetsSetting.launcherPosition === 1)
                        ? (type === "popover" ? `${widgetsSetting.launcherLeftSpacing || 20}px` : `${widgetsSetting.launcherLeftSpacing || 690}px`)
                        : "inherit",
                    right: (widgetsSetting.launcherPosition === 2)
                        ? `${widgetsSetting.launcherRightSpacing || 20}px`
                        : "inherit",
                    bottom: (widgetsSetting.launcherBottomSpacing) ? `${widgetsSetting.launcherBottomSpacing || "90"}px` : "inherit",
                    width: `${widgetsSetting.popoverWidth}px`, height: `${widgetsSetting.popoverHeight}px`
                }}>
                    {renderContent()}
                </div>
            }

            {
                type === "sidebar" &&
                    <div className={`QH-sidebar-admin ${toggle ? "QH-sidebar-open-admin" : ""} relative`} style={{
                        left: widgetsSetting.sidebarPosition === 1 ? "0px" : "inherit",
                        right: widgetsSetting.sidebarPosition === 2 ? "0" : "inherit",
                    }}>
                        <div className="QH-sidebar-content-admin" style={{
                            left: widgetsSetting.sidebarPosition === 1 ? "0px" : "inherit",
                            right: widgetsSetting.sidebarPosition === 2 ? "0" : "inherit",
                            bottom: (widgetsSetting.launcherBottomSpacing) ? `${widgetsSetting.launcherBottomSpacing || "90"}px` : "inherit",
                            width: `${widgetsSetting.sidebarWidth}px`,
                        }}>
                            {renderContent()}
                        </div>
                        <div className="QH-sidebar-shadow-admin" onClick={onToggle}>&nbsp;</div>
                    </div>
            }

            {
                type === "modal" &&
                <div className={"relative h-full"}>
                    <div className={`QH-modal-admin ${toggle ? "QH-modal-open-admin" : ""}`}>
                        <div className={"QH-modal-content-admin"}
                             style={{
                                 width: `${widgetsSetting.modalWidth}px`,
                                 height: `${widgetsSetting.modalHeight}px`,
                             }}>
                            {renderContent()}
                        </div>
                    </div>
                </div>
            }

            {
                type === "embed" &&
                <div className={"p-4 md:p-[64px] h-full "}>
                    <div className={"QH-widget-embed-admin border rounded-lg"}>
                        <div className={"QH-embed-admin"}>
                            {renderContent()}
                        </div>
                    </div>
                </div>
            }

        </Fragment>
    );
};

export default WidgetPreview;