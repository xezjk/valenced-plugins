const dictionary: Record<string, string> = {
    fuck: "f*ck",
    shit: "sh*t",
    nigger: "n**ger",
    dick: "d*ck",
    cock: "c*ck",
    bitch: "b*tch",
    cunt: "c*nt",
    slut: "sl*t"
};

export default function censor(content: string) {
    for (const key in dictionary) {
        content = content.replace(new RegExp(key, "gi"), match => {
            const replacement = dictionary[key];

            if (match === match.toUpperCase()) {
                return replacement.toUpperCase();
            }

            if (match[0] === match[0].toUpperCase()) {
                return replacement[0].toUpperCase() + replacement.slice(1);
            }

            return replacement;
        });
    }
}