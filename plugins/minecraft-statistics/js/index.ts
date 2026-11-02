import { ping } from './response'
import SettingsComponent from './settings'

interface Settings {
    IP: string,
    PORT: number
}

export default plugin<{ jsonStorage: Settings }>({
    jsonStorage() {
        return {
            load: true,
            default: {
                IP: '',
                PORT: '0'
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
