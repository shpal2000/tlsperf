import { n as noop, a as safe_not_equal, c as create_ssr_component, b as subscribe, d as createEventDispatcher, e as escape, v as validate_component, f as compute_rest_props, g as spread, h as escape_object, i as add_attribute, j as add_classes, k as each, l as is_promise, o as set_store_value } from "../../chunks/index-a9021a4f.js";
const subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
const selectedNode = writable({
  Name: "",
  ParentName: "",
  Type: ""
});
const nodeTreeRoot = writable({
  Name: "Traffic Nodes",
  expanded: false,
  MenuItems: ["Error!"],
  children: []
});
const profileTreeRoot = writable({
  Name: "Traffic Profiles",
  expanded: false,
  MenuItems: ["Error!"],
  children: []
});
const ClosedIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="${"http://www.w3.org/2000/svg"}" width="${"24"}" height="${"24"}" viewBox="${"0 0 24 24"}" fill="${"none"}" stroke="${"currentColor"}" stroke-width="${"2"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-chevron-right"}"><polyline points="${"9 18 15 12 9 6"}"></polyline></svg>`;
});
const OpenedIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="${"http://www.w3.org/2000/svg"}" width="${"24"}" height="${"24"}" viewBox="${"0 0 24 24"}" fill="${"none"}" stroke="${"currentColor"}" stroke-width="${"2"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-chevron-down"}"><polyline points="${"6 9 12 15 18 9"}"></polyline></svg>`;
});
const CircleIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="${"http://www.w3.org/2000/svg"}" width="${"24"}" height="${"24"}" viewBox="${"0 0 24 24"}" fill="${"none"}" stroke="${"currentColor"}" stroke-width="${"2"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-chevron-right"}"><rect x="${"5"}" y="${"8"}" width="${"8"}" height="${"8"}" fill="${"grey"}"></rect></svg>`;
});
var Treenode_svelte_svelte_type_style_lang = "";
const css$6 = {
  code: ".selected.svelte-1xfyu03{background-color:darkgray;color:white}li.svelte-1xfyu03{border-bottom:solid 0px aliceblue;margin:0 0;padding:0.60rem;display:flex;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}",
  map: null
};
const Treenode = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $selectedNode, $$unsubscribe_selectedNode;
  $$unsubscribe_selectedNode = subscribe(selectedNode, (value) => $selectedNode = value);
  let { node } = $$props;
  let { pnode } = $$props;
  let { type } = $$props;
  let { level } = $$props;
  createEventDispatcher();
  if ($$props.node === void 0 && $$bindings.node && node !== void 0)
    $$bindings.node(node);
  if ($$props.pnode === void 0 && $$bindings.pnode && pnode !== void 0)
    $$bindings.pnode(pnode);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.level === void 0 && $$bindings.level && level !== void 0)
    $$bindings.level(level);
  $$result.css.add(css$6);
  $$unsubscribe_selectedNode();
  return `<li style="${"padding-left:" + escape(level * 1) + "rem"}" class="${[
    "svelte-1xfyu03",
    $selectedNode.Name == node.Name && $selectedNode.ParentName == pnode.Name && $selectedNode.Type == type ? "selected" : ""
  ].join(" ").trim()}">${node.children ? `${!node.expanded ? `${validate_component(ClosedIcon, "ClosedIcon").$$render($$result, {}, {}, {})} ${escape(node.Name)}` : `${validate_component(OpenedIcon, "OpenedIcon").$$render($$result, {}, {}, {})} ${escape(node.Name)}`}` : `${validate_component(CircleIcon, "CircleIcon").$$render($$result, {}, {}, {})} ${escape(node.Name)}`}</li>

${``}`;
});
const HOOKS = [
  "onChange",
  "onClose",
  "onDayCreate",
  "onDestroy",
  "onKeyDown",
  "onMonthChange",
  "onOpen",
  "onParseConfig",
  "onReady",
  "onValueUpdate",
  "onYearChange",
  "onPreCalendarPosition"
];
const defaults = {
  _disable: [],
  allowInput: false,
  allowInvalidPreload: false,
  altFormat: "F j, Y",
  altInput: false,
  altInputClass: "form-control input",
  animate: typeof window === "object" && window.navigator.userAgent.indexOf("MSIE") === -1,
  ariaDateFormat: "F j, Y",
  autoFillDefaultTime: true,
  clickOpens: true,
  closeOnSelect: true,
  conjunction: ", ",
  dateFormat: "Y-m-d",
  defaultHour: 12,
  defaultMinute: 0,
  defaultSeconds: 0,
  disable: [],
  disableMobile: false,
  enableSeconds: false,
  enableTime: false,
  errorHandler: (err) => typeof console !== "undefined" && console.warn(err),
  getWeek: (givenDate) => {
    const date = new Date(givenDate.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    var week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 864e5 - 3 + (week1.getDay() + 6) % 7) / 7);
  },
  hourIncrement: 1,
  ignoredFocusElements: [],
  inline: false,
  locale: "default",
  minuteIncrement: 5,
  mode: "single",
  monthSelectorType: "dropdown",
  nextArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",
  noCalendar: false,
  now: new Date(),
  onChange: [],
  onClose: [],
  onDayCreate: [],
  onDestroy: [],
  onKeyDown: [],
  onMonthChange: [],
  onOpen: [],
  onParseConfig: [],
  onReady: [],
  onValueUpdate: [],
  onYearChange: [],
  onPreCalendarPosition: [],
  plugins: [],
  position: "auto",
  positionElement: void 0,
  prevArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
  shorthandCurrentMonth: false,
  showMonths: 1,
  static: false,
  time_24hr: false,
  weekNumbers: false,
  wrap: false
};
const english = {
  weekdays: {
    shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    longhand: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ]
  },
  months: {
    shorthand: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    longhand: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]
  },
  daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  firstDayOfWeek: 0,
  ordinal: (nth) => {
    const s = nth % 100;
    if (s > 3 && s < 21)
      return "th";
    switch (s % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  },
  rangeSeparator: " to ",
  weekAbbreviation: "Wk",
  scrollTitle: "Scroll to increment",
  toggleTitle: "Click to toggle",
  amPM: ["AM", "PM"],
  yearAriaLabel: "Year",
  monthAriaLabel: "Month",
  hourAriaLabel: "Hour",
  minuteAriaLabel: "Minute",
  time_24hr: false
};
const pad = (number, length = 2) => `000${number}`.slice(length * -1);
const int = (bool) => bool === true ? 1 : 0;
function debounce(fn, wait) {
  let t;
  return function() {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, arguments), wait);
  };
}
const arrayify = (obj) => obj instanceof Array ? obj : [obj];
function toggleClass(elem, className, bool) {
  if (bool === true)
    return elem.classList.add(className);
  elem.classList.remove(className);
}
function createElement(tag, className, content) {
  const e = window.document.createElement(tag);
  className = className || "";
  content = content || "";
  e.className = className;
  if (content !== void 0)
    e.textContent = content;
  return e;
}
function clearNode(node) {
  while (node.firstChild)
    node.removeChild(node.firstChild);
}
function findParent(node, condition) {
  if (condition(node))
    return node;
  else if (node.parentNode)
    return findParent(node.parentNode, condition);
  return void 0;
}
function createNumberInput(inputClassName, opts) {
  const wrapper = createElement("div", "numInputWrapper"), numInput = createElement("input", "numInput " + inputClassName), arrowUp = createElement("span", "arrowUp"), arrowDown = createElement("span", "arrowDown");
  if (navigator.userAgent.indexOf("MSIE 9.0") === -1) {
    numInput.type = "number";
  } else {
    numInput.type = "text";
    numInput.pattern = "\\d*";
  }
  if (opts !== void 0)
    for (const key in opts)
      numInput.setAttribute(key, opts[key]);
  wrapper.appendChild(numInput);
  wrapper.appendChild(arrowUp);
  wrapper.appendChild(arrowDown);
  return wrapper;
}
function getEventTarget(event) {
  try {
    if (typeof event.composedPath === "function") {
      const path = event.composedPath();
      return path[0];
    }
    return event.target;
  } catch (error) {
    return event.target;
  }
}
const doNothing = () => void 0;
const monthToStr = (monthNumber, shorthand, locale) => locale.months[shorthand ? "shorthand" : "longhand"][monthNumber];
const revFormat = {
  D: doNothing,
  F: function(dateObj, monthName, locale) {
    dateObj.setMonth(locale.months.longhand.indexOf(monthName));
  },
  G: (dateObj, hour) => {
    dateObj.setHours(parseFloat(hour));
  },
  H: (dateObj, hour) => {
    dateObj.setHours(parseFloat(hour));
  },
  J: (dateObj, day) => {
    dateObj.setDate(parseFloat(day));
  },
  K: (dateObj, amPM, locale) => {
    dateObj.setHours(dateObj.getHours() % 12 + 12 * int(new RegExp(locale.amPM[1], "i").test(amPM)));
  },
  M: function(dateObj, shortMonth, locale) {
    dateObj.setMonth(locale.months.shorthand.indexOf(shortMonth));
  },
  S: (dateObj, seconds) => {
    dateObj.setSeconds(parseFloat(seconds));
  },
  U: (_, unixSeconds) => new Date(parseFloat(unixSeconds) * 1e3),
  W: function(dateObj, weekNum, locale) {
    const weekNumber = parseInt(weekNum);
    const date = new Date(dateObj.getFullYear(), 0, 2 + (weekNumber - 1) * 7, 0, 0, 0, 0);
    date.setDate(date.getDate() - date.getDay() + locale.firstDayOfWeek);
    return date;
  },
  Y: (dateObj, year) => {
    dateObj.setFullYear(parseFloat(year));
  },
  Z: (_, ISODate) => new Date(ISODate),
  d: (dateObj, day) => {
    dateObj.setDate(parseFloat(day));
  },
  h: (dateObj, hour) => {
    dateObj.setHours(parseFloat(hour));
  },
  i: (dateObj, minutes) => {
    dateObj.setMinutes(parseFloat(minutes));
  },
  j: (dateObj, day) => {
    dateObj.setDate(parseFloat(day));
  },
  l: doNothing,
  m: (dateObj, month) => {
    dateObj.setMonth(parseFloat(month) - 1);
  },
  n: (dateObj, month) => {
    dateObj.setMonth(parseFloat(month) - 1);
  },
  s: (dateObj, seconds) => {
    dateObj.setSeconds(parseFloat(seconds));
  },
  u: (_, unixMillSeconds) => new Date(parseFloat(unixMillSeconds)),
  w: doNothing,
  y: (dateObj, year) => {
    dateObj.setFullYear(2e3 + parseFloat(year));
  }
};
const tokenRegex = {
  D: "(\\w+)",
  F: "(\\w+)",
  G: "(\\d\\d|\\d)",
  H: "(\\d\\d|\\d)",
  J: "(\\d\\d|\\d)\\w+",
  K: "",
  M: "(\\w+)",
  S: "(\\d\\d|\\d)",
  U: "(.+)",
  W: "(\\d\\d|\\d)",
  Y: "(\\d{4})",
  Z: "(.+)",
  d: "(\\d\\d|\\d)",
  h: "(\\d\\d|\\d)",
  i: "(\\d\\d|\\d)",
  j: "(\\d\\d|\\d)",
  l: "(\\w+)",
  m: "(\\d\\d|\\d)",
  n: "(\\d\\d|\\d)",
  s: "(\\d\\d|\\d)",
  u: "(.+)",
  w: "(\\d\\d|\\d)",
  y: "(\\d{2})"
};
const formats = {
  Z: (date) => date.toISOString(),
  D: function(date, locale, options) {
    return locale.weekdays.shorthand[formats.w(date, locale, options)];
  },
  F: function(date, locale, options) {
    return monthToStr(formats.n(date, locale, options) - 1, false, locale);
  },
  G: function(date, locale, options) {
    return pad(formats.h(date, locale, options));
  },
  H: (date) => pad(date.getHours()),
  J: function(date, locale) {
    return locale.ordinal !== void 0 ? date.getDate() + locale.ordinal(date.getDate()) : date.getDate();
  },
  K: (date, locale) => locale.amPM[int(date.getHours() > 11)],
  M: function(date, locale) {
    return monthToStr(date.getMonth(), true, locale);
  },
  S: (date) => pad(date.getSeconds()),
  U: (date) => date.getTime() / 1e3,
  W: function(date, _, options) {
    return options.getWeek(date);
  },
  Y: (date) => pad(date.getFullYear(), 4),
  d: (date) => pad(date.getDate()),
  h: (date) => date.getHours() % 12 ? date.getHours() % 12 : 12,
  i: (date) => pad(date.getMinutes()),
  j: (date) => date.getDate(),
  l: function(date, locale) {
    return locale.weekdays.longhand[date.getDay()];
  },
  m: (date) => pad(date.getMonth() + 1),
  n: (date) => date.getMonth() + 1,
  s: (date) => date.getSeconds(),
  u: (date) => date.getTime(),
  w: (date) => date.getDay(),
  y: (date) => String(date.getFullYear()).substring(2)
};
const createDateFormatter = ({ config = defaults, l10n = english, isMobile = false }) => (dateObj, frmt, overrideLocale) => {
  const locale = overrideLocale || l10n;
  if (config.formatDate !== void 0 && !isMobile) {
    return config.formatDate(dateObj, frmt, locale);
  }
  return frmt.split("").map((c, i, arr) => formats[c] && arr[i - 1] !== "\\" ? formats[c](dateObj, locale, config) : c !== "\\" ? c : "").join("");
};
const createDateParser = ({ config = defaults, l10n = english }) => (date, givenFormat, timeless, customLocale) => {
  if (date !== 0 && !date)
    return void 0;
  const locale = customLocale || l10n;
  let parsedDate;
  const dateOrig = date;
  if (date instanceof Date)
    parsedDate = new Date(date.getTime());
  else if (typeof date !== "string" && date.toFixed !== void 0)
    parsedDate = new Date(date);
  else if (typeof date === "string") {
    const format = givenFormat || (config || defaults).dateFormat;
    const datestr = String(date).trim();
    if (datestr === "today") {
      parsedDate = new Date();
      timeless = true;
    } else if (/Z$/.test(datestr) || /GMT$/.test(datestr))
      parsedDate = new Date(date);
    else if (config && config.parseDate)
      parsedDate = config.parseDate(date, format);
    else {
      parsedDate = !config || !config.noCalendar ? new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0) : new Date(new Date().setHours(0, 0, 0, 0));
      let matched, ops = [];
      for (let i = 0, matchIndex = 0, regexStr = ""; i < format.length; i++) {
        const token = format[i];
        const isBackSlash = token === "\\";
        const escaped = format[i - 1] === "\\" || isBackSlash;
        if (tokenRegex[token] && !escaped) {
          regexStr += tokenRegex[token];
          const match = new RegExp(regexStr).exec(date);
          if (match && (matched = true)) {
            ops[token !== "Y" ? "push" : "unshift"]({
              fn: revFormat[token],
              val: match[++matchIndex]
            });
          }
        } else if (!isBackSlash)
          regexStr += ".";
        ops.forEach(({ fn, val }) => parsedDate = fn(parsedDate, val, locale) || parsedDate);
      }
      parsedDate = matched ? parsedDate : void 0;
    }
  }
  if (!(parsedDate instanceof Date && !isNaN(parsedDate.getTime()))) {
    config.errorHandler(new Error(`Invalid date provided: ${dateOrig}`));
    return void 0;
  }
  if (timeless === true)
    parsedDate.setHours(0, 0, 0, 0);
  return parsedDate;
};
function compareDates(date1, date2, timeless = true) {
  if (timeless !== false) {
    return new Date(date1.getTime()).setHours(0, 0, 0, 0) - new Date(date2.getTime()).setHours(0, 0, 0, 0);
  }
  return date1.getTime() - date2.getTime();
}
const isBetween = (ts, ts1, ts2) => {
  return ts > Math.min(ts1, ts2) && ts < Math.max(ts1, ts2);
};
const duration = {
  DAY: 864e5
};
function getDefaultHours(config) {
  let hours = config.defaultHour;
  let minutes = config.defaultMinute;
  let seconds = config.defaultSeconds;
  if (config.minDate !== void 0) {
    const minHour = config.minDate.getHours();
    const minMinutes = config.minDate.getMinutes();
    const minSeconds = config.minDate.getSeconds();
    if (hours < minHour) {
      hours = minHour;
    }
    if (hours === minHour && minutes < minMinutes) {
      minutes = minMinutes;
    }
    if (hours === minHour && minutes === minMinutes && seconds < minSeconds)
      seconds = config.minDate.getSeconds();
  }
  if (config.maxDate !== void 0) {
    const maxHr = config.maxDate.getHours();
    const maxMinutes = config.maxDate.getMinutes();
    hours = Math.min(hours, maxHr);
    if (hours === maxHr)
      minutes = Math.min(maxMinutes, minutes);
    if (hours === maxHr && minutes === maxMinutes)
      seconds = config.maxDate.getSeconds();
  }
  return { hours, minutes, seconds };
}
if (typeof Object.assign !== "function") {
  Object.assign = function(target, ...args) {
    if (!target) {
      throw TypeError("Cannot convert undefined or null to object");
    }
    for (const source of args) {
      if (source) {
        Object.keys(source).forEach((key) => target[key] = source[key]);
      }
    }
    return target;
  };
}
const DEBOUNCED_CHANGE_MS = 300;
function FlatpickrInstance(element, instanceConfig) {
  const self = {
    config: Object.assign(Object.assign({}, defaults), flatpickr.defaultConfig),
    l10n: english
  };
  self.parseDate = createDateParser({ config: self.config, l10n: self.l10n });
  self._handlers = [];
  self.pluginElements = [];
  self.loadedPlugins = [];
  self._bind = bind;
  self._setHoursFromDate = setHoursFromDate;
  self._positionCalendar = positionCalendar;
  self.changeMonth = changeMonth;
  self.changeYear = changeYear;
  self.clear = clear;
  self.close = close;
  self._createElement = createElement;
  self.destroy = destroy;
  self.isEnabled = isEnabled;
  self.jumpToDate = jumpToDate;
  self.open = open;
  self.redraw = redraw;
  self.set = set;
  self.setDate = setDate;
  self.toggle = toggle;
  function setupHelperFunctions() {
    self.utils = {
      getDaysInMonth(month = self.currentMonth, yr = self.currentYear) {
        if (month === 1 && (yr % 4 === 0 && yr % 100 !== 0 || yr % 400 === 0))
          return 29;
        return self.l10n.daysInMonth[month];
      }
    };
  }
  function init() {
    self.element = self.input = element;
    self.isOpen = false;
    parseConfig();
    setupLocale();
    setupInputs();
    setupDates();
    setupHelperFunctions();
    if (!self.isMobile)
      build();
    bindEvents();
    if (self.selectedDates.length || self.config.noCalendar) {
      if (self.config.enableTime) {
        setHoursFromDate(self.config.noCalendar ? self.latestSelectedDateObj : void 0);
      }
      updateValue(false);
    }
    setCalendarWidth();
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (!self.isMobile && isSafari) {
      positionCalendar();
    }
    triggerEvent("onReady");
  }
  function bindToInstance(fn) {
    return fn.bind(self);
  }
  function setCalendarWidth() {
    const config = self.config;
    if (config.weekNumbers === false && config.showMonths === 1) {
      return;
    } else if (config.noCalendar !== true) {
      window.requestAnimationFrame(function() {
        if (self.calendarContainer !== void 0) {
          self.calendarContainer.style.visibility = "hidden";
          self.calendarContainer.style.display = "block";
        }
        if (self.daysContainer !== void 0) {
          const daysWidth = (self.days.offsetWidth + 1) * config.showMonths;
          self.daysContainer.style.width = daysWidth + "px";
          self.calendarContainer.style.width = daysWidth + (self.weekWrapper !== void 0 ? self.weekWrapper.offsetWidth : 0) + "px";
          self.calendarContainer.style.removeProperty("visibility");
          self.calendarContainer.style.removeProperty("display");
        }
      });
    }
  }
  function updateTime(e) {
    if (self.selectedDates.length === 0) {
      const defaultDate = self.config.minDate === void 0 || compareDates(new Date(), self.config.minDate) >= 0 ? new Date() : new Date(self.config.minDate.getTime());
      const defaults2 = getDefaultHours(self.config);
      defaultDate.setHours(defaults2.hours, defaults2.minutes, defaults2.seconds, defaultDate.getMilliseconds());
      self.selectedDates = [defaultDate];
      self.latestSelectedDateObj = defaultDate;
    }
    if (e !== void 0 && e.type !== "blur") {
      timeWrapper(e);
    }
    const prevValue = self._input.value;
    setHoursFromInputs();
    updateValue();
    if (self._input.value !== prevValue) {
      self._debouncedChange();
    }
  }
  function ampm2military(hour, amPM) {
    return hour % 12 + 12 * int(amPM === self.l10n.amPM[1]);
  }
  function military2ampm(hour) {
    switch (hour % 24) {
      case 0:
      case 12:
        return 12;
      default:
        return hour % 12;
    }
  }
  function setHoursFromInputs() {
    if (self.hourElement === void 0 || self.minuteElement === void 0)
      return;
    let hours = (parseInt(self.hourElement.value.slice(-2), 10) || 0) % 24, minutes = (parseInt(self.minuteElement.value, 10) || 0) % 60, seconds = self.secondElement !== void 0 ? (parseInt(self.secondElement.value, 10) || 0) % 60 : 0;
    if (self.amPM !== void 0) {
      hours = ampm2military(hours, self.amPM.textContent);
    }
    const limitMinHours = self.config.minTime !== void 0 || self.config.minDate && self.minDateHasTime && self.latestSelectedDateObj && compareDates(self.latestSelectedDateObj, self.config.minDate, true) === 0;
    const limitMaxHours = self.config.maxTime !== void 0 || self.config.maxDate && self.maxDateHasTime && self.latestSelectedDateObj && compareDates(self.latestSelectedDateObj, self.config.maxDate, true) === 0;
    if (limitMaxHours) {
      const maxTime = self.config.maxTime !== void 0 ? self.config.maxTime : self.config.maxDate;
      hours = Math.min(hours, maxTime.getHours());
      if (hours === maxTime.getHours())
        minutes = Math.min(minutes, maxTime.getMinutes());
      if (minutes === maxTime.getMinutes())
        seconds = Math.min(seconds, maxTime.getSeconds());
    }
    if (limitMinHours) {
      const minTime = self.config.minTime !== void 0 ? self.config.minTime : self.config.minDate;
      hours = Math.max(hours, minTime.getHours());
      if (hours === minTime.getHours() && minutes < minTime.getMinutes())
        minutes = minTime.getMinutes();
      if (minutes === minTime.getMinutes())
        seconds = Math.max(seconds, minTime.getSeconds());
    }
    setHours(hours, minutes, seconds);
  }
  function setHoursFromDate(dateObj) {
    const date = dateObj || self.latestSelectedDateObj;
    if (date) {
      setHours(date.getHours(), date.getMinutes(), date.getSeconds());
    }
  }
  function setHours(hours, minutes, seconds) {
    if (self.latestSelectedDateObj !== void 0) {
      self.latestSelectedDateObj.setHours(hours % 24, minutes, seconds || 0, 0);
    }
    if (!self.hourElement || !self.minuteElement || self.isMobile)
      return;
    self.hourElement.value = pad(!self.config.time_24hr ? (12 + hours) % 12 + 12 * int(hours % 12 === 0) : hours);
    self.minuteElement.value = pad(minutes);
    if (self.amPM !== void 0)
      self.amPM.textContent = self.l10n.amPM[int(hours >= 12)];
    if (self.secondElement !== void 0)
      self.secondElement.value = pad(seconds);
  }
  function onYearInput(event) {
    const eventTarget = getEventTarget(event);
    const year = parseInt(eventTarget.value) + (event.delta || 0);
    if (year / 1e3 > 1 || event.key === "Enter" && !/[^\d]/.test(year.toString())) {
      changeYear(year);
    }
  }
  function bind(element2, event, handler, options) {
    if (event instanceof Array)
      return event.forEach((ev) => bind(element2, ev, handler, options));
    if (element2 instanceof Array)
      return element2.forEach((el) => bind(el, event, handler, options));
    element2.addEventListener(event, handler, options);
    self._handlers.push({
      remove: () => element2.removeEventListener(event, handler)
    });
  }
  function triggerChange() {
    triggerEvent("onChange");
  }
  function bindEvents() {
    if (self.config.wrap) {
      ["open", "close", "toggle", "clear"].forEach((evt) => {
        Array.prototype.forEach.call(self.element.querySelectorAll(`[data-${evt}]`), (el) => bind(el, "click", self[evt]));
      });
    }
    if (self.isMobile) {
      setupMobile();
      return;
    }
    const debouncedResize = debounce(onResize, 50);
    self._debouncedChange = debounce(triggerChange, DEBOUNCED_CHANGE_MS);
    if (self.daysContainer && !/iPhone|iPad|iPod/i.test(navigator.userAgent))
      bind(self.daysContainer, "mouseover", (e) => {
        if (self.config.mode === "range")
          onMouseOver(getEventTarget(e));
      });
    bind(window.document.body, "keydown", onKeyDown);
    if (!self.config.inline && !self.config.static)
      bind(window, "resize", debouncedResize);
    if (window.ontouchstart !== void 0)
      bind(window.document, "touchstart", documentClick);
    else
      bind(window.document, "mousedown", documentClick);
    bind(window.document, "focus", documentClick, { capture: true });
    if (self.config.clickOpens === true) {
      bind(self._input, "focus", self.open);
      bind(self._input, "click", self.open);
    }
    if (self.daysContainer !== void 0) {
      bind(self.monthNav, "click", onMonthNavClick);
      bind(self.monthNav, ["keyup", "increment"], onYearInput);
      bind(self.daysContainer, "click", selectDate);
    }
    if (self.timeContainer !== void 0 && self.minuteElement !== void 0 && self.hourElement !== void 0) {
      const selText = (e) => getEventTarget(e).select();
      bind(self.timeContainer, ["increment"], updateTime);
      bind(self.timeContainer, "blur", updateTime, { capture: true });
      bind(self.timeContainer, "click", timeIncrement);
      bind([self.hourElement, self.minuteElement], ["focus", "click"], selText);
      if (self.secondElement !== void 0)
        bind(self.secondElement, "focus", () => self.secondElement && self.secondElement.select());
      if (self.amPM !== void 0) {
        bind(self.amPM, "click", (e) => {
          updateTime(e);
          triggerChange();
        });
      }
    }
    if (self.config.allowInput) {
      bind(self._input, "blur", onBlur);
    }
  }
  function jumpToDate(jumpDate, triggerChange2) {
    const jumpTo = jumpDate !== void 0 ? self.parseDate(jumpDate) : self.latestSelectedDateObj || (self.config.minDate && self.config.minDate > self.now ? self.config.minDate : self.config.maxDate && self.config.maxDate < self.now ? self.config.maxDate : self.now);
    const oldYear = self.currentYear;
    const oldMonth = self.currentMonth;
    try {
      if (jumpTo !== void 0) {
        self.currentYear = jumpTo.getFullYear();
        self.currentMonth = jumpTo.getMonth();
      }
    } catch (e) {
      e.message = "Invalid date supplied: " + jumpTo;
      self.config.errorHandler(e);
    }
    if (triggerChange2 && self.currentYear !== oldYear) {
      triggerEvent("onYearChange");
      buildMonthSwitch();
    }
    if (triggerChange2 && (self.currentYear !== oldYear || self.currentMonth !== oldMonth)) {
      triggerEvent("onMonthChange");
    }
    self.redraw();
  }
  function timeIncrement(e) {
    const eventTarget = getEventTarget(e);
    if (~eventTarget.className.indexOf("arrow"))
      incrementNumInput(e, eventTarget.classList.contains("arrowUp") ? 1 : -1);
  }
  function incrementNumInput(e, delta, inputElem) {
    const target = e && getEventTarget(e);
    const input = inputElem || target && target.parentNode && target.parentNode.firstChild;
    const event = createEvent("increment");
    event.delta = delta;
    input && input.dispatchEvent(event);
  }
  function build() {
    const fragment = window.document.createDocumentFragment();
    self.calendarContainer = createElement("div", "flatpickr-calendar");
    self.calendarContainer.tabIndex = -1;
    if (!self.config.noCalendar) {
      fragment.appendChild(buildMonthNav());
      self.innerContainer = createElement("div", "flatpickr-innerContainer");
      if (self.config.weekNumbers) {
        const { weekWrapper, weekNumbers } = buildWeeks();
        self.innerContainer.appendChild(weekWrapper);
        self.weekNumbers = weekNumbers;
        self.weekWrapper = weekWrapper;
      }
      self.rContainer = createElement("div", "flatpickr-rContainer");
      self.rContainer.appendChild(buildWeekdays());
      if (!self.daysContainer) {
        self.daysContainer = createElement("div", "flatpickr-days");
        self.daysContainer.tabIndex = -1;
      }
      buildDays();
      self.rContainer.appendChild(self.daysContainer);
      self.innerContainer.appendChild(self.rContainer);
      fragment.appendChild(self.innerContainer);
    }
    if (self.config.enableTime) {
      fragment.appendChild(buildTime());
    }
    toggleClass(self.calendarContainer, "rangeMode", self.config.mode === "range");
    toggleClass(self.calendarContainer, "animate", self.config.animate === true);
    toggleClass(self.calendarContainer, "multiMonth", self.config.showMonths > 1);
    self.calendarContainer.appendChild(fragment);
    const customAppend = self.config.appendTo !== void 0 && self.config.appendTo.nodeType !== void 0;
    if (self.config.inline || self.config.static) {
      self.calendarContainer.classList.add(self.config.inline ? "inline" : "static");
      if (self.config.inline) {
        if (!customAppend && self.element.parentNode)
          self.element.parentNode.insertBefore(self.calendarContainer, self._input.nextSibling);
        else if (self.config.appendTo !== void 0)
          self.config.appendTo.appendChild(self.calendarContainer);
      }
      if (self.config.static) {
        const wrapper = createElement("div", "flatpickr-wrapper");
        if (self.element.parentNode)
          self.element.parentNode.insertBefore(wrapper, self.element);
        wrapper.appendChild(self.element);
        if (self.altInput)
          wrapper.appendChild(self.altInput);
        wrapper.appendChild(self.calendarContainer);
      }
    }
    if (!self.config.static && !self.config.inline)
      (self.config.appendTo !== void 0 ? self.config.appendTo : window.document.body).appendChild(self.calendarContainer);
  }
  function createDay(className, date, dayNumber, i) {
    const dateIsEnabled = isEnabled(date, true), dayElement = createElement("span", "flatpickr-day " + className, date.getDate().toString());
    dayElement.dateObj = date;
    dayElement.$i = i;
    dayElement.setAttribute("aria-label", self.formatDate(date, self.config.ariaDateFormat));
    if (className.indexOf("hidden") === -1 && compareDates(date, self.now) === 0) {
      self.todayDateElem = dayElement;
      dayElement.classList.add("today");
      dayElement.setAttribute("aria-current", "date");
    }
    if (dateIsEnabled) {
      dayElement.tabIndex = -1;
      if (isDateSelected(date)) {
        dayElement.classList.add("selected");
        self.selectedDateElem = dayElement;
        if (self.config.mode === "range") {
          toggleClass(dayElement, "startRange", self.selectedDates[0] && compareDates(date, self.selectedDates[0], true) === 0);
          toggleClass(dayElement, "endRange", self.selectedDates[1] && compareDates(date, self.selectedDates[1], true) === 0);
          if (className === "nextMonthDay")
            dayElement.classList.add("inRange");
        }
      }
    } else {
      dayElement.classList.add("flatpickr-disabled");
    }
    if (self.config.mode === "range") {
      if (isDateInRange(date) && !isDateSelected(date))
        dayElement.classList.add("inRange");
    }
    if (self.weekNumbers && self.config.showMonths === 1 && className !== "prevMonthDay" && dayNumber % 7 === 1) {
      self.weekNumbers.insertAdjacentHTML("beforeend", "<span class='flatpickr-day'>" + self.config.getWeek(date) + "</span>");
    }
    triggerEvent("onDayCreate", dayElement);
    return dayElement;
  }
  function focusOnDayElem(targetNode) {
    targetNode.focus();
    if (self.config.mode === "range")
      onMouseOver(targetNode);
  }
  function getFirstAvailableDay(delta) {
    const startMonth = delta > 0 ? 0 : self.config.showMonths - 1;
    const endMonth = delta > 0 ? self.config.showMonths : -1;
    for (let m = startMonth; m != endMonth; m += delta) {
      const month = self.daysContainer.children[m];
      const startIndex = delta > 0 ? 0 : month.children.length - 1;
      const endIndex = delta > 0 ? month.children.length : -1;
      for (let i = startIndex; i != endIndex; i += delta) {
        const c = month.children[i];
        if (c.className.indexOf("hidden") === -1 && isEnabled(c.dateObj))
          return c;
      }
    }
    return void 0;
  }
  function getNextAvailableDay(current, delta) {
    const givenMonth = current.className.indexOf("Month") === -1 ? current.dateObj.getMonth() : self.currentMonth;
    const endMonth = delta > 0 ? self.config.showMonths : -1;
    const loopDelta = delta > 0 ? 1 : -1;
    for (let m = givenMonth - self.currentMonth; m != endMonth; m += loopDelta) {
      const month = self.daysContainer.children[m];
      const startIndex = givenMonth - self.currentMonth === m ? current.$i + delta : delta < 0 ? month.children.length - 1 : 0;
      const numMonthDays = month.children.length;
      for (let i = startIndex; i >= 0 && i < numMonthDays && i != (delta > 0 ? numMonthDays : -1); i += loopDelta) {
        const c = month.children[i];
        if (c.className.indexOf("hidden") === -1 && isEnabled(c.dateObj) && Math.abs(current.$i - i) >= Math.abs(delta))
          return focusOnDayElem(c);
      }
    }
    self.changeMonth(loopDelta);
    focusOnDay(getFirstAvailableDay(loopDelta), 0);
    return void 0;
  }
  function focusOnDay(current, offset) {
    const dayFocused = isInView(document.activeElement || document.body);
    const startElem = current !== void 0 ? current : dayFocused ? document.activeElement : self.selectedDateElem !== void 0 && isInView(self.selectedDateElem) ? self.selectedDateElem : self.todayDateElem !== void 0 && isInView(self.todayDateElem) ? self.todayDateElem : getFirstAvailableDay(offset > 0 ? 1 : -1);
    if (startElem === void 0) {
      self._input.focus();
    } else if (!dayFocused) {
      focusOnDayElem(startElem);
    } else {
      getNextAvailableDay(startElem, offset);
    }
  }
  function buildMonthDays(year, month) {
    const firstOfMonth = (new Date(year, month, 1).getDay() - self.l10n.firstDayOfWeek + 7) % 7;
    const prevMonthDays = self.utils.getDaysInMonth((month - 1 + 12) % 12, year);
    const daysInMonth = self.utils.getDaysInMonth(month, year), days = window.document.createDocumentFragment(), isMultiMonth = self.config.showMonths > 1, prevMonthDayClass = isMultiMonth ? "prevMonthDay hidden" : "prevMonthDay", nextMonthDayClass = isMultiMonth ? "nextMonthDay hidden" : "nextMonthDay";
    let dayNumber = prevMonthDays + 1 - firstOfMonth, dayIndex = 0;
    for (; dayNumber <= prevMonthDays; dayNumber++, dayIndex++) {
      days.appendChild(createDay(prevMonthDayClass, new Date(year, month - 1, dayNumber), dayNumber, dayIndex));
    }
    for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++, dayIndex++) {
      days.appendChild(createDay("", new Date(year, month, dayNumber), dayNumber, dayIndex));
    }
    for (let dayNum = daysInMonth + 1; dayNum <= 42 - firstOfMonth && (self.config.showMonths === 1 || dayIndex % 7 !== 0); dayNum++, dayIndex++) {
      days.appendChild(createDay(nextMonthDayClass, new Date(year, month + 1, dayNum % daysInMonth), dayNum, dayIndex));
    }
    const dayContainer = createElement("div", "dayContainer");
    dayContainer.appendChild(days);
    return dayContainer;
  }
  function buildDays() {
    if (self.daysContainer === void 0) {
      return;
    }
    clearNode(self.daysContainer);
    if (self.weekNumbers)
      clearNode(self.weekNumbers);
    const frag = document.createDocumentFragment();
    for (let i = 0; i < self.config.showMonths; i++) {
      const d = new Date(self.currentYear, self.currentMonth, 1);
      d.setMonth(self.currentMonth + i);
      frag.appendChild(buildMonthDays(d.getFullYear(), d.getMonth()));
    }
    self.daysContainer.appendChild(frag);
    self.days = self.daysContainer.firstChild;
    if (self.config.mode === "range" && self.selectedDates.length === 1) {
      onMouseOver();
    }
  }
  function buildMonthSwitch() {
    if (self.config.showMonths > 1 || self.config.monthSelectorType !== "dropdown")
      return;
    const shouldBuildMonth = function(month) {
      if (self.config.minDate !== void 0 && self.currentYear === self.config.minDate.getFullYear() && month < self.config.minDate.getMonth()) {
        return false;
      }
      return !(self.config.maxDate !== void 0 && self.currentYear === self.config.maxDate.getFullYear() && month > self.config.maxDate.getMonth());
    };
    self.monthsDropdownContainer.tabIndex = -1;
    self.monthsDropdownContainer.innerHTML = "";
    for (let i = 0; i < 12; i++) {
      if (!shouldBuildMonth(i))
        continue;
      const month = createElement("option", "flatpickr-monthDropdown-month");
      month.value = new Date(self.currentYear, i).getMonth().toString();
      month.textContent = monthToStr(i, self.config.shorthandCurrentMonth, self.l10n);
      month.tabIndex = -1;
      if (self.currentMonth === i) {
        month.selected = true;
      }
      self.monthsDropdownContainer.appendChild(month);
    }
  }
  function buildMonth() {
    const container = createElement("div", "flatpickr-month");
    const monthNavFragment = window.document.createDocumentFragment();
    let monthElement;
    if (self.config.showMonths > 1 || self.config.monthSelectorType === "static") {
      monthElement = createElement("span", "cur-month");
    } else {
      self.monthsDropdownContainer = createElement("select", "flatpickr-monthDropdown-months");
      self.monthsDropdownContainer.setAttribute("aria-label", self.l10n.monthAriaLabel);
      bind(self.monthsDropdownContainer, "change", (e) => {
        const target = getEventTarget(e);
        const selectedMonth = parseInt(target.value, 10);
        self.changeMonth(selectedMonth - self.currentMonth);
        triggerEvent("onMonthChange");
      });
      buildMonthSwitch();
      monthElement = self.monthsDropdownContainer;
    }
    const yearInput = createNumberInput("cur-year", { tabindex: "-1" });
    const yearElement = yearInput.getElementsByTagName("input")[0];
    yearElement.setAttribute("aria-label", self.l10n.yearAriaLabel);
    if (self.config.minDate) {
      yearElement.setAttribute("min", self.config.minDate.getFullYear().toString());
    }
    if (self.config.maxDate) {
      yearElement.setAttribute("max", self.config.maxDate.getFullYear().toString());
      yearElement.disabled = !!self.config.minDate && self.config.minDate.getFullYear() === self.config.maxDate.getFullYear();
    }
    const currentMonth = createElement("div", "flatpickr-current-month");
    currentMonth.appendChild(monthElement);
    currentMonth.appendChild(yearInput);
    monthNavFragment.appendChild(currentMonth);
    container.appendChild(monthNavFragment);
    return {
      container,
      yearElement,
      monthElement
    };
  }
  function buildMonths() {
    clearNode(self.monthNav);
    self.monthNav.appendChild(self.prevMonthNav);
    if (self.config.showMonths) {
      self.yearElements = [];
      self.monthElements = [];
    }
    for (let m = self.config.showMonths; m--; ) {
      const month = buildMonth();
      self.yearElements.push(month.yearElement);
      self.monthElements.push(month.monthElement);
      self.monthNav.appendChild(month.container);
    }
    self.monthNav.appendChild(self.nextMonthNav);
  }
  function buildMonthNav() {
    self.monthNav = createElement("div", "flatpickr-months");
    self.yearElements = [];
    self.monthElements = [];
    self.prevMonthNav = createElement("span", "flatpickr-prev-month");
    self.prevMonthNav.innerHTML = self.config.prevArrow;
    self.nextMonthNav = createElement("span", "flatpickr-next-month");
    self.nextMonthNav.innerHTML = self.config.nextArrow;
    buildMonths();
    Object.defineProperty(self, "_hidePrevMonthArrow", {
      get: () => self.__hidePrevMonthArrow,
      set(bool) {
        if (self.__hidePrevMonthArrow !== bool) {
          toggleClass(self.prevMonthNav, "flatpickr-disabled", bool);
          self.__hidePrevMonthArrow = bool;
        }
      }
    });
    Object.defineProperty(self, "_hideNextMonthArrow", {
      get: () => self.__hideNextMonthArrow,
      set(bool) {
        if (self.__hideNextMonthArrow !== bool) {
          toggleClass(self.nextMonthNav, "flatpickr-disabled", bool);
          self.__hideNextMonthArrow = bool;
        }
      }
    });
    self.currentYearElement = self.yearElements[0];
    updateNavigationCurrentMonth();
    return self.monthNav;
  }
  function buildTime() {
    self.calendarContainer.classList.add("hasTime");
    if (self.config.noCalendar)
      self.calendarContainer.classList.add("noCalendar");
    const defaults2 = getDefaultHours(self.config);
    self.timeContainer = createElement("div", "flatpickr-time");
    self.timeContainer.tabIndex = -1;
    const separator = createElement("span", "flatpickr-time-separator", ":");
    const hourInput = createNumberInput("flatpickr-hour", {
      "aria-label": self.l10n.hourAriaLabel
    });
    self.hourElement = hourInput.getElementsByTagName("input")[0];
    const minuteInput = createNumberInput("flatpickr-minute", {
      "aria-label": self.l10n.minuteAriaLabel
    });
    self.minuteElement = minuteInput.getElementsByTagName("input")[0];
    self.hourElement.tabIndex = self.minuteElement.tabIndex = -1;
    self.hourElement.value = pad(self.latestSelectedDateObj ? self.latestSelectedDateObj.getHours() : self.config.time_24hr ? defaults2.hours : military2ampm(defaults2.hours));
    self.minuteElement.value = pad(self.latestSelectedDateObj ? self.latestSelectedDateObj.getMinutes() : defaults2.minutes);
    self.hourElement.setAttribute("step", self.config.hourIncrement.toString());
    self.minuteElement.setAttribute("step", self.config.minuteIncrement.toString());
    self.hourElement.setAttribute("min", self.config.time_24hr ? "0" : "1");
    self.hourElement.setAttribute("max", self.config.time_24hr ? "23" : "12");
    self.hourElement.setAttribute("maxlength", "2");
    self.minuteElement.setAttribute("min", "0");
    self.minuteElement.setAttribute("max", "59");
    self.minuteElement.setAttribute("maxlength", "2");
    self.timeContainer.appendChild(hourInput);
    self.timeContainer.appendChild(separator);
    self.timeContainer.appendChild(minuteInput);
    if (self.config.time_24hr)
      self.timeContainer.classList.add("time24hr");
    if (self.config.enableSeconds) {
      self.timeContainer.classList.add("hasSeconds");
      const secondInput = createNumberInput("flatpickr-second");
      self.secondElement = secondInput.getElementsByTagName("input")[0];
      self.secondElement.value = pad(self.latestSelectedDateObj ? self.latestSelectedDateObj.getSeconds() : defaults2.seconds);
      self.secondElement.setAttribute("step", self.minuteElement.getAttribute("step"));
      self.secondElement.setAttribute("min", "0");
      self.secondElement.setAttribute("max", "59");
      self.secondElement.setAttribute("maxlength", "2");
      self.timeContainer.appendChild(createElement("span", "flatpickr-time-separator", ":"));
      self.timeContainer.appendChild(secondInput);
    }
    if (!self.config.time_24hr) {
      self.amPM = createElement("span", "flatpickr-am-pm", self.l10n.amPM[int((self.latestSelectedDateObj ? self.hourElement.value : self.config.defaultHour) > 11)]);
      self.amPM.title = self.l10n.toggleTitle;
      self.amPM.tabIndex = -1;
      self.timeContainer.appendChild(self.amPM);
    }
    return self.timeContainer;
  }
  function buildWeekdays() {
    if (!self.weekdayContainer)
      self.weekdayContainer = createElement("div", "flatpickr-weekdays");
    else
      clearNode(self.weekdayContainer);
    for (let i = self.config.showMonths; i--; ) {
      const container = createElement("div", "flatpickr-weekdaycontainer");
      self.weekdayContainer.appendChild(container);
    }
    updateWeekdays();
    return self.weekdayContainer;
  }
  function updateWeekdays() {
    if (!self.weekdayContainer) {
      return;
    }
    const firstDayOfWeek = self.l10n.firstDayOfWeek;
    let weekdays = [...self.l10n.weekdays.shorthand];
    if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
      weekdays = [
        ...weekdays.splice(firstDayOfWeek, weekdays.length),
        ...weekdays.splice(0, firstDayOfWeek)
      ];
    }
    for (let i = self.config.showMonths; i--; ) {
      self.weekdayContainer.children[i].innerHTML = `
      <span class='flatpickr-weekday'>
        ${weekdays.join("</span><span class='flatpickr-weekday'>")}
      </span>
      `;
    }
  }
  function buildWeeks() {
    self.calendarContainer.classList.add("hasWeeks");
    const weekWrapper = createElement("div", "flatpickr-weekwrapper");
    weekWrapper.appendChild(createElement("span", "flatpickr-weekday", self.l10n.weekAbbreviation));
    const weekNumbers = createElement("div", "flatpickr-weeks");
    weekWrapper.appendChild(weekNumbers);
    return {
      weekWrapper,
      weekNumbers
    };
  }
  function changeMonth(value, isOffset = true) {
    const delta = isOffset ? value : value - self.currentMonth;
    if (delta < 0 && self._hidePrevMonthArrow === true || delta > 0 && self._hideNextMonthArrow === true)
      return;
    self.currentMonth += delta;
    if (self.currentMonth < 0 || self.currentMonth > 11) {
      self.currentYear += self.currentMonth > 11 ? 1 : -1;
      self.currentMonth = (self.currentMonth + 12) % 12;
      triggerEvent("onYearChange");
      buildMonthSwitch();
    }
    buildDays();
    triggerEvent("onMonthChange");
    updateNavigationCurrentMonth();
  }
  function clear(triggerChangeEvent = true, toInitial = true) {
    self.input.value = "";
    if (self.altInput !== void 0)
      self.altInput.value = "";
    if (self.mobileInput !== void 0)
      self.mobileInput.value = "";
    self.selectedDates = [];
    self.latestSelectedDateObj = void 0;
    if (toInitial === true) {
      self.currentYear = self._initialDate.getFullYear();
      self.currentMonth = self._initialDate.getMonth();
    }
    if (self.config.enableTime === true) {
      const { hours, minutes, seconds } = getDefaultHours(self.config);
      setHours(hours, minutes, seconds);
    }
    self.redraw();
    if (triggerChangeEvent)
      triggerEvent("onChange");
  }
  function close() {
    self.isOpen = false;
    if (!self.isMobile) {
      if (self.calendarContainer !== void 0) {
        self.calendarContainer.classList.remove("open");
      }
      if (self._input !== void 0) {
        self._input.classList.remove("active");
      }
    }
    triggerEvent("onClose");
  }
  function destroy() {
    if (self.config !== void 0)
      triggerEvent("onDestroy");
    for (let i = self._handlers.length; i--; ) {
      self._handlers[i].remove();
    }
    self._handlers = [];
    if (self.mobileInput) {
      if (self.mobileInput.parentNode)
        self.mobileInput.parentNode.removeChild(self.mobileInput);
      self.mobileInput = void 0;
    } else if (self.calendarContainer && self.calendarContainer.parentNode) {
      if (self.config.static && self.calendarContainer.parentNode) {
        const wrapper = self.calendarContainer.parentNode;
        wrapper.lastChild && wrapper.removeChild(wrapper.lastChild);
        if (wrapper.parentNode) {
          while (wrapper.firstChild)
            wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
          wrapper.parentNode.removeChild(wrapper);
        }
      } else
        self.calendarContainer.parentNode.removeChild(self.calendarContainer);
    }
    if (self.altInput) {
      self.input.type = "text";
      if (self.altInput.parentNode)
        self.altInput.parentNode.removeChild(self.altInput);
      delete self.altInput;
    }
    if (self.input) {
      self.input.type = self.input._type;
      self.input.classList.remove("flatpickr-input");
      self.input.removeAttribute("readonly");
    }
    [
      "_showTimeInput",
      "latestSelectedDateObj",
      "_hideNextMonthArrow",
      "_hidePrevMonthArrow",
      "__hideNextMonthArrow",
      "__hidePrevMonthArrow",
      "isMobile",
      "isOpen",
      "selectedDateElem",
      "minDateHasTime",
      "maxDateHasTime",
      "days",
      "daysContainer",
      "_input",
      "_positionElement",
      "innerContainer",
      "rContainer",
      "monthNav",
      "todayDateElem",
      "calendarContainer",
      "weekdayContainer",
      "prevMonthNav",
      "nextMonthNav",
      "monthsDropdownContainer",
      "currentMonthElement",
      "currentYearElement",
      "navigationCurrentMonth",
      "selectedDateElem",
      "config"
    ].forEach((k) => {
      try {
        delete self[k];
      } catch (_) {
      }
    });
  }
  function isCalendarElem(elem) {
    if (self.config.appendTo && self.config.appendTo.contains(elem))
      return true;
    return self.calendarContainer.contains(elem);
  }
  function documentClick(e) {
    if (self.isOpen && !self.config.inline) {
      const eventTarget = getEventTarget(e);
      const isCalendarElement = isCalendarElem(eventTarget);
      const isInput = eventTarget === self.input || eventTarget === self.altInput || self.element.contains(eventTarget) || e.path && e.path.indexOf && (~e.path.indexOf(self.input) || ~e.path.indexOf(self.altInput));
      const lostFocus = e.type === "blur" ? isInput && e.relatedTarget && !isCalendarElem(e.relatedTarget) : !isInput && !isCalendarElement && !isCalendarElem(e.relatedTarget);
      const isIgnored = !self.config.ignoredFocusElements.some((elem) => elem.contains(eventTarget));
      if (lostFocus && isIgnored) {
        if (self.timeContainer !== void 0 && self.minuteElement !== void 0 && self.hourElement !== void 0 && self.input.value !== "" && self.input.value !== void 0) {
          updateTime();
        }
        self.close();
        if (self.config && self.config.mode === "range" && self.selectedDates.length === 1) {
          self.clear(false);
          self.redraw();
        }
      }
    }
  }
  function changeYear(newYear) {
    if (!newYear || self.config.minDate && newYear < self.config.minDate.getFullYear() || self.config.maxDate && newYear > self.config.maxDate.getFullYear())
      return;
    const newYearNum = newYear, isNewYear = self.currentYear !== newYearNum;
    self.currentYear = newYearNum || self.currentYear;
    if (self.config.maxDate && self.currentYear === self.config.maxDate.getFullYear()) {
      self.currentMonth = Math.min(self.config.maxDate.getMonth(), self.currentMonth);
    } else if (self.config.minDate && self.currentYear === self.config.minDate.getFullYear()) {
      self.currentMonth = Math.max(self.config.minDate.getMonth(), self.currentMonth);
    }
    if (isNewYear) {
      self.redraw();
      triggerEvent("onYearChange");
      buildMonthSwitch();
    }
  }
  function isEnabled(date, timeless = true) {
    var _a;
    const dateToCheck = self.parseDate(date, void 0, timeless);
    if (self.config.minDate && dateToCheck && compareDates(dateToCheck, self.config.minDate, timeless !== void 0 ? timeless : !self.minDateHasTime) < 0 || self.config.maxDate && dateToCheck && compareDates(dateToCheck, self.config.maxDate, timeless !== void 0 ? timeless : !self.maxDateHasTime) > 0)
      return false;
    if (!self.config.enable && self.config.disable.length === 0)
      return true;
    if (dateToCheck === void 0)
      return false;
    const bool = !!self.config.enable, array = (_a = self.config.enable) !== null && _a !== void 0 ? _a : self.config.disable;
    for (let i = 0, d; i < array.length; i++) {
      d = array[i];
      if (typeof d === "function" && d(dateToCheck))
        return bool;
      else if (d instanceof Date && dateToCheck !== void 0 && d.getTime() === dateToCheck.getTime())
        return bool;
      else if (typeof d === "string") {
        const parsed = self.parseDate(d, void 0, true);
        return parsed && parsed.getTime() === dateToCheck.getTime() ? bool : !bool;
      } else if (typeof d === "object" && dateToCheck !== void 0 && d.from && d.to && dateToCheck.getTime() >= d.from.getTime() && dateToCheck.getTime() <= d.to.getTime())
        return bool;
    }
    return !bool;
  }
  function isInView(elem) {
    if (self.daysContainer !== void 0)
      return elem.className.indexOf("hidden") === -1 && elem.className.indexOf("flatpickr-disabled") === -1 && self.daysContainer.contains(elem);
    return false;
  }
  function onBlur(e) {
    const isInput = e.target === self._input;
    if (isInput && (self.selectedDates.length > 0 || self._input.value.length > 0) && !(e.relatedTarget && isCalendarElem(e.relatedTarget))) {
      self.setDate(self._input.value, true, e.target === self.altInput ? self.config.altFormat : self.config.dateFormat);
    }
  }
  function onKeyDown(e) {
    const eventTarget = getEventTarget(e);
    const isInput = self.config.wrap ? element.contains(eventTarget) : eventTarget === self._input;
    const allowInput = self.config.allowInput;
    const allowKeydown = self.isOpen && (!allowInput || !isInput);
    const allowInlineKeydown = self.config.inline && isInput && !allowInput;
    if (e.keyCode === 13 && isInput) {
      if (allowInput) {
        self.setDate(self._input.value, true, eventTarget === self.altInput ? self.config.altFormat : self.config.dateFormat);
        return eventTarget.blur();
      } else {
        self.open();
      }
    } else if (isCalendarElem(eventTarget) || allowKeydown || allowInlineKeydown) {
      const isTimeObj = !!self.timeContainer && self.timeContainer.contains(eventTarget);
      switch (e.keyCode) {
        case 13:
          if (isTimeObj) {
            e.preventDefault();
            updateTime();
            focusAndClose();
          } else
            selectDate(e);
          break;
        case 27:
          e.preventDefault();
          focusAndClose();
          break;
        case 8:
        case 46:
          if (isInput && !self.config.allowInput) {
            e.preventDefault();
            self.clear();
          }
          break;
        case 37:
        case 39:
          if (!isTimeObj && !isInput) {
            e.preventDefault();
            if (self.daysContainer !== void 0 && (allowInput === false || document.activeElement && isInView(document.activeElement))) {
              const delta2 = e.keyCode === 39 ? 1 : -1;
              if (!e.ctrlKey)
                focusOnDay(void 0, delta2);
              else {
                e.stopPropagation();
                changeMonth(delta2);
                focusOnDay(getFirstAvailableDay(1), 0);
              }
            }
          } else if (self.hourElement)
            self.hourElement.focus();
          break;
        case 38:
        case 40:
          e.preventDefault();
          const delta = e.keyCode === 40 ? 1 : -1;
          if (self.daysContainer && eventTarget.$i !== void 0 || eventTarget === self.input || eventTarget === self.altInput) {
            if (e.ctrlKey) {
              e.stopPropagation();
              changeYear(self.currentYear - delta);
              focusOnDay(getFirstAvailableDay(1), 0);
            } else if (!isTimeObj)
              focusOnDay(void 0, delta * 7);
          } else if (eventTarget === self.currentYearElement) {
            changeYear(self.currentYear - delta);
          } else if (self.config.enableTime) {
            if (!isTimeObj && self.hourElement)
              self.hourElement.focus();
            updateTime(e);
            self._debouncedChange();
          }
          break;
        case 9:
          if (isTimeObj) {
            const elems = [
              self.hourElement,
              self.minuteElement,
              self.secondElement,
              self.amPM
            ].concat(self.pluginElements).filter((x) => x);
            const i = elems.indexOf(eventTarget);
            if (i !== -1) {
              const target = elems[i + (e.shiftKey ? -1 : 1)];
              e.preventDefault();
              (target || self._input).focus();
            }
          } else if (!self.config.noCalendar && self.daysContainer && self.daysContainer.contains(eventTarget) && e.shiftKey) {
            e.preventDefault();
            self._input.focus();
          }
          break;
      }
    }
    if (self.amPM !== void 0 && eventTarget === self.amPM) {
      switch (e.key) {
        case self.l10n.amPM[0].charAt(0):
        case self.l10n.amPM[0].charAt(0).toLowerCase():
          self.amPM.textContent = self.l10n.amPM[0];
          setHoursFromInputs();
          updateValue();
          break;
        case self.l10n.amPM[1].charAt(0):
        case self.l10n.amPM[1].charAt(0).toLowerCase():
          self.amPM.textContent = self.l10n.amPM[1];
          setHoursFromInputs();
          updateValue();
          break;
      }
    }
    if (isInput || isCalendarElem(eventTarget)) {
      triggerEvent("onKeyDown", e);
    }
  }
  function onMouseOver(elem) {
    if (self.selectedDates.length !== 1 || elem && (!elem.classList.contains("flatpickr-day") || elem.classList.contains("flatpickr-disabled")))
      return;
    const hoverDate = elem ? elem.dateObj.getTime() : self.days.firstElementChild.dateObj.getTime(), initialDate = self.parseDate(self.selectedDates[0], void 0, true).getTime(), rangeStartDate = Math.min(hoverDate, self.selectedDates[0].getTime()), rangeEndDate = Math.max(hoverDate, self.selectedDates[0].getTime());
    let containsDisabled = false;
    let minRange = 0, maxRange = 0;
    for (let t = rangeStartDate; t < rangeEndDate; t += duration.DAY) {
      if (!isEnabled(new Date(t), true)) {
        containsDisabled = containsDisabled || t > rangeStartDate && t < rangeEndDate;
        if (t < initialDate && (!minRange || t > minRange))
          minRange = t;
        else if (t > initialDate && (!maxRange || t < maxRange))
          maxRange = t;
      }
    }
    for (let m = 0; m < self.config.showMonths; m++) {
      const month = self.daysContainer.children[m];
      for (let i = 0, l = month.children.length; i < l; i++) {
        const dayElem = month.children[i], date = dayElem.dateObj;
        const timestamp = date.getTime();
        const outOfRange = minRange > 0 && timestamp < minRange || maxRange > 0 && timestamp > maxRange;
        if (outOfRange) {
          dayElem.classList.add("notAllowed");
          ["inRange", "startRange", "endRange"].forEach((c) => {
            dayElem.classList.remove(c);
          });
          continue;
        } else if (containsDisabled && !outOfRange)
          continue;
        ["startRange", "inRange", "endRange", "notAllowed"].forEach((c) => {
          dayElem.classList.remove(c);
        });
        if (elem !== void 0) {
          elem.classList.add(hoverDate <= self.selectedDates[0].getTime() ? "startRange" : "endRange");
          if (initialDate < hoverDate && timestamp === initialDate)
            dayElem.classList.add("startRange");
          else if (initialDate > hoverDate && timestamp === initialDate)
            dayElem.classList.add("endRange");
          if (timestamp >= minRange && (maxRange === 0 || timestamp <= maxRange) && isBetween(timestamp, initialDate, hoverDate))
            dayElem.classList.add("inRange");
        }
      }
    }
  }
  function onResize() {
    if (self.isOpen && !self.config.static && !self.config.inline)
      positionCalendar();
  }
  function open(e, positionElement = self._positionElement) {
    if (self.isMobile === true) {
      if (e) {
        e.preventDefault();
        const eventTarget = getEventTarget(e);
        if (eventTarget) {
          eventTarget.blur();
        }
      }
      if (self.mobileInput !== void 0) {
        self.mobileInput.focus();
        self.mobileInput.click();
      }
      triggerEvent("onOpen");
      return;
    } else if (self._input.disabled || self.config.inline) {
      return;
    }
    const wasOpen = self.isOpen;
    self.isOpen = true;
    if (!wasOpen) {
      self.calendarContainer.classList.add("open");
      self._input.classList.add("active");
      triggerEvent("onOpen");
      positionCalendar(positionElement);
    }
    if (self.config.enableTime === true && self.config.noCalendar === true) {
      if (self.config.allowInput === false && (e === void 0 || !self.timeContainer.contains(e.relatedTarget))) {
        setTimeout(() => self.hourElement.select(), 50);
      }
    }
  }
  function minMaxDateSetter(type) {
    return (date) => {
      const dateObj = self.config[`_${type}Date`] = self.parseDate(date, self.config.dateFormat);
      const inverseDateObj = self.config[`_${type === "min" ? "max" : "min"}Date`];
      if (dateObj !== void 0) {
        self[type === "min" ? "minDateHasTime" : "maxDateHasTime"] = dateObj.getHours() > 0 || dateObj.getMinutes() > 0 || dateObj.getSeconds() > 0;
      }
      if (self.selectedDates) {
        self.selectedDates = self.selectedDates.filter((d) => isEnabled(d));
        if (!self.selectedDates.length && type === "min")
          setHoursFromDate(dateObj);
        updateValue();
      }
      if (self.daysContainer) {
        redraw();
        if (dateObj !== void 0)
          self.currentYearElement[type] = dateObj.getFullYear().toString();
        else
          self.currentYearElement.removeAttribute(type);
        self.currentYearElement.disabled = !!inverseDateObj && dateObj !== void 0 && inverseDateObj.getFullYear() === dateObj.getFullYear();
      }
    };
  }
  function parseConfig() {
    const boolOpts = [
      "wrap",
      "weekNumbers",
      "allowInput",
      "allowInvalidPreload",
      "clickOpens",
      "time_24hr",
      "enableTime",
      "noCalendar",
      "altInput",
      "shorthandCurrentMonth",
      "inline",
      "static",
      "enableSeconds",
      "disableMobile"
    ];
    const userConfig = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(element.dataset || {}))), instanceConfig);
    const formats2 = {};
    self.config.parseDate = userConfig.parseDate;
    self.config.formatDate = userConfig.formatDate;
    Object.defineProperty(self.config, "enable", {
      get: () => self.config._enable,
      set: (dates) => {
        self.config._enable = parseDateRules(dates);
      }
    });
    Object.defineProperty(self.config, "disable", {
      get: () => self.config._disable,
      set: (dates) => {
        self.config._disable = parseDateRules(dates);
      }
    });
    const timeMode = userConfig.mode === "time";
    if (!userConfig.dateFormat && (userConfig.enableTime || timeMode)) {
      const defaultDateFormat = flatpickr.defaultConfig.dateFormat || defaults.dateFormat;
      formats2.dateFormat = userConfig.noCalendar || timeMode ? "H:i" + (userConfig.enableSeconds ? ":S" : "") : defaultDateFormat + " H:i" + (userConfig.enableSeconds ? ":S" : "");
    }
    if (userConfig.altInput && (userConfig.enableTime || timeMode) && !userConfig.altFormat) {
      const defaultAltFormat = flatpickr.defaultConfig.altFormat || defaults.altFormat;
      formats2.altFormat = userConfig.noCalendar || timeMode ? "h:i" + (userConfig.enableSeconds ? ":S K" : " K") : defaultAltFormat + ` h:i${userConfig.enableSeconds ? ":S" : ""} K`;
    }
    Object.defineProperty(self.config, "minDate", {
      get: () => self.config._minDate,
      set: minMaxDateSetter("min")
    });
    Object.defineProperty(self.config, "maxDate", {
      get: () => self.config._maxDate,
      set: minMaxDateSetter("max")
    });
    const minMaxTimeSetter = (type) => (val) => {
      self.config[type === "min" ? "_minTime" : "_maxTime"] = self.parseDate(val, "H:i:S");
    };
    Object.defineProperty(self.config, "minTime", {
      get: () => self.config._minTime,
      set: minMaxTimeSetter("min")
    });
    Object.defineProperty(self.config, "maxTime", {
      get: () => self.config._maxTime,
      set: minMaxTimeSetter("max")
    });
    if (userConfig.mode === "time") {
      self.config.noCalendar = true;
      self.config.enableTime = true;
    }
    Object.assign(self.config, formats2, userConfig);
    for (let i = 0; i < boolOpts.length; i++)
      self.config[boolOpts[i]] = self.config[boolOpts[i]] === true || self.config[boolOpts[i]] === "true";
    HOOKS.filter((hook) => self.config[hook] !== void 0).forEach((hook) => {
      self.config[hook] = arrayify(self.config[hook] || []).map(bindToInstance);
    });
    self.isMobile = !self.config.disableMobile && !self.config.inline && self.config.mode === "single" && !self.config.disable.length && !self.config.enable && !self.config.weekNumbers && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    for (let i = 0; i < self.config.plugins.length; i++) {
      const pluginConf = self.config.plugins[i](self) || {};
      for (const key in pluginConf) {
        if (HOOKS.indexOf(key) > -1) {
          self.config[key] = arrayify(pluginConf[key]).map(bindToInstance).concat(self.config[key]);
        } else if (typeof userConfig[key] === "undefined")
          self.config[key] = pluginConf[key];
      }
    }
    if (!userConfig.altInputClass) {
      self.config.altInputClass = getInputElem().className + " " + self.config.altInputClass;
    }
    triggerEvent("onParseConfig");
  }
  function getInputElem() {
    return self.config.wrap ? element.querySelector("[data-input]") : element;
  }
  function setupLocale() {
    if (typeof self.config.locale !== "object" && typeof flatpickr.l10ns[self.config.locale] === "undefined")
      self.config.errorHandler(new Error(`flatpickr: invalid locale ${self.config.locale}`));
    self.l10n = Object.assign(Object.assign({}, flatpickr.l10ns.default), typeof self.config.locale === "object" ? self.config.locale : self.config.locale !== "default" ? flatpickr.l10ns[self.config.locale] : void 0);
    tokenRegex.K = `(${self.l10n.amPM[0]}|${self.l10n.amPM[1]}|${self.l10n.amPM[0].toLowerCase()}|${self.l10n.amPM[1].toLowerCase()})`;
    const userConfig = Object.assign(Object.assign({}, instanceConfig), JSON.parse(JSON.stringify(element.dataset || {})));
    if (userConfig.time_24hr === void 0 && flatpickr.defaultConfig.time_24hr === void 0) {
      self.config.time_24hr = self.l10n.time_24hr;
    }
    self.formatDate = createDateFormatter(self);
    self.parseDate = createDateParser({ config: self.config, l10n: self.l10n });
  }
  function positionCalendar(customPositionElement) {
    if (typeof self.config.position === "function") {
      return void self.config.position(self, customPositionElement);
    }
    if (self.calendarContainer === void 0)
      return;
    triggerEvent("onPreCalendarPosition");
    const positionElement = customPositionElement || self._positionElement;
    const calendarHeight = Array.prototype.reduce.call(self.calendarContainer.children, (acc, child) => acc + child.offsetHeight, 0), calendarWidth = self.calendarContainer.offsetWidth, configPos = self.config.position.split(" "), configPosVertical = configPos[0], configPosHorizontal = configPos.length > 1 ? configPos[1] : null, inputBounds = positionElement.getBoundingClientRect(), distanceFromBottom = window.innerHeight - inputBounds.bottom, showOnTop = configPosVertical === "above" || configPosVertical !== "below" && distanceFromBottom < calendarHeight && inputBounds.top > calendarHeight;
    const top = window.pageYOffset + inputBounds.top + (!showOnTop ? positionElement.offsetHeight + 2 : -calendarHeight - 2);
    toggleClass(self.calendarContainer, "arrowTop", !showOnTop);
    toggleClass(self.calendarContainer, "arrowBottom", showOnTop);
    if (self.config.inline)
      return;
    let left = window.pageXOffset + inputBounds.left;
    let isCenter = false;
    let isRight = false;
    if (configPosHorizontal === "center") {
      left -= (calendarWidth - inputBounds.width) / 2;
      isCenter = true;
    } else if (configPosHorizontal === "right") {
      left -= calendarWidth - inputBounds.width;
      isRight = true;
    }
    toggleClass(self.calendarContainer, "arrowLeft", !isCenter && !isRight);
    toggleClass(self.calendarContainer, "arrowCenter", isCenter);
    toggleClass(self.calendarContainer, "arrowRight", isRight);
    const right = window.document.body.offsetWidth - (window.pageXOffset + inputBounds.right);
    const rightMost = left + calendarWidth > window.document.body.offsetWidth;
    const centerMost = right + calendarWidth > window.document.body.offsetWidth;
    toggleClass(self.calendarContainer, "rightMost", rightMost);
    if (self.config.static)
      return;
    self.calendarContainer.style.top = `${top}px`;
    if (!rightMost) {
      self.calendarContainer.style.left = `${left}px`;
      self.calendarContainer.style.right = "auto";
    } else if (!centerMost) {
      self.calendarContainer.style.left = "auto";
      self.calendarContainer.style.right = `${right}px`;
    } else {
      const doc = getDocumentStyleSheet();
      if (doc === void 0)
        return;
      const bodyWidth = window.document.body.offsetWidth;
      const centerLeft = Math.max(0, bodyWidth / 2 - calendarWidth / 2);
      const centerBefore = ".flatpickr-calendar.centerMost:before";
      const centerAfter = ".flatpickr-calendar.centerMost:after";
      const centerIndex = doc.cssRules.length;
      const centerStyle = `{left:${inputBounds.left}px;right:auto;}`;
      toggleClass(self.calendarContainer, "rightMost", false);
      toggleClass(self.calendarContainer, "centerMost", true);
      doc.insertRule(`${centerBefore},${centerAfter}${centerStyle}`, centerIndex);
      self.calendarContainer.style.left = `${centerLeft}px`;
      self.calendarContainer.style.right = "auto";
    }
  }
  function getDocumentStyleSheet() {
    let editableSheet = null;
    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i];
      try {
        sheet.cssRules;
      } catch (err) {
        continue;
      }
      editableSheet = sheet;
      break;
    }
    return editableSheet != null ? editableSheet : createStyleSheet();
  }
  function createStyleSheet() {
    const style = document.createElement("style");
    document.head.appendChild(style);
    return style.sheet;
  }
  function redraw() {
    if (self.config.noCalendar || self.isMobile)
      return;
    buildMonthSwitch();
    updateNavigationCurrentMonth();
    buildDays();
  }
  function focusAndClose() {
    self._input.focus();
    if (window.navigator.userAgent.indexOf("MSIE") !== -1 || navigator.msMaxTouchPoints !== void 0) {
      setTimeout(self.close, 0);
    } else {
      self.close();
    }
  }
  function selectDate(e) {
    e.preventDefault();
    e.stopPropagation();
    const isSelectable = (day) => day.classList && day.classList.contains("flatpickr-day") && !day.classList.contains("flatpickr-disabled") && !day.classList.contains("notAllowed");
    const t = findParent(getEventTarget(e), isSelectable);
    if (t === void 0)
      return;
    const target = t;
    const selectedDate = self.latestSelectedDateObj = new Date(target.dateObj.getTime());
    const shouldChangeMonth = (selectedDate.getMonth() < self.currentMonth || selectedDate.getMonth() > self.currentMonth + self.config.showMonths - 1) && self.config.mode !== "range";
    self.selectedDateElem = target;
    if (self.config.mode === "single")
      self.selectedDates = [selectedDate];
    else if (self.config.mode === "multiple") {
      const selectedIndex = isDateSelected(selectedDate);
      if (selectedIndex)
        self.selectedDates.splice(parseInt(selectedIndex), 1);
      else
        self.selectedDates.push(selectedDate);
    } else if (self.config.mode === "range") {
      if (self.selectedDates.length === 2) {
        self.clear(false, false);
      }
      self.latestSelectedDateObj = selectedDate;
      self.selectedDates.push(selectedDate);
      if (compareDates(selectedDate, self.selectedDates[0], true) !== 0)
        self.selectedDates.sort((a, b) => a.getTime() - b.getTime());
    }
    setHoursFromInputs();
    if (shouldChangeMonth) {
      const isNewYear = self.currentYear !== selectedDate.getFullYear();
      self.currentYear = selectedDate.getFullYear();
      self.currentMonth = selectedDate.getMonth();
      if (isNewYear) {
        triggerEvent("onYearChange");
        buildMonthSwitch();
      }
      triggerEvent("onMonthChange");
    }
    updateNavigationCurrentMonth();
    buildDays();
    updateValue();
    if (!shouldChangeMonth && self.config.mode !== "range" && self.config.showMonths === 1)
      focusOnDayElem(target);
    else if (self.selectedDateElem !== void 0 && self.hourElement === void 0) {
      self.selectedDateElem && self.selectedDateElem.focus();
    }
    if (self.hourElement !== void 0)
      self.hourElement !== void 0 && self.hourElement.focus();
    if (self.config.closeOnSelect) {
      const single = self.config.mode === "single" && !self.config.enableTime;
      const range = self.config.mode === "range" && self.selectedDates.length === 2 && !self.config.enableTime;
      if (single || range) {
        focusAndClose();
      }
    }
    triggerChange();
  }
  const CALLBACKS = {
    locale: [setupLocale, updateWeekdays],
    showMonths: [buildMonths, setCalendarWidth, buildWeekdays],
    minDate: [jumpToDate],
    maxDate: [jumpToDate],
    clickOpens: [
      () => {
        if (self.config.clickOpens === true) {
          bind(self._input, "focus", self.open);
          bind(self._input, "click", self.open);
        } else {
          self._input.removeEventListener("focus", self.open);
          self._input.removeEventListener("click", self.open);
        }
      }
    ]
  };
  function set(option, value) {
    if (option !== null && typeof option === "object") {
      Object.assign(self.config, option);
      for (const key in option) {
        if (CALLBACKS[key] !== void 0)
          CALLBACKS[key].forEach((x) => x());
      }
    } else {
      self.config[option] = value;
      if (CALLBACKS[option] !== void 0)
        CALLBACKS[option].forEach((x) => x());
      else if (HOOKS.indexOf(option) > -1)
        self.config[option] = arrayify(value);
    }
    self.redraw();
    updateValue(true);
  }
  function setSelectedDate(inputDate, format) {
    let dates = [];
    if (inputDate instanceof Array)
      dates = inputDate.map((d) => self.parseDate(d, format));
    else if (inputDate instanceof Date || typeof inputDate === "number")
      dates = [self.parseDate(inputDate, format)];
    else if (typeof inputDate === "string") {
      switch (self.config.mode) {
        case "single":
        case "time":
          dates = [self.parseDate(inputDate, format)];
          break;
        case "multiple":
          dates = inputDate.split(self.config.conjunction).map((date) => self.parseDate(date, format));
          break;
        case "range":
          dates = inputDate.split(self.l10n.rangeSeparator).map((date) => self.parseDate(date, format));
          break;
      }
    } else
      self.config.errorHandler(new Error(`Invalid date supplied: ${JSON.stringify(inputDate)}`));
    self.selectedDates = self.config.allowInvalidPreload ? dates : dates.filter((d) => d instanceof Date && isEnabled(d, false));
    if (self.config.mode === "range")
      self.selectedDates.sort((a, b) => a.getTime() - b.getTime());
  }
  function setDate(date, triggerChange2 = false, format = self.config.dateFormat) {
    if (date !== 0 && !date || date instanceof Array && date.length === 0)
      return self.clear(triggerChange2);
    setSelectedDate(date, format);
    self.latestSelectedDateObj = self.selectedDates[self.selectedDates.length - 1];
    self.redraw();
    jumpToDate(void 0, triggerChange2);
    setHoursFromDate();
    if (self.selectedDates.length === 0) {
      self.clear(false);
    }
    updateValue(triggerChange2);
    if (triggerChange2)
      triggerEvent("onChange");
  }
  function parseDateRules(arr) {
    return arr.slice().map((rule) => {
      if (typeof rule === "string" || typeof rule === "number" || rule instanceof Date) {
        return self.parseDate(rule, void 0, true);
      } else if (rule && typeof rule === "object" && rule.from && rule.to)
        return {
          from: self.parseDate(rule.from, void 0),
          to: self.parseDate(rule.to, void 0)
        };
      return rule;
    }).filter((x) => x);
  }
  function setupDates() {
    self.selectedDates = [];
    self.now = self.parseDate(self.config.now) || new Date();
    const preloadedDate = self.config.defaultDate || ((self.input.nodeName === "INPUT" || self.input.nodeName === "TEXTAREA") && self.input.placeholder && self.input.value === self.input.placeholder ? null : self.input.value);
    if (preloadedDate)
      setSelectedDate(preloadedDate, self.config.dateFormat);
    self._initialDate = self.selectedDates.length > 0 ? self.selectedDates[0] : self.config.minDate && self.config.minDate.getTime() > self.now.getTime() ? self.config.minDate : self.config.maxDate && self.config.maxDate.getTime() < self.now.getTime() ? self.config.maxDate : self.now;
    self.currentYear = self._initialDate.getFullYear();
    self.currentMonth = self._initialDate.getMonth();
    if (self.selectedDates.length > 0)
      self.latestSelectedDateObj = self.selectedDates[0];
    if (self.config.minTime !== void 0)
      self.config.minTime = self.parseDate(self.config.minTime, "H:i");
    if (self.config.maxTime !== void 0)
      self.config.maxTime = self.parseDate(self.config.maxTime, "H:i");
    self.minDateHasTime = !!self.config.minDate && (self.config.minDate.getHours() > 0 || self.config.minDate.getMinutes() > 0 || self.config.minDate.getSeconds() > 0);
    self.maxDateHasTime = !!self.config.maxDate && (self.config.maxDate.getHours() > 0 || self.config.maxDate.getMinutes() > 0 || self.config.maxDate.getSeconds() > 0);
  }
  function setupInputs() {
    self.input = getInputElem();
    if (!self.input) {
      self.config.errorHandler(new Error("Invalid input element specified"));
      return;
    }
    self.input._type = self.input.type;
    self.input.type = "text";
    self.input.classList.add("flatpickr-input");
    self._input = self.input;
    if (self.config.altInput) {
      self.altInput = createElement(self.input.nodeName, self.config.altInputClass);
      self._input = self.altInput;
      self.altInput.placeholder = self.input.placeholder;
      self.altInput.disabled = self.input.disabled;
      self.altInput.required = self.input.required;
      self.altInput.tabIndex = self.input.tabIndex;
      self.altInput.type = "text";
      self.input.setAttribute("type", "hidden");
      if (!self.config.static && self.input.parentNode)
        self.input.parentNode.insertBefore(self.altInput, self.input.nextSibling);
    }
    if (!self.config.allowInput)
      self._input.setAttribute("readonly", "readonly");
    self._positionElement = self.config.positionElement || self._input;
  }
  function setupMobile() {
    const inputType = self.config.enableTime ? self.config.noCalendar ? "time" : "datetime-local" : "date";
    self.mobileInput = createElement("input", self.input.className + " flatpickr-mobile");
    self.mobileInput.tabIndex = 1;
    self.mobileInput.type = inputType;
    self.mobileInput.disabled = self.input.disabled;
    self.mobileInput.required = self.input.required;
    self.mobileInput.placeholder = self.input.placeholder;
    self.mobileFormatStr = inputType === "datetime-local" ? "Y-m-d\\TH:i:S" : inputType === "date" ? "Y-m-d" : "H:i:S";
    if (self.selectedDates.length > 0) {
      self.mobileInput.defaultValue = self.mobileInput.value = self.formatDate(self.selectedDates[0], self.mobileFormatStr);
    }
    if (self.config.minDate)
      self.mobileInput.min = self.formatDate(self.config.minDate, "Y-m-d");
    if (self.config.maxDate)
      self.mobileInput.max = self.formatDate(self.config.maxDate, "Y-m-d");
    if (self.input.getAttribute("step"))
      self.mobileInput.step = String(self.input.getAttribute("step"));
    self.input.type = "hidden";
    if (self.altInput !== void 0)
      self.altInput.type = "hidden";
    try {
      if (self.input.parentNode)
        self.input.parentNode.insertBefore(self.mobileInput, self.input.nextSibling);
    } catch (_a) {
    }
    bind(self.mobileInput, "change", (e) => {
      self.setDate(getEventTarget(e).value, false, self.mobileFormatStr);
      triggerEvent("onChange");
      triggerEvent("onClose");
    });
  }
  function toggle(e) {
    if (self.isOpen === true)
      return self.close();
    self.open(e);
  }
  function triggerEvent(event, data2) {
    if (self.config === void 0)
      return;
    const hooks = self.config[event];
    if (hooks !== void 0 && hooks.length > 0) {
      for (let i = 0; hooks[i] && i < hooks.length; i++)
        hooks[i](self.selectedDates, self.input.value, self, data2);
    }
    if (event === "onChange") {
      self.input.dispatchEvent(createEvent("change"));
      self.input.dispatchEvent(createEvent("input"));
    }
  }
  function createEvent(name) {
    const e = document.createEvent("Event");
    e.initEvent(name, true, true);
    return e;
  }
  function isDateSelected(date) {
    for (let i = 0; i < self.selectedDates.length; i++) {
      if (compareDates(self.selectedDates[i], date) === 0)
        return "" + i;
    }
    return false;
  }
  function isDateInRange(date) {
    if (self.config.mode !== "range" || self.selectedDates.length < 2)
      return false;
    return compareDates(date, self.selectedDates[0]) >= 0 && compareDates(date, self.selectedDates[1]) <= 0;
  }
  function updateNavigationCurrentMonth() {
    if (self.config.noCalendar || self.isMobile || !self.monthNav)
      return;
    self.yearElements.forEach((yearElement, i) => {
      const d = new Date(self.currentYear, self.currentMonth, 1);
      d.setMonth(self.currentMonth + i);
      if (self.config.showMonths > 1 || self.config.monthSelectorType === "static") {
        self.monthElements[i].textContent = monthToStr(d.getMonth(), self.config.shorthandCurrentMonth, self.l10n) + " ";
      } else {
        self.monthsDropdownContainer.value = d.getMonth().toString();
      }
      yearElement.value = d.getFullYear().toString();
    });
    self._hidePrevMonthArrow = self.config.minDate !== void 0 && (self.currentYear === self.config.minDate.getFullYear() ? self.currentMonth <= self.config.minDate.getMonth() : self.currentYear < self.config.minDate.getFullYear());
    self._hideNextMonthArrow = self.config.maxDate !== void 0 && (self.currentYear === self.config.maxDate.getFullYear() ? self.currentMonth + 1 > self.config.maxDate.getMonth() : self.currentYear > self.config.maxDate.getFullYear());
  }
  function getDateStr(format) {
    return self.selectedDates.map((dObj) => self.formatDate(dObj, format)).filter((d, i, arr) => self.config.mode !== "range" || self.config.enableTime || arr.indexOf(d) === i).join(self.config.mode !== "range" ? self.config.conjunction : self.l10n.rangeSeparator);
  }
  function updateValue(triggerChange2 = true) {
    if (self.mobileInput !== void 0 && self.mobileFormatStr) {
      self.mobileInput.value = self.latestSelectedDateObj !== void 0 ? self.formatDate(self.latestSelectedDateObj, self.mobileFormatStr) : "";
    }
    self.input.value = getDateStr(self.config.dateFormat);
    if (self.altInput !== void 0) {
      self.altInput.value = getDateStr(self.config.altFormat);
    }
    if (triggerChange2 !== false)
      triggerEvent("onValueUpdate");
  }
  function onMonthNavClick(e) {
    const eventTarget = getEventTarget(e);
    const isPrevMonth = self.prevMonthNav.contains(eventTarget);
    const isNextMonth = self.nextMonthNav.contains(eventTarget);
    if (isPrevMonth || isNextMonth) {
      changeMonth(isPrevMonth ? -1 : 1);
    } else if (self.yearElements.indexOf(eventTarget) >= 0) {
      eventTarget.select();
    } else if (eventTarget.classList.contains("arrowUp")) {
      self.changeYear(self.currentYear + 1);
    } else if (eventTarget.classList.contains("arrowDown")) {
      self.changeYear(self.currentYear - 1);
    }
  }
  function timeWrapper(e) {
    e.preventDefault();
    const isKeyDown = e.type === "keydown", eventTarget = getEventTarget(e), input = eventTarget;
    if (self.amPM !== void 0 && eventTarget === self.amPM) {
      self.amPM.textContent = self.l10n.amPM[int(self.amPM.textContent === self.l10n.amPM[0])];
    }
    const min = parseFloat(input.getAttribute("min")), max = parseFloat(input.getAttribute("max")), step = parseFloat(input.getAttribute("step")), curValue = parseInt(input.value, 10), delta = e.delta || (isKeyDown ? e.which === 38 ? 1 : -1 : 0);
    let newValue = curValue + step * delta;
    if (typeof input.value !== "undefined" && input.value.length === 2) {
      const isHourElem = input === self.hourElement, isMinuteElem = input === self.minuteElement;
      if (newValue < min) {
        newValue = max + newValue + int(!isHourElem) + (int(isHourElem) && int(!self.amPM));
        if (isMinuteElem)
          incrementNumInput(void 0, -1, self.hourElement);
      } else if (newValue > max) {
        newValue = input === self.hourElement ? newValue - max - int(!self.amPM) : min;
        if (isMinuteElem)
          incrementNumInput(void 0, 1, self.hourElement);
      }
      if (self.amPM && isHourElem && (step === 1 ? newValue + curValue === 23 : Math.abs(newValue - curValue) > step)) {
        self.amPM.textContent = self.l10n.amPM[int(self.amPM.textContent === self.l10n.amPM[0])];
      }
      input.value = pad(newValue);
    }
  }
  init();
  return self;
}
function _flatpickr(nodeList, config) {
  const nodes = Array.prototype.slice.call(nodeList).filter((x) => x instanceof HTMLElement);
  const instances = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    try {
      if (node.getAttribute("data-fp-omit") !== null)
        continue;
      if (node._flatpickr !== void 0) {
        node._flatpickr.destroy();
        node._flatpickr = void 0;
      }
      node._flatpickr = FlatpickrInstance(node, config || {});
      instances.push(node._flatpickr);
    } catch (e) {
      console.error(e);
    }
  }
  return instances.length === 1 ? instances[0] : instances;
}
if (typeof HTMLElement !== "undefined" && typeof HTMLCollection !== "undefined" && typeof NodeList !== "undefined") {
  HTMLCollection.prototype.flatpickr = NodeList.prototype.flatpickr = function(config) {
    return _flatpickr(this, config);
  };
  HTMLElement.prototype.flatpickr = function(config) {
    return _flatpickr([this], config);
  };
}
var flatpickr = function(selector, config) {
  if (typeof selector === "string") {
    return _flatpickr(window.document.querySelectorAll(selector), config);
  } else if (selector instanceof Node) {
    return _flatpickr([selector], config);
  } else {
    return _flatpickr(selector, config);
  }
};
flatpickr.defaultConfig = {};
flatpickr.l10ns = {
  en: Object.assign({}, english),
  default: Object.assign({}, english)
};
flatpickr.localize = (l10n) => {
  flatpickr.l10ns.default = Object.assign(Object.assign({}, flatpickr.l10ns.default), l10n);
};
flatpickr.setDefaults = (config) => {
  flatpickr.defaultConfig = Object.assign(Object.assign({}, flatpickr.defaultConfig), config);
};
flatpickr.parseDate = createDateParser({});
flatpickr.formatDate = createDateFormatter({});
flatpickr.compareDates = compareDates;
if (typeof jQuery !== "undefined" && typeof jQuery.fn !== "undefined") {
  jQuery.fn.flatpickr = function(config) {
    return _flatpickr(this, config);
  };
}
Date.prototype.fp_incr = function(days) {
  return new Date(this.getFullYear(), this.getMonth(), this.getDate() + (typeof days === "string" ? parseInt(days, 10) : days));
};
if (typeof window !== "undefined") {
  window.flatpickr = flatpickr;
}
const ProgressBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let indeterminate;
  let capped;
  let $$restProps = compute_rest_props($$props, ["value", "max", "labelText", "hideLabel", "helperText", "id"]);
  let { value = void 0 } = $$props;
  let { max = 100 } = $$props;
  let { labelText = "" } = $$props;
  let { hideLabel = false } = $$props;
  let { helperText = "" } = $$props;
  let { id = "ccs-" + Math.random().toString(36) } = $$props;
  let helperId = "ccs-" + Math.random().toString(36);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.max === void 0 && $$bindings.max && max !== void 0)
    $$bindings.max(max);
  if ($$props.labelText === void 0 && $$bindings.labelText && labelText !== void 0)
    $$bindings.labelText(labelText);
  if ($$props.hideLabel === void 0 && $$bindings.hideLabel && hideLabel !== void 0)
    $$bindings.hideLabel(hideLabel);
  if ($$props.helperText === void 0 && $$bindings.helperText && helperText !== void 0)
    $$bindings.helperText(helperText);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  indeterminate = value === void 0;
  capped = value > max ? max : value < 0 ? 0 : value;
  return `<div${spread([escape_object($$restProps)], {
    classes: "bx--progress-bar " + (indeterminate ? "bx--progress-bar--indeterminate" : "")
  })}><label${add_attribute("for", id, 0)}${add_classes(("bx--progress-bar__label " + (hideLabel ? "bx--visually-hidden" : "")).trim())}>${slots.labelText ? slots.labelText({}) : `
      ${escape(labelText)}
    `}</label>
  <div role="${"progressbar"}"${add_attribute("id", id, 0)}${add_attribute("aria-valuemin", indeterminate ? void 0 : 0, 0)}${add_attribute("aria-valuemax", indeterminate ? void 0 : max, 0)}${add_attribute("aria-valuenow", indeterminate ? void 0 : capped, 0)}${add_attribute("aria-describedby", helperText ? helperId : null, 0)}${add_classes("bx--progress-bar__track".trim())}><div style="${"transform: scaleX(" + escape(capped / max) + ")"}"${add_classes("bx--progress-bar__bar".trim())}></div></div>
  ${helperText ? `<div${add_attribute("id", helperId, 0)}${add_classes("bx--progress-bar__helper-text".trim())}>${escape(helperText)}</div>` : ``}</div>`;
});
var HeaderAction_svelte_svelte_type_style_lang = "";
var HeaderActionLink_svelte_svelte_type_style_lang = "";
const data = [
  {
    href: "#",
    title: "Test title search 1",
    menu: "Test menu 1",
    description: "This is a description for seach #1"
  },
  {
    href: "#",
    title: "Changing text to simulate search",
    menu: "Test menu 2",
    description: "This is a description for seach #2"
  },
  {
    href: "#",
    title: "More testing texts",
    menu: "Test menu 3",
    description: "This is a description for seach #3"
  },
  {
    href: "#",
    title: "We can find here another test text",
    menu: "Test menu 4",
    description: "This is a description for seach #4"
  }
];
const globalStore = writable(void 0);
({
  subscribe: globalStore.subscribe,
  search: (searchString) => {
    if (searchString.length > 1) {
      let resultSearch = [];
      data.forEach((item) => {
        if (item.title.toLowerCase().includes(searchString.toLowerCase())) {
          resultSearch.push(item);
        }
      });
      if (resultSearch.length > 0) {
        globalStore.set(resultSearch);
      } else {
        globalStore.set(void 0);
      }
    } else {
      globalStore.set(void 0);
    }
  },
  clear: () => {
    globalStore.set(void 0);
  }
});
var HeaderActionSearch_svelte_svelte_type_style_lang = "";
var HeaderPanelDivider_svelte_svelte_type_style_lang = "";
var HeaderSearch_svelte_svelte_type_style_lang = "";
var AddProfileGroup_svelte_svelte_type_style_lang = "";
const css$5 = {
  code: ".errmsg.svelte-7mms2t{background-color:transparent;color:red;overflow:auto}",
  map: null
};
const AddProfileGroup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_profileTreeRoot;
  $$unsubscribe_profileTreeRoot = subscribe(profileTreeRoot, (value) => value);
  let { isActive } = $$props;
  let Name;
  let nameError;
  let nameHelp;
  let isError;
  let errorMsg;
  let errorRows;
  let isProgress;
  function resetState() {
    Name = "";
    nameError = false;
    isError = false;
    isProgress = false;
    isActive = false;
  }
  resetState();
  createEventDispatcher();
  if ($$props.isActive === void 0 && $$bindings.isActive && isActive !== void 0)
    $$bindings.isActive(isActive);
  $$result.css.add(css$5);
  $$unsubscribe_profileTreeRoot();
  return `<div class="${"modal " + escape(isActive ? "is-active" : "")}"><div class="${"modal-card box"}"><header><p class="${"modal-card-title"}">Add Profile Folder</p></header>
    <section class="${"modal-card-body"}"><div class="${"field"}">
        <label class="${"label"}">Name</label>
        <div class="${"control"}"><input class="${"input " + escape(nameError ? "is-danger" : "is-info")}" type="${"text"}" placeholder="${"Text input"}"${add_attribute("value", Name, 0)}>
          ${nameError ? `<p class="${"help"}">${escape(nameHelp)}</p>` : ``}</div></div>

      <div class="${"field is-grouped"}"><div class="${"control"}"><button class="${"button is-info"}">Add</button></div>
        <div class="${"control"}"><button class="${"button is-info is-light"}">Cancel</button></div></div>

      ${isProgress ? `<div class="${"field"}"><div class="${"control"}">${validate_component(ProgressBar, "ProgressBar").$$render($$result, { helperText: "" }, {}, {})}</div></div>` : ``}

      ${isError ? `<div class="${"field"}">
          <label class="${"label"}">Error</label>
          <div class="${"control"}"><textarea class="${"textarea errmsg svelte-7mms2t"}" placeholder="${""}"${add_attribute("rows", errorRows, 0)} readonly>${escape(errorMsg)}</textarea></div></div>` : ``}</section></div>
</div>`;
});
const AddProfile = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_selectedNode;
  $$unsubscribe_selectedNode = subscribe(selectedNode, (value) => value);
  let { isActive } = $$props;
  let Name = "";
  createEventDispatcher();
  if ($$props.isActive === void 0 && $$bindings.isActive && isActive !== void 0)
    $$bindings.isActive(isActive);
  $$unsubscribe_selectedNode();
  return `<div class="${"modal " + escape(isActive ? "is-active" : "")}"><div class="${"modal-background"}"></div>
    <div class="${"modal-card box "}"><header><p class="${"modal-card-title "}">New Profile</p></header>
      <section class="${"modal-card-body"}"><div class="${"columns is-multiline is-mobile"}"><div class="${"column is-half"}"><div class="${"field"}">
              <label class="${"label "}">Name</label>
              <div class="${"control"}"><input class="${"input "}" type="${"text"}" placeholder="${"Text input"}"${add_attribute("value", Name, 0)}></div></div></div>

          <div class="${"column is-half"}"><div class="${"field"}">
              <label class="${"label "}">Type</label>
              <div class="${"select is-fullwidth "}"><select class="${""}"><option value="${"TLS Client -- TLS Server"}">TLS Client -- TLS Server</option></select></div></div></div>
          <br>
          <div class="${"column is-half"}"><div class="${"field"}">
              <label class="${"label "}">Client Port</label>
              <div class="${"select is-fullwidth "}"><select class="${""}"><option value="${"Select Port"}">Select Port</option><option value="${"G1:N1:ens192"}">G1:N1:ens192</option><option value="${"G1:N1:ens224"}">G1:N1:ens224</option></select></div></div></div>

          <div class="${"column is-half"}"><div class="${"field"}">
              <label class="${"label "}">Server Port</label>
              <div class="${"select is-fullwidth "}"><select class="${""}"><option value="${"Select Port"}">Select Port</option><option value="${"G1:N1:ens192"}">G1:N1:ens192</option><option value="${"G1:N1:ens224"}">G1:N1:ens224</option></select></div></div></div></div>
        <div class="${"field is-grouped"}"><div class="${"control"}"><button class="${"button is-info"}">Add</button></div>
          <div class="${"control"}"><button class="${"button is-light"}">Cancel</button></div></div></section></div>
</div>`;
});
var TrafficProfiles_svelte_svelte_type_style_lang = "";
const css$4 = {
  code: "ul.svelte-2on8hh{list-style-type:none;padding:0;margin:0}",
  map: null
};
const TrafficProfiles = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $profileTreeRoot, $$unsubscribe_profileTreeRoot;
  let $$unsubscribe_selectedNode;
  $$unsubscribe_profileTreeRoot = subscribe(profileTreeRoot, (value) => $profileTreeRoot = value);
  $$unsubscribe_selectedNode = subscribe(selectedNode, (value) => value);
  let showAddProfileGroup = false;
  let showAddProfile = false;
  $$result.css.add(css$4);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<ul class="${"svelte-2on8hh"}">${validate_component(Treenode, "Treenode").$$render($$result, {
      node: $profileTreeRoot,
      pnode: $profileTreeRoot,
      level: 1,
      type: "ProfileTreeRoot"
    }, {}, {})}

  ${$profileTreeRoot.expanded && $profileTreeRoot.children ? `${each($profileTreeRoot.children, (child) => {
      return `${validate_component(Treenode, "Treenode").$$render($$result, {
        node: child,
        pnode: $profileTreeRoot,
        level: 2,
        type: "ProfileGroup"
      }, {}, {})}

          ${child.expanded && child.children ? `${each(child.children, (grandChild) => {
        return `${validate_component(Treenode, "Treenode").$$render($$result, {
          node: grandChild,
          pnode: child,
          level: 3,
          type: "Profile"
        }, {}, {})}`;
      })}` : ``}`;
    })}` : ``}</ul> 

