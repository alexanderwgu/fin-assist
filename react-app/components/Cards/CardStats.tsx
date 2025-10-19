import React from "react";

interface CardStatsProps {
  statSubtitle?: string;
  statTitle?: string;
  statArrow?: "up" | "down";
  statPercent?: string;
  statPercentColor?: string;
  statDescription?: string;
  statIconName?: string;
  statIconColor?: string;
}

export default function CardStats({
  statSubtitle = "Traffic",
  statTitle = "350,897",
  statArrow = "up",
  statPercent = "3.48",
  statPercentColor = "text-emerald-600",
  statDescription = "Since last month",
  statIconName = "far fa-chart-bar",
  statIconColor = "bg-emerald-500",
}: CardStatsProps) {
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-6 xl:mb-0 shadow-lg border border-gray-100">
        <div className="flex-auto p-6">
          <div className="flex flex-wrap">
            <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
              <h5 className="text-gray-500 uppercase font-medium text-xs tracking-wide">
                {statSubtitle}
              </h5>
              <span className="font-bold text-2xl text-gray-800 mt-1 block">
                {statTitle}
              </span>
            </div>
            <div className="relative w-auto pl-4 flex-initial">
              <div
                className={
                  "text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full " +
                  statIconColor
                }
              >
                <i className={statIconName}></i>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            <span className={statPercentColor + " mr-2 font-medium"}>
              <i
                className={
                  statArrow === "up"
                    ? "fas fa-arrow-up"
                    : statArrow === "down"
                    ? "fas fa-arrow-down"
                    : ""
                }
              ></i>{" "}
              {statPercent}%
            </span>
            <span className="whitespace-nowrap font-medium">{statDescription}</span>
          </p>
        </div>
      </div>
    </>
  );
}
