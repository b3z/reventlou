// // import * as highlight from "highlight.js";
// // import { Converter } from "showdown";
// // import { networkInterfaces } from "os";#
// import { log } from "./logger";

export function translate(md: string): string {
    // this is nice but we need to rewrite a lot for md and code syntax highlighting
    // never the less it is planed for the future. But first I need a running ims.
    //let converter = new Converter();
    //return converter.makeHtml(md);

    // md = newline(md);
    md = linkHTTP(md); // make links clickable
    md = newline(md); // render linebreaks as html
    md = linkFILE(md);
    //md = linkHASH(md);
    return md;
}

// function newline(md: string): string {
//     return md.replace(/\n/g, "<br>");
// }

function linkHTTP(md: string): string {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return md.replace(urlRegex, (url) => {
        return '<a href="' + url + '">' + url + "</a>";
    });
}

function newline(md: string): string {
    return md.replace(/\n/g, "<br>");
}

function linkFILE(md: string): string {
    const urlRegex = /(file:\/\/[^\s]+)/g;
    return md.replace(urlRegex, (url) => {
        return (
            '<div id="file"><a id="explorer" href="explorer:' +
            url +
            '">&#8678; </a>' +
            '<a href="' +
            url +
            '">' +
            url.replace("file://", "") +
            "</a></div>"
        );
    });
}

// function linkHASH(md: string): string {
//     var urlRegex = /(ims:\/\/[^\s]+)/g;
//     return md.replace(urlRegex, (url) => {
//         return '<a href="' + url + '">' + url + "</a>";
//     });
// }
