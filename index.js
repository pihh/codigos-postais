const fs = require('fs');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const zone = "oeiras";
const url = `https://www.codigo-postal.pt/${zone}/`;
const filename = `codigos-postais-${zone}.txt`;

const getNumberOfPages = function ($) {
    return parseInt($('.pagination-totals').text().replace('Página 1 de ', ''));
}
const getCP = function ($) {
    return $('.cp');
}
const getFirst4Digits = function (cp) {
    return cp.substring(0, 4);
}
const read = async () => {
    const DOM = await fetch(url);
    const HTML = await DOM.text();

    const $ = cheerio.load(HTML);
    const pages = getNumberOfPages($);
    const postalCodes = [];

    for (let i = 1; i <= pages; i++) {
        const PAGE_URL = `${url}${i}.html`;
        const PAGE = await fetch(PAGE_URL);
        const PAGE_HTML = await PAGE.text();
        const $page = cheerio.load(PAGE_HTML);
        const cps = getCP($page);
        cps.each((i, el) => {
            const d = getFirst4Digits($(el).text());
            if (postalCodes.indexOf(d) === -1) {
                postalCodes.push(d);
            }
        })
        console.log('Finnished analysing ', PAGE_URL)

    }


    fs.writeFile(filename, postalCodes.map(el => el + '*').toString(), function (err) {
        if (err) return console.error(err);
        console.log('Analyzed and scraped all website, you now have all postal codes in ' + zone + ' written at the following file: ' + filename);
        console.log('\x1b[33m%s\x1b[0m', '🕱🕱🕱 Pihh is the best 🕱🕱🕱')
    })
}



read();