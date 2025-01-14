import { TAB_BAR_HEIGHT } from '@/constants/Values'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { auth } from '@/src/api/firebase/config'
import AdminWrapper from '@/src/components/AdminWrapper'
import CustomButton from '@/src/components/button/CustomButton'
import Header from '@/src/components/header'
import DropdownMenu from '@/src/components/input/DropdownMenu'
import SearchInput from '@/src/components/input/SearchInput'
import ThemeText from '@/src/components/theme/ThemeText'
import { useAdminService } from '@/src/contexts/service'
import { useCustomTheme } from '@/src/contexts/theme'
import { getServices } from '@/src/redux/adminAsyncActions'
import { AppDispatch, RootState } from '@/src/redux/store'
import { router } from 'expo-router'
import React, { useEffect } from 'react'
import { Image, Pressable, Text, View, ViewStyle } from 'react-native'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { ArrowRightIcon, CurrencyDollarIcon, MapPinIcon, PlusIcon } from 'react-native-heroicons/solid'
import Animated from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'

const Service = () => {
    const { colors } = useCustomTheme()
    const { services } = useSelector((state: RootState) => state.admin)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        auth.currentUser?.getIdToken().then(token => {
            console.log(token)
            dispatch(getServices(token))
        })
    }, [])

    useEffect(() => {
        console.log(services.length)
    }, [services])


    return (
        <AdminWrapper
            style={{
                flex: 1,
                marginBottom: TAB_BAR_HEIGHT
            }}
            HeaderComponent={
                <Header title='/SERVICE'
                    backIconShown={false} />
            }>
            {/* search & buttons */}
            <View className='px-4 flex-row-reverse py-2'
                style={
                    {
                        backgroundColor: hexToRGBA(colors.background.default, 0.7),
                    }
                }>
                <Animated.View>
                    <CustomButton
                        title='Detail'
                        style={{
                            height: 40
                        }}
                        Icon={<ArrowRightIcon color={colors.icon.enable} size={20} />} />
                </Animated.View>
                <View className='w-2' />
                <CustomButton
                    onPress={() => {
                        router.push({
                            pathname: '/routes/admin-routes/form/(service)',
                            params: { id: 'add' }
                        })
                    }}
                    style={{
                        width: 50,
                        height: 40
                    }}
                    Icon={<PlusIcon color={colors.icon.enable} size={20} />} />
                <View className='flex-1 pr-2'>
                    <SearchInput style={{ height: 40 }} />
                </View>
            </View>
            <View className='flex-1'>
                <FlatList
                    data={services}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) =>
                        <ServiceItem
                            style={{
                                borderBottomWidth: 1,
                            }}
                            id={item._id}
                            image={item.image}
                            title={item.title}
                            price={item.price}
                            description={item.description}
                            onPress={() => { }} />} />
            </View>
        </AdminWrapper>
    )
}

interface ServiceItemProps {
    style?: ViewStyle,
    id: string,
    title: string,
    description?: string,
    price: number,
    image: string,
    typeId?: string,
    onPress: () => void
}

const ServiceItem = ({
    style,
    id,
    title,
    description,
    price,
    image,
    typeId,
    onPress }: ServiceItemProps) => {
    const { colors } = useCustomTheme()
    return (
        <Pressable onPress={onPress}>
            <View className='flex-row-reverse overflow-hidden' style={[{
                backgroundColor: hexToRGBA(colors.background.default, 0.7),
                paddingHorizontal: 16,
            }, style]}>
                <View
                    className='w-1/4 items-center justify-center h-[100px]'>
                    <Image
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        resizeMode='cover'
                        source={{ uri: image }} />
                </View>
                <View className='py-2 flex-1'>
                    <ThemeText
                        fontSize={20}
                        fontWeight='bold'
                        letterSpacing={3}
                        color={colors.text.dark}
                    >{title.toUpperCase()}</ThemeText>
                    {description
                        && <ThemeText>{description}</ThemeText>}
                    <View className='flex-row items-center'>
                        <CurrencyDollarIcon
                            size={16}
                            color={colors.icon.highlight} />
                        <View className='w-2' />
                        <ThemeText>{price}</ThemeText>
                    </View>
                    <ThemeText
                        color={colors.text.light}>{typeId || 'Base Service'}</ThemeText>
                </View>
            </View>
        </Pressable>
    )
}

export default Service