
import swears from "./swears";

export default function censor(content: string): string {
    const keys = (Object.keys(swears) as (keyof typeof swears)[])
        .sort((a, b) => b.length - a.length);

    const regex = /\b[\p{L}\p{N}_]+\b/giu;

    return content.replace(regex, word => {
        const normalized = word
            .toLowerCase()
            .replace(/(.)\1+/gu, "$1");

        let key: keyof typeof swears | undefined;
        let suffixLength = 0;

        for (const candidate of keys) {
            const base = candidate.toLowerCase();

            if (!normalized.startsWith(base)) continue;

            const suffix = normalized.slice(base.length);

            if (!suffix) {
                key = candidate;
                break;
            }

            for (let length = base.length; length >= 1; length--) {
                const chunk = base.slice(-length);

                if (
                    suffix.length % length === 0 &&
                    chunk.repeat(suffix.length / length) === suffix
                ) {
                    key = candidate;
                    suffixLength = length;
                    break;
                }
            }

            if (key) break;
        }

        if (!key) return word;

        const replacement = swears[key].match(/\\\*|[\s\S]/gu) ?? [];
        const base = key.toLowerCase();
        const result: string[] = [];

        let index = 0;

        for (const match of word.matchAll(/(.)\1*/gu)) {
            const group = match[0];

            let replacementIndex = index;

            if (index >= base.length && suffixLength > 0) {
                replacementIndex =
                    base.length - suffixLength +
                    ((index - base.length) % suffixLength);
            }

            const replacementChar = replacement[replacementIndex];

            if (replacementChar === undefined) {
                result.push(group);
            } else {
                result.push(
                    ...Array.from(group, char =>
                        char !== char.toLowerCase() &&
                        char === char.toUpperCase()
                            ? replacementChar.toUpperCase()
                            : replacementChar
                    )
                );
            }

            index++;
        }

        return result.join("");
    });
}
