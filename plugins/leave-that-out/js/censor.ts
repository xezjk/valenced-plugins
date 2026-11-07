import swears from './swears'

export default function censor(content: string): string {
    content = content.replace(new RegExp(key, "gi"), match =>
        [...swears[key]].map((char, i) =>
            match[i] === match[i]?.toUpperCase() && match[i] !== match[i]?.toLowerCase()
            ? char.toUpperCase()
            : char
        ).join("")
    );
}