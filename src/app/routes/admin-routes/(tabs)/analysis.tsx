import { TAB_BAR_HEIGHT } from '@/constants/Values'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import AdminWrapper from '@/src/components/AdminWrapper'
import HomeHeader from '@/src/components/header/HomeHeader'
import { useCustomTheme } from '@/src/contexts/theme'
import React from 'react'
import { Dimensions, View } from 'react-native'
import { LineChart, PieChart } from 'react-native-gifted-charts'

const schedule = () => {
    const { width } = Dimensions.get('window')
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const orders = [{ value: 5 }, { value: 20 }, { value: 40 }, { value: 40 }, { value: 60 }, { value: 55 }, { value: 70 }, { value: 72 }, { value: 77 }, { value: 88 }, { value: 99 }, { value: 120 }, { value: 110 }, { value: 120 }, { value: 150 }, { value: 200 },];
    const tickets = [{ value: 5 }, { value: 6 }, { value: 7 }, { value: 8 }, { value: 9 }, { value: 7 }, { value: 8 }, { value: 10 }, { value: 11 }, { value: 11 }, { value: 21 }, { value: 23 }, { value: 25 }, { value: 30 }, { value: 33 }, { value: 40 },];
    const combos = [{ value: 7 }, { value: 22 }, { value: 44 }, { value: 49 }, { value: 66 }, { value: 65 }, { value: 70 }, { value: 72 }, { value: 60 }, { value: 70 }, { value: 85 }, { value: 121 }, { value: 100 }, { value: 105 }, { value: 120 }, { value: 144 },];

    const pieCharts = [
        { value: 54, color: hexToRGBA(colors.text.highlight, 0.6), text: '54%' },
        { value: 40, color: hexToRGBA(colors.text.default, 0.8), text: '30%' },
        { value: 20, color: hexToRGBA(colors.error, 0.9), text: '26%' },
    ];
    return (
        <AdminWrapper
            style={{
                flex: 1,
                marginBottom: TAB_BAR_HEIGHT
            }}
            HeaderComponent={
                <HomeHeader />
            }>
            <View className='z-50'>
                <LineChart
                    isAnimated
                    scrollEventThrottle={16}
                    scrollAnimation
                    scrollToEnd
                    height={300}
                    width={width - 50}
                    rulesColor={colors.background.bottomSheet}
                    yAxisColor={colors.background.bottomSheet}
                    xAxisColor={colors.background.bottomSheet}
                    yAxisTextStyle={{ color: colors.text.default }}
                    dashGap={10}
                    curved
                    areaChart
                    hideDataPoints
                    curveType={0}
                    curvature={0.15}
                    data={orders}
                    startFillColor={colors.icon.highlight}
                    startOpacity={0.3}
                    textColor={colors.text.default}
                    endFillColor={colors.icon.disable}
                    endOpacity={0.1}
                    color={colors.text.highlight}
                    data2={tickets}
                    startFillColor2={colors.icon.disable}
                    startOpacity2={0.3}
                    textColor2={colors.text.default}
                    endFillColor2={colors.icon.disable}
                    endOpacity2={0.1}
                    color2={colors.text.default}
                    data3={combos}
                    startFillColor3={colors.error}
                    startOpacity3={0.5}
                    textColor3={colors.text.default}
                    endFillColor3={colors.icon.disable}
                    endOpacity3={0.1}
                    color3={colors.error} />
            </View>
            <View className='flex-1'>
                <PieChart
                    isAnimated
                    animationDuration={1000}
                    focusOnPress={false}
                    showText
                    textColor='black'
                    radius={170}
                    textSize={20}
                    data={pieCharts}
                    extraRadius={20}
                    strokeWidth={8}
                    strokeColor={colors.background.default}
                />
            </View>

        </AdminWrapper>
    )
}

export default schedule