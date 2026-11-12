
import swears from "./swears";

type Key = keyof typeof swears;

function normalize(value: string): string {
    return value.toLowerCase().replace(/(.)\1+/gu, "$1");
}

function findMatchAt(word: string, start: number, keys: Key[]) {
    const remaining = word.slice(start);

    for (const key of keys) {
        if (remaining.toLowerCase().startsWith(key.toLowerCase())) {
            return {
                key,
                end: start + key.length,
                suffixLength: 0
            };
        }
    }

    let best:
        | { key: Key; end: number; suffixLength: number }
        | undefined;

    for (const key of keys) {
        const base = normalize(key);

        for (let end = start + 1; end <= word.length; end++) {
            const candidate = normalize(word.slice(start, end));

            if (!candidate.startsWith(base)) continue;

            const suffix = candidate.slice(base.length);
            let suffixLength = 0;

            if (suffix) {
                for (let length = base.length; length >= 1; length--) {
                    const chunk = base.slice(-length);

                    if (
                        suffix.length % length === 0 &&
                        chunk.repeat(suffix.length / length) === suffix
                    ) {
                        suffixLength = length;
                        break;
                    }
                }

                if (!suffixLength) continue;
            }

            if (!best || end > best.end) {
                best = { key, end, suffixLength };
            }
        }
    }

    return best;
}

function censorMatch(
    word: string,
    key: Key,
    suffixLength: number
): string {
    const replacement = swears[key].match(/\\\*|[\s\S]/gu) ?? [];
    const keyGroups = key.match(/(.)\1*/gu) ?? [];
    const wordGroups = word.match(/(.)\1*/gu) ?? [];

    const keyPositions: number[] = [];
    let position = 0;

    for (const group of keyGroups) {
        keyPositions.push(position);
        position += group.length;
    }

    const base = normalize(key);
    const result: string[] = [];

    for (let i = 0; i < wordGroups.length; i++) {
        const group = wordGroups[i];

        let keyGroupIndex = i;

        if (i >= keyGroups.length && suffixLength > 0) {
            keyGroupIndex =
                base.length - suffixLength +
                ((i - base.length) % suffixLength);
        }

        const keyPosition = keyPositions[keyGroupIndex];

        if (keyPosition === undefined) {
            result.push(group);
            continue;
        }

        const keyGroup = keyGroups[keyGroupIndex];

        for (let j = 0; j < group.length; j++) {
            const replacementIndex =
                keyPosition + Math.min(j, keyGroup.length - 1);

            const char = group[j];
            const replacementChar = replacement[replacementIndex];

            if (replacementChar === undefined) {
                result.push(char);
                continue;
            }

            result.push(
                char !== char.toLowerCase() &&
                char === char.toUpperCase()
                    ? replacementChar.toUpperCase()
                    : replacementChar
            );
        }
    }

    return result.join("");
}

export default function censor(content: string): string {
    const keys = (Object.keys(swears) as Key[])
        .sort((a, b) => b.length - a.length);

    const regex = /\b[\p{L}\p{N}_]+\b/giu;

    return content.replace(regex, word => {
        let result = "";
        let position = 0;

        while (position < word.length) {
            const match = findMatchAt(word, position, keys);

            if (!match) {
                result += word[position];
                position++;
                continue;
            }

            const segment = word.slice(position, match.end);

            result += censorMatch(
                segment,
                match.key,
                match.suffixLength
            );

            position = match.end;
        }

        return result;
    });
}
