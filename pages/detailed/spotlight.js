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

                const content = dom.window.document.querySelectorAll('.pkmn-list-flex')[0];

                var event = {
                    name: "",
                    canBeShiny: false,
                    image: "",
                    bonus: [],
                    graphic: []
                };

                const images = dom.window.document.querySelectorAll('img');
                event.graphic = utils.Graphics(images);

                pokemons = content.querySelectorAll(".pkmn-name");

                names = []
                for (let i = 0; i < pokemons.length; i++) {
                    const pokeName = pokemons[i];
                    names.push(pokeName.innerHTML)
                }

                event.name = names.join(', ')
                event.canBeShiny = content.querySelector(":scope > .pkmn-list-item > .shiny-icon") != null;
                event.image = content.querySelector(":scope > .pkmn-list-item > .pkmn-list-img > img").src;

                var temp = dom.window.document.querySelectorAll('.event-description')[0].innerHTML;
                var split = temp.split("<strong>");
                event.bonus.push(split[split.length - 1].split("</strong>")[0]);

                fs.writeFile(`files/temp/${id}.json`, JSON.stringify({ id: id, type: "pokemon-spotlight-hour", data: event }), err => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
            }).catch(_err => {
                for (var i = 0; i < bkp.length; i++) {
                    if (bkp[i].eventID == id) {
                        fs.writeFile(`files/temp/${id}.json`, JSON.stringify({ id: id, type: "pokemon-spotlight-hour", data: bkp[i].extraData }), err => {
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