import React from 'react';
import {Icon} from "../../../utils/Icon";
import {useSelector} from "react-redux";
import {Button} from "../../ui/button";

const WidgetHeader = ({widgetsSetting, selected, setSelected}) => {
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const navList = [
        {
            title: widgetsSetting.ideaTitle || 'Ideas',
            icon: Icon.ideasIcon,
            link: 'ideas',
            selected: selected === `ideas`,
            isCheck: widgetsSetting.isIdea !== false,
            isRedirect: widgetsSetting.ideaDisplay !== 2,
        },
        {
            title: widgetsSetting.roadmapTitle || 'Roadmap',
            link: 'roadmap',
            icon: Icon.roadmapIcon,
            selected: selected === `roadmap`,
            isCheck: widgetsSetting.isRoadmap !== false,
            isRedirect: widgetsSetting.roadmapDisplay !== 2,
        },
        {
            title: widgetsSetting.changelogTitle || 'Announcements',
            link: 'announcements',
            icon: Icon.announcement,
            selected: selected === `announcements`,
            isCheck: widgetsSetting.isAnnouncement !== false,
            isRedirect: widgetsSetting.changelogDisplay !== 2,
        }
    ];

    const onRedirect = (link, redirectType) => {
        if (redirectType) {
            setSelected(link);
        } else {
            window.open(`https://${projectDetailsReducer.domain}/${link}`, "_blank")
        }
    };

    return (
        <header className="border-b border-slate-200" style={{backgroundColor: widgetsSetting.headerBgColor}}>
            <div className={"px-3"}>
                {
                    widgetsSetting?.hideHeader ?
                        <div className="flex items-center gap-4 justify-between pt-3 pb-4">
                            <div className="inline-block align-middle cursor-pointer">

                                {
                                    (projectDetailsReducer && projectDetailsReducer?.logo) ? (
                                        <img
                                            src={projectDetailsReducer.logo}
                                            alt={projectDetailsReducer?.name}
                                            className="max-h-10"
                                        />
                                    ) : (
                                        <span className="text-3xl font-medium tracking-tight transition-colors">
                                            {projectDetailsReducer?.name || ''}
                                        </span>
                                    )
                                }

                            </div>
                            <div className="flex flex-wrap gap-2">
                                <div className={`gap-2 flex`}>
                                    <Button variant={"outline"} style={{
                                        borderColor: widgetsSetting?.headerBtnBackgroundColor,
                                        color: widgetsSetting?.headerBtnBackgroundColor,
                                    }} className="hover:bg-inherit text-primary border-primary bg-transparent">Sign
                                        in</Button>
                                    <Button style={{
                                        backgroundColor: widgetsSetting?.headerBtnBackgroundColor,
                                        color: widgetsSetting?.headerBtnTextColor
                                    }}>Sign up</Button>
                                </div>


                            </div>
                        </div> : ''
                }
                <ul className={`gap-1 mb-b-1 flex ${widgetsSetting?.hideHeader === false ? 'pt-2' : ''}`}>
                    {
                        (navList || []).map((x, i) => {
                            if (x.isCheck) {
                                return (
                                    <li key={`Nav_${i}`}>
                                        <button onClick={() => onRedirect(x.link, x.isRedirect)}
                                                style={{color: x.selected ? widgetsSetting.headerBtnBackgroundColor : widgetsSetting.headerTextColor}}
                                                className={`${x.selected ? 'bg-slate-50 border-slate-200 text-primary' : 'border-transparent'}  border border-b-0 rounded-t-md flex items-center gap-1 text-sm py-2 px-2`}>{x.icon}{x.title}</button>
                                    </li>
                                )
                            }
                        })
                    }
                </ul>
            </div>
        </header>
    );
};

export default WidgetHeader;