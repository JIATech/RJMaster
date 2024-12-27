import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function formatToLocalTime(utcDate: Date): string {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Detecta la zona horaria local
    const zonedDate = toZonedTime(utcDate, timeZone); // Convierte UTC a la zona horaria local
    return format(zonedDate, "yyyy-MM-dd HH:mm:ss"); // Ajusta el formato según lo necesites
}
