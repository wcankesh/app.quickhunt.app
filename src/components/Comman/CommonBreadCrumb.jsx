import React from 'react';
import {useNavigate} from "react-router-dom";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "../ui/breadcrumb";

const CommonBreadCrumb = ({ links, currentPage, separator = '/', truncateLimit = 30 }) => {
    const navigate = useNavigate();
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {links.map((link, index) => (
                    <React.Fragment key={index}>
                        <BreadcrumbItem className={"cursor-pointer font-[500]"}>
                            <BreadcrumbLink onClick={() => navigate(link.path)}>
                                {link.label}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {/*{index < links.length - 1 && <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}*/}
                        <BreadcrumbSeparator />
                    </React.Fragment>
                ))}
                {currentPage && (
                    <BreadcrumbItem className={"cursor-pointer"}>
                        <BreadcrumbPage className={`w-full font-[500] ${currentPage.length > truncateLimit ? "max-w-[200px] truncate" : ""}`}>
                            {currentPage}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default CommonBreadCrumb;