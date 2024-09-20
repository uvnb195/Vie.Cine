export const bgColor = (value: string) => {
    return { backgroundColor: value }
}

export const shadowImageStyle = (color: string) => ({
    shadowColor: color,
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.41,

    elevation: 5,
})