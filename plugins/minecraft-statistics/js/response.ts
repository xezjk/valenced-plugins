export function ping(
    p_host: string,
    p_port?: number,
    p_timeout?: number,
    p_protocolVersion?: number
) {
    const address = p_port ? `${p_host}:${p_port}` : p_host

    return fetch(
        `https://api.mcsrvstat.us/3/${encodeURIComponent(address)}`,
        {
            headers: {
                'User-Agent': 'MinecraftStatistics/1.0'
            },
            signal: AbortSignal.timeout(p_timeout ?? 10000)
        }
    ).then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
    })
}