import React, { useState } from 'react'
import { Design } from '@valenced/discord/design'
import * as components from '@valenced/components'
import { ScrollView } from 'react-native'
import { ping } from './response'

export default function SettingsComponent({ api }) {
    const { TableRowGroup, TableSwitchRow, Card, TextInput, Button } = Design
    const { Page } = components

    const settings = api.jsonStorage.use()
    console.log('Storage:', settings)

    const [ip, setIp] = useState(settings?.IP ?? '')
    const [loading, setLoading] = useState(false)

    async function handlePing() {
        if (!ip.trim()) return

        setLoading(true)

        try {
            api.jsonStorage.set({ IP: ip })

            const result = await ping(ip)

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
                <TextInput
                    label='Server IP'
                    placeholder='play.cubecraft.net'
                    defaultValue={ip}
                    status='default'
                    onChange={setIp}
                />

                <Button
                    variant='secondary'
                    size='sm'
                    text={loading ? 'PINGING...' : 'PING'}
                    onPress={handlePing}
                    disabled={loading}
                />
            </ScrollView>
        </Page>
    )
}