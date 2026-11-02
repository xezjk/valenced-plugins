import React, { useState } from 'react'
import { Design } from '@valenced/discord/design'
import * as components from '@valenced/components'
import { ScrollView, Pressable } from 'react-native'
import { ping } from './response'

export default function SettingsComponent({ api }) {
    const { TableRowGroup, TableSwitchRow, Card, TextInput, Card, AlertModal, AlertActionButton } = Design
    const { Page } = components

    const settings = api.jsonStorage.use()
    const [ip, setIp] = useState(settings?.IP ?? '')
    const [port, setPort] = useState(settings?.PORT ?? 0)
    const [loading, setLoading] = useState(false)

    const scheme = useColorScheme()
    const dark = scheme !== 'light'
    const colors = useMemo(() => ({
        background: dark ? '#202127' : '#F2F3F5',
        surface: dark ? '#2B2D35' : '#FFFFFF',
        text: dark ? '#F2F3F5' : '#232428',
        muted: dark ? '#B5BAC1' : '#5C5E66',
        border: dark ? '#41434C' : '#D9DADD',
        button: dark ? '#454852' : '#E2E3E6',
        buttonText: dark ? '#FFFFFF' : '#232428',
    }), [dark])

    async function handlePing() {
        if (!ip.trim()) return

        setLoading(true)

        try {
            api.jsonStorage.set({ IP: ip })
            api.jsonStorage.set({ PORT: port })

            const result = await ping(ip, port ?? undefined)

            console.log(result)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Page>
            <ScrollView>
                <Pressable
                    onPress={() => connect()}
                    style={{
                        backgroundColor: colors.button,
                        borderRadius: 12,
                        padding: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8
                    }}
                >
                    <Text>Add server</Text>
                </Pressable>
                <TextInput
                    label='SERVER IP'
                    placeholder='play.example.com'
                    defaultValue={ip}
                    status='default'
                    onChange={setIp}
                />
                <TextInput
                    label='SERVER PORT (optional)'
                    placeholder='25565'
                    defaultValue={port}
                    status='default'
                    onChange={setPort}
                />
                <Button
                    variant='secondary'
                    size='md'
                    text={loading ? 'PINGING...' : 'PING'}
                    onPress={handlePing}
                    disabled={loading}
                />
                <Card variant='secondary'>
                    <ScrollView>
                        
                    </ScrollView>
                </Card>
            </ScrollView>
        </Page>
    )
}