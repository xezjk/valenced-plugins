import { ping } from './response.ts'

export default plugin ({
    start() {
        console.log(ping('mc.hypixel.net'))
    },
    stop() {
        console.log('stop')
    }
})