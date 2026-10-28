/**
 * Slash commands and "only you can see this" replies, shared by every plugin that has a command.
 * Each plugin's `js/lib/commands.ts` calls `createCommands` once and re-exports the result, so its
 * own files keep importing from there. Fix it here, not there.
 *
 * Every plugin bundles its own copy of this file, so the state below is per plugin, not global.
 *
 * ## Why this exists
 *
 * Classic Revenge and Vendetta shipped `vendetta.commands.registerCommand`. Revenge Next exposes
 * nothing equivalent, so this reimplements the small part of it a plugin actually needs.
 *
 * ## How Discord's own commands work
 *
 * Built-in commands — the ones that are not from a bot, like /shrug and /tableflip — live in a
 * plain array exported as `BUILT_IN_COMMANDS` from
 * `modules/application_commands/ApplicationCommandBuiltIns.tsx`. Pushing a well-formed entry into
 * that array is all registration is, and Discord then runs its `execute` locally on send.
 *
 * ## Why this waits rather than looks
 *
 * The command modules are not initialized at `start()`, so a one-shot `lookupModule` finds
 * nothing (porting rule 3). `registerCommand` records what you want and the entry is pushed the
 * moment the module shows up. Two routes are tried, better one first:
 *
 * 1. `getModuleWithImportedPath`, which resolves a module by the path Discord's own bundle
 *    records — a map lookup plus a subscription, with no filter `max` to poison.
 * 2. A `lookupModules` + `waitForModules` pair on `withProps('BUILT_IN_COMMANDS')`, in case the
 *    path moves in a later Discord build.
 *
 * Whichever answers first wins, and `registryStatus()` says which.
 *
 * ## Clientside replies
 *
 * `showClientMessage` hands a fabricated message to the client's own receive path: it renders
 * like a real one in the channel you are reading and no request is made. `flags: 64` is
 * EPHEMERAL, which makes Discord render its own "Only you can see this" notice.
 */

import * as modulesFinders from '@valenced/modules/finders'
import * as filters from '@valenced/modules/finders/filters'
import * as discordFinders from '@valenced/discord/utils/modules/finders'
import * as flux from '@valenced/discord/common/flux'
import { reportError } from './report'

const DEBUG: boolean = false

export enum OptionType {
	String = 3,
	Integer = 4,
	Boolean = 5,
	User = 6,
	Channel = 7,
	Role = 8,
	Number = 10,
}

export interface CommandOption {
	name: string
	description: string
	type: OptionType
	required?: boolean
	/** A fixed list to pick from instead of free text. */
	choices?: { name: string; value: string }[]
}

export interface CommandArgument {
	name: string
	value: unknown
}

export interface CommandContext {
	channel?: { id: string; name?: string; guild_id?: string }
	guild?: { id: string }
}

export interface CommandDefinition {
	name: string
	description: string
	options?: CommandOption[]
	/** Returning `{ content }` sends that text as you (the helper sends it; see sendAsUser). */
	execute(
		args: CommandArgument[],
		context: CommandContext,
	): void | { content: string } | Promise<void>
}

export interface ClientMessageOptions {
	channelId: string
	content: string
	/** Shown as the author. Defaults to the plugin's name given to `createCommands`. */
	author?: string
	/**
	 * The message's id, to change it later with `updateClientMessage` or take it away with
	 * `deleteClientMessage`. Make one with `clientMessageId()`; a new one is made when left out.
	 */
	id?: string
}

/** An id for a clientside message that will be updated or deleted later. */
export function clientMessageId(): string {
	return fakeSnowflake()
}

/** Reads one option out of the argument list Discord hands `execute`. */
export function argument<T>(
	args: CommandArgument[],
	name: string,
	fallback: T,
): T {
	const found = args?.find(arg => arg?.name === name)
	return found?.value === undefined ? fallback : (found.value as T)
}

/** The path Discord's bundle records for the module holding the built-in command list. */
const BUILT_INS_PATH =
	'modules/application_commands/ApplicationCommandBuiltIns.tsx'

/** Discord's own id for commands that come from the client rather than an application. */
const BUILT_IN_APPLICATION_ID = '-1'
/** ApplicationCommandType.CHAT_INPUT */
const CHAT_INPUT = 1
/** ApplicationCommandInputType.BUILT_IN */
const INPUT_BUILT_IN = 0

