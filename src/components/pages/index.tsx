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
    children: React.ReactNode
}

const PaymentPages = ({
    totalPages,
    handleNext,
    handlePrev,
    handleFinish,
    handleCancel,
    children }: Props) => {

    // plus 1 for finish screen
    const pages = totalPages + 1

    const ref = useRef<PagerView>(null)
    const [currentPage, setCurrentPage] = React.useState(0)
    const [disable, setDisable] = React.useState(false)

    const handleNextPress = () => {
        if (currentPage === pages - 1) {
            handleFinish && handleFinish()
            return
        }
        handleNext && handleNext(currentPage + 1)
        setDisable(true)
        setCurrentPage(currentPage + 1)
    }

    const handlePrevPress = () => {
        if (currentPage == 0) {
            handleCancel && handleCancel()
            return
        }
        handlePrev && handlePrev(currentPage - 1)
        setDisable(true)
        setCurrentPage(currentPage - 1)
    }

    useEffect(() => {
        ref.current?.setPage(currentPage)

        setTimeout(() => { setDisable(false) }, 300)
    }, [currentPage])



    return (
        <View className='w-full h-full flex-col-reverse'>
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
                    scrollEnabled={true}>
                    {children}
                </PagerView>
            </View>

        </View>
    )
}

export default PaymentPages