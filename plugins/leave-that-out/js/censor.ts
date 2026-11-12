
import swears from "./swears";

export default function censor(content: string): string {
    const keys = Object.keys(swears).sort((a, b) => b.length - a.length);
    const regex = /\b[\p{L}\p{N}_]+\b/giu;

    return content.replace(regex, word => {
        const chars = [...word];

        const normalized = word
            .toLowerCase()
            .replace(/(.)\1+/g, "$1");

        const key = keys.find(key => key.toLowerCase() === normalized);

        if (!key) return word;

        const replacement = [...swears[key]];
        const result: string[] = [];

        let index = 0;
        let previous = "";

        for (const char of chars) {
            const lower = char.toLowerCase();

            if (lower === previous) {
                result.push("*");
                continue;
            }

            previous = lower;

            const replacementChar = replacement[index++];

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

        return result.join("");
    });
}
