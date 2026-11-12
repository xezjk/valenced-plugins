
import swears from "./swears";

export default function censor(content: string): string {
    const keys = (Object.keys(swears) as (keyof typeof swears)[])
        .sort((a, b) => b.length - a.length);

    const regex = /\b[\p{L}\p{N}_]+\b/giu;

    return content.replace(regex, word => {
        const normalized = word
            .toLowerCase()
            .replace(/(.)\1+/gu, "$1");

        const key = keys.find(key => key.toLowerCase() === normalized);

        if (!key) return word;

        const replacement = swears[key].match(/\\\*|[\s\S]/gu) ?? [];
        const result: string[] = [];

        let index = 0;

        for (const match of word.matchAll(/(.)\1*/gu)) {
            const group = match[0];
            const replacementChar = replacement[index++];

            if (replacementChar === undefined) {
                result.push(group);
                continue;
            }

            const masked = group.split("").map(char => {
                return char !== char.toLowerCase() &&
                    char === char.toUpperCase()
                    ? replacementChar.toUpperCase()
                    : replacementChar;
            });

            result.push(...masked);
        }

        return result.join("");
    });
}
