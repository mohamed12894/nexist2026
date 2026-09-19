export const money = (value: number | string) => new Intl.NumberFormat('en-TN', { style: 'currency', currency: 'TND', minimumFractionDigits: 2 }).format(Number(value))
export const dateTime = (value: string) => new Intl.DateTimeFormat('en-TN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
