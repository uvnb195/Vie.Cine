import { View, Text, ImageBackground, Dimensions } from 'react-native'
import React, { memo, ReactNode } from 'react'
import { useCustomTheme } from '../contexts/theme'
import { bgColor } from '../../constants/Styles'

interface Props {
    children: ReactNode
}

const MainBackgroundImageView = ({ children }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const { theme } = themeValue

    const { height: windowHeight } = Dimensions.get('window')

    const imageSoure = theme === 'light'
        ? require(`../assets/images/background-image-light.png`)
        : require(`../assets/images/background-image-dark.png`)
    return (
        <View className='flex-1'
            style={[bgColor(colors.background.default)]}>
            <ImageBackground
                className='flex-col absolute top-0 left-0 z-0'
                style={{
                    height: windowHeight,
                    width: '100%'
                }}
                source={imageSoure}
                resizeMode='cover'>
                {children}
            </ImageBackground>
        </View >
    )
}

export default memo(MainBackgroundImageView)