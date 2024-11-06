export function getWeekStart (date) {
    const currentDate = new Date(date)
    const dayOfWeek = currentDate.getDay()
    currentDate.setDate(currentDate.getDate() - dayOfWeek)
    currentDate.setHours(0,0,0,0)
    return currentDate
}