const EPHEMERAL = 64

/** Discord rejects ids it cannot parse as a snowflake, so this has to look like one. */
function fakeSnowflake(): string {
	// Snowflake epoch is 2015-01-01. The low 22 bits are worker/process/increment; random is fine
	// for a message that exists only in this client's store.
	const timestamp = BigInt(Date.now() - 1420070400000) << 22n
	const noise = BigInt(Math.floor(Math.random() * 4194304))
	return (timestamp | noise).toString()
}

let messageActions: any

/** Discord's MessageActions (`sendMessage`), looked up on first send. */
function findMessageActions(): any {
	if (messageActions) return messageActions
	const { lookupModule } = modulesFinders
	const { withProps } = filters
	const [mod] = lookupModule(withProps('receiveMessage', 'sendMessage')) as [any, number | undefined]
	const host = typeof mod?.sendMessage === 'function' ? mod : mod?.default
	if (typeof host?.sendMessage === 'function') messageActions = host
	return messageActions
}

/**
 * Sends [content] as the user, the way Discord's own send path does: with the send options
 * (`getSendMessageOptions`) and a nonce. Copied from Diagnostics (plugins/checkup/js/lib/command.ts).
 *
 * Why not return `{ content }` to Discord: its built-in executor ignores it for BUILT_IN commands,
 * and for BUILT_IN_TEXT (/shrug's type) it calls `_sendMessage` without the options argument, which
 * throws "Cannot read property 'activityAction' of undefined" (351.6; 'nonce' on 348). Seen live
 * with Invisible Chat's /secret on 2026-10-22; it's also why /fx messages never arrived.
 */
function sendAsUser(channelId: string | undefined, content: string) {
	const actions = findMessageActions()
	if (!channelId || !actions) {
		reportError('[commands] could not send: no channel or no MessageActions', new Error('missing'))
		return
	}
	let options: Record<string, unknown> = {}
	try {
		const built = actions.getSendMessageOptions?.({})
		if (built && typeof built === 'object') options = { ...built }
	} catch {
		/* fall back to a bare options object */
	}
	if (options.nonce == null) options.nonce = fakeSnowflake()
	Promise.resolve(
		actions.sendMessage(channelId, { content, tts: false, invalidEmojis: [], validNonShortcutEmojis: [] }, undefined, options),
	).catch(error => reportError('[commands] sending failed:', error))
}

/** Pulls `BUILT_IN_COMMANDS` off a module namespace, checking `default` too (porting rule 3). */
function extract(mod: any): unknown {
	if (Array.isArray(mod?.BUILT_IN_COMMANDS)) return mod.BUILT_IN_COMMANDS
	if (Array.isArray(mod?.default?.BUILT_IN_COMMANDS))
		return mod.default.BUILT_IN_COMMANDS
	return undefined
}

/**
 * Discord's autocomplete reads several name and description fields rather than one, and a missing
 * one shows as a blank row rather than an error. They are all filled from the same two strings.
 */
function buildEntry(definition: CommandDefinition, id: string) {
	return {
		id,
		applicationId: BUILT_IN_APPLICATION_ID,
		type: CHAT_INPUT,
		inputType: INPUT_BUILT_IN,
		name: definition.name,
		displayName: definition.name,
		untranslatedName: definition.name,
		description: definition.description,
		displayDescription: definition.description,
		untranslatedDescription: definition.description,
		options: (definition.options ?? []).map(option => ({
			...option,
			displayName: option.name,
			displayDescription: option.description,
			required: option.required ?? false,
			...(option.choices
				? {
						choices: option.choices.map(choice => ({
							...choice,
							displayName: choice.name,
						})),
					}
				: {}),
		})),
		execute(args: CommandArgument[], context: CommandContext) {
			const result = definition.execute(args, context)
			if (result && !(result instanceof Promise) && typeof result.content === 'string') {
				sendAsUser(context?.channel?.id, result.content)
				return
			}
			return result
		},
	}
}

/**
 * Discord's six default avatars, by the index its avatar helper derives from a user id:
 * 0 blurple, 1 grey, 2 green, 3 orange, 4 red, 5 pink.
 */
