'use strict';

import md5Helper from './md5.helper';
import sha1Helper from './sha1.helper';

let toHash = str => {

    return md5Helper.md5(str);
    // return sha1Helper.sha1(str);
};

let aElemAttrs;

let insertHyperlinks = substring => {

    let linkElem = "";
    let linkElemStart = "<a ";

    if (substring.indexOf(" ") === 0) { // if substring have space

        substring = substring.replace(/\s/, ""); // remove first space if it exist

        linkElem = " "; // add space before link

    }

    if (aElemAttrs) {
        linkElemStart += aElemAttrs + " ";
    }

    linkElem += linkElemStart + "href='" + substring + "'>" + substring + "</a>"

    return linkElem;

};

let parseAndInsertHyperlinks = (str, elemAttrs) => {

    if (str) {

        aElemAttrs = elemAttrs;

        /*
        (?:^|\s) - start of text or white space
        (?:http|ftp|mailto|file|data|irc) - uri schemes
        :[^\s]+ - colon and any character before white space or end of text
        */
        let stringWithHyperlink = str.replaceAll(/(?:^|\s)(?:http|https|ftp|mailto|file|data|irc):[^\s]+/g, insertHyperlinks);

        return stringWithHyperlink;

    }

    return '';

};

/**
 *
 * @param string {String}
 * @return {string}
 */
let escapeHtml = (string) => {

    if (typeof string !== "string") {
        throw new Error(`[stringHelper escapeHtml] Invalid type of argument. Expected 'string' got an ${typeof string}: ${string}`);
    }

    return string.replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

};

export default {
    toHash: toHash,
    parseAndInsertHyperlinks: parseAndInsertHyperlinks,
    escapeHtml: escapeHtml,
};