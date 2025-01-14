import React, { useEffect, useRef } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import PagerView from 'react-native-pager-view'
import BottomSection from '../bottom-sheet/BottomSection'
import { useCustomTheme } from '@/src/contexts/theme'
import { useAdminTheatre } from '@/src/contexts/theatre'

interface Props {
    totalPages: number,
    handleNext?: (index: number) => void,
    handlePrev?: (index: number) => void,
    handleFinish?: () => void,
    handleCancel?: () => void,
    disabled?: boolean,
    children: React.ReactNode
}

const CustomPagerView = ({
    totalPages,
    handleNext,
    handlePrev,
    handleFinish,
    handleCancel,
    disabled = false,
    children }: Props) => {
    const { colors } = useCustomTheme()
    const { editPage } = useAdminTheatre()
    const [disable, setDisable] = React.useState(disabled)

    useEffect(() => {
        setDisable(disabled)
    }, [disabled])

    useEffect(() => {
        console.log('disable::::::::::::', disable)
    }, [disable])

    // plus 1 for finish screen
    const pages = totalPages + 1

    const ref = useRef<PagerView>(null)
    const [currentPage, setCurrentPage] = React.useState(0)

    const handleNextPress = () => {
        console.log(currentPage, editPage)
        if (currentPage + 1 === editPage) {
            setDisable(true)
        }
        if (currentPage === pages - 1) {
            handleFinish && handleFinish()
            return
        }
        setCurrentPage(currentPage + 1)
        handleNext && handleNext(currentPage + 1)
    }

    const handlePrevPress = () => {
        if (disable) {
            setDisable(false)
        }
        if (currentPage == 0) {
            handleCancel && handleCancel()
            return
        }
        setCurrentPage(currentPage - 1)
        handlePrev && handlePrev(currentPage - 1)
    }

    useEffect(() => {
        ref.current?.setPage(currentPage)
    }, [currentPage])

    useEffect(() => { },
        [editPage])

    return (
        <View className='w-full h-full flex-col-reverse z-50'>
            <View className='w-full h-20'>
                <BottomSection
                    currentIndex={currentPage}
                    disabled={disable}
                    totalPage={pages}
                    handleNext={handleNextPress}
                    handlePrev={handlePrevPress}
                    handleCancel={handleCancel} />
            </View>
            <View className='flex-grow'>
                <PagerView
                    ref={ref}
                    initialPage={0}
                    className='flex-1'
                    scrollEnabled={false}>
                    {children}
                </PagerView>
            </View>

        </View >
    )
}

export default CustomPagerView