import React, { useMemo } from 'react'
import { Design } from '@valenced/discord/design'
import * as components from '@valenced/components'
import { ScrollView, View, Image, Text, useColorScheme } from 'react-native'
import { setDisabledAnimal } from './../lib/links.ts'

export default function SettingsComponent({ api }) {
    const { TableRowGroup, TableSwitchRow, Card } = Design
    const { Page } = components
    const { finders } = valenced.modules;
    const userModule = finders.lookupModule(finders.filters.withProps("getCurrentUser"));
    const settings = api.jsonStorage.use()

    const currentUser = userModule?.getCurrentUser?.() || Object.values(userModule || {}).find(store => typeof store?.getCurrentUser === "function")?.getCurrentUser();
    const avatarUrl = currentUser?.avatar ? `https://cdn.discordapp.com/avatars/${currentUser.id}/${currentUser.avatar}.png?size=128` : `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(currentUser?.id || "0") >> 22n) % 5n)}.png`;
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

    return (
        <Page>
            <ScrollView>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 50, marginBottom: 50 }}>
                    <Image source={{ uri: avatarUrl }} style={{ width: 92, height: 92, borderRadius: 22, borderWidth: 2, borderColor: '#000000' }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800' }}>Commands</Text>
                        <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 20 }}>Cool animals images with slash commands</Text>
                    </View>
                </View>
                <TableRowGroup title="Animals">
                    <TableSwitchRow
                        label="Enable /dog command"
                        value={settings?.enabled_dog ?? true}
                        onValueChange={(enabled: boolean) => {
                            setDisabledAnimal('dog', !enabled)
                            api.jsonStorage.set({ enabled_dog: enabled })
                        }}
                    />
                    <TableSwitchRow
                        label="Enable /cat command"
                        value={settings?.enabled_cat ?? true}
                        onValueChange={(enabled: boolean) => {
                            setDisabledAnimal('cat', !enabled)
                            api.jsonStorage.set({ enabled_cat: enabled })
                        }}
                    />
                    <TableSwitchRow
                        label="Enable /fox command"
                        value={settings?.enabled_fox ?? true}
                        onValueChange={(enabled: boolean) => {
                            setDisabledAnimal('fox', !enabled)
                            api.jsonStorage.set({ enabled_fox: enabled })
                        }}
                    />
                    <TableSwitchRow
                        label="Enable /duck command"
                        value={settings?.enabled_duck ?? true}
                        onValueChange={(enabled: boolean) => {
                            setDisabledAnimal('duck', !enabled)
                            api.jsonStorage.set({ enabled_duck: enabled })
                        }}
                    />
                    <TableSwitchRow
                        label="Enable /shiba command"
                        value={settings?.enabled_shiba ?? true}
                        onValueChange={(enabled: boolean) => {
                            setDisabledAnimal('shiba', !enabled)
                            api.jsonStorage.set({ enabled_shiba: enabled })
                        }}
                    />
                    <TableSwitchRow
                        label="Enable /horse command"
                        value={settings?.enabled_horse ?? true}
                        onValueChange={(enabled: boolean) => {
                            setDisabledAnimal('horse', !enabled)
                            api.jsonStorage.set({ enabled_horse: enabled })
                        }}
                    />
                    <TableSwitchRow
                        label="Enable /otter command"
                        value={settings?.enabled_otter ?? true}
                        onValueChange={(enabled: boolean) => {
                            setDisabledAnimal('otter', !enabled)
                            api.jsonStorage.set({ enabled_otter: enabled })
                        }}
                    />
                    <TableSwitchRow
                        label="Enable /bird command"
                        value={settings?.enabled_bird ?? true}
                        onValueChange={(enabled: boolean) => {
                            setDisabledAnimal('bird', !enabled)
                            api.jsonStorage.set({ enabled_bird: enabled })
                        }}
                    />
                    <TableSwitchRow
                        label="Enable /turtle command"
                        value={settings?.enabled_turtle ?? true}
                        onValueChange={(enabled: boolean) => {
                            setDisabledAnimal('turtle', !enabled)
                            api.jsonStorage.set({ enabled_turtle: enabled })
                        }}
                    />
                    <TableSwitchRow
                        label="Enable /sheep command"
                        value={settings?.enabled_sheep ?? true}
                        onValueChange={(enabled: boolean) => {
                            setDisabledAnimal('sheep', !enabled)
                            api.jsonStorage.set({ enabled_sheep: enabled })
                        }}
                    />
                    <TableSwitchRow
                        label="Enable /capybara command"
                        value={settings?.enabled_capybara ?? true}
                        onValueChange={(enabled: boolean) => {
                            setDisabledAnimal('capybara', !enabled)
                            api.jsonStorage.set({ enabled_capybara: enabled })
                        }}
                    />
                    <TableSwitchRow
                        label="Enable /bunny command"
                        value={settings?.enabled_bunny ?? true}
                        onValueChange={(enabled: boolean) => {
                            setDisabledAnimal('bunny', !enabled)
                            api.jsonStorage.set({ enabled_bunny: enabled })
                        }}
                    />
                    <TableSwitchRow
                        label="Enable /hamster command"
                        value={settings?.enabled_hamster ?? true}
                        onValueChange={(enabled: boolean) => {
                            setDisabledAnimal('hamster', !enabled)
                            api.jsonStorage.set({ enabled_hamster: enabled })
                        }}
                    />
                </TableRowGroup>
            </ScrollView>
        </Page>
    )
}
