"use client";
import { Tooltip as ReactTooltip } from "react-tooltip";

interface TemplateProps {
    children: React.ReactNode;
}

const Template: React.FC<TemplateProps> = ({ children }) => {

    return (
        <div className="bg-fgc dark:bg-fgc-dark">
            {children}
            {/* <Script src="/assets/js/owl.carousel.min.js" /> */}
            <ReactTooltip
                id="main-tooltip"
                place="top"
                variant="info"
                className="z-50"
            />
        </div>
    );
};
export default Template;
