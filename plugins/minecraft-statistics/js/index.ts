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
    start({ jsonStorage }) {
        console.log("start")
    },
    stop() {
        console.log("stop")
    },
    SettingsComponent
})
