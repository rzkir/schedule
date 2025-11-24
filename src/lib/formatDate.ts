import { format } from "date-fns";
import { id } from "date-fns/locale";

export function FormatIndoDate(
  date: Date | { toDate: () => Date } | null | undefined
) {
  if (!date) return "";
  const d = typeof date === "object" && "toDate" in date ? date.toDate() : date;
  if (!(d instanceof Date) || isNaN(d.getTime())) return "";
  return format(d, "d MMMM yyyy", { locale: id });
}
