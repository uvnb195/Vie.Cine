import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import ImagePicker from '@/src/components/picker/ImagePicker'
import CustomInput from '@/src/components/input/CustomInput'
import DropdownMenu from '@/src/components/input/DropdownMenu'
import { ScrollView } from 'react-native-gesture-handler'
import BottomSection from '@/src/components/bottom-sheet/BottomSection'
import { useAdminService } from '@/src/contexts/service'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/src/redux/store'
import { addService } from '@/src/redux/adminAsyncActions'
import { auth } from '@/src/api/firebase/config'
import { err } from 'react-native-svg'
import { router } from 'expo-router'

const AddService = () => {
    const { data, error, handleData } = useAdminService()
    const dispatch = useDispatch<AppDispatch>()

    const handleFinish = () => {
        console.log('finish')
        const formData = new FormData()
        formData.append('image', data.image)
        formData.append('title', data.title)
        if (data.description) {
            formData.append('description', data.description)
        }
        formData.append('price', data.price.toString())
        auth.currentUser?.getIdToken().then(token => {
            dispatch(addService({ token, service: formData }))
        })
        router.dismissAll()
    }
    return (
        <View className='flex-1'>
            <ScrollView className='w-full px-4 '>
                <ImagePicker
                    required={error.image}
                    style={{
                        width: '80%',
                        height: 200,
                        alignSelf: 'center'
                    }}
                    onImageChange={v => handleData('image', v)}
                    shape='square'
                    mode='image' />
                <View className='flex-1 w-full pt-4'>
                    <CustomInput
                        errorMsg={error.title}
                        selectOnFocus
                        value={data.title}
                        onValueChange={v => handleData('title', v)}
                        placeHolder='Title (*)' />
                    <CustomInput
                        selectOnFocus
                        value={data.description}
                        onValueChange={v => handleData('description', v)}
                        placeHolder='Description'
                        style={{
                            marginTop: 16,
                            height: 100
                        }} />
                    <CustomInput
                        errorMsg={error.price}
                        selectOnFocus
                        value={data.price == 0 || Number.isNaN(data.price) ? '' : data.price.toString()}
                        onValueChange={v => {
                            handleData('price', parseInt(v))
                        }}
                        keyboardType='numeric'
                        placeHolder='Price (VNĐ) (*)'
                        style={{
                            marginTop: 16
                        }} />
                    <DropdownMenu
                        value={data.typeId}
                        disableSearch
                        placeHolder='Service Type'
                        style={{
                            marginTop: 16,
                        }}
                        data={[
                            { value: 'Base Service', key: 0 },
                            { value: 'Special Service', key: 1 }
                        ]}
                        onSelected={v => {
                            handleData('typeId', v)
                        }} />
                </View>
            </ScrollView>
            <View className='px-6'>
                <BottomSection
                    disabled={
                        error.image
                        || error.title.length > 0
                        || error.price.length > 0
                    }
                    handleNext={handleFinish}
                    handleCancel={() => router.back()}
                    currentIndex={0}
                    totalPage={1} />
            </View>
        </View>
    )
}

export default AddService