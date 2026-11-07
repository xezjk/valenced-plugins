import swears from "./swears";

export default function censor(content: string): string {
    for (const key in swears) {
        const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        content = content.replace(new RegExp(`\\b${escaped}\\b`, "gi"), match =>
            [...swears[key]].map((char, i) =>
                match[i] === match[i]?.toUpperCase() &&
                match[i] !== match[i]?.toLowerCase()
                    ? char.toUpperCase()
                    : char
            ).join("")
        );
    }

    return content;
}