export type DefaultAvatar = 0 | 1 | 2 | 3 | 4 | 5

/**
 * A stable, snowflake-shaped author id per plugin. Each plugin needs its own: Discord groups
 * consecutive messages by author id. With no avatar hash, Discord picks the default avatar
 * `(id >> 22) % 6`, so the id is built to land on the one asked for.
 */
function authorIdFor(owner: string, avatar: DefaultAvatar): string {
	let hash = 0n
	for (let i = 0; i < owner.length; i++)
		hash = (hash * 31n + BigInt(owner.charCodeAt(i))) % 100000000000n
	return (((hash + 1n) * 6n + BigInt(avatar)) << 22n).toString()
}

/**
 * `owner` is the plugin's display name: it tags the logs and is the author name of clientside
 * messages, which show Discord's default avatar number `avatar`. Safe to call at module scope —
 * nothing here touches `revenge` until a command is registered or a message shown, which must
 * only happen from `start()` (porting rule 1).
 */
export function createCommands(owner: string, avatar: DefaultAvatar = 0) {
	const tag = `[${owner.replace(/\s+/g, '')}]`
	const authorId = authorIdFor(owner, avatar)
	/** The picture Discord shows for `authorId`, for anything else that wants the same one. */
	const avatarUrl = `https://cdn.discordapp.com/embed/avatars/${avatar}.png`

	const status = {
		found: false,
		via: '' as '' | 'imported-path' | 'props',
		registered: [] as string[],
	}

	let registry: any[] | undefined
	/** Entries waiting for the registry to turn up. */
	const queued = new Map<string, any>()
	let watching = false
	const teardown: Array<() => void> = []

	function stopWatching() {
		for (const stop of teardown.splice(0)) {
			try {
				stop()
			} catch {
				/* a subscription that is already gone is nothing to report */
			}
		}
		watching = false
	}

	function adopt(array: unknown, via: 'imported-path' | 'props'): boolean {
		if (registry || !Array.isArray(array)) return false

		registry = array as any[]
		status.found = true
		status.via = via
		if (DEBUG) console.log(
			`${tag} command registry found via ${via} (${registry.length} built-ins)`,
		)

		// Anything registered before the module arrived goes in now.
		for (const [id, entry] of queued) {
			const stale = registry.findIndex(command => command?.id === id)
			if (stale !== -1) registry.splice(stale, 1)
			registry.push(entry)
			if (DEBUG) console.log(`${tag} registered /${entry.name}`)
		}
		queued.clear()
		stopWatching()
		return true
	}

	function watchForRegistry() {
		if (watching || registry) return
		watching = true

		// Route 1: by source path. The namespace moved between Revenge builds, and the short one
		// throws rather than returning undefined, so try both and let either answer.
		try {
			const finders =
				(discordFinders as any)
			if (typeof finders?.getModuleWithImportedPath === 'function') {
				const unsub = finders.getModuleWithImportedPath(
					BUILT_INS_PATH,
					(exports: any) => {
						adopt(extract(exports), 'imported-path')
					},
				)
				if (typeof unsub === 'function') teardown.push(unsub)
			} else {
				if (DEBUG) console.log(
					`${tag} no getModuleWithImportedPath on this build; falling back to props`,
				)
			}
		} catch (error) {
			reportError(`${tag} imported-path lookup threw:`, error)
		}
		// The callback can fire synchronously, before its unsubscribe was pushed; drop it now.
		if (registry) return stopWatching()

		// Route 2: by shape, as a standing subscription rather than a one-shot look.
		try {
			const { lookupModules, waitForModules } = modulesFinders
			const { withProps } = filters
			const filter = withProps('BUILT_IN_COMMANDS')

			for (const [exports] of lookupModules(filter)) {
				if (adopt(extract(exports), 'props')) return
			}

			const unsub = waitForModules(filter, (exports: any) => {
				adopt(extract(exports), 'props')
			})
			teardown.push(() => unsub?.())
		} catch (error) {
			reportError(`${tag} props lookup threw:`, error)
		}
	}

	/**
	 * Returns an unregister callback immediately. The command itself lands whenever the registry
	 * does, which may be after this returns.
	 */
	function registerCommand(definition: CommandDefinition): () => void {
		const id = `bleelblep-${definition.name}`
		const entry = buildEntry(definition, id)
		status.registered.push(definition.name)

		if (registry) {
			// Re-registering after a reload would otherwise show the command twice.
			const stale = registry.findIndex(command => command?.id === id)
			if (stale !== -1) registry.splice(stale, 1)
			registry.push(entry)
			if (DEBUG) console.log(`${tag} registered /${definition.name}`)
		} else {
			queued.set(id, entry)
			watchForRegistry()
		}

		return () => {
			queued.delete(id)
			if (registry) {
				const index = registry.findIndex(command => command?.id === id)
				if (index !== -1) registry.splice(index, 1)
			}
			status.registered = status.registered.filter(
				name => name !== definition.name,
			)
			// Only stop waiting once nothing is left waiting; the plugin's other commands may
			// still be queued for a registry that has not turned up yet.
			if (queued.size === 0) stopWatching()
		}
	}

	function registryStatus(): {
		found: boolean
		via: string
		registered: string[]
	} {
		return {
			found: status.found,
			via: status.via,
			registered: [...status.registered],
		}
	}

	let receiver: any
	let receiverResolved = false

	/** Resolved lazily and cached. Never at module scope -- porting rule 1. */
	function getReceiver(): any {
		if (receiverResolved) return receiver
		receiverResolved = true

		try {
			const { lookupModule } = modulesFinders
			const { withProps } = filters
			const [mod, id] = lookupModule(
				withProps('receiveMessage', 'sendMessage'),
			) as [any, number | undefined]
			if (id === undefined) {
				reportError(`${tag} no receiveMessage module found`)
				return undefined
			}
			// The export is usually on `default`, not on the namespace -- porting rule 3.
			const host =
				typeof mod?.receiveMessage === 'function' ? mod : mod?.default
			if (typeof host?.receiveMessage !== 'function') {
				reportError(`${tag} module ${id} has no callable receiveMessage`)
				return undefined
			}
			receiver = host
			if (DEBUG) console.log(`${tag} clientside messages will use module ${id}`)
		} catch (error) {
			reportError(`${tag} receiveMessage lookup threw:`, error)
		}

		return receiver
	}

	function clientMessage({ channelId, content, author = owner, id }: ClientMessageOptions) {
		return {
			id: id ?? fakeSnowflake(),
			type: 0,
			flags: EPHEMERAL,
			channel_id: channelId,
			content,
			author: {
				id: authorId,
				username: author,
				global_name: author,
				// '0' selects the id-based default avatar; any legacy discriminator gives everyone the same one.
				discriminator: '0',
				avatar: null,
				bot: true,
			},
			timestamp: new Date().toISOString(),
			edited_timestamp: null,
			tts: false,
			pinned: false,
			mention_everyone: false,
			mentions: [],
			mention_roles: [],
			attachments: [],
			embeds: [],
			reactions: [],
			state: 'SENT',
		}
	}

	/** True when the message was handed to the client. Nothing is ever sent to Discord. */
	function showClientMessage(options: ClientMessageOptions): boolean {
		const host = getReceiver()
		if (!host) return false

		try {
			host.receiveMessage(options.channelId, clientMessage(options))
			return true
		} catch (error) {
			reportError(`${tag} could not show the clientside message:`, error)
			return false
		}
	}

	function dispatch(action: Record<string, unknown>): boolean {
		const dispatcher = (flux as any).Dispatcher
		if (typeof dispatcher?.dispatch !== 'function') return false
		try {
			dispatcher.dispatch(action)
			return true
		} catch (error) {
			reportError(`${tag} could not change the clientside message:`, error)
			return false
		}
	}

	/** Rewrites a message shown with `showClientMessage({ id })`, in place. Local only. */
	function updateClientMessage(options: ClientMessageOptions & { id: string }): boolean {
		return dispatch({ type: 'MESSAGE_UPDATE', message: clientMessage(options) })
	}

	/** Takes away a message shown with `showClientMessage({ id })`. Local only. */
	function deleteClientMessage(channelId: string, id: string): boolean {
		return dispatch({ type: 'MESSAGE_DELETE', id, channelId })
	}

	return { registerCommand, registryStatus, showClientMessage, updateClientMessage, deleteClientMessage, avatarUrl }
}
