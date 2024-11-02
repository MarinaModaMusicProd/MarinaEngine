import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { u as useAdminReport, A as AdminHeaderReport, V as VisitorsReportCharts } from "./admin-routes-4e751a94.mjs";
import { v as StaticPageTitle, T as Trans } from "../server-entry.mjs";
import { d as DateRangePresets, R as ReportDateSelector } from "./backstage-track-insights-7c7dcbb8.mjs";
import "react-router-dom";
import "clsx";
import "./use-channel-f6833f7b.mjs";
import "framer-motion";
import "@react-stately/utils";
import "./play-arrow-filled-43482d1f.mjs";
import "react-hook-form";
import "@react-aria/utils";
import "@react-aria/focus";
import "@react-aria/interactions";
import "react-dom";
import "@tanstack/react-query";
import "dot-object";
import "@react-stately/color";
import "@internationalized/date";
import "./Edit-7b19e063.mjs";
import "zustand";
import "zustand/middleware";
import "zustand/middleware/immer";
import "deepmerge";
import "immer";
import "react-colorful";
import "nanoid";
import "deep-object-diff";
import "nano-memoize";
import "./use-resume-subscription-3b4b45a4.mjs";
import "./MoreHoriz-2a3c8f85.mjs";
import "@tanstack/react-virtual";
import "react-dom/server";
import "process";
import "http";
import "axios";
import "react-router-dom/server.mjs";
import "slugify";
import "@internationalized/number";
import "@floating-ui/react-dom";
import "react-merge-refs";
import "@react-aria/ssr";
import "axios-retry";
import "tus-js-client";
import "react-use-cookie";
import "mime-match";
import "react-use-clipboard";
function AdminReportPage() {
  const [dateRange, setDateRange] = useState(() => {
    return DateRangePresets[2].getRangeValue();
  });
  const { isLoading, data } = useAdminReport({ dateRange });
  const title = /* @__PURE__ */ jsx(Trans, { message: "Visitors report" });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-full gap-12 overflow-x-hidden p-12 md:gap-24 md:p-24", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-24 items-center justify-between gap-24 md:flex", children: [
      /* @__PURE__ */ jsx(StaticPageTitle, { children: title }),
      /* @__PURE__ */ jsx("h1", { className: "mb-24 text-3xl font-light md:mb-0", children: title }),
      /* @__PURE__ */ jsx(ReportDateSelector, { value: dateRange, onChange: setDateRange })
    ] }),
    /* @__PURE__ */ jsx(AdminHeaderReport, { report: data == null ? void 0 : data.headerReport }),
    /* @__PURE__ */ jsx(
      VisitorsReportCharts,
      {
        report: data == null ? void 0 : data.visitorsReport,
        isLoading
      }
    )
  ] });
}
export {
  AdminReportPage as default
};
//# sourceMappingURL=admin-report-page-ef7f93bc.mjs.map
