/**
 * Errors go through `plugin.reportError` (community repo rule), not the log. Revenge keeps them on
 * the plugin, shows them in its options sheet and under the "has errors" filter, and logs them.
 *
 * Each plugin bundles its own copy of this file, so the module state below is per plugin. `start()`
 * calls `setReporter(plugin)` and clears it on cleanup.
 *
 * - `plugin.errors` is never trimmed, so each distinct error is reported once per session. A
 *   failure in a hot path (every message, every render) would otherwise grow it without bound.
 * - Errors before `start()` (module scope, preInit) are queued and reported when it runs.
 * - `context` says what failed; it becomes the start of the message, and the original stack is kept.
 */

interface Reporter {
	reportError(e: unknown): void
}

const MAX_QUEUED = 20

let reporter: Reporter | undefined
const queued: unknown[] = []
const seen = new Set<string>()

export function setReporter(plugin: Reporter | undefined) {
	reporter = plugin
	if (!plugin) return
	for (const error of queued.splice(0)) send(error)
}

export function reportError(context: string, error?: unknown) {
	const wrapped = withContext(context, error)
	const key = wrapped instanceof Error ? wrapped.message : String(wrapped)
	if (seen.has(key)) return
	seen.add(key)
	if (reporter) send(wrapped)
	else if (queued.length < MAX_QUEUED) queued.push(wrapped)
}

function send(error: unknown) {
	try {
		reporter?.reportError(error)
	} catch {
		/* reporting must never throw into the caller */
	}
}

function withContext(context: string, error: unknown): unknown {
	if (error === undefined) return new Error(context)
	if (!context) return error
	const message = error instanceof Error ? error.message : String(error)
	const wrapped = new Error(`${context} ${message}`)
	// Keep where it actually failed: the original frames under the new message.
	if (error instanceof Error && typeof error.stack === 'string') {
		const frames = error.stack.split('\n').slice(1).join('\n')
		if (frames) wrapped.stack = `${wrapped.name}: ${wrapped.message}\n${frames}`
	}
	return wrapped
}
