// components/GridCard4.js

import React from "react";
import { MessageCardType } from "../utils/types";
import Image from "next/image";

const MessageCard: React.FC<{ item: MessageCardType }> = ({ item }) => {
  return (
    <div className="flex gap-4 w-full">
      <div className="flex gap-4 w-full rounded-md px-3 my-2 py-1 cursor-pointer hover:bg-fgc/10">
        <div className="self-center">
          <Image
            src={item.image}
            alt={item.name}
            className="rounded-full h-[38px] w-[38px]"
          />
        </div>
        <div className="flex flex-grow items-center gap-2">
          <div className="grid gap-0.5">
            <div className="text-sm font-semibold">{item.name}</div>
            <span className="text-xs font-medium">{item.title}</span>
          </div>
          <div className="flex-grow grid" />
          <div className="flex flex-col items-end">
            <div className="text-end text-sm">{item.time}</div>
            <span className="rounded-full text-white text-sm bg-fgc px-1.5 mt-1">
              {item.messages}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
