const httpLinks = /\[([^[]+)\]\(([^)]+)\)/gim;

const rules = {
    links: {
        regex: httpLinks,
        replacer: function (match, $1, $2) {
            return `<a href="${$2}">${$1}</a>`;
        },
    },
};

export function render(md) {
    Object.keys(rules).forEach((key) => {
        md = md.replace(rules[key].regex, rules[key].replacer);
    });
    return md.trim();
}
