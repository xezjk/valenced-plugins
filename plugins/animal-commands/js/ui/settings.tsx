import { Design } from '@valenced/discord/design'
import * as components from '@valenced/components'
import * as ReactNative from 'react-native'

export default function SettingsComponent({ api }) {
    const { TableRowGroup, TableSwitchRow } = Design
    const settings = api.jsonStorage.use()
    const { Page } = components
	const { ScrollView, View } = ReactNative
    const { finders } = revenge.modules;
    const userModule = finders.lookupModule(finders.filters.withProps("getCurrentUser"));

    const currentUser = userModule?.getCurrentUser?.() || Object.values(userModule || {}).find(store => typeof store?.getCurrentUser === "function")?.getCurrentUser();
    const avatarUrl = currentUser?.avatar ? `https://cdn.discordapp.com/avatars/${currentUser.id}/${currentUser.avatar}.png?size=128` : `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(currentUser?.id || "0") >> 22n) % 5n)}.png`;

    return (
        <Page>
            <ScrollView>
                <Card variant="secondary" border="none">
                    <Image source = {{ uri: avatarUrl }} />
                </Card>
                <Text>Hello</Text>
                <TableRowGroup>
                    <TableSwitchRow
                        label="Enable /dog command"
                        value={settings?.enabled ?? true}
                        onValueChange={(enabled: boolean) =>
                            api.jsonStorage.set({ enabled })
                        }
                    />
                    <TableSwitchRow
                        label="Enable /cat command"
                        value={settings?.enabled ?? true}
                        onValueChange={(enabled: boolean) =>
                            api.jsonStorage.set({ enabled })
                        }
                    />
                    <TableSwitchRow
                        label="Enable /fox command"
                        value={settings?.enabled ?? true}
                        onValueChange={(enabled: boolean) =>
                            api.jsonStorage.set({ enabled })
                        }
                    />
                    <TableSwitchRow
                        label="Enable /duck command"
                        value={settings?.enabled ?? true}
                        onValueChange={(enabled: boolean) =>
                            api.jsonStorage.set({ enabled })
                        }
                    />
                    <TableSwitchRow
                        label="Enable /shiba command"
                        value={settings?.enabled ?? true}
                        onValueChange={(enabled: boolean) =>
                            api.jsonStorage.set({ enabled })
                        }
                    />
                    <TableSwitchRow
                        label="Enable /horse command"
                        value={settings?.enabled ?? true}
                        onValueChange={(enabled: boolean) =>
                            api.jsonStorage.set({ enabled })
                        }
                    />
                    <TableSwitchRow
                        label="Enable /otter command"
                        value={settings?.enabled ?? true}
                        onValueChange={(enabled: boolean) =>
                            api.jsonStorage.set({ enabled })
                        }
                    />
                    <TableSwitchRow
                        label="Enable /bird command"
                        value={settings?.enabled ?? true}
                        onValueChange={(enabled: boolean) =>
                            api.jsonStorage.set({ enabled })
                        }
                    />
                    <TableSwitchRow
                        label="Enable /turtle command"
                        value={settings?.enabled ?? true}
                        onValueChange={(enabled: boolean) =>
                            api.jsonStorage.set({ enabled })
                        }
                    />
                    <TableSwitchRow
                        label="Enable /sheep command"
                        value={settings?.enabled ?? true}
                        onValueChange={(enabled: boolean) =>
                            api.jsonStorage.set({ enabled })
                        }
                    />
                    <TableSwitchRow
                        label="Enable /capybara command"
                        value={settings?.enabled ?? true}
                        onValueChange={(enabled: boolean) =>
                            api.jsonStorage.set({ enabled })
                        }
                    />
                    <TableSwitchRow
                        label="Enable /bunny command"
                        value={settings?.enabled ?? true}
                        onValueChange={(enabled: boolean) =>
                            api.jsonStorage.set({ enabled })
                        }
                    />
                    <TableSwitchRow
                        label="Enable /hamster command"
                        value={settings?.enabled ?? true}
                        onValueChange={(enabled: boolean) =>
                            api.jsonStorage.set({ enabled })
                        }
                    />
                </TableRowGroup>
            </ScrollView>
        </Page>
    )
}
