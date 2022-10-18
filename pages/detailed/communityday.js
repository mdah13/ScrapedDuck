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

                var content = dom.window.document.querySelector('.page-content').childNodes;

                var event = {
                    name: "",
                    image: "",
                    bonus: [],
                    graphic: []
                };

                const images = dom.window.document.querySelectorAll('img');
                event.graphic = utils.Graphics(images);

                var bonuses = dom.window.document.querySelectorAll('.bonus-text');
                event.bonus = utils.Bonuses(bonuses);

                var spawnList;

                var lastNodeName = null

                for (let i = 0; i < content.length; i++) {
                    const node = content[i];

                    if (node.className === "pkmn-list-flex" && lastNodeName === "event-section-header spawns") {
                        spawnList = node;
                        break
                    }

                    if (node.className != null && node.className != '') {
                        lastNodeName = node.className;
                    }
                }

                if (spawnList != null) {
                    pokemons = spawnList.querySelectorAll(".pkmn-name");

                    names = []
                    for (let i = 0; i < pokemons.length; i++) {
                        const pokeName = pokemons[i];
                        names.push(pokeName.innerHTML)
                    }

                    event.name = names.join(', ')
                    event.image = spawnList.querySelector(":scope > .pkmn-list-item > .pkmn-list-img > img").src;
                }

                fs.writeFile(`files/temp/${id}.json`, JSON.stringify({ id: id, type: "community-day", data: event }), err => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
            }).catch(_err => {
                for (var i = 0; i < bkp.length; i++) {
                    if (bkp[i].eventID == id) {
                        fs.writeFile(`files/temp/${id}.json`, JSON.stringify({ id: id, type: "community-day", data: bkp[i].extraData }), err => {
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