const dictionary: Record<string, string> = {
    fuck: "f*ck",
    shit: "sh*t",
    nigger: "n**ger",
    dick: "d*ck",
    cock: "c*ck"
};

export default function censor(content: string) {
    for (const key in dictionary) {
        content = content.replace(new RegExp(key, "gi"), dictionary[key]);
    }
    return content;
}