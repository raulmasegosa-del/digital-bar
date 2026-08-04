export function getElapsedMinutes(
  date: string
) {
  const created =
    new Date(date).getTime();

  const now = Date.now();

  return Math.floor(
    (now - created) / 60000
  );
}