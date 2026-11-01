import { ping } from './response'
import SettingsComponent from './settings'

interface Settings {
    IP: string
}

export default plugin<{ jsonStorage: Settings }>({
    jsonStorage() {
        return {
            load: true,
            default: {
                IP: ''
            }
        }
    },
    SettingsComponent
})