${validate_component(AddProfileGroup, "AddProfileGroup").$$render($$result, { isActive: showAddProfileGroup }, {
      isActive: ($$value) => {
        showAddProfileGroup = $$value;
        $$settled = false;
      }
    }, {})}

${validate_component(AddProfile, "AddProfile").$$render($$result, { isActive: showAddProfile }, {
      isActive: ($$value) => {
        showAddProfile = $$value;
        $$settled = false;
      }
    }, {})}`;
  } while (!$$settled);
  $$unsubscribe_profileTreeRoot();
  $$unsubscribe_selectedNode();
  return $$rendered;
});
var AddNodeGroup_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: ".errmsg.svelte-lyudnp{background-color:transparent;color:red;overflow:auto}",
  map: null
};
const AddNodeGroup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_nodeTreeRoot;
  $$unsubscribe_nodeTreeRoot = subscribe(nodeTreeRoot, (value) => value);
  let { isActive } = $$props;
  let Name;
  let nameError;
  let nameHelp;
  let isError;
  let errorMsg;
  let errorRows;
  let isProgress;
  function resetState() {
    Name = "";
    nameError = false;
    isError = false;
    isProgress = false;
    isActive = false;
  }
  resetState();
  createEventDispatcher();
  if ($$props.isActive === void 0 && $$bindings.isActive && isActive !== void 0)
    $$bindings.isActive(isActive);
  $$result.css.add(css$3);
  $$unsubscribe_nodeTreeRoot();
  return `<div class="${"modal " + escape(isActive ? "is-active" : "")}"><div class="${"modal-card box"}"><header><p class="${"modal-card-title"}">Add Node Folder</p></header>
      <section class="${"modal-card-body"}"><div class="${"field"}">
          <label class="${"label"}">Name</label>
          <div class="${"control"}"><input class="${"input " + escape(nameError ? "is-danger" : "is-info")}" type="${"text"}" placeholder="${""}"${add_attribute("value", Name, 0)}>
            ${nameError ? `<p class="${"help"}">${escape(nameHelp)}</p>` : ``}</div></div>

        <div class="${"field is-grouped"}"><div class="${"control"}"><button class="${"button is-info"}">Add</button></div>
          <div class="${"control"}"><button class="${"button is-info is-light"}">Cancel</button></div></div>

        ${isProgress ? `<div class="${"field"}"><div class="${"control"}">${validate_component(ProgressBar, "ProgressBar").$$render($$result, { helperText: "" }, {}, {})}</div></div>` : ``}

        ${isError ? `<div class="${"field"}">
            <label class="${"label"}">Error</label>
            <div class="${"control"}"><textarea class="${"textarea errmsg svelte-lyudnp"}" placeholder="${""}"${add_attribute("rows", errorRows, 0)} readonly>${escape(errorMsg)}</textarea></div></div>` : ``}</section></div>
