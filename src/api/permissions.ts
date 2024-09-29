import { getCurrentPositionAsync, requestForegroundPermissionsAsync, reverseGeocodeAsync } from "expo-location"

export const requestDeviceLocation = async () => {
    // request location permission
    try {
        const { status } = await requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            return { status: 'fail', msg: 'Permission to access location was denied' }
        }

        const location = await getCurrentPositionAsync({})
        if (location) {
            console.log(location)
            const geoLocation = await reverseGeocodeAsync(location.coords).then((res) =>
            ({
                city: res[0].city || res[0].region || "",
                district: res[0].district || res[0].subregion || ""
            }))

            return { status: 'success', data: geoLocation }
        }
        return { status: 'fail', msg: 'Location not found' }
    } catch (e: any) {
        return { status: 'fail', msg: e.message }
    }
}