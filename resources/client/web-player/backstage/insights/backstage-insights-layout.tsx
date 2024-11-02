import {Trans} from '@ui/i18n/trans';
import React, {cloneElement, Fragment, ReactElement, useState} from 'react';
import {DateRangeValue} from '@ui/forms/input-field/date/date-range-picker/date-range-value';
import {DateRangePresets} from '@ui/forms/input-field/date/date-range-picker/dialog/date-range-presets';
import {ReportDateSelector} from '@common/admin/analytics/report-date-selector';
import {StaticPageTitle} from '@common/seo/static-page-title';
import {InsightsReportChartsProps} from '@app/admin/reports/insights-report-charts';
import {Navbar} from '@common/ui/navigation/navbar/navbar';
import {Footer} from '@common/ui/footer/footer';
import {Skeleton} from '@ui/skeleton/skeleton';

interface Props {
  children: ReactElement<InsightsReportChartsProps>;
  reportModel: string;
  title?: ReactElement;
  isNested?: boolean;
}
export function BackstageInsightsLayout({
  children,
  reportModel,
  title,
  isNested,
}: Props) {
  const [dateRange, setDateRange] = useState<DateRangeValue>(() => {
    // This week
    return DateRangePresets[2].getRangeValue();
  });
  return (
    <Fragment>
      <StaticPageTitle>
        <Trans message="Insights" />
      </StaticPageTitle>
      <div className="flex h-full flex-col">
        {!isNested && (
          <Navbar className="flex-shrink-0" color="bg" darkModeColor="bg" />
        )}
        <div className="relative flex-auto overflow-y-auto bg-cover">
          <div className="mx-auto flex min-h-full max-w-[1600px] flex-col overflow-x-hidden p-12 md:p-24">
            <div className="flex-auto">
              <div className="mb-38 mt-14 h-48 items-center justify-between gap-24 md:flex">
                {title ? title : <Skeleton className="max-w-320" />}
                <div className="flex flex-shrink-0 items-center justify-between gap-10 md:gap-24">
                  <ReportDateSelector
                    value={dateRange}
                    onChange={setDateRange}
                  />
                </div>
              </div>
              {cloneElement(children, {dateRange, model: reportModel})}
            </div>
            {!isNested && <Footer />}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