</div>`;
});
var AddNode_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: ".errmsg.svelte-1s6x7wp{background-color:transparent;color:red;overflow:auto}",
  map: null
};
const AddNode = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_selectedNode;
  let $$unsubscribe_nodeTreeRoot;
  $$unsubscribe_selectedNode = subscribe(selectedNode, (value) => value);
  $$unsubscribe_nodeTreeRoot = subscribe(nodeTreeRoot, (value) => value);
  let { isActive } = $$props;
  let Name;
  let nameError;
  let nameHelp;
  let SshIP;
  let sshIPError;
  let sshIPHelp;
  let SshUser;
  let sshUserError;
  let sshUserHelp;
  let SshPass;
  let sshPassError;
  let sshPassHelp;
  let isError;
  let errorMsg;
  let errorRows;
  let isProgress;
  function resetState() {
    Name = "";
    nameError = false;
    SshIP = "";
    sshIPError = false;
    SshUser = "";
    sshUserError = false;
    SshPass = "";
    sshPassError = false;
    isError = false;
    isProgress = false;
    isActive = false;
  }
  resetState();
  createEventDispatcher();
  if ($$props.isActive === void 0 && $$bindings.isActive && isActive !== void 0)
    $$bindings.isActive(isActive);
  $$result.css.add(css$2);
  $$unsubscribe_selectedNode();
  $$unsubscribe_nodeTreeRoot();
  return `<div class="${"modal " + escape(isActive ? "is-active" : "")}"><div class="${"modal-card box"}"><header><p class="${"modal-card-title"}">Add Node</p></header>
      <section class="${"modal-card-body"}"><div class="${"field"}">
          <label class="${"label"}">Alias</label>
          <div class="${"control"}"><input class="${"input " + escape(nameError ? "is-danger" : "is-info")}" type="${"text"}" placeholder="${""}"${add_attribute("value", Name, 0)}>
            ${nameError ? `<p class="${"help"}">${escape(nameHelp)}</p>` : ``}</div></div>

        <div class="${"field"}">
          <label class="${"label"}">Ssh IP</label>
          <div class="${"control"}"><input class="${"input " + escape(sshIPError ? "is-danger" : "is-info")}" type="${"text"}" placeholder="${""}"${add_attribute("value", SshIP, 0)}>
            ${sshIPError ? `<p class="${"help"}">${escape(sshIPHelp)}</p>` : ``}</div></div>

        <div class="${"field"}">
          <label class="${"label"}">Ssh User</label>
          <div class="${"control"}"><input class="${"input " + escape(sshUserError ? "is-danger" : "is-info")}" type="${"text"}" placeholder="${""}"${add_attribute("value", SshUser, 0)}>
            ${sshUserError ? `<p class="${"help"}">${escape(sshUserHelp)}</p>` : ``}</div></div>

        <div class="${"field"}">
          <label class="${"label"}">Ssh Pass</label>
          <div class="${"control"}"><input class="${"input " + escape(sshPassError ? "is-danger" : "is-info")}" type="${"password"}" placeholder="${""}"${add_attribute("value", SshPass, 0)}>
            ${sshPassError ? `<p class="${"help"}">${escape(sshPassHelp)}</p>` : ``}</div></div>

        <div class="${"field is-grouped"}"><div class="${"control"}"><button class="${"button is-info"}">Add</button></div>
          <div class="${"control"}"><button class="${"button is-info is-light"}">Cancel</button></div></div>

        ${isProgress ? `<div class="${"field"}"><div class="${"control"}">${validate_component(ProgressBar, "ProgressBar").$$render($$result, { helperText: "" }, {}, {})}</div></div>` : ``}

        ${isError ? `<div class="${"field"}">
            <label class="${"label"}">Error</label>
            <div class="${"control"}"><textarea class="${"textarea errmsg svelte-1s6x7wp"}" placeholder="${""}"${add_attribute("rows", errorRows, 0)} readonly>${escape(errorMsg)}</textarea></div></div>` : ``}</section></div>
