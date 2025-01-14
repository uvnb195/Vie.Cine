import { View, Text } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import PageWrapper from '@/src/components/pages/PageWrapper'
import { ScrollView } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import CustomInput from '@/src/components/input/CustomInput'
import InputAddress from '@/src/components/input/InputAddress'
import { useAdminTheatre } from '@/src/contexts/theatre'
import BottomSection from '@/src/components/bottom-sheet/BottomSection'
import { Redirect, router } from 'expo-router'
import { AppDispatch, RootState } from '@/src/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { onAuthStateChanged } from '@firebase/auth'
import { auth } from '@/src/api/firebase/config'
import { addTheatre } from '@/src/redux/adminAsyncActions'
import { setLoading, Status } from '@/src/redux/publicSlice'
import { clearUser } from '@/src/redux/privateSlice'
import { updateStatus } from '@/src/redux/adminSlice'

interface Props {
  onSubmit: () => void
}

const Address = ({ onSubmit }: Props) => {
  const { data, dataError, handleData } = useAdminTheatre()
  const { fetching } = useSelector((state: RootState) => state.public)
  const dispatch = useDispatch<AppDispatch>()
  const {
    theatres,
    theatreDetail,
    status
  } = useSelector((state: RootState) => state.admin)
  const { loading } = useSelector((state: RootState) => state.public)

  const handleConfirm = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then(token => {
          const formData = new FormData()
          formData.append('name', data.name)
          formData.append('location', JSON.stringify(data.location))
          dispatch(addTheatre({ token, data: formData }))
        })
      }
      else dispatch(clearUser())
    })
  }

  const handleStatus = useCallback((success: boolean) => {
    console.log('handleStatus', success)
    if (loading) dispatch(setLoading(false))
    if (success) {
      dispatch(updateStatus(Status.IDLE))
      router.replace({
        pathname: '/routes/admin-routes/status/[id]',
        params: { id: 'success', message: 'Theatre added successfully !!!' }
      })
    }
    else router.replace({
      pathname: '/routes/admin-routes/status/[id]',
      params: { id: 'failed', message: 'Something wrong. Please try again later !!!' }
    })
  }, [loading])

  useEffect(() => {
    console.log('status===', status)
    switch (status) {
      case Status.FAILED:
        handleStatus(false)
        break
      case Status.SUCCESS:
        handleStatus(true)
        break
      case Status.PENDING:
        dispatch(setLoading(true))
        break
    }
  }, [status])

  return (
    <>
      <PageWrapper
        title='Add Theatre'
        subTitle='Fill address'
      >
        <View className='w-full h-full px-6 pt-4'>
          <ScrollView>
            {/* name & address */}
            <Animated.View
              className='w-full'>
              <CustomInput
                value={data.name}
                onValueChange={v => {
                  handleData('name', v)
                }
                }
                placeHolder='Name'
                errorMsg={dataError.name} />

              <InputAddress
                data={data.location}
                disable={data.name === ''}
                errorMsg={dataError.location}
                acceptLatAndLng={true}
                style={{
                  paddingVertical: 8
                }}
                onSubmit={(v) => {
                  handleData('location', v)
                  onSubmit && onSubmit()
                }
                } />
            </Animated.View>
          </ScrollView>
          <View>
            <BottomSection
              handleNext={handleConfirm}
              handleCancel={() => router.dismiss()}
              currentIndex={0}
              totalPage={4}
              disabled={data.location.lat == null || data.location.lng == null}
            />
          </View>
        </View>
      </PageWrapper>
    </>

  )
}

export default Address