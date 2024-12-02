import React from "react";
import { classNames } from "../utils/conts";
import Icon from "./Icon";

type requestType = {
	type?: string;
	onClick?: () => void;
};
const NotFound: React.FC<requestType> = ({ type, onClick }) => {
	return (
		<div className="inline-flex h-[calc(100vh-400px)] w-[100%] items-center justify-center">
			<div className="flex flex-row gap-6">
				<Icon icon="folder" className="h-24 w-24 opacity-50" />
				<div
					className={classNames(
						"flex flex-col font-normal",
					)}>
					<h1 className="text-start text-2xl font-semibold leading-8">
						It’s empty in here..
					</h1>
					<p className="text-start text-sm font-normal">
						We couldn’t find any data 😕 <br />
						You could try these:
					</p>
					<ul className="list-disc pl-5">
						<li className="text-start text-sm font-normal">
							Adjust your filters
						</li>
						{type && (
							<li className="cursor-pointer text-start text-sm font-normal">
								<span
									className="text-sm font-normal text-red-500 underline"
									onClick={() => {
										onClick && onClick();
									}}>
									Create a new {type}
								</span>
							</li>
						)}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
