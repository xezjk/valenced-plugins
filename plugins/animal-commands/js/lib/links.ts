
import { commands } from './commands'
import { getModules } from '@valenced/modules/finders'
import { withProps } from '@valenced/modules/finders/filters'

type Animal = {
    name: string
    definition: Parameters<typeof commands.registerCommand>[0]
    unregister?: () => void
}

let registered: Animal[] = []

export function registerAnimals(): void {
    const definitions: Animal[] = [
        {
            name: 'dog',
            definition: {
                name: 'dog',
                description: 'Get a random dog picture.',
                async execute(args, context) {
                    const channelId = context?.channel?.id
                    if (!channelId) return

                    let response = await fetch('https://dog.ceo/api/breeds/image/random')
                    let data = await response.json()
                    let link: string | undefined

                    if (data.message) {
                        link = data.message
                    } else {
                        response = await fetch('https://random.dog/woof.json')
                        data = await response.json()
                        if (data.url) link = data.url
                        else return
                    }

                    interface ChatInputs {
                        getBestActiveInputForChannelId(channelId: string): { insertText(text: string): void } | undefined
                    }

                    getModules(withProps<ChatInputs>('getBestActiveInputForChannelId'), inputs => {
                        inputs.getBestActiveInputForChannelId(channelId)?.insertText(link!)
                    })
                }
            }
        },
        {
            name: 'cat',
            definition: {
                name: 'cat',
                description: 'Get a random cat picture.',
                async execute(args, context) {
                    const channelId = context?.channel?.id
                    if (!channelId) return

                    let response = await fetch('https://api.thecatapi.com/v1/images/search')
                    let data = await response.json()
                    let link: string | undefined

                    if (data[0]?.url) {
                        link = data[0].url
                    } else {
                        response = await fetch('https://cataas.com/cat?json=true')
                        data = await response.json()
                        if (data.url) link = data.url
                        else return
                    }

                    interface ChatInputs {
                        getBestActiveInputForChannelId(channelId: string): { insertText(text: string): void } | undefined
                    }

                    getModules(withProps<ChatInputs>('getBestActiveInputForChannelId'), inputs => {
                        inputs.getBestActiveInputForChannelId(channelId)?.insertText(link!)
                    })
                }
            }
        },
        {
            name: 'fox',
            definition: {
                name: 'fox',
                description: 'Get a random fox picture.',
                async execute(args, context) {
                    const channelId = context?.channel?.id
                    if (!channelId) return

                    let response = await fetch('https://randomfox.ca/floof/')
                    let data = await response.json()
                    let link: string | undefined

                    if (data.image) {
                        link = data.image
                    } else {
                        response = await fetch('https://some-random-api.com/animal/fox')
                        data = await response.json()
                        if (data.image) link = data.image
                        else return
                    }

                    interface ChatInputs {
                        getBestActiveInputForChannelId(channelId: string): { insertText(text: string): void } | undefined
                    }

                    getModules(withProps<ChatInputs>('getBestActiveInputForChannelId'), inputs => {
                        inputs.getBestActiveInputForChannelId(channelId)?.insertText(link!)
                    })
                }
            }
        },
        {
            name: 'duck',
            definition: {
                name: 'duck',
                description: 'Get a random duck picture.',
                async execute(args, context) {
                    const channelId = context?.channel?.id
                    if (!channelId) return

                    let response = await fetch('https://random-d.uk/api/v2/random')
                    let data = await response.json()
                    let link: string | undefined

                    if (data.url) {
                        link = data.url
                    } else {
                        response = await fetch('https://random-d.uk/api/random')
                        data = await response.json()
                        if (data.url) link = data.url
                        else return
                    }

                    interface ChatInputs {
                        getBestActiveInputForChannelId(channelId: string): { insertText(text: string): void } | undefined
                    }

                    getModules(withProps<ChatInputs>('getBestActiveInputForChannelId'), inputs => {
                        inputs.getBestActiveInputForChannelId(channelId)?.insertText(link!)
                    })
                }
            }
        },
        {
            name: 'shiba',
            definition: {
                name: 'shiba',
                description: 'Get a random Shiba Inu picture.',
                async execute(args, context) {
                    const channelId = context?.channel?.id
                    if (!channelId) return

                    const response = await fetch('https://dog.ceo/api/breed/shiba/images/random')
                    const data = await response.json()
                    if (!data.message) return

                    const link: string = data.message

                    interface ChatInputs {
                        getBestActiveInputForChannelId(channelId: string): { insertText(text: string): void } | undefined
                    }

                    getModules(withProps<ChatInputs>('getBestActiveInputForChannelId'), inputs => {
                        inputs.getBestActiveInputForChannelId(channelId)?.insertText(link)
                    })
                }
            }
        },
        {
            name: 'horse',
            definition: {
                name: 'horse',
                description: 'Get a random horse picture.',
                async execute(args, context) {
                    const channelId = context?.channel?.id
                    if (!channelId) return

                    const response = await fetch('https://animals.maxz.dev/api/horse/random')
                    const data = await response.json()
                    if (!data.image) return

                    const link: string = data.image

                    interface ChatInputs {
                        getBestActiveInputForChannelId(channelId: string): { insertText(text: string): void } | undefined
                    }

                    getModules(withProps<ChatInputs>('getBestActiveInputForChannelId'), inputs => {
                        inputs.getBestActiveInputForChannelId(channelId)?.insertText(link)
                    })
                }
            }
        },
        {
            name: 'deer',
            definition: {
                name: 'deer',
                description: 'Get a random deer picture.',
                async execute(args, context) {
                    const channelId = context?.channel?.id
                    if (!channelId) return

                    const response = await fetch('https://animals.maxz.dev/api/deer/random')
                    const data = await response.json()
                    if (!data.image) return

                    const link: string = data.image

                    interface ChatInputs {
                        getBestActiveInputForChannelId(channelId: string): { insertText(text: string): void } | undefined
                    }

                    getModules(withProps<ChatInputs>('getBestActiveInputForChannelId'), inputs => {
                        inputs.getBestActiveInputForChannelId(channelId)?.insertText(link)
                    })
                }
            }
        },
        {
            name: 'otter',
            definition: {
                name: 'otter',
                description: 'Get a random otter picture.',
                async execute(args, context) {
                    const channelId = context?.channel?.id
                    if (!channelId) return

                    const response = await fetch('https://api.tinyfox.dev/img.json?animal=ott')
                    const data = await response.json()
                    if (!data.loc) return

                    const link = 'https://api.tinyfox.dev' + data.loc

                    interface ChatInputs {
                        getBestActiveInputForChannelId(channelId: string): { insertText(text: string): void } | undefined
                    }

                    getModules(withProps<ChatInputs>('getBestActiveInputForChannelId'), inputs => {
                        inputs.getBestActiveInputForChannelId(channelId)?.insertText(link)
                    })
                }
            }
        },
        {
            name: 'bird',
            definition: {
                name: 'bird',
                description: 'Get a random bird picture.',
                async execute(args, context) {
                    const channelId = context?.channel?.id
                    if (!channelId) return

                    const response = await fetch('https://animals.maxz.dev/api/bird/random')
                    const data = await response.json()
                    if (!data.image) return

                    const link: string = data.image

                    interface ChatInputs {
                        getBestActiveInputForChannelId(channelId: string): { insertText(text: string): void } | undefined
                    }

                    getModules(withProps<ChatInputs>('getBestActiveInputForChannelId'), inputs => {
                        inputs.getBestActiveInputForChannelId(channelId)?.insertText(link)
                    })
                }
            }
        },
        {
            name: 'turtle',
            definition: {
                name: 'turtle',
                description: 'Get a random turtle picture.',
                async execute(args, context) {
                    const channelId = context?.channel?.id
                    if (!channelId) return

                    const response = await fetch('https://animals.maxz.dev/api/turtle/random')
                    const data = await response.json()
                    if (!data.image) return

                    const link: string = data.image

                    interface ChatInputs {
                        getBestActiveInputForChannelId(channelId: string): { insertText(text: string): void } | undefined
                    }

                    getModules(withProps<ChatInputs>('getBestActiveInputForChannelId'), inputs => {
                        inputs.getBestActiveInputForChannelId(channelId)?.insertText(link)
                    })
                }
            }
        },
        {
            name: 'sheep',
            definition: {
                name: 'sheep',
                description: 'Get a random sheep picture.',
                async execute(args, context) {
                    const channelId = context?.channel?.id
                    if (!channelId) return

                    const response = await fetch('https://animals.maxz.dev/api/sheep/random')
                    const data = await response.json()
                    if (!data.image) return

                    const link: string = data.image

                    interface ChatInputs {
                        getBestActiveInputForChannelId(channelId: string): { insertText(text: string): void } | undefined
                    }

                    getModules(withProps<ChatInputs>('getBestActiveInputForChannelId'), inputs => {
                        inputs.getBestActiveInputForChannelId(channelId)?.insertText(link)
                    })
                }
            }
        },
        {
            name: 'capybara',
            definition: {
                name: 'capybara',
                description: 'Get a random capybara picture.',
                async execute(args, context) {
                    const channelId = context?.channel?.id
                    if (!channelId) return

                    let response = await fetch('https://api.capy.lol/v1/capybara?json=true')
                    let data = await response.json()
                    let link: string | undefined

                    if (data.data?.url) {
                        link = data.data.url
                    } else {
                        response = await fetch('https://animals.maxz.dev/api/capybara/random')
                        data = await response.json()
                        if (data.image) link = data.image
                        else return
                    }

                    interface ChatInputs {
                        getBestActiveInputForChannelId(channelId: string): { insertText(text: string): void } | undefined
                    }

                    getModules(withProps<ChatInputs>('getBestActiveInputForChannelId'), inputs => {
                        inputs.getBestActiveInputForChannelId(channelId)?.insertText(link!)
                    })
                }
            }
        },
        {
            name: 'bunny',
            definition: {
                name: 'bunny',
                description: 'Get a random bunny picture.',
                async execute(args, context) {
                    const channelId = context?.channel?.id
                    if (!channelId) return

                    const response = await fetch('https://animals.maxz.dev/api/rabbit/random')
                    const data = await response.json()
                    if (!data.image) return

                    const link: string = data.image

                    interface ChatInputs {
                        getBestActiveInputForChannelId(channelId: string): { insertText(text: string): void } | undefined
                    }

                    getModules(withProps<ChatInputs>('getBestActiveInputForChannelId'), inputs => {
                        inputs.getBestActiveInputForChannelId(channelId)?.insertText(link)
                    })
                }
            }
        },
        {
            name: 'hamster',
            definition: {
                name: 'hamster',
                description: 'Get a random hamster picture.',
                async execute(args, context) {
                    const channelId = context?.channel?.id
                    if (!channelId) return

                    const response = await fetch('https://animals.maxz.dev/api/hamster/random')
                    const data = await response.json()
                    if (!data.image) return

                    const link: string = data.image

                    interface ChatInputs {
                        getBestActiveInputForChannelId(channelId: string): { insertText(text: string): void } | undefined
                    }

                    getModules(withProps<ChatInputs>('getBestActiveInputForChannelId'), inputs => {
                        inputs.getBestActiveInputForChannelId(channelId)?.insertText(link)
                    })
                }
            }
        }
    ]

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
