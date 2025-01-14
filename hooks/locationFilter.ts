export const locationFilter = (name: string | undefined, type: 'District' | 'Province' | 'Ward') => {
    if (name === undefined) return ''
    if (name.length === 0) return ''
    let filter = name
    switch (type) {
        case "Province": {
            filter = filter.includes('Tỉnh ')
                ? filter.replace('Tỉnh ', '')
                : filter.includes('Thành phố ')
                    ? filter.replace('Thành phố ', 'Tp. ')
                    : filter
            break;
        }
        case "District": {
            filter = filter.includes('Thành Phố ')
                ? filter.replace('Thành Phố ', 'Tp. ')
                : filter.includes('Thành phố ')
                    ? filter.replace('Thành phố ', 'Tp. ')
                    : filter.includes('Quận ')
                        ? filter.replace('Quận ', '')
                        : filter.includes('Huyện ')
                            ? filter.replace('Huyện ', '')
                            : filter.includes('Thị xã ')
                                ? filter.replace('Thị xã ', 'Tx. ')
                                : filter
            break
        }
        default: return filter
    }
    return filter
}

export const locationNameFormatter = (name: string) => {
    if (name.length === 0) return ''
    return name
        .replace('Tp. ', '')
        .replace('Tx. ', '')
}