import { View, Text, Image, ImageBackground } from 'react-native'
import React from 'react'
import { CardProps } from './HorizontalCard'
import ThemeText from '../theme/ThemeText'
import CardStat from './CardStat'
import TextHighLight from './TextHighLight'
import { ScrollView } from 'react-native-gesture-handler'
import { useCustomTheme } from '@/src/contexts/theme'

const Ticket = ({
    image,
    title,
    stats,
    shortTags,
    style, }: CardProps) => {
    const themeValue = useCustomTheme()
    const { colors, theme } = themeValue

    const backgroundSrc = theme === 'light' ? require('../../assets/images/ticket_layout_light.png') : require('../../assets/images/ticket_layout_dark.png')

    const renderStats = () => {
        return stats.map((item, index) =>
            <CardStat key={index} stat={stats[index]} />
        )
    }

    const renderShortTags = () => {
        return shortTags.map((item, index) =>
            <TextHighLight key={index} children={shortTags[index]} />
        )
    }
    return (
        <View className='w-full min-h-[48px]'
            style={style}>

            <ImageBackground
                resizeMethod='resize'
                resizeMode='stretch'
                source={backgroundSrc}
                className='flex-1 items-center px-4'
                blurRadius={1}>
                <View className='w-full px-5'>
                    <ScrollView horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            columnGap: 8,
                            paddingVertical: 8,
                        }}>
                        {renderShortTags()}
                    </ScrollView>

                </View>
                <View className='flex-row items-center w-full'>
                    <Image source={image} className='w-1/4 h-full self-center rounded-2 ml-5' />
                    <View className='flex-1 ml-2 mr-6'>
                        <ThemeText fontWeight='bold' letterSpacing={2}
                            color={colors.icon.highlight}>{title}</ThemeText>
                        <View className='w-full'>
                            {renderStats()}
                        </View>
                    </View>
                </View>
                <View className='w-1/4 mb-1 self-start items-center ml-5'>
                    <ThemeText
                        otherProps={{
                            textAlign: 'center'
                        }} fontSize={10} color={colors.text.light}>27/09/2024</ThemeText>
                </View>
            </ImageBackground>
        </View>
    )
}

export default Ticket