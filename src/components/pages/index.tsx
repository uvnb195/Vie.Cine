import React, { useEffect, useRef } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import PagerView from 'react-native-pager-view'
import BottomSection from '../bottom-sheet/BottomSection'

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

    // plus 1 for finish screen
    const pages = totalPages + 1

    const ref = useRef<PagerView>(null)
    const [currentPage, setCurrentPage] = React.useState(0)
    const [disable, setDisable] = React.useState(disabled)

    const handleNextPress = () => {
        if (currentPage === pages - 1) {
            handleFinish && handleFinish()
            return
        }
        handleNext && handleNext(currentPage + 1)
        setDisable(true)
        setCurrentPage(currentPage + 1)
        setTimeout(() => { setDisable(false) }, 300)
    }

    const handlePrevPress = () => {
        if (currentPage == 0) {
            handleCancel && handleCancel()
            return
        }
        handlePrev && handlePrev(currentPage - 1)
        setDisable(true)
        setCurrentPage(currentPage - 1)
        setTimeout(() => { setDisable(false) }, 300)
    }

    useEffect(() => {
        ref.current?.setPage(currentPage)
    }, [currentPage])



    return (
        <View className='w-full h-full flex-col-reverse z-50'>
            <View className='w-full h-20'>
                <BottomSection
                    currentIndex={currentPage}
                    disabled={disabled}
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
                    scrollEnabled={true}>
                    {children}
                </PagerView>
            </View>

        </View>
    )
}

export default CustomPagerView