import { View, Text } from 'react-native'
import React from 'react'
import PageWrapper from '../PageWrapper'
import ThemeText from '../../theme/ThemeText'
import CustomInput from '../../input/CustomInput'
import { KeyIcon } from 'react-native-heroicons/outline'
import { useCustomTheme } from '@/src/contexts/theme'

const Step5 = () => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    return (
        <PageWrapper
            title='Buy Ticket'
            subTitle='Step 5: Validation'
            style={{
                justifyContent: 'center',
                marginHorizontal: 24
            }}>
            <ThemeText otherProps={{
                marginBottom: 16,
            }}>Enter PASSWORD/PIN to confirm.</ThemeText>
            <CustomInput
                blockText
                leftIcon={<KeyIcon color={colors.icon.highlight} />}
                placeHolder={''} />
        </PageWrapper>
    )
}

export default Step5