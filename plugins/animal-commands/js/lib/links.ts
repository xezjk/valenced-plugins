import { commands } from './commands'
import { getModules } from '@valenced/modules/finders'
import { withProps } from '@valenced/modules/finders/filters'
import { ToastActionCreators } from '@valenced/discord/actions'

type Animal = {
    name: string
    definition: Parameters<typeof commands.registerCommand>[0]
    unregister?: () => void
}

let registered: Animal[] = []
let definitions: Animal[] = []

function addAnimal(an_name: string, api1: string, api2?: string, alt_des_name?: string): void {
    definitions.push(
        { 
            name: an_name,
            definition: {
                name: an_name,
                description: 'Get a random ' + (alt_des_name ?? an_name) + ' picture.',
                async execute(args, context) {
                    const channelId = context?.channel?.id
                    if (!channelId) {
                        ToastActionCreators.open(
                            "ChannelError", {
                                text: "DISCORD ERROR: Couldn't get current open channel.",
                                variant: 'critical'
                            }
                        )
                        return
                    }
                    
                    ToastActionCreators.open(
                        "GettingToast", {
                            text: "Getting a random image.",
                            variant: 'default'
                        }
                    )
                    
                    let response = await fetch(api1)
                    let data = await response.json()
                    let link: string | undefined

                    if (data.message || data[0]?.url || data.image || data.url || data.data?.url || data.loc) {
                        link = data.message || data[0]?.url || data.image || data.url || data.data?.url || (data.loc ? 'https://api.tinyfox.dev' + data.loc : undefined)
                    } else if (api2) {
                        response = await fetch(api2)
                        data = await response.json()
                        if (data.message || data[0]?.url || data.image || data.url || data.data.url || data.loc) link = data.message || data[0]?.url || data.image || data.url || data.data.url || data.loc
                        else {
                            ToastActionCreators.open(
                                "ApiError1", {
                                    text: "API ERROR: Couldn't get a response from the API.",
                                    variant: 'critical'
                                }
                            )
                            return
                        }
                    } else {
                        ToastActionCreators.open(
                            "ApiError2", {
                                text: "API ERROR: Couldn't get a response from the API.",
                                variant: 'critical'
                            }
                        )
                        return
                    }
                    
                    ToastActionCreators.open(
                        "SuccessToast", {
                            text: "Successfully received a random image!",
                            variant: 'success'
                        }
                    )

                    interface ChatInputs {
                        getBestActiveInputForChannelId(channelId: string): { insertText(text: string): void } | undefined
                    }

                    getModules(withProps<ChatInputs>('getBestActiveInputForChannelId'), inputs => {
                        inputs.getBestActiveInputForChannelId(channelId)?.insertText(link!)
                    })
                }
            }
        }
    )
}

export function registerAnimals(): void {
    definitions = []

    addAnimal('dog', 'https://dog.ceo/api/breeds/image/random', 'https://random.dog/woof.json')
    addAnimal('cat', 'https://api.thecatapi.com/v1/images/search', 'https://cataas.com/cat?json=true')
    addAnimal('fox', 'https://randomfox.ca/floof/', 'https://some-random-api.com/animal/fox')
    addAnimal('duck', 'https://random-d.uk/api/v2/random', 'https://random-d.uk/api/random')
    addAnimal('shiba', 'https://dog.ceo/api/breed/shiba/images/random', undefined, 'Shiba Inu')
    addAnimal('horse', 'https://animals.maxz.dev/api/horse/random')
    addAnimal('deer', 'https://animals.maxz.dev/api/deer/random')
    addAnimal('otter', 'https://api.tinyfox.dev/img.json?animal=ott', undefined, 'otter')
    addAnimal('bird', 'https://animals.maxz.dev/api/bird/random')
    addAnimal('turtle', 'https://animals.maxz.dev/api/turtle/random')
    addAnimal('sheep', 'https://animals.maxz.dev/api/sheep/random')
    addAnimal('capybara', 'https://api.capy.lol/v1/capybara?json=true', 'https://animals.maxz.dev/api/capybara/random')
    addAnimal('bunny', 'https://animals.maxz.dev/api/rabbit/random')
    addAnimal('hamster', 'https://animals.maxz.dev/api/hamster/random')

    registered = definitions.map(animal => ({
        ...animal,
        unregister: commands.registerCommand(animal.definition)
    }))
}

export function unregisterAnimals(): void {
    registered.forEach(animal => animal.unregister?.())
    registered = []
}

export function setDisabledAnimal(name: string, disabled: boolean): void {
    const animal = registered.find(animal => animal.name === name)
    if (!animal) return

    if (disabled) {
        animal.unregister?.()
        animal.unregister = undefined
    } else if (!animal.unregister) {
        animal.unregister = commands.registerCommand(animal.definition)
    }
}
