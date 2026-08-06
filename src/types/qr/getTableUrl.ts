const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://digital-bar-orpin.vercel.app/";

export function getTableUrl(
  table: number
) {
  return `${APP_URL}/?mesa=${table}`;
}