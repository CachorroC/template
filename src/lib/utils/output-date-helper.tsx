export default function OutputDateHelper({
  incomingDate,
}: {
  incomingDate: string | Date | null | undefined;
}) {
  if (!incomingDate) {
    return 'sin especificar';
  }

  // 1. Create the Date object safely
  const dateObj = new Date(incomingDate);

  // 2. Validate it
  if (isNaN(dateObj.getTime())) {
    return 'Fecha inválida';
  }

  // 3. The Magic Fix:
  // We force 'UTC' timezone.
  // - Old dates (00:00 UTC) show as 12:00 AM on the correct day.
  // - New dates (05:00 UTC) show as 05:00 AM on the correct day.
  // Neither will shift to "Yesterday".
  return dateObj.toLocaleString('es-CO', {
    timeZone: 'UTC',
    year: 'numeric',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
