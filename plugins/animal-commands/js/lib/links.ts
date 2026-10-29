import { commands } from './commands'
import { getModules } from '@valenced/modules/finders'
import { withProps } from '@valenced/modules/finders/filters'

let registered: {
    name: string
    command: ReturnType<typeof commands.registerCommand>
}[] = []

export function registerAnimals(): void {
    registered = [
        {
            name: 'dog',
            command: commands.registerCommand({
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
            })
        },
        {
            name: 'cat',
            command: commands.registerCommand({
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
            })
        },
        {
            name: 'fox',
            command: commands.registerCommand({
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
            })
        },
        {
            name: 'duck',
            command: commands.registerCommand({
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
            })
        },
        {
            name: 'shiba',
            command: commands.registerCommand({
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
            })
        },
        {
            name: 'horse',
            command: commands.registerCommand({
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
            })
        },
        {
            name: 'deer',
            command: commands.registerCommand({
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
            })
        },
        {
            name: 'otter',
            command: commands.registerCommand({
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
            })
        },
        {
            name: 'bird',
            command: commands.registerCommand({
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
            })
        },
        {
            name: 'turtle',
            command: commands.registerCommand({
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
            })
        },
        {
            name: 'sheep',
            command: commands.registerCommand({
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
            })
        },
        {
            name: 'capybara',
            command: commands.registerCommand({
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
            })
        },
        {
            name: 'bunny',
            command: commands.registerCommand({
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
            })
        },
        {
            name: 'hamster',
            command: commands.registerCommand({
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
            })
        }
    ]
}

export function unregisterAnimals(): void {
    registered.forEach(c => c.command.unregister())
    registered = []
}

export function setDisabledAnimal(name: string, state: boolean): void {
    const command = registered.find(c => c.name === name)?.command

    if (state) command?.disable()
    else command?.enable()
}