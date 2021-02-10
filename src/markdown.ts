const httpBracketLink = /\[([^[]+)\]\(([^)]+)\)/gim; // matches [text](url) note still needs https to be clickable
const httpRawLink = /((?<!href=")https?:\/\/[^\s]+)/gim; // old raw match: /(https?:\/\/[^\s]+)/gim; // matches raw url without href=" in front

const rules = {
    httpBracketLink: {
        regex: httpBracketLink,
        replacer: function (match, $1, $2) {
            return `<a href="${$2}">${$1}</a>`;
        },
    },
    // matches all urls that don't have a href yet in front.
    httpRawLink: {
        regex: httpRawLink,
        replacer: function (match, $1) {
            return `<a href="${$1}">${$1}</a>`;
        },
    },
};

export function render(md) {
    Object.keys(rules).forEach((key) => {
        md = md.replace(rules[key].regex, rules[key].replacer);
    });
    return md.trim();
}
