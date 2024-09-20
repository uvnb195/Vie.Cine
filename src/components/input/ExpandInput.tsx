import { useCustomTheme } from '@/src/contexts/theme'
import React, { useEffect, useRef } from 'react'
import { Animated, TouchableOpacity, ViewStyle, View } from 'react-native'
import ThemeText from '../theme/ThemeText'
import OutlinedTextInput from './OutlinedTextInput'

interface Props {
    title: string,
    width: number,
    height: number,
    style?: ViewStyle,
    disabled?: boolean,
    onOpen?: () => void
    onFinished?: (value: string) => void,
    isExpanded?: boolean
}

const ExpandInput = ({ title, style, width, height, disabled, onOpen, onFinished, isExpanded = false }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const heightValue = useRef(new Animated.Value(height / 2)).current
    const [isExpand, setIsExpand] = React.useState(isExpanded)
    const [input, setInput] = React.useState(title)

    const animationStart = () => {
        Animated.timing(heightValue, {
            toValue: height,
            duration: 200,
            useNativeDriver: false
        }).start()
    }

    const animationEnd = () => {
        Animated.timing(heightValue, {
            toValue: height / 2,
            duration: 200,
            useNativeDriver: false
        }).start()
    }

    const animationStyle = {
        height: heightValue,
        borderRadius: heightValue.interpolate({
            inputRange: [height / 2, height],
            outputRange: [16, 8]
        }),
        borderColor: colors.border.default,
    }

    const handlePress = () => {
        setIsExpand(!isExpand)
        onOpen && onOpen()
    }

    useEffect(() => {
        if (isExpand)
            animationStart()
        else animationEnd()
    }, [isExpand])


    const paddingValue = 8

    return (
        <View
            style={{
                width: width,
                height: height,
            }}
            className='items-center justify-center'
        >

            <Animated.View
                className={'items-center justify-center border'}
                style={[
                    style,
                    animationStyle,
                    {
                        width: width,
                        backgroundColor: disabled
                            ? colors.smallButton.backgroundDisable
                            : colors.smallButton.backgroundDefault,
                    }
                ]}>

                <TouchableOpacity
                    disabled={disabled}
                    className=' self-center rounded-full items-center justify-center flex-1 w-full overflow-hidden'
                    style={[
                        {
                            alignSelf: 'flex-start',
                        },
                    ]}
                    onPress={handlePress}>
                    {isExpand === true
                        ? <OutlinedTextInput width='100%'
                            placeHolder=' '
                            onSubmitEditing={(text) => {
                                onFinished && onFinished(text)
                                setIsExpand(false)
                                setInput(text.length > 0
                                    ? text : title)
                            }}
                            upperCase
                            maxLetters={4}
                            onBlur={() => setIsExpand(false)} />

                        : <ThemeText fontSize={12}
                            otherProps={{
                                width: '100%',
                                textAlign: 'center',
                                overflow: 'hidden'
                            }}
                            fontWeight={disabled ? 'bold' : 'regular'}
                            letterSpacing={1.5}
                            color={disabled
                                ? colors.smallButton.textDisable
                                : colors.smallButton.textDefault}
                            numsOfLines={1}
                        >
                            {input}
                        </ThemeText>
                    }

                </TouchableOpacity>
            </Animated.View>
        </View>
    )
}

export default ExpandInput