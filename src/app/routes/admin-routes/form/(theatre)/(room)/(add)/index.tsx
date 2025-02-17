import { View, Text, KeyboardAvoidingView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/src/redux/store'
import { SeatProps, SeatType, curRoom } from '@/src/redux/adminSlice'
import CinemaMapView from '@/src/components/scroll/CinemaMapView'
import CustomInput from '@/src/components/input/CustomInput'
import { ScrollView } from 'react-native-gesture-handler'
import ThemeText from '@/src/components/theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'
import CustomButton from '@/src/components/button/CustomButton'
import SeatTypes from '../../(add)/SeatTypes'
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'
import { AntDesign, Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import PageWrapper from '@/src/components/pages/PageWrapper'
import { hexToRGBA } from '@/hooks/hexToRGBA'

const AddRoom = () => {
  const { colors } = useCustomTheme()
  const dispatch = useDispatch<AppDispatch>()
  const [map, setMap] = useState<Array<Array<SeatProps>>>([])
  const [cols, setCols] = useState(0)
  const [rows, setRows] = useState(0)
  const [mapSelected, setMapSelected] = useState<{ x: number, y: number, data: SeatProps }[]>([])
  const [isGeneratedSeats, setIsGeneratedSeats] = useState(false)
  const [buttonTitle, setButtonTitle] = useState('Generate')
  const height = useDerivedValue(() => rows === 0 || cols === 0 ? 0 : 80)
  const [message, setMessage] = useState('Choose the entrance on the map or Skip it !!!')
  const clearButton = useDerivedValue(() => map.length > 0 ? 1 : 0)
  const { rooms } = useSelector((state: RootState) => state.admin)

  const messageAnimation = useAnimatedStyle(() => ({
    height: withTiming(height.value)
  }))
  const seatType = useAnimatedStyle(() => ({
    opacity: withTiming(isGeneratedSeats ? 1 : 0)
  }))

  const handleGenerate = () => {
    if (buttonTitle === 'Generate seats') {
      generateSeats()
    } else {
      generateMap(rows, cols)
    }
  }
  const generateMap = (row: number, column: number) => {
    setMapSelected([])
    setIsGeneratedSeats(false)
    setButtonTitle('Generate seats')
    setMessage('Choose the entrance on the map or Skip it !!!')
    const map: Array<Array<SeatProps>> = []
    for (let i = 0; i < row; i++) {
      const row: Array<SeatProps> = []
      for (let j = 0; j < column; j++) {
        row.push({
          seatType: SeatType.STANDARD,
          seatCode: null
        })
      }
      map.push(row)
    }
    console.log(map)
    setMap(map)
  }

  const generateSeats = useCallback(() => {
    setIsGeneratedSeats(true)
    setMapSelected([])
    setMessage('Add VIP seats or Skip it !!!')
    let curRow = 0
    let curCol = 0
    if (map.length === 0) return
    const newMap = map.map((row, rowIndex) => {
      curRow = rowIndex
      curCol = 0
      return row.map((seat, seatIndex) => {
        if (seat.seatType === SeatType.EMPTY) return seat
        else if (mapSelected.map(item => item.data).includes(seat)) {
          return {
            seatType: SeatType.EMPTY,
            seatCode: null
          }
        }
        else {

          return {
            seatType: seat.seatType,
            seatCode: `${String.fromCharCode(65 + curRow)}${1 + curCol++}`
          }
        }
      })
    })
    setMap(newMap)
  }, [map, mapSelected, cols, rows])

  const handleSeatType = (type: SeatType) => {
    if (mapSelected.length === 0) return
    const newMap = map.map(row => {
      return row.map(seat => {
        if (mapSelected.map(item => item.data).includes(seat)) {
          return {
            ...seat,
            seatType: type
          }
        }
        return seat
      })
    })
    setMapSelected([])
    setMap(newMap)
  }

  const handleConfirm = () => {
    dispatch(curRoom({
      map2d: map,
      totalSeats: map.flat().filter(item =>
        item.seatType != SeatType.EMPTY
        && item.seatType != SeatType.UNAVAILABLE).length,
      theatreId: rooms.theatreId,
    }))
    router.push({ pathname: '/routes/admin-routes/form/(room)/(add)/PriceSetting' })
  }

  useEffect(() => {
    setIsGeneratedSeats(false)
    console.log(rows, cols)
    if (cols === 0 || rows === 0) {
      setMessage('Choose the entrance on the map or Skip it !!!')
    }

    setButtonTitle('Generate')
    setMap([])
  }, [cols, rows])

  return (
    <PageWrapper
      title='Add Room'
      subTitle='Create a new room for your theatre'>
      <View className='flex-1 relative'>
        <CinemaMapView
          data={map}
          selected={mapSelected}
          onSelected={(selected) => {
            if (mapSelected.map(item => item.data).includes(selected.data)) {
              setMapSelected(mapSelected.filter(item => item.data !== selected.data))
            } else {
              setMapSelected([...mapSelected, selected])
            }
          }} />
        <KeyboardAvoidingView behavior='position' style={{ flex: 1 }}>
          <ScrollView className='pb-16' style={{ backgroundColor: colors.background.default }}>
            <ThemeText
              fontSize={18}
              fontWeight='bold'
              letterSpacing={1.9}
              otherProps={{
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}>Create grid by</ThemeText>
            <View className='flex-row  w-full justify-center items-center pb-4'>
              <View className='flex-grow'>
                <CustomInput
                  selectOnFocus
                  keyboardType='numeric'
                  value={rows.toString()}
                  onValueChange={(v) => setRows(!isNaN(parseInt(v)) ? parseInt(v) : 0)
                  }
                  placeHolder='Nums of Row'
                  style={{
                    width: '90%',
                    alignSelf: 'center'
                  }} />
              </View>
              <ThemeText fontSize={24}>X</ThemeText>
              <View className='flex-grow'>
                <CustomInput
                  selectOnFocus
                  keyboardType='numeric'
                  value={cols.toString()}
                  onValueChange={(v) => setCols(!isNaN(parseInt(v)) ? parseInt(v) : 0)
                  }
                  placeHolder='Nums of Column'
                  style={{
                    width: '90%',
                    alignSelf: 'center'
                  }} />
              </View>
            </View>
            <View className='w-full items-end flex-row px-4 pb-4 justify-between'>
              <Animated.View style={seatType}>
                <CustomButton title=''
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 4,
                    backgroundColor: hexToRGBA(colors.icon.highlight, 0.3)
                  }}
                  onPress={() => generateMap(rows, cols)}
                  Icon={<AntDesign name="close" size={24} color={colors.text.dark} />} />
              </Animated.View>
              <CustomButton title={buttonTitle} disabled={rows === 0 || cols === 0} onPress={handleGenerate} />
            </View>
            <Animated.View
              style={messageAnimation}
              className='w-full px-4'>
              <ThemeText otherProps={{
                paddingHorizontal: '20%',
                textAlign: 'center',
                paddingVertical: 8,
              }} color={colors.error} fontWeight='bold'>{message}</ThemeText>
            </Animated.View>
            <View className='w-full justify-between items-center flex-row px-2 pb-[120px]'>
              <Animated.View style={seatType}>
                <ThemeText
                  fontSize={18}
                  fontWeight='bold'
                  letterSpacing={1.9}
                  otherProps={{
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                  }}>Type</ThemeText>
              </Animated.View>
              <Animated.View style={seatType}>
                <CustomButton
                  disabled={mapSelected.length === 0}
                  style={{
                    paddingHorizontal: 8,
                    marginHorizontal: 8
                  }}
                  title={'VIP'}
                  Icon={map.flat().map(item => item.seatType).includes(SeatType.VIP) ? <Feather name="check-circle" size={24} color={colors.text.dark} /> : <FontAwesome name="circle-thin" size={24} color={colors.text.dark} />}
                  onPress={() => handleSeatType(SeatType.VIP)} />
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <KeyboardAvoidingView behavior='padding' className=' absolute bottom-0 right-0 left-0 px-4 my-4'>
          <View className='w-full justify-end items-end flex-row'>
            <View>
              <CustomButton title='Continue'
                disabled={map.flat().filter(item => item.seatType != SeatType.EMPTY && item.seatType != SeatType.UNAVAILABLE).map(item => item.seatCode).filter(item => item).length === 0}
                onPress={handleConfirm} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </PageWrapper>
  )
}

export default AddRoom