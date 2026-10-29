import { registerAnimals, unregisterAnimals } from './lib/links'
import { onFluxEventDispatched } from '@valenced/discord/flux'
import { Design } from '@valenced/discord/design'
import SettingsComponent from './ui/settings'

interface Settings {
    enabled_dog: boolean
    enabled_cat: boolean
    enabled_fox: boolean
    enabled_duck: boolean
    enabled_shiba: boolean
    enabled_horse: boolean
    enabled_otter: boolean
    enabled_deer: boolean
    enabled_bird: boolean
    enabled_turtle: boolean
    enabled_sheep: boolean
    enabled_capybara: boolean
    enabled_bunny: boolean
    enabled_hamster: boolean
}

export default plugin<{ jsonStorage: Settings }>({
    jsonStorage() {
        return {
            load: true,
            default: {
                enabled_dog: true,
                enabled_cat: true,
                enabled_fox: true,
                enabled_duck: true,
                enabled_shiba: true,
                enabled_horse: true,
                enabled_deer: true,
                enabled_otter: true,
                enabled_bird: true,
                enabled_turtle: true,
                enabled_sheep: true,
                enabled_capybara: true,
                enabled_bunny: true,
                enabled_hamster: true
            }
        }
    },
	start({ jsonStorage }) {
		registerAnimals()
	},
    stop() {
	    unregisterAnimals()
	},
    SettingsComponent,
})
