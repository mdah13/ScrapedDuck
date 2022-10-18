const fs = require('fs');
const jsd = require('jsdom');
const { JSDOM } = jsd;
const https = require('https');
const utils = require('./utils');

function get(url, id, bkp) {
    return new Promise(resolve => {
        JSDOM.fromURL(url, {
        })
            .then((dom) => {

                var event = {
                    name: "",
                    canBeShiny: false,
                    image: "",
                    bonus: [],
                    graphic: []
                };

                const images = dom.window.document.querySelectorAll('img');
                event.graphic = utils.Graphics(images);

                var bonuses = dom.window.document.querySelectorAll('.bonus-text');
                event.bonus = utils.Bonuses(bonuses);

                var content = dom.window.document.querySelectorAll('.pkmn-list-flex');

                if (content.length != 0) {
                    names = []
                    for (let i = 0; i < content.length; i++) {
                        const element = content[i];
                        pokeList = element.querySelectorAll(".pkmn-name");

                        if (pokeList.length != 0) {
                            for (let i = 0; i < pokeList.length; i++) {
                                const pokeName = pokeList[i];
                                if (pokeName.innerHTML) {
                                    names.push(pokeName.innerHTML)
                                }
                            }
                        }

                        if (element.querySelector(":scope > .pkmn-list-item > .shiny-icon") != null) {
                            event.canBeShiny = true;
                        }

                        const pkmImg = element.querySelector(":scope > .pkmn-list-item > .pkmn-list-img > img")
                        if (pkmImg != null) {
                            event.image = event.image || pkmImg.src;
                            if (pkmImg.src.includes("shiny")) {
                                event.canBeShiny = true;
                            }
                        }
                    }
                    names = names.filter((v, i, a) => a.indexOf(v) === i);
                    event.name = names.join(', ')
                }

                fs.writeFile(`files/temp/${id}.json`, JSON.stringify({ id: id, type: "raid-battles", data: event }), err => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
            }).catch(_err => {
                for (var i = 0; i < bkp.length; i++) {
                    if (bkp[i].eventID == id) {
                        fs.writeFile(`files/temp/${id}.json`, JSON.stringify({ id: id, type: "raid-battles", data: bkp[i].extraData }), err => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                        });
                    }
                }
            });
    })
}

module.exports = { get }