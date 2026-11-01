import { ping } from './response.ts'

export default plugin ({
    async start() {
        const response = await ping('play.cubecraft.net')
        console.log(response)
    },
    stop() {
        console.log('stop')
    }
})