/**
150 => 150 ₫
**/
export const currencyFormat = (num: number) => {
    return new Intl.NumberFormat(
        'vi-VN',
        { style: 'currency', currency: 'VND' }).format(num)
}

/**
15000 => 15.000
**/
export const formatCurrency = (num: number | string) => {
    return new Intl.NumberFormat().format(typeof num === 'string' ? parseInt(num.replaceAll(' ', '')) : num).replaceAll(',', ' ')
}