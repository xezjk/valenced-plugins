import { registerAnimals, unregisterAnimals } from './lib/links'
import { onFluxEventDispatched } from '@valenced/discord/flux'
import { Design } from '@valenced/discord/design'
import SettingsComponent from './ui/settings'

interface Settings {
    enabled: boolean,
}

export default plugin<{ jsonStorage: Settings }>({
    jsonStorage: {
        load: true,
        default: {enabled: true},
    },
	start({ jsonStorage }) {
		registerAnimals()
	},
    stop() {
	    unregisterAnimals()
	},
    SettingsComponent,
})