</div>`;
});
var TrafficNodes_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "ul.svelte-2on8hh{list-style-type:none;padding:0;margin:0}",
  map: null
};
const TrafficNodes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $nodeTreeRoot, $$unsubscribe_nodeTreeRoot;
  let $$unsubscribe_selectedNode;
  $$unsubscribe_nodeTreeRoot = subscribe(nodeTreeRoot, (value) => $nodeTreeRoot = value);
  $$unsubscribe_selectedNode = subscribe(selectedNode, (value) => value);
  let showAddNodeGroup = false;
  let showAddNode = false;
  $$result.css.add(css$1);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<ul class="${"svelte-2on8hh"}">${validate_component(Treenode, "Treenode").$$render($$result, {
      node: $nodeTreeRoot,
      pnode: $nodeTreeRoot,
      level: 1,
      type: "NodeTreeRoot"
    }, {}, {})}

  ${$nodeTreeRoot.expanded && $nodeTreeRoot.children ? `${each($nodeTreeRoot.children, (child) => {
      return `${validate_component(Treenode, "Treenode").$$render($$result, {
        node: child,
        pnode: $nodeTreeRoot,
        level: 2,
        type: "NodeGroup"
      }, {}, {})}

          ${child.expanded && child.children ? `${each(child.children, (grandChild) => {
        return `${validate_component(Treenode, "Treenode").$$render($$result, {
          node: grandChild,
          pnode: child,
          level: 3,
          type: "Node"
        }, {}, {})}`;
      })}` : ``}`;
    })}` : ``}</ul>

${validate_component(AddNodeGroup, "AddNodeGroup").$$render($$result, { isActive: showAddNodeGroup }, {
      isActive: ($$value) => {
        showAddNodeGroup = $$value;
        $$settled = false;
      }
    }, {})}

${validate_component(AddNode, "AddNode").$$render($$result, { isActive: showAddNode }, {
      isActive: ($$value) => {
        showAddNode = $$value;
        $$settled = false;
      }
    }, {})}`;
  } while (!$$settled);
  $$unsubscribe_nodeTreeRoot();
  $$unsubscribe_selectedNode();
  return $$rendered;
});
var __layout_svelte_svelte_type_style_lang = "";
const css = {
  code: ".topbar.svelte-1to6t4u{position:sticky;border-bottom:1px solid lightgray}.leftbar.svelte-1to6t4u{height:calc(100vh - 3.25rem);border-right:1px solid lightgrey;overflow:scroll}.rightbar.svelte-1to6t4u{height:calc(100vh - 3.25rem);overflow:scroll}",
  map: null
};
const _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $profileTreeRoot, $$unsubscribe_profileTreeRoot;
  let $nodeTreeRoot, $$unsubscribe_nodeTreeRoot;
  $$unsubscribe_profileTreeRoot = subscribe(profileTreeRoot, (value) => $profileTreeRoot = value);
  $$unsubscribe_nodeTreeRoot = subscribe(nodeTreeRoot, (value) => $nodeTreeRoot = value);
  let NodeGroupRootMenuItems = [
    {
      "Name": "Add Folder ...",
      "Event": "addNodeGroup",
      "EventCtx": {}
    }
  ];
  let NodeGroupMenuItems = [
    {
      "Name": "Add Node ...",
      "Event": "addNode",
      "EventCtx": {}
    }
  ];
  let ProfileGroupRootMenuItems = [
    {
      "Name": "Add Folder ...",
      "Event": "addProfileGroup",
      "EventCtx": {}
    }
  ];
  let ProfileGroupMenuItems = [
    {
      "Name": "Add Profile ...",
      "Event": "addProfile",
      "EventCtx": {}
    }
  ];
  async function getStorePopulated() {
    const nodeGroups = await fetch("/api/node_groups.json");
    const nodes = await fetch("/api/nodes.json");
    const profileGroups = await fetch("/api/profile_groups.json");
    const profiles = await fetch("/api/profiles.json");
    if (nodeGroups.ok && nodes.ok) {
      const nodeGroupList = await nodeGroups.json();
      const nodeList = await nodes.json();
      set_store_value(nodeTreeRoot, $nodeTreeRoot.MenuItems = NodeGroupRootMenuItems, $nodeTreeRoot);
      for (const nodeGroup of nodeGroupList) {
        const nodeGroupNodeList = nodeList.filter((n) => n.Group == nodeGroup.Name);
        const nodeGroupNodeList2 = nodeGroupNodeList.map((n) => ({
          ...n,
          UrlPath: "/node/" + nodeGroup.Name + "/" + n.Name,
          UrlPathView: "/node/" + nodeGroup.Name + "/" + n.Name
        }));
        nodeGroup.expanded = false;
        nodeGroup.children = nodeGroupNodeList2;
        nodeGroup.MenuItems = NodeGroupMenuItems;
        $nodeTreeRoot.children.push(nodeGroup);
      }
    }
    if (profileGroups.ok && profiles.ok) {
      const profileGroupList = await profileGroups.json();
      const profileList = await profiles.json();
      set_store_value(profileTreeRoot, $profileTreeRoot.MenuItems = ProfileGroupRootMenuItems, $profileTreeRoot);
      for (const profileGroup of profileGroupList) {
        const profileGroupProfileList = profileList.filter((n) => n.Group == profileGroup.Name);
        const profileGroupProfileList2 = profileGroupProfileList.map((n) => ({
          ...n,
          UrlPath: "/profile/" + profileGroup.Name + "/" + n.Name,
          UrlPathView: "/profile/" + profileGroup.Name + "/" + n.Name
        }));
        profileGroup.expanded = false;
        profileGroup.children = profileGroupProfileList2;
        profileGroup.MenuItems = ProfileGroupMenuItems;
        $profileTreeRoot.children.push(profileGroup);
      }
    }
    return 0;
  }
  let nodeGroupsPromise = getStorePopulated();
  $$result.css.add(css);
  $$unsubscribe_profileTreeRoot();
  $$unsubscribe_nodeTreeRoot();
  return `

${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return `
	<p>Loading ...</p>
