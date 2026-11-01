import mc from '../mc-pinger/src/index.ts'

export function ping(p_host: string, p_port?: number, p_timeout?: number, p_protocolVersion?: number) {
    return mc.lookup({
        host: p_host,
        port: p_port,
        timeout: p_timeout ?? 10000,
        ping: true,
        protocolVersion: p_protocolVersion,
        throwOnParseError: false,
        SRVLookup: true,
        JSONParse: true,
    })
}