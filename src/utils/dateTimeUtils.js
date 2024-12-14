export function durationToSeconds(duration) {
  const daysInSeconds = (duration.days || 0) * 86400;
  const hoursInSeconds = (duration.hours || 0) * 3600;
  const minutesInSeconds = (duration.minutes || 0) * 60;
  return daysInSeconds + hoursInSeconds + minutesInSeconds;
}

export function formatDate(date) {
  return new Date(date).toLocaleString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export function getTime(date) {
  return new Date(date).toLocaleString("en-us", {
    hour: "numeric",
    minute: "numeric",
  });
}
