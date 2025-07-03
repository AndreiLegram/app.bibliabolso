import { Alert, Platform } from 'react-native'

const alertPolyfill = (title, description, options) => {
    const result = window.confirm([title, description].filter(Boolean).join('\n'))
    if (options) {
        if (result) {
            const confirmOption = options.find(({ style }) => style !== 'cancel')
            confirmOption && Object.hasOwn(confirmOption, "onPress") && confirmOption.onPress()
        } else {
            const cancelOption = options.find(({ style }) => style === 'cancel')
            cancelOption && Object.hasOwn(cancelOption, "onPress") && cancelOption.onPress()
        }
    }
}

const alert = Platform.OS === 'web' ? alertPolyfill : Alert.alert

export default alert