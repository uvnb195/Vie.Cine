import { View, Text, ImageBackground } from 'react-native'
import React, { memo, ReactNode } from 'react'
import { useCustomTheme } from '../contexts/theme'
import { bgColor } from '../../constants/Styles'

interface Props {
    children: ReactNode
}

const MainBackgroundImage = ({ children }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const { theme } = themeValue
    return (
        <View className='flex-1'
            style={[bgColor(colors.background.default)]}>
            {theme === 'light' ?
                <ImageBackground className='flex-1 flex-col'
                    source={require('../assets/images/background-image-light.png')}
                    resizeMode='cover'>
                    {children}
                </ImageBackground>
                : <ImageBackground className='flex-1 flex-col'
                    source={require('../assets/images/background-image-dark.png')}
                    resizeMode='cover'>
                    {children}
                </ImageBackground>
            }
        </View>
    )
}

export default memo(MainBackgroundImage)