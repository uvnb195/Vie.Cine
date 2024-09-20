import { useCustomTheme } from '@/src/contexts/theme'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import ExpandInput from '../input/ExpandInput'

interface Props {
    width?: number,
    heith?: number,
    itemSize: number
}

const ExpandedInputScrollView = ({ width, heith, itemSize }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const [data, setData] = React.useState<string[]>([])

    const scrollRef = React.useRef<ScrollView>(null)

    const handleRemoveData = (index: number) => {
        if (index >= data.length) return
        const tmp = [...data.slice(0, index), ...data.slice(index + 1)]
        setData(tmp)
        scrollRef.current?.scrollToEnd()
    }

    const handleUpdateData = (index: number, value: string) => {
        console.log(index, value)
        if (index >= data.length) {
            setData([...data, value])
        } else {
            const tmp = [...data]
            tmp[index] = value
            setData(tmp)
        }
        scrollRef.current?.scrollToEnd()
    }

    useEffect(() => {
        console.log(data)
    }, [data])


    const renders = () => {
        return Array.from({ length: data.length + 1 }).map((_, index) => (
            <ExpandInput key={index}
                isExpanded={true}
                title={'+'}
                width={itemSize}
                height={itemSize}
                onFinished={(value) => {
                    if (value.length === 0)
                        handleRemoveData(index)
                    else
                        handleUpdateData(index, value)

                }} />
        ))
    }

    return (
        <View className='w-full h-full'
            style={{
                width: width,
                height: heith
            }}>
            <ScrollView
                showsHorizontalScrollIndicator={false}
                ref={scrollRef}
                horizontal
                contentContainerStyle={{
                    columnGap: 8,
                }}
                bounces={false}
            >

                {renders()}

            </ScrollView>
        </View>
    )
}

export default ExpandedInputScrollView