import { View, Text, ViewStyle, Image } from 'react-native'
import React, { useEffect } from 'react'
import ThemeText from '../theme/ThemeText'
import CustomInput from '../input/CustomInput'
import { useCustomTheme } from '@/src/contexts/theme'
import CustomButton from '../button/CustomButton'
import { MinusIcon, PlusIcon } from 'react-native-heroicons/outline'
import { useSelector } from 'react-redux'
import { RootState } from '@/src/redux/store'

interface Props {
    data: {
        id: string,
        title: string,
        desc: string,
        cost: number,
        imageUri: string,
        remaining: number
    },
    style?: ViewStyle,
    editabled?: boolean,
    quantity?: number,
    descLines?: number,
    onIncrease?: (value: number) => void,
    onDecrease?: (value: number) => void
}

const ServiceCard = ({
    data,
    style,
    onIncrease,
    onDecrease,
    editabled = true,
    quantity,
    descLines: titleLines
}: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const services = useSelector((state: RootState) => state.payment.services)
    const [count, setCount] = React.useState(0)

    const handleIncrease = () => {
        onIncrease && onIncrease(count + 1)
        setCount(count + 1)
    }

    const handleDecrease = () => {
        if (count == 0) return
        onDecrease && onDecrease(count - 1)
        setCount(count - 1)
    }

    useEffect(() => {
        if (services.length == 0)
            setCount(0)
    }, [services])

    return (
        <View className='w-full flex-row items-start justify-start rounded-2' style={style}>
            <View className='w-1/3 max-h-[100px] self-center'>
                <Image
                    className='w-full h-full'
                    source={{ uri: data.imageUri }}
                    resizeMode='contain' />
            </View>

            <View className='w-2/3'>
                <ThemeText
                    otherProps={{
                        paddingVertical: 8
                    }}
                    fontWeight='bold'
                    letterSpacing={0.5}>{data.title}</ThemeText>
                <ThemeText
                    otherProps={{
                        textAlign: 'left'
                    }}
                    letterSpacing={1}
                    fontSize={14}
                    numsOfLines={titleLines || undefined}
                >{data.desc}</ThemeText>

                {/* price */}
                {editabled ?
                    <ThemeText
                        letterSpacing={0.5}
                        numsOfLines={1}
                        otherProps={{
                            marginTop: 8,
                            textAlign: 'right'
                        }}>Price:{' '}
                        <ThemeText
                            fontWeight='bold'
                            letterSpacing={2}
                        >{data.cost} VNĐ</ThemeText>
                    </ThemeText>
                    : <View className='flex-row items-center justify-end pt-2 mx-2'>
                        <ThemeText
                            letterSpacing={0.5}
                            numsOfLines={1}
                            fontWeight='bold' >{quantity}</ThemeText>
                        <ThemeText fontWeight='light'> x </ThemeText>
                        <ThemeText
                            letterSpacing={0.5}
                            numsOfLines={1}
                            fontWeight='bold' >{data.cost} VNĐ</ThemeText>
                    </View>}
                {/* button section */}
                {editabled ?
                    <View className='w-full flex-row justify-end px-2 items-center'>
                        <CustomButton
                            onPress={handleDecrease}
                            disabled={count == 0}
                            style={{
                                marginVertical: 9,
                                marginRight: 8
                            }}
                            width={32}
                            height={32}
                            icon={
                                <MinusIcon
                                    size={24}
                                    color={count == 0 ? colors.text.light : colors.text.default} />} />
                        <View className='w-[50px] h-[50px]'>
                            <CustomInput
                                borderColor={colors.text.light}
                                disabled={true}
                                placeHolder={count + ""}
                                placeHolderColor={colors.text.default}
                                keyboardType='numeric'
                                textAlgin='center' />
                        </View>

                        <CustomButton
                            disabled={data.remaining == count}
                            onPress={handleIncrease}
                            style={{
                                marginVertical: 9,
                                marginLeft: 8
                            }}
                            width={32}
                            height={32}
                            icon={
                                <PlusIcon
                                    size={24}
                                    color={data.remaining == count ? colors.text.light : colors.text.default} />} />
                    </View>
                    : null}

            </View>
        </View>
    )
}

export default ServiceCard