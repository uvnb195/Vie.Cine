import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import MainWrapper from '@/src/components/MainWrapper'
import Header from '@/src/components/header'
import ImagePicker from '@/src/components/picker/ImagePicker'
import { useCustomTheme } from '@/src/contexts/theme'
import CustomButton from '@/src/components/button/CustomButton'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/src/redux/store'
import { auth } from '@/src/api/firebase/config'
import { updateAvatar } from '@/src/redux/privateAsyncActions'
import { setLoading } from '@/src/redux/publicSlice'
import { router } from 'expo-router'

const UpdateAvatarScreen = () => {
    const { width, height } = Dimensions.get('window')
    const value = useCustomTheme()
    const { colors } = value
    const { userInfo } = useSelector((state: RootState) => state.private)
    const dispatch = useDispatch<AppDispatch>()

    const [disable, setDisable] = React.useState<boolean>(true)
    const [imageBase64, setImageBase64] = React.useState<string | null>(null)

    console.log(userInfo?.photoURL)

    const handleSubmit = async () => {
        if (!imageBase64) return
        dispatch(setLoading(true))
        setDisable(false)
        const formImage = new FormData()
        formImage.append('image', imageBase64)
        await auth.currentUser?.getIdToken().then(token => {
            dispatch(updateAvatar({ formImage, token }))
        })
        dispatch(setLoading(false))
        router.dismissAll()
    }

    return (
        <MainWrapper
            loadingLayer={false}
            HeaderComponent={
                <Header
                    backIconPress={() => router.dismiss()}
                    title='/CHANGE-AVATAR' />
            }>
            <View className='w-full'>
                <View
                    className='self-center mt-10'
                    style={{
                        width: width - 48,
                        height: width - 48
                    }}>
                    <ImagePicker
                        defaultUri={userInfo?.photoURL || undefined}
                        onImageChange={(base64) => {
                            setDisable(false)
                            setImageBase64(base64)
                        }} />
                </View>
                {/* button  */}
                <View className='w-full flex-row justify-end pt-10 pb-10 px-4'>
                    <CustomButton
                        onPress={() => { router.dismiss() }}
                        title='Cancel' />
                    <View className='w-4' />

                    {/* submit button */}
                    <View>
                        <CustomButton
                            disabled={disable}
                            onPress={handleSubmit}
                            title='Save' />
                    </View>
                </View>
            </View>
        </MainWrapper>
    )
}

export default UpdateAvatarScreen