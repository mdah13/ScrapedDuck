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

                var content = dom.window.document.querySelectorAll('.pkmn-list-flex')[0];
                if (content != null) {
                    pokemons = content.querySelectorAll(".pkmn-name");
                    names = []
                    for (let i = 0; i < pokemons.length; i++) {
                        const pokeName = pokemons[i];
                        names.push(pokeName.innerHTML)
                    }
    
                    event.name = names.join(', ')
                }



                fs.writeFile(`files/temp/${id}.json`, JSON.stringify({ id: id, type: "event", data: event }), err => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
            }).catch(_err => {
                for (var i = 0; i < bkp.length; i++) {
                    if (bkp[i].eventID == id) {
                        fs.writeFile(`files/temp/${id}.json`, JSON.stringify({ id: id, type: "event", data: bkp[i].extraData }), err => {
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