
import swears from "./swears";

type Key = keyof typeof swears;

type Match = {
    key: Key;
    end: number;
    suffixLength: number;
};

function normalize(value: string): string {
    return value.toLowerCase().replace(/(.)\1+/gu, "$1");
}

function findMatchAt(word: string, start: number, keys: Key[]): Match[] {
    const matches: Match[] = [];

    for (const key of keys) {
        if (word.slice(start).toLowerCase().startsWith(key.toLowerCase())) {
            matches.push({
                key,
                end: start + key.length,
                suffixLength: 0
            });
        }
    }

    if (matches.length) return matches;

    for (const key of keys) {
        const base = normalize(key);
        let end = start;

        while (end < word.length) {
            end++;

            const candidate = normalize(word.slice(start, end));

            if (candidate === base) {
                matches.push({ key, end, suffixLength: 0 });
                break;
            }

            if (!base.startsWith(candidate)) continue;

            if (candidate.length > base.length) break;
        }
    }

    return matches;
}

function segmentWord(word: string, keys: Key[]): Match[] | undefined {
    const memo = new Map<number, Match[] | null>();

    function solve(position: number): Match[] | undefined {
        if (position === word.length) return [];

        if (memo.has(position)) {
            return memo.get(position) ?? undefined;
        }

        const matches = findMatchAt(word, position, keys)
            .sort((a, b) => b.end - a.end);

        for (const match of matches) {
            const rest = solve(match.end);

            if (rest !== undefined) {
                const result = [match, ...rest];
                memo.set(position, result);
                return result;
            }
        }

        memo.set(position, null);
        return undefined;
    }

    return solve(0);
}

function censorMatch(word: string, key: Key): string {
    const replacement = swears[key].match(/\\\*|[\s\S]/gu) ?? [];
    const keyGroups = key.match(/(.)\1*/gu) ?? [];
    const wordGroups = word.match(/(.)\1*/gu) ?? [];

    const result: string[] = [];
    let index = 0;

    for (let i = 0; i < wordGroups.length; i++) {
        const group = wordGroups[i];
        const keyGroup = keyGroups[i];

        if (!keyGroup) {
            result.push(group);
            continue;
        }

        for (let j = 0; j < group.length; j++) {
            const replacementChar =
                replacement[index + Math.min(j, keyGroup.length - 1)];

            const char = group[j];

            result.push(
                replacementChar === undefined
                    ? char
                    : char !== char.toLowerCase() &&
                      char === char.toUpperCase()
                        ? replacementChar.toUpperCase()
                        : replacementChar
            );
        }

        index += keyGroup.length;
    }

    return result.join("");
}

export default function censor(content: string): string {
    const keys = (Object.keys(swears) as Key[])
        .sort((a, b) => b.length - a.length);

    const regex = /\b[\p{L}\p{N}_]+\b/giu;

    return content.replace(regex, word => {
        const exact = keys.find(
            key => key.toLowerCase() === word.toLowerCase()
        );

        if (exact) return censorMatch(word, exact);

        const matches = segmentWord(word, keys);

        if (!matches || matches.length < 2) return word;

        let position = 0;

        return matches.map(match => {
            const segment = word.slice(position, match.end);
            position = match.end;

            return censorMatch(segment, match.key);
        }).join("");
    });
}
