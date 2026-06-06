export function formatDate(date: string | Date): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return value.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatTime(time: string): string {
  return time.slice(0, 5);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatDayOfWeek(day: string): string {
  const labels: Record<string, string> = {
    SUNDAY: "Domingo",
    MONDAY: "Segunda-feira",
    TUESDAY: "Terça-feira",
    WEDNESDAY: "Quarta-feira",
    THURSDAY: "Quinta-feira",
    FRIDAY: "Sexta-feira",
    SATURDAY: "Sábado",
  };
  return labels[day] ?? day;
}
