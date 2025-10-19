import React from 'react';

interface CardStatsProps {
  statSubtitle?: string;
  statTitle?: string;
  statArrow?: 'up' | 'down';
  statPercent?: string;
  statPercentColor?: string;
  statDescription?: string;
  statIconName?: string;
  statIconColor?: string;
}

export default function CardStats({
  statSubtitle = 'Traffic',
  statTitle = '350,897',
  statArrow = 'up',
  statPercent = '3.48',
  statPercentColor = 'text-emerald-600',
  statDescription = 'Since last month',
  statIconName = 'far fa-chart-bar',
  statIconColor = 'bg-emerald-500',
}: CardStatsProps) {
  return (
    <>
      <div className="relative mb-6 flex min-w-0 flex-col rounded-lg border border-gray-100 bg-white break-words shadow-lg xl:mb-0">
        <div className="flex-auto p-6">
          <div className="flex flex-wrap">
            <div className="relative w-full max-w-full flex-1 flex-grow pr-4">
              <h5 className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                {statSubtitle}
              </h5>
              <span className="mt-1 block text-2xl font-bold text-gray-800">{statTitle}</span>
            </div>
            <div className="relative w-auto flex-initial pl-4">
              <div
                className={
                  'inline-flex h-12 w-12 items-center justify-center rounded-full p-3 text-center text-white shadow-lg ' +
                  statIconColor
                }
              >
                <i className={statIconName}></i>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            <span className={statPercentColor + ' mr-2 font-medium'}>
              <i
                className={
                  statArrow === 'up'
                    ? 'fas fa-arrow-up'
                    : statArrow === 'down'
                      ? 'fas fa-arrow-down'
                      : ''
                }
              ></i>{' '}
              {statPercent}%
            </span>
            <span className="font-medium whitespace-nowrap">{statDescription}</span>
          </p>
        </div>
      </div>
    </>
  );
}