`;
    }
    return function() {
      return `
    
    <nav class="${"navbar topbar is-dark has-shadow svelte-1to6t4u"}" role="${"navigation"}" aria-label="${"main navigation"}"><div class="${"navbar-brand"}"><a class="${"navbar-item"}" href="${"/"}"><p class="${"is-size-6"}">MyTLS</p></a>
            
            <a role="${"button"}" class="${"navbar-burger"}" aria-label="${"menu"}" aria-expanded="${"false"}" data-target="${"navbarTopMenu"}"><span aria-hidden="${"true"}"></span>
                <span aria-hidden="${"true"}"></span>
                <span aria-hidden="${"true"}"></span></a></div>

        <div id="${"navbarTopMenu"}" class="${["navbar-menu", ""].join(" ").trim()}"><div class="${"navbar-start"}"></div>

            <div class="${"navbar-end"}"><div class="${"navbar-item"}"><div class="${"buttons"}"><button class="${"button is-info is-small"}">Sign in</button>
                        <button class="${"button is-info is-small is-outlined"}">Sign up</button></div></div></div></div></nav>

    <div class="${"columns is-gapless"}"><div class="${"column is-one-fifth"}"><div class="${"leftbar svelte-1to6t4u"}">${validate_component(TrafficNodes, "TrafficNodes").$$render($$result, {}, {}, {})}
                ${validate_component(TrafficProfiles, "TrafficProfiles").$$render($$result, {}, {}, {})}</div></div>

        <div class="${"column"}"><div class="${"container rightbar svelte-1to6t4u"}">${slots.default ? slots.default({}) : ``}</div></div></div>
`;
    }();
  }(nodeGroupsPromise)}`;
});
export { _layout as default };
