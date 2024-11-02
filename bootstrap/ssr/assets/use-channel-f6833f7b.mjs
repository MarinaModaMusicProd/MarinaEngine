import { jsx, jsxs } from "react/jsx-runtime";
import { createContext, useEffect, useMemo, useCallback, cloneElement, useContext, useRef, useState, useId, Fragment } from "react";
import { ar as useMediaQuery, aN as getFromLocalStorage, s as setInLocalStorage, b7 as Underlay, q as Skeleton, a0 as getInputFieldClassNames, b as useNumberFormatter, b8 as clamp, b9 as createEventHandler, c as createSvgIcon, g as useDialogContext, h as Dialog, j as DialogBody, I as IconButton, r as CloseIcon, ap as slugifyString, aa as getBootstrapData, e as useTrans, a2 as FileUploadProvider, U as FormImageSelector, f as FormTextField, T as Trans, m as message, x as toast, w as queryClient, J as onFormQueryError, y as showHttpErrorToast, z as apiClient, i as DialogHeader, k as Form, p as DialogFooter, B as Button } from "../server-entry.mjs";
import { AnimatePresence, m } from "framer-motion";
import { useControlledState } from "@react-stately/utils";
import clsx from "clsx";
import { A as Avatar, $ as usePointerEvents, K as KeyboardArrowLeftIcon, a as KeyboardArrowRightIcon, c as FormSwitch } from "./play-arrow-filled-43482d1f.mjs";
import { useGlobalListeners, mergeProps, snapValueToStep, useObjectRef } from "@react-aria/utils";
import { useController, useForm } from "react-hook-form";
import { useSearchParams, useNavigate, Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
const DashboardLayoutContext = createContext(
  null
);
function useBlockBodyOverflow(disable = false) {
  useEffect(() => {
    if (disable) {
      document.documentElement.classList.remove("no-page-overflow");
    } else {
      document.documentElement.classList.add("no-page-overflow");
    }
    return () => {
      document.documentElement.classList.remove("no-page-overflow");
    };
  }, [disable]);
}
function DashboardLayout({
  children,
  leftSidenavStatus: leftSidenav,
  onLeftSidenavChange,
  rightSidenavStatus: rightSidenav,
  initialRightSidenavStatus,
  onRightSidenavChange,
  name,
  leftSidenavCanBeCompact,
  height = "h-screen",
  className,
  gridClassName = "dashboard-grid",
  blockBodyOverflow = true,
  ...domProps
}) {
  useBlockBodyOverflow(!blockBodyOverflow);
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const isCompactModeInitially = useMemo(() => {
    return !name ? false : getFromLocalStorage(`${name}.sidenav.compact`);
  }, [name]);
  const defaultLeftSidenavStatus = isCompactModeInitially ? "compact" : "open";
  const [leftSidenavStatus, setLeftSidenavStatus] = useControlledState(
    leftSidenav,
    isMobile ? "closed" : defaultLeftSidenavStatus,
    onLeftSidenavChange
  );
  const rightSidenavStatusDefault = useMemo(() => {
    if (isMobile) {
      return "closed";
    }
    if (initialRightSidenavStatus != null) {
      return initialRightSidenavStatus;
    }
    const userSelected = getFromLocalStorage(
      `${name}.sidenav.right.position`,
      "open"
    );
    if (userSelected != null) {
      return userSelected;
    }
    return initialRightSidenavStatus || "closed";
  }, [isMobile, name, initialRightSidenavStatus]);
  const [rightSidenavStatus, _setRightSidenavStatus] = useControlledState(
    rightSidenav,
    rightSidenavStatusDefault,
    onRightSidenavChange
  );
  const setRightSidenavStatus = useCallback(
    (status) => {
      _setRightSidenavStatus(status);
      setInLocalStorage(`${name}.sidenav.right.position`, status);
    },
    [_setRightSidenavStatus, name]
  );
  const shouldShowUnderlay = isMobile && (leftSidenavStatus === "open" || rightSidenavStatus === "open");
  return /* @__PURE__ */ jsx(
    DashboardLayoutContext.Provider,
    {
      value: {
        leftSidenavStatus,
        setLeftSidenavStatus,
        rightSidenavStatus,
        setRightSidenavStatus,
        leftSidenavCanBeCompact,
        name,
        isMobileMode: isMobile
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          ...domProps,
          className: clsx("relative isolate", gridClassName, className, height),
          children: [
            children,
            /* @__PURE__ */ jsx(AnimatePresence, { children: shouldShowUnderlay && /* @__PURE__ */ jsx(
              Underlay,
              {
                position: "fixed",
                onClick: () => {
                  setLeftSidenavStatus("closed");
                  setRightSidenavStatus("closed");
                }
              },
              "dashboard-underlay"
            ) })
          ]
        }
      )
    }
  );
}
function DashboardContent({
  children,
  isScrollable = true
}) {
  return cloneElement(children, {
    className: clsx(
      children.props.className,
      isScrollable && "overflow-y-auto stable-scrollbar",
      "dashboard-grid-content"
    )
  });
}
function DashboardSidenav({
  className,
  position,
  children,
  size = "md",
  mode,
  overlayPosition = "fixed",
  display = "flex",
  overflow = "overflow-hidden",
  forceClosed = false
}) {
  const {
    isMobileMode,
    leftSidenavStatus,
    setLeftSidenavStatus,
    rightSidenavStatus,
    setRightSidenavStatus
  } = useContext(DashboardLayoutContext);
  const status = position === "left" ? leftSidenavStatus : rightSidenavStatus;
  const isOverlayMode = isMobileMode || mode === "overlay";
  const variants = {
    open: { display, width: null },
    compact: {
      display,
      width: null
    },
    closed: {
      width: 0,
      transitionEnd: {
        display: "none"
      }
    }
  };
  const sizeClassName = getSize(status === "compact" ? "compact" : size);
  return /* @__PURE__ */ jsx(
    m.div,
    {
      variants,
      initial: false,
      animate: forceClosed ? "closed" : status,
      transition: { type: "tween", duration: 0.15 },
      onClick: (e) => {
        const target = e.target;
        if (isMobileMode && (target.closest("button") || target.closest("a"))) {
          setLeftSidenavStatus("closed");
          setRightSidenavStatus("closed");
        }
      },
      className: clsx(
        className,
        position === "left" ? "dashboard-grid-sidenav-left" : "dashboard-grid-sidenav-right",
        "will-change-[width]",
        overflow,
        sizeClassName,
        isOverlayMode && `${overlayPosition} bottom-0 top-0 z-20 shadow-2xl`,
        isOverlayMode && position === "left" && "left-0",
        isOverlayMode && position === "right" && "right-0"
      ),
      children: cloneElement(children, {
        className: clsx(
          children.props.className,
          "w-full h-full",
          status === "compact" && "compact-scrollbar"
        ),
        isCompactMode: status === "compact"
      })
    }
  );
}
function getSize(size) {
  switch (size) {
    case "compact":
      return "w-80";
    case "sm":
      return "w-224";
    case "md":
      return "w-240";
    case "lg":
      return "w-288";
    default:
      return size || "";
  }
}
const BackendFiltersUrlKey = "filters";
function decodeBackendFilters(encodedFilters) {
  if (!encodedFilters)
    return [];
  let filtersFromQuery = [];
  try {
    filtersFromQuery = JSON.parse(atob(decodeURIComponent(encodedFilters)));
    filtersFromQuery.map((filterValue) => {
      if (filterValue.valueKey != null) {
        filterValue.value = filterValue.valueKey;
      }
      return filterValue;
    });
  } catch (e) {
  }
  return filtersFromQuery;
}
function encodeBackendFilters(filterValues, filters) {
  if (!filterValues)
    return "";
  filterValues = !filters ? filterValues : filterValues.filter((item) => item.value !== "").map((item) => transformValue(item, filters));
  filterValues = filterValues.filter((fm) => !fm.isInactive);
  if (!filterValues.length) {
    return "";
  }
  return encodeURIComponent(btoa(JSON.stringify(filterValues)));
}
function transformValue(filterValue, filters) {
  var _a;
  const filterConfig = filters.find((f) => f.key === filterValue.key);
  if ((filterConfig == null ? void 0 : filterConfig.control.type) === "select") {
    const option = (filterConfig.control.options || []).find(
      (o) => o.key === filterValue.value
    );
    if (option) {
      return { ...filterValue, value: option.value, valueKey: option.key };
    }
  }
  if ((_a = filterConfig == null ? void 0 : filterConfig.extraFilters) == null ? void 0 : _a.length) {
    filterValue["extraFilters"] = filterConfig.extraFilters;
  }
  return filterValue;
}
function useBackendFilterUrlParams(filters, pinnedFilters) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const encodedFilters = searchParams.get(BackendFiltersUrlKey);
  const decodedFilters = useMemo(() => {
    if (!filters)
      return [];
    const decoded = decodeBackendFilters(encodedFilters);
    (pinnedFilters || []).forEach((key) => {
      if (!decoded.find((f) => f.key === key)) {
        const config = filters.find((f) => f.key === key);
        decoded.push({
          key,
          value: config.control.defaultValue,
          operator: config.defaultOperator,
          isInactive: true
        });
      }
    });
    decoded.sort(
      (a, b) => filters.findIndex((f) => f.key === a.key) - filters.findIndex((f) => f.key === b.key)
    );
    return decoded;
  }, [encodedFilters, pinnedFilters, filters]);
  const getDecodedWithoutKeys = useCallback(
    (values) => {
      const newFilters = [...decodedFilters];
      values.forEach((value) => {
        const key = typeof value === "object" ? value.key : value;
        const index = newFilters.findIndex((f) => f.key === key);
        if (index > -1) {
          newFilters.splice(index, 1);
        }
      });
      return newFilters;
    },
    [decodedFilters]
  );
  const replaceAll = useCallback(
    (filterValues) => {
      const encodedFilters2 = encodeBackendFilters(filterValues, filters);
      if (encodedFilters2) {
        searchParams.set(BackendFiltersUrlKey, encodedFilters2);
      } else {
        searchParams.delete(BackendFiltersUrlKey);
      }
      navigate({ search: `?${searchParams}` }, { replace: true });
    },
    [filters, navigate, searchParams]
  );
  const add = useCallback(
    (filterValues) => {
      const existing = getDecodedWithoutKeys(filterValues);
      const decodedFilters2 = [...existing, ...filterValues];
      replaceAll(decodedFilters2);
    },
    [getDecodedWithoutKeys, replaceAll]
  );
  const remove = useCallback(
    (key) => replaceAll(getDecodedWithoutKeys([key])),
    [getDecodedWithoutKeys, replaceAll]
  );
  return {
    add,
    remove,
    replaceAll,
    decodedFilters,
    encodedFilters
  };
}
const EMPTY_PAGINATION_RESPONSE = {
  pagination: { data: [], from: 0, to: 0, per_page: 15, current_page: 1 }
};
function hasNextPage(pagination) {
  if ("next_cursor" in pagination) {
    return pagination.next_cursor != null;
  }
  if ("last_page" in pagination) {
    return pagination.current_page < pagination.last_page;
  }
  return pagination.data.length > 0 && pagination.data.length >= pagination.per_page;
}
function downloadFileFromUrl(url, name) {
  const link = document.createElement("a");
  link.href = url;
  if (name)
    link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function NameWithAvatar({
  image,
  label,
  description,
  labelClassName,
  avatarSize = "md"
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-12", children: [
    image && /* @__PURE__ */ jsx(Avatar, { size: avatarSize, className: "flex-shrink-0", src: image }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0 overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: clsx(labelClassName, "overflow-hidden overflow-ellipsis"),
          children: label
        }
      ),
      description && /* @__PURE__ */ jsx("div", { className: "overflow-hidden overflow-ellipsis text-xs text-muted", children: description })
    ] })
  ] });
}
function NameWithAvatarPlaceholder({
  labelClassName,
  showDescription
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex w-full max-w-4/5 items-center gap-12", children: [
    /* @__PURE__ */ jsx(Skeleton, { size: "w-40 h-40 md:w-32 md:h-32", variant: "rect" }),
    /* @__PURE__ */ jsxs("div", { className: "flex-auto", children: [
      /* @__PURE__ */ jsx("div", { className: clsx(labelClassName, "leading-3"), children: /* @__PURE__ */ jsx(Skeleton, {}) }),
      showDescription && /* @__PURE__ */ jsx("div", { className: "mt-4 leading-3 text-muted", children: /* @__PURE__ */ jsx(Skeleton, {}) })
    ] })
  ] });
}
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
function BaseSlider(props) {
  const {
    size = "md",
    inline,
    label,
    showValueLabel = !!label,
    className,
    width = "w-full",
    slider,
    children,
    trackColor = "primary",
    fillColor = "primary"
  } = props;
  const {
    domProps,
    trackRef,
    getThumbPercent,
    getThumbValueLabel,
    labelId,
    groupId,
    thumbIds,
    isDisabled,
    numberFormatter,
    minValue,
    maxValue,
    step,
    values,
    getValueLabel
  } = slider;
  let outputValue = "";
  let maxLabelLength = Math.max(
    [...numberFormatter.format(minValue)].length,
    [...numberFormatter.format(maxValue)].length,
    [...numberFormatter.format(step)].length
  );
  if (getValueLabel) {
    outputValue = getValueLabel(values[0]);
  } else if (values.length === 1) {
    outputValue = getThumbValueLabel(0);
  } else if (values.length === 2) {
    outputValue = `${getThumbValueLabel(0)} – ${getThumbValueLabel(1)}`;
    maxLabelLength = 3 + 2 * Math.max(
      maxLabelLength,
      [...numberFormatter.format(minValue)].length,
      [...numberFormatter.format(maxValue)].length
    );
  }
  const style = getInputFieldClassNames({
    size,
    disabled: isDisabled,
    labelDisplay: "flex"
  });
  const wrapperClassname = clsx("touch-none", className, width, {
    "flex items-center": inline
  });
  return /* @__PURE__ */ jsxs("div", { className: wrapperClassname, role: "group", id: groupId, children: [
    (label || showValueLabel) && /* @__PURE__ */ jsxs("div", { className: clsx(style.label, "select-none"), children: [
      label && /* @__PURE__ */ jsx(
        "label",
        {
          onClick: () => {
            var _a;
            (_a = document.getElementById(thumbIds[0])) == null ? void 0 : _a.focus();
          },
          id: labelId,
          htmlFor: groupId,
          children: label
        }
      ),
      showValueLabel && /* @__PURE__ */ jsx(
        "output",
        {
          htmlFor: thumbIds[0],
          className: "ml-auto text-right",
          "aria-live": "off",
          style: !maxLabelLength ? void 0 : {
            width: `${maxLabelLength}ch`,
            minWidth: `${maxLabelLength}ch`
          },
          children: outputValue
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        ref: trackRef,
        className: clsx("relative", getWrapperHeight(props)),
        ...domProps,
        role: "presentation",
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: clsx(
                "absolute inset-0 m-auto rounded",
                getTrackColor(trackColor, isDisabled),
                getTrackHeight(size)
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: clsx(
                "absolute inset-0 my-auto rounded",
                getFillColor(fillColor, isDisabled),
                getTrackHeight(size)
              ),
              style: { width: `${Math.max(getThumbPercent(0) * 100, 0)}%` }
            }
          ),
          children
        ]
      }
    )
  ] });
}
function getWrapperHeight({ size, wrapperHeight }) {
  if (wrapperHeight)
    return wrapperHeight;
  switch (size) {
    case "xs":
      return "h-14";
    case "sm":
      return "h-20";
    default:
      return "h-30";
  }
}
function getTrackHeight(size) {
  switch (size) {
    case "xs":
      return "h-2";
    case "sm":
      return "h-3";
    default:
      return "h-4";
  }
}
function getTrackColor(color, isDisabled) {
  if (isDisabled) {
    color = "disabled";
  }
  switch (color) {
    case "disabled":
      return "bg-slider-disabled/60";
    case "primary":
      return "bg-primary-light";
    case "neutral":
      return "bg-divider";
    default:
      return color;
  }
}
function getFillColor(color, isDisabled) {
  if (isDisabled) {
    color = "disabled";
  }
  switch (color) {
    case "disabled":
      return "bg-slider-disabled";
    case "primary":
      return "bg-primary";
    default:
      return color;
  }
}
function useSlider({
  minValue = 0,
  maxValue = 100,
  isDisabled = false,
  step = 1,
  formatOptions,
  onChangeEnd,
  onPointerDown,
  label,
  getValueLabel,
  showThumbOnHoverOnly,
  thumbSize,
  onPointerMove,
  ...props
}) {
  const [isPointerOver, setIsPointerOver] = useState(false);
  const numberFormatter = useNumberFormatter(formatOptions);
  const { addGlobalListener, removeGlobalListener } = useGlobalListeners();
  const trackRef = useRef(null);
  const [values, setValues] = useControlledState(
    props.value ? props.value : void 0,
    props.defaultValue ?? [minValue],
    props.onChange
  );
  const valuesRef = useRef(null);
  valuesRef.current = values;
  const [draggedThumbs, setDraggedThumbs] = useState(
    new Array(values.length).fill(false)
  );
  const draggedThumbsRef = useRef(null);
  draggedThumbsRef.current = draggedThumbs;
  function getFormattedValue(value) {
    return numberFormatter.format(value);
  }
  const isThumbDragging = (index) => {
    var _a;
    return ((_a = draggedThumbsRef.current) == null ? void 0 : _a[index]) || false;
  };
  const getThumbValueLabel = (index) => getFormattedValue(values[index]);
  const getThumbMinValue = (index) => index === 0 ? minValue : values[index - 1];
  const getThumbMaxValue = (index) => index === values.length - 1 ? maxValue : values[index + 1];
  const setThumbValue = (index, value) => {
    if (isDisabled || !isThumbEditable(index) || !valuesRef.current) {
      return;
    }
    const thisMin = getThumbMinValue(index);
    const thisMax = getThumbMaxValue(index);
    value = snapValueToStep(value, thisMin, thisMax, step);
    valuesRef.current = replaceIndex(valuesRef.current, index, value);
    setValues(valuesRef.current);
  };
  const updateDraggedThumbs = (index, dragging) => {
    var _a;
    if (isDisabled || !isThumbEditable(index)) {
      return;
    }
    const wasDragging = (_a = draggedThumbsRef.current) == null ? void 0 : _a[index];
    draggedThumbsRef.current = replaceIndex(
      draggedThumbsRef.current || [],
      index,
      dragging
    );
    setDraggedThumbs(draggedThumbsRef.current);
    if (onChangeEnd && wasDragging && !draggedThumbsRef.current.some(Boolean)) {
      onChangeEnd(valuesRef.current || []);
    }
  };
  const [focusedThumb, setFocusedThumb] = useState(
    void 0
  );
  const getValuePercent = (value) => {
    const x = Math.min(1, (value - minValue) / (maxValue - minValue));
    if (isNaN(x)) {
      return 0;
    }
    return x;
  };
  const getThumbPercent = (index) => getValuePercent(valuesRef.current[index]);
  const setThumbPercent = (index, percent) => {
    setThumbValue(index, getPercentValue(percent));
  };
  const getRoundedValue = (value) => Math.round((value - minValue) / step) * step + minValue;
  const getPercentValue = (percent) => {
    const val = percent * (maxValue - minValue) + minValue;
    return clamp(getRoundedValue(val), minValue, maxValue);
  };
  const editableThumbsRef = useRef(
    new Array(values.length).fill(true)
  );
  const isThumbEditable = (index) => editableThumbsRef.current[index];
  const setThumbEditable = (index, editable) => {
    editableThumbsRef.current[index] = editable;
  };
  const realTimeTrackDraggingIndex = useRef(null);
  const currentPointer = useRef(void 0);
  const handlePointerDown = (e) => {
    if (e.pointerType === "mouse" && (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey)) {
      return;
    }
    onPointerDown == null ? void 0 : onPointerDown();
    if (trackRef.current && !isDisabled && values.every((_, i) => !draggedThumbs[i])) {
      const size = trackRef.current.offsetWidth;
      const trackPosition = trackRef.current.getBoundingClientRect().left;
      const offset = e.clientX - trackPosition;
      const percent = offset / size;
      const value = getPercentValue(percent);
      let closestThumb;
      const split = values.findIndex((v) => value - v < 0);
      if (split === 0) {
        closestThumb = split;
      } else if (split === -1) {
        closestThumb = values.length - 1;
      } else {
        const lastLeft = values[split - 1];
        const firstRight = values[split];
        if (Math.abs(lastLeft - value) < Math.abs(firstRight - value)) {
          closestThumb = split - 1;
        } else {
          closestThumb = split;
        }
      }
      if (closestThumb >= 0 && isThumbEditable(closestThumb)) {
        e.preventDefault();
        realTimeTrackDraggingIndex.current = closestThumb;
        setFocusedThumb(closestThumb);
        currentPointer.current = e.pointerId;
        updateDraggedThumbs(realTimeTrackDraggingIndex.current, true);
        setThumbValue(closestThumb, value);
        addGlobalListener(window, "pointerup", onUpTrack, false);
      } else {
        realTimeTrackDraggingIndex.current = null;
      }
    }
  };
  const currentPosition = useRef(null);
  const { domProps: moveDomProps } = usePointerEvents({
    onPointerDown: handlePointerDown,
    onMoveStart() {
      currentPosition.current = null;
    },
    onMove(e, deltaX) {
      var _a;
      const size = ((_a = trackRef.current) == null ? void 0 : _a.offsetWidth) || 0;
      if (currentPosition.current == null) {
        currentPosition.current = getThumbPercent(realTimeTrackDraggingIndex.current || 0) * size;
      }
      currentPosition.current += deltaX;
      if (realTimeTrackDraggingIndex.current != null && trackRef.current) {
        const percent = clamp(currentPosition.current / size, 0, 1);
        setThumbPercent(realTimeTrackDraggingIndex.current, percent);
      }
    },
    onMoveEnd() {
      if (realTimeTrackDraggingIndex.current != null) {
        updateDraggedThumbs(realTimeTrackDraggingIndex.current, false);
        realTimeTrackDraggingIndex.current = null;
      }
    }
  });
  const domProps = mergeProps(moveDomProps, {
    onPointerEnter: () => {
      setIsPointerOver(true);
    },
    onPointerLeave: () => {
      setIsPointerOver(false);
    },
    onPointerMove: (e) => {
      onPointerMove == null ? void 0 : onPointerMove(e);
    }
  });
  const onUpTrack = (e) => {
    const id2 = e.pointerId;
    if (id2 === currentPointer.current) {
      if (realTimeTrackDraggingIndex.current != null) {
        updateDraggedThumbs(realTimeTrackDraggingIndex.current, false);
        realTimeTrackDraggingIndex.current = null;
      }
      removeGlobalListener(window, "pointerup", onUpTrack, false);
    }
  };
  const id = useId();
  const labelId = label ? `${id}-label` : void 0;
  const groupId = `${id}-group`;
  const thumbIds = [...Array(values.length)].map((v, i) => {
    return `${id}-thumb-${i}`;
  });
  return {
    domProps,
    trackRef,
    isDisabled,
    step,
    values,
    minValue,
    maxValue,
    focusedThumb,
    labelId,
    groupId,
    thumbIds,
    numberFormatter,
    getThumbPercent,
    getThumbMinValue,
    getThumbMaxValue,
    getThumbValueLabel,
    isThumbDragging,
    setThumbValue,
    updateDraggedThumbs,
    setThumbEditable,
    setFocusedThumb,
    getValueLabel,
    isPointerOver,
    showThumbOnHoverOnly,
    thumbSize
  };
}
function replaceIndex(array, index, value) {
  if (array[index] === value) {
    return array;
  }
  return [...array.slice(0, index), value, ...array.slice(index + 1)];
}
function SliderThumb({
  index,
  slider,
  isDisabled: isThumbDisabled,
  ariaLabel,
  inputRef,
  onBlur,
  fillColor = "primary"
}) {
  const inputObjRef = useObjectRef(inputRef);
  const { addGlobalListener, removeGlobalListener } = useGlobalListeners();
  const {
    step,
    values,
    focusedThumb,
    labelId,
    thumbIds,
    isDisabled: isSliderDisabled,
    getThumbPercent,
    getThumbMinValue,
    getThumbMaxValue,
    getThumbValueLabel,
    setThumbValue,
    updateDraggedThumbs,
    isThumbDragging,
    setThumbEditable,
    setFocusedThumb,
    isPointerOver,
    showThumbOnHoverOnly,
    thumbSize = "w-18 h-18"
  } = slider;
  const isDragging = isThumbDragging(index);
  const value = values[index];
  setThumbEditable(index, !isThumbDisabled);
  const isDisabled = isThumbDisabled || isSliderDisabled;
  const focusInput = useCallback(() => {
    if (inputObjRef.current) {
      inputObjRef.current.focus({ preventScroll: true });
    }
  }, [inputObjRef]);
  const isFocused = focusedThumb === index;
  useEffect(() => {
    if (isFocused) {
      focusInput();
    }
  }, [isFocused, focusInput]);
  const currentPointer = useRef(void 0);
  const handlePointerUp = (e) => {
    if (e.pointerId === currentPointer.current) {
      focusInput();
      updateDraggedThumbs(index, false);
      removeGlobalListener(window, "pointerup", handlePointerUp, false);
    }
  };
  const className = clsx(
    "outline-none rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 absolute inset-0 transition-button duration-200",
    thumbSize,
    !isDisabled && "shadow-md",
    thumbColor({ fillColor, isDisabled, isDragging }),
    // show thumb on hover and while dragging, otherwise "blur" event will fire on thumb and dragging will stop
    !showThumbOnHoverOnly || showThumbOnHoverOnly && isDragging || isPointerOver ? "visible" : "invisible"
  );
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "presentation",
      className,
      style: {
        left: `${Math.max(getThumbPercent(index) * 100, 0)}%`
      },
      onPointerDown: (e) => {
        if (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey) {
          return;
        }
        focusInput();
        currentPointer.current = e.pointerId;
        updateDraggedThumbs(index, true);
        addGlobalListener(window, "pointerup", handlePointerUp, false);
      },
      children: /* @__PURE__ */ jsx(
        "input",
        {
          id: thumbIds[index],
          onKeyDown: createEventHandler(() => {
            updateDraggedThumbs(index, true);
          }),
          onKeyUp: createEventHandler(() => {
            updateDraggedThumbs(index, false);
          }),
          ref: inputObjRef,
          tabIndex: !isDisabled ? 0 : void 0,
          min: getThumbMinValue(index),
          max: getThumbMaxValue(index),
          step,
          value,
          disabled: isDisabled,
          "aria-label": ariaLabel,
          "aria-labelledby": labelId,
          "aria-orientation": "horizontal",
          "aria-valuetext": getThumbValueLabel(index),
          onFocus: () => {
            setFocusedThumb(index);
          },
          onBlur: (e) => {
            setFocusedThumb(void 0);
            updateDraggedThumbs(index, false);
            onBlur == null ? void 0 : onBlur(e);
          },
          onChange: (e) => {
            setThumbValue(index, parseFloat(e.target.value));
          },
          type: "range",
          className: "sr-only"
        }
      )
    }
  );
}
function thumbColor({
  isDisabled,
  isDragging,
  fillColor
}) {
  if (isDisabled) {
    return "bg-slider-disabled cursor-default";
  }
  if (fillColor && fillColor !== "primary") {
    return fillColor;
  }
  return clsx(
    "hover:bg-primary-dark",
    isDragging ? "bg-primary-dark" : "bg-primary"
  );
}
function Slider({ inputRef, onBlur, ...props }) {
  const { onChange, onChangeEnd, value, defaultValue, ...otherProps } = props;
  const baseProps = {
    ...otherProps,
    // Normalize `value: number[]` to `value: number`
    value: value != null ? [value] : void 0,
    defaultValue: defaultValue != null ? [defaultValue] : void 0,
    onChange: (v) => {
      onChange == null ? void 0 : onChange(v[0]);
    },
    onChangeEnd: (v) => {
      onChangeEnd == null ? void 0 : onChangeEnd(v[0]);
    }
  };
  const slider = useSlider(baseProps);
  return /* @__PURE__ */ jsx(BaseSlider, { ...baseProps, slider, children: /* @__PURE__ */ jsx(
    SliderThumb,
    {
      fillColor: props.fillColor,
      index: 0,
      slider,
      inputRef,
      onBlur
    }
  ) });
}
function FormSlider({ name, ...props }) {
  const {
    field: { onChange, onBlur, value = "", ref }
  } = useController({
    name
  });
  const formProps = {
    onChange,
    onBlur,
    value: value || ""
    // avoid issues with "null" value when setting form defaults from backend model
  };
  return /* @__PURE__ */ jsx(Slider, { inputRef: ref, ...mergeProps(formProps, props) });
}
const USER_MODEL = "user";
const MoreVertIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" }),
  "MoreVertOutlined"
);
const artistPageTabs = {
  discography: 1,
  similar: 2,
  about: 3,
  tracks: 4,
  albums: 5,
  followers: 6
};
function ImageZoomDialog(props) {
  const { close } = useDialogContext();
  const { image, images } = props;
  const [activeIndex, setActiveIndex] = useControlledState(
    props.activeIndex,
    props.defaultActiveIndex,
    props.onActiveIndexChange
  );
  const src = image || (images == null ? void 0 : images[activeIndex]);
  return /* @__PURE__ */ jsx(Dialog, { size: "fullscreenTakeover", background: "bg-black/80", children: /* @__PURE__ */ jsxs(DialogBody, { padding: "p-0", className: "h-full w-full", children: [
    /* @__PURE__ */ jsx(
      IconButton,
      {
        size: "lg",
        color: "paper",
        className: "absolute right-0 top-0 z-20 text-white",
        onClick: () => {
          close();
        },
        children: /* @__PURE__ */ jsx(CloseIcon, {})
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative flex h-full w-full items-center justify-center p-40", children: [
      (images == null ? void 0 : images.length) ? /* @__PURE__ */ jsx(
        IconButton,
        {
          size: "lg",
          color: "white",
          variant: "flat",
          className: "absolute bottom-0 left-20 top-0 my-auto",
          disabled: activeIndex < 1,
          onClick: () => {
            setActiveIndex(activeIndex - 1);
          },
          children: /* @__PURE__ */ jsx(KeyboardArrowLeftIcon, {})
        }
      ) : null,
      /* @__PURE__ */ jsx(
        "img",
        {
          src,
          alt: "",
          className: "max-h-full w-auto object-contain shadow"
        }
      ),
      (images == null ? void 0 : images.length) ? /* @__PURE__ */ jsx(
        IconButton,
        {
          size: "lg",
          color: "white",
          variant: "flat",
          className: "absolute bottom-0 right-20 top-0 my-auto",
          disabled: activeIndex + 1 === (images == null ? void 0 : images.length),
          onClick: () => {
            setActiveIndex(activeIndex + 1);
          },
          children: /* @__PURE__ */ jsx(KeyboardArrowRightIcon, {})
        }
      ) : null
    ] })
  ] }) });
}
const PauseIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z" }),
  "PauseOutlined"
);
const ARTIST_MODEL = "artist";
const TRACK_MODEL = "track";
function GenreLink({ genre, className, ...linkProps }) {
  const uri = useMemo(() => {
    return getGenreLink(genre);
  }, [genre]);
  return /* @__PURE__ */ jsx(
    Link,
    {
      ...linkProps,
      className: clsx(
        "block outline-none first-letter:capitalize hover:underline focus-visible:underline",
        className
      ),
      to: uri,
      children: genre.display_name || genre.name
    }
  );
}
function getGenreLink(genre, { absolute } = {}) {
  const genreName = slugifyString(genre.name);
  let link = `/genre/${genreName}`;
  if (absolute) {
    link = `${getBootstrapData().settings.base_url}${link}`;
  }
  return link;
}
function PlaylistLink({ playlist, className }) {
  const uri = useMemo(() => {
    return getPlaylistLink(playlist);
  }, [playlist.id]);
  return /* @__PURE__ */ jsx(Link, { className: clsx("capitalize hover:underline", className), to: uri, children: playlist.name });
}
function getPlaylistLink(playlist, { absolute } = {}) {
  const playlistName = slugifyString(playlist.name);
  let link = `/playlist/${playlist.id}/${playlistName}`;
  if (absolute) {
    link = `${getBootstrapData().settings.base_url}${link}`;
  }
  return link;
}
const ImageIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86-3 3.87L9 13.14 6 17h12l-3.86-5.14z" }),
  "ImageOutlined"
);
function CrupdatePlaylistFields() {
  const { trans } = useTrans();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "md:flex gap-28", children: [
      /* @__PURE__ */ jsx(FileUploadProvider, { children: /* @__PURE__ */ jsx(
        FormImageSelector,
        {
          name: "image",
          diskPrefix: "playlist_media",
          variant: "square",
          previewSize: "w-160 h-160",
          className: "mb-24 md:mb-0",
          placeholderIcon: /* @__PURE__ */ jsx(ImageIcon, {}),
          showRemoveButton: true,
          stretchPreview: true
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-auto mb-34", children: [
        /* @__PURE__ */ jsx(
          FormTextField,
          {
            autoFocus: true,
            name: "name",
            label: /* @__PURE__ */ jsx(Trans, { message: "Name" }),
            className: "mb-24"
          }
        ),
        /* @__PURE__ */ jsx(
          FormSwitch,
          {
            name: "collaborative",
            description: /* @__PURE__ */ jsx(Trans, { message: "Invite other users to add tracks." }),
            className: "mb-24",
            children: /* @__PURE__ */ jsx(Trans, { message: "Collaborative" })
          }
        ),
        /* @__PURE__ */ jsx(
          FormSwitch,
          {
            name: "public",
            description: /* @__PURE__ */ jsx(Trans, { message: "Everyone can see public playlists." }),
            children: /* @__PURE__ */ jsx(Trans, { message: "Public" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        name: "description",
        label: /* @__PURE__ */ jsx(Trans, { message: "Description" }),
        inputElementType: "textarea",
        rows: 4,
        placeholder: trans(message("Give your playlist a catchy description."))
      }
    )
  ] });
}
function useUpdatePlaylist({
  form,
  playlistId
} = {}) {
  const params = useParams();
  if (params.playlistId && !playlistId) {
    playlistId = params.playlistId;
  }
  return useMutation({
    mutationFn: (props) => updatePlaylist(playlistId, props),
    onSuccess: () => {
      toast(message("Playlist updated"));
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
    onError: (r) => form ? onFormQueryError(r, form) : showHttpErrorToast(r)
  });
}
function updatePlaylist(playlistId, payload) {
  return apiClient.put(`playlists/${playlistId}`, payload).then((r) => r.data);
}
function UpdatePlaylistDialog({ playlist }) {
  const { close, formId } = useDialogContext();
  const form = useForm({
    defaultValues: {
      name: playlist.name,
      public: playlist.public,
      collaborative: playlist.collaborative,
      image: playlist.image,
      description: playlist.description
    }
  });
  const updatePlaylist2 = useUpdatePlaylist({ form, playlistId: playlist.id });
  return /* @__PURE__ */ jsxs(Dialog, { size: "xl", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Update playlist" }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsx(
      Form,
      {
        id: formId,
        form,
        onSubmit: (values) => {
          updatePlaylist2.mutate(values, {
            onSuccess: (response) => {
              close(response.playlist);
            }
          });
        },
        children: /* @__PURE__ */ jsx(CrupdatePlaylistFields, {})
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { onClick: () => close(), children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" }) }),
      /* @__PURE__ */ jsx(
        Button,
        {
          form: formId,
          type: "submit",
          variant: "flat",
          color: "primary",
          disabled: updatePlaylist2.isPending,
          children: /* @__PURE__ */ jsx(Trans, { message: "Update" })
        }
      )
    ] })
  ] });
}
function useCreatePlaylist(form) {
  return useMutation({
    mutationFn: (props) => createPlaylist(props),
    onSuccess: () => {
      toast(message("Playlist created"));
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
    onError: (r) => onFormQueryError(r, form)
  });
}
function createPlaylist(payload) {
  return apiClient.post("playlists", payload).then((r) => r.data);
}
function CreatePlaylistDialog() {
  const { close, formId } = useDialogContext();
  const form = useForm();
  const createPlaylist2 = useCreatePlaylist(form);
  return /* @__PURE__ */ jsxs(Dialog, { size: "xl", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "New playlist" }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsx(
      Form,
      {
        id: formId,
        form,
        onSubmit: (values) => {
          createPlaylist2.mutate(values, {
            onSuccess: (response) => {
              close(response.playlist);
            }
          });
        },
        children: /* @__PURE__ */ jsx(CrupdatePlaylistFields, {})
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { onClick: () => close(), children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" }) }),
      /* @__PURE__ */ jsx(
        Button,
        {
          form: formId,
          type: "submit",
          variant: "flat",
          color: "primary",
          disabled: createPlaylist2.isPending,
          children: /* @__PURE__ */ jsx(Trans, { message: "Create" })
        }
      )
    ] })
  ] });
}
const PLAYLIST_MODEL = "playlist";
function useDeleteComments() {
  return useMutation({
    mutationFn: (payload) => deleteComments(payload),
    onSuccess: (response, payload) => {
      toast(
        message("[one Comment deleted|other Deleted :count comments]", {
          values: { count: payload.commentIds.length }
        })
      );
    },
    onError: (err) => showHttpErrorToast(err)
  });
}
function deleteComments({ commentIds }) {
  return apiClient.delete(`comment/${commentIds.join(",")}`).then((r) => r.data);
}
const TrendingUpIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "m16 6 2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" }),
  "TrendingUpOutlined"
);
const CHANNEL_MODEL = "channel";
const GridViewIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z" }),
  "GridViewOutlined"
);
function useIsTouchDevice() {
  return useMediaQuery("((pointer: coarse))");
}
function useChannelQueryParams(channel, userParams) {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { encodedFilters } = useBackendFilterUrlParams();
  const queryParams = {
    ...userParams,
    restriction: params.restriction || "",
    order: searchParams.get("order"),
    [BackendFiltersUrlKey]: encodedFilters,
    paginate: "simple"
  };
  if (!queryParams.order && channel) {
    queryParams.order = channel.config.contentOrder || "popularity:desc";
  }
  return queryParams;
}
function useChannel(slugOrId, loader, userParams) {
  const params = useParams();
  const channelId = slugOrId || params.slugOrId;
  const queryParams = useChannelQueryParams(void 0, userParams);
  return useQuery({
    // only refetch when channel ID or restriction changes and not query params.
    // content will be re-fetched in channel content components
    // on SSR use query params as well, to avoid caching wrong data when query params change
    queryKey: channelQueryKey(channelId, queryParams),
    queryFn: () => fetchChannel(channelId, { ...queryParams, loader }),
    initialData: () => {
      var _a, _b;
      const data = (_a = getBootstrapData().loaders) == null ? void 0 : _a[loader];
      const isSameChannel = (data == null ? void 0 : data.channel.id) == channelId || (data == null ? void 0 : data.channel.slug) == channelId;
      const isSameRestriction = !queryParams.restriction || ((_b = data == null ? void 0 : data.channel.restriction) == null ? void 0 : _b.name) === queryParams.restriction;
      if (isSameChannel && isSameRestriction) {
        return data;
      }
    }
  });
}
function channelQueryKey(slugOrId, params) {
  return ["channel", `${slugOrId}`, params];
}
function channelEndpoint(slugOrId) {
  return `channel/${slugOrId}`;
}
function fetchChannel(slugOrId, params = {}) {
  return apiClient.get(channelEndpoint(slugOrId), { params }).then((response) => response.data);
}
export {
  ARTIST_MODEL as A,
  BackendFiltersUrlKey as B,
  CreatePlaylistDialog as C,
  DashboardLayoutContext as D,
  EMPTY_PAGINATION_RESPONSE as E,
  FormSlider as F,
  GenreLink as G,
  ImageZoomDialog as I,
  MoreVertIcon as M,
  NameWithAvatar as N,
  PauseIcon as P,
  Slider as S,
  TRACK_MODEL as T,
  USER_MODEL as U,
  DashboardLayout as a,
  DashboardSidenav as b,
  DashboardContent as c,
  downloadFileFromUrl as d,
  usePrevious as e,
  artistPageTabs as f,
  PLAYLIST_MODEL as g,
  hasNextPage as h,
  PlaylistLink as i,
  UpdatePlaylistDialog as j,
  useDeleteComments as k,
  TrendingUpIcon as l,
  CHANNEL_MODEL as m,
  GridViewIcon as n,
  ImageIcon as o,
  useIsTouchDevice as p,
  useChannel as q,
  getPlaylistLink as r,
  getGenreLink as s,
  useUpdatePlaylist as t,
  useBackendFilterUrlParams as u,
  useChannelQueryParams as v,
  channelQueryKey as w,
  channelEndpoint as x,
  NameWithAvatarPlaceholder as y,
  useSlider as z
};
//# sourceMappingURL=use-channel-f6833f7b.mjs.map
