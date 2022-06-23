const fs = require('fs');
const jsd = require('jsdom');
const { JSDOM } = jsd;
const https = require('https');

function get(url, id, bkp)
{
    return new Promise(resolve => {
        JSDOM.fromURL(url, {
        })
        .then((dom) => {

            var content = dom.window.document.querySelectorAll('.pkmn-list-flex')[0];

            var spotlight = {
                name: "",
                canBeShiny: false,
                image: "",
                bonus: [],
                graphic: ""
            };

            const images = dom.window.document.querySelectorAll('img');

            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                if (img.alt === "Graphic") {
                    spotlight.graphic = img.src
                }
            }

            spotlight.name = content.querySelector(":scope > .pkmn-list-item > .pkmn-name").innerHTML;
            spotlight.canBeShiny = content.querySelector(":scope > .pkmn-list-item > .shiny-icon") != null;
            spotlight.image = content.querySelector(":scope > .pkmn-list-item > .pkmn-list-img > img").src;

            var temp = dom.window.document.querySelectorAll('.event-description')[0].innerHTML;
            var split = temp.split("<strong>");
            spotlight.bonus.push(split[split.length - 1].split("</strong>")[0]);

            fs.writeFile(`files/temp/${id}.json`, JSON.stringify({ id: id, type: "pokemon-spotlight-hour", data: spotlight }), err => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        }).catch(_err =>
        {
            for (var i = 0; i < bkp.length; i++)
            {
                if (bkp[i].eventID == id)
                {
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