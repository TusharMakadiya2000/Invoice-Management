// components/GridCard4.js

import React from "react";
import { overviewCardType } from "../utils/types";
import Icon from "../common/Icon";

const OverviewCard: React.FC<{ item: overviewCardType }> = ({ item }) => {
    return (
        <div className="container rounded-lg border text-sm px-6 py-5">
            <div className="flex">
                <div className="flex">
                    <div className="flex items-center ">
                        <Icon
                            icon={item.icon}
                            className="lg:h-8 rounded-full bg-fgc text-white"
                        />
                    </div>
                    <div className="px-5">
                        <div className="flex">
                            <div>{item.title}</div>
                        </div>
                        <div>{item.number}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewCard;
