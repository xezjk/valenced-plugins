import mc from '../mc-pinger/src/index.ts'

export default plugin ({
    start() {
        let result = await mc.lookup({
            host: "mc.hypixel.net"
            port: 25565,
            timeout: 10000,
            ping: true,
            protocolVersion: 769
            throwOnParseError: false,
            SRVLookup: true,
            JSONParse: true
        })
        
        console.log(result)
    },
    stop() {
        
    }
})