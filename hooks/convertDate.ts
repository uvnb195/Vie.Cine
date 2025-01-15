//2024-07-24 -> 24-07-2024
export const dateConverter = (date: string | Date) => {
    if (!date) return ''
    if (typeof date === 'string') {
        const [year, month, day] = date.split('-')
        return `${day}-${month}-${year}`
    } else {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        return `${day}-${month}-${year}`
    }
}