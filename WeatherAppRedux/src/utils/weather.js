function shiftedDate(unixSeconds, timezoneOffsetSeconds) {
  return new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
}

export function formatLocalTime(unixSeconds, timezoneOffsetSeconds) {
  const date = shiftedDate(unixSeconds, timezoneOffsetSeconds);
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function isDaytime(now, sunrise, sunset) {
  return now >= sunrise && now < sunset;
}

export function localDateParts(unixSeconds, timezoneOffsetSeconds) {
  const date = shiftedDate(unixSeconds, timezoneOffsetSeconds);
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    day: date.getUTCDate(),
    hours: date.getUTCHours(),
    weekday: date.getUTCDay(),
  };
}

export function localDateKey(unixSeconds, timezoneOffsetSeconds) {
  const parts = localDateParts(unixSeconds, timezoneOffsetSeconds);
  const month = String(parts.month + 1).padStart(2, "0");
  const day = String(parts.day).padStart(2, "0");
  return `${parts.year}-${month}-${day}`;
}
