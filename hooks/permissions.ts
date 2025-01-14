import { getCurrentPositionAsync, requestForegroundPermissionsAsync, reverseGeocodeAsync } from "expo-location"
import { getLocales, Localization } from 'expo-localization'

export const requestLocationPermission = async () => {
    try {
        const { status } = await requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            return { status: 'fail', msg: 'Permission to access location was denied' }
        }
        const location = await getCurrentPositionAsync({})
        if (location) {
            return { status: 'success', data: location }
        }
        return { status: 'fail', msg: 'Location not found' }
    } catch (e: any) {
        return { status: 'fail', msg: e.message }
    }
}

export const getDeviceLocation = async () => {
    // request location permission
    try {

        const result = await requestLocationPermission()
        if (result.status == 'success') {
            const geoLocation = await reverseGeocodeAsync(result.data!!.coords).then((res) => {
                return ({
                    city: res[0].city || res[0].region || "",
                    district: res[0].district || res[0].subregion || "",
                    latitude: result.data?.coords.latitude || 0,
                    longitude: result.data?.coords.longitude || 0
                })
            })
            return { status: 'success', data: { ...geoLocation } }
        }
        return { status: 'fail', msg: 'Location not found' }
    } catch (e: any) {
        return { status: 'fail', msg: e.message }
    }
}

export const getDeviceLocales = () => {
    const locales = getLocales()[0]
    return locales
}


// locales return = {
//     "currencyCode": "USD",
//     "currencySymbol": "$",
//     "decimalSeparator": ".",
//     "digitGroupingSeparator": ",",
//     "languageCode": "en",
//     "languageTag": "en-US",
//     "measurementSystem": "us",
//     "regionCode": "US",
//     "temperatureUnit": "fahrenheit",
//     "textDirection": "ltr"
// }