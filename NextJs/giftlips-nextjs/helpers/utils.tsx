import { devLog } from "./logger";

export const findAndSetSvg = async (cardData: any) => {
  devLog("findAndSetSvg", cardData);

  try {
    if (!cardData.assets.length) {
      return cardData.template.assets[0].url;
    }

    return cardData.assets[0].url;
  } catch (e) {
    devLog(e);
    return "";
  }
};

export const getActivityDisplayName = (activity: any, currentUser: any) => {
  devLog(activity, currentUser);

  return activity.actor?._id === currentUser?.user?.id
    ? "You"
    : activity.actor?.firstName;
};

export const filetypeOptions = [
  { label: "File type: PDF", value: "pdf" },
  { label: "File type: PNG", value: "png" },
  { label: "File type: JPEG", value: "jpeg" },
  { label: "File type: SVG", value: "svg" },
];

export const cleanWpUrl = (input: string) => {
  devLog("cleanWpUrl", input);

  if (input) {
    return input
      .replace("http://cms.gifltips.com", "https://www.giftlips.com")
      .replace("https://cms.gifltips.com", "https://www.giftlips.com")
      .replace("https://www.cms.gifltips.com", "https://www.giftlips.com");
  }

  return "";
};

export const pageSizeOptions = [
  { label: "4A0", value: "4A0" },
  { label: "2A0", value: "2A0" },
  { label: "A0", value: "A0" },
  { label: "A1", value: "A1" },
  { label: "A2", value: "A2" },
  { label: "A3", value: "A3" },
  { label: "A4", value: "A4" },
  { label: "A5", value: "A5" },
  { label: "A6", value: "A6" },
  { label: "A7", value: "A7" },
  { label: "A8", value: "A8" },
  { label: "A9", value: "A9" },
  { label: "A10", value: "A10" },
  { label: "B0", value: "B0" },
  { label: "B1", value: "B1" },
  { label: "B2", value: "B2" },
  { label: "B3", value: "B3" },
  { label: "B4", value: "B4" },
  { label: "B5", value: "B5" },
  { label: "B6", value: "B6" },
  { label: "B7", value: "B7" },
  { label: "B8", value: "B8" },
  { label: "B9", value: "B9" },
  { label: "B10", value: "B10" },
  { label: "C0", value: "C0" },
  { label: "C1", value: "C1" },
  { label: "C2", value: "C2" },
  { label: "C3", value: "C3" },
  { label: "C4", value: "C4" },
  { label: "C5", value: "C5" },
  { label: "C6", value: "C6" },
  { label: "C7", value: "C7" },
  { label: "C8", value: "C8" },
  { label: "C9", value: "C9" },
  { label: "C10", value: "C10" },
  { label: "RA0", value: "RA0" },
  { label: "RA1", value: "RA1" },
  { label: "RA2", value: "RA2" },
  { label: "RA3", value: "RA3" },
  { label: "RA4", value: "RA4" },
  { label: "SRA0", value: "SRA0" },
  { label: "SRA1", value: "SRA1" },
  { label: "SRA2", value: "SRA2" },
  { label: "SRA3", value: "SRA3" },
  { label: "SRA4", value: "SRA4" },
  { label: "EXECUTIVE", value: "EXECUTIVE" },
  { label: "FOLIO", value: "FOLIO" },
  { label: "LEGAL", value: "LEGAL" },
  { label: "LETTER", value: "LETTER" },
  { label: "TABLOID", value: "TABLOID" },
];

export const formatBytes = (b: number) => {
  const units = ["bytes", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let l = 0;
  let n = b;

  while (n >= 1024) {
    n /= 1024;
    l += 1;
  }

  return `${n.toFixed(n >= 10 || l < 1 ? 0 : 1)}${units[l]}`;
};

export const formatDuration = (seconds: number) => {
  const date = new Date(0);

  date.setSeconds(seconds);

  const dateString = date.toISOString().slice(11, 19);

  if (seconds < 3600) {
    return dateString.slice(3);
  }

  return dateString;
};

export const checkDeviceType = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/android/.test(userAgent)) {
    return "android";
  } else if (/iphone|ipad|ipod/.test(userAgent)) {
    return "iOS";
  }

  return "desktop";
};

export const checkBrowserType = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.indexOf("firefox") > -1) {
    return "firefox";
  } else if (userAgent.indexOf("chrome") > -1) {
    return "chrome";
  } else if (userAgent.indexOf("safari") > -1) {
    return "safari";
  } else if (userAgent.indexOf("opera") > -1 || userAgent.indexOf("opr") > -1) {
    return "opera";
  } else if (userAgent.indexOf("edge") > -1) {
    return "edge";
  } else if (
    userAgent.indexOf("ie") > -1 ||
    userAgent.indexOf("trident") > -1
  ) {
    return "ie";
  }

  return "unknown";
};

export const getFileType = (recordType: string): string => {
  if (recordType === "video") {
    return `${recordType}/mp4`;
  }

  return `${recordType}/wav`;
};
