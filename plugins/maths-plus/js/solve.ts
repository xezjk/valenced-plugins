
const additionSigns: string[] = ["+", "＋", "⊕"];
const subtractionSigns: string[] = ["-", "−", "－", "–", "—"];
const multiplicationSigns: string[] = ["x", "X", "×", "·", "⋅", "*"];
const divisionSigns: string[] = ["/", "÷", "⁄", "∕", ":"];

const constants: Record<string, number> = {
    pi: Math.PI,
    π: Math.PI,
    Π: Math.PI,
    e: Math.E,
    tau: Math.PI * 2,
    τ: Math.PI * 2,
    infinity: Infinity,
    "∞": Infinity
};

const functions: Record<string, (n: number) => number> = {
    sqrt: Math.sqrt,
    cbrt: Math.cbrt,

    sin: n => Math.sin(n * Math.PI / 180),
    cos: n => Math.cos(n * Math.PI / 180),
    tan: n => Math.tan(n * Math.PI / 180),

    asin: n => Math.asin(n) * 180 / Math.PI,
    acos: n => Math.acos(n) * 180 / Math.PI,
    atan: n => Math.atan(n) * 180 / Math.PI,

    sinh: Math.sinh,
    cosh: Math.cosh,
    tanh: Math.tanh,

    log: Math.log10,
    log10: Math.log10,
    ln: Math.log,

    abs: Math.abs,
    floor: Math.floor,
    ceil: Math.ceil,
    round: Math.round,
    trunc: Math.trunc,

    exp: Math.exp,
    sign: Math.sign
};

const superscripts: Record<string, string> = {
    "⁰": "0", "¹": "1", "²": "2", "³": "3",
    "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7",
    "⁸": "8", "⁹": "9"
};

function factorial(n: number): number {
    if (!Number.isInteger(n) || n < 0 || n > 170) {
        throw new Error("Invalid factorial");
    }

    let result = 1;

    for (let i = 2; i <= n; i++) {
        result *= i;
    }

    return result;
}

function solveExpression(expression: string): number {
    let source = expression
        .replace(/∛/g, "cbrt")
        .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, match =>
            "^" + [...match].map(char => superscripts[char]).join("")
        );

    for (const sign of additionSigns) {
        if (sign !== "+") source = source.replaceAll(sign, "+");
    }

    for (const sign of subtractionSigns) {
        if (sign !== "-") source = source.replaceAll(sign, "-");
    }

    for (const sign of multiplicationSigns) {
        if (sign !== "*") source = source.replaceAll(sign, "*");
    }

    for (const sign of divisionSigns) {
        if (sign !== "/") source = source.replaceAll(sign, "/");
    }

    source = source.replace(/\*\*/g, "^");

    const tokens = source.match(
        /(?:\d+(?:\.\d*)?|\.\d+)|[a-zA-Z]+|[πΠτ∞√^+\-*/%()!|]/g
    );

    if (!tokens || source.replace(/\s/g, "") !== tokens.join("")) {
        throw new Error("Invalid expression");
    }

    // Implicit multiplication
    const parsedTokens: string[] = [];
    let insideAbsolute = false;
    let previousWasClosingPipe = false;

    for (const token of tokens) {
        const previous = parsedTokens[parsedTokens.length - 1];

        const previousEndsValue = previous !== undefined && (
            /^\d/.test(previous) ||
            previous in constants ||
            previous === ")" ||
            previous === "!" ||
            (previous === "|" && previousWasClosingPipe)
        );

        const currentStartsValue =
            /^\d/.test(token) ||
            token in constants ||
            token in functions ||
            token === "(" ||
            (token === "|" && !insideAbsolute);

        if (
            previousEndsValue &&
            currentStartsValue &&
            !(previous in functions && token === "(")
        ) {
            parsedTokens.push("*");
        }

        if (token === "|") {
            insideAbsolute = !insideAbsolute;
            previousWasClosingPipe = insideAbsolute === false;
        } else {
            previousWasClosingPipe = false;
        }

        parsedTokens.push(token);
    }

    let position = 0;

    function peek(): string | undefined {
        return parsedTokens[position];
    }

    function consume(): string {
        return parsedTokens[position++];
    }

    function parseExpression(): number {
        let result = parseTerm();

        while (peek() === "+" || peek() === "-") {
            const operator = consume();
            const right = parseTerm();

            result = operator === "+"
                ? result + right
                : result - right;
        }

        return result;
    }

    function parseTerm(): number {
        let result = parseUnary();

        while (["*", "/", "%"].includes(peek() ?? "")) {
            const operator = consume();
            const right = parseUnary();

            if ((operator === "/" || operator === "%") && right === 0) {
                throw new Error("Division by zero");
            }

            if (operator === "*") result *= right;
            if (operator === "/") result /= right;
            if (operator === "%") result %= right;
        }

        return result;
    }

    function parseUnary(): number {
        if (peek() === "+") {
            consume();
            return parseUnary();
        }

        if (peek() === "-") {
            consume();
            return -parseUnary();
        }

        return parsePower();
    }

    function parsePower(): number {
        const base = parsePostfix();

        if (peek() === "^") {
            consume();
            return base ** parseUnary();
        }

        return base;
    }

    function parsePostfix(): number {
        let result = parsePrimary();

        while (peek() === "!") {
            consume();
            result = factorial(result);
        }

        return result;
    }

    function parsePrimary(): number {
        const token = peek();

        if (!token) {
            throw new Error("Unexpected end of expression");
        }

        if (token === "|") {
            consume();

            const value = parseExpression();

            if (consume() !== "|") {
                throw new Error("Missing closing absolute value pipe");
            }

            return Math.abs(value);
        }

        if (token === "√") {
            consume();

            const value = parseUnary();

            if (value < 0) {
                throw new Error("Invalid square root");
            }

            return Math.sqrt(value);
        }

        if (token === "(") {
            consume();

            const result = parseExpression();

            if (consume() !== ")") {
                throw new Error("Missing closing parenthesis");
            }

            return result;
        }

        if (/^\d/.test(token) || /^\.\d/.test(token)) {
            return Number(consume());
        }

        if (token in constants) {
            consume();
            return constants[token];
        }

        if (token in functions) {
            const name = consume();

            if (consume() !== "(") {
                throw new Error(`${name} requires parentheses`);
            }

            const value = parseExpression();

            if (consume() !== ")") {
                throw new Error("Missing closing parenthesis");
            }

            return functions[name](value);
        }

        throw new Error("Unexpected token: " + token);
    }

    const result = parseExpression();

    if (position !== parsedTokens.length) {
        throw new Error("Unexpected token: " + peek());
    }

    if (Number.isNaN(result)) {
        throw new Error("Invalid result");
    }

    return result;
}

export default function solve(content: string): string {
    return content.replace(/<<(.*?)>>/g, (match, expression: string) => {
        try {
            return String(solveExpression(expression));
        } catch {
            return match;
        }
    });
}
