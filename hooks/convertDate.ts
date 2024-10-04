//2024-07-24 -> 24-07-2024
export const dateConverter = (date: string) => {
    const [year, month, day] = date.split('-')
    return `${day}-${month}-${year}`
}