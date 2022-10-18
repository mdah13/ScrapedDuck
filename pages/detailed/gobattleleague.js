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

                var content = dom.window.document.querySelector('.event-description').childNodes;

                var event = {
                    name: "",
                    image: "",
                    bonus: [],
                    graphic: []
                };
                
                const images = dom.window.document.querySelectorAll('img');

                event.graphic = utils.Graphics(images);

                for (let i = 0; i < content.length; i++) {
                    const node = content[i];

                    if (node.childNodes.length > 0) {
                        for (let j = 0; j < node.childNodes.length; j++) {
                            const cNode = node.childNodes[j];
                            if (cNode.nodeName === "STRONG" || cNode.nodeName === "H3") {
                                event.bonus.push(cNode.textContent)
                                continue
                            }
                            if (cNode.nodeName === "LI") {
                                event.bonus.push("-" + cNode.textContent)
                                continue
                            }
                        }
                    }

                    if (node.nodeName === "STRONG" || node.nodeName === "H3") {
                        event.bonus.push(node.textContent)
                    }
                    if (node.nodeName === "LI") {
                        event.bonus.push("-" + node.textContent)
                    }
                }

                fs.writeFile(`files/temp/${id}.json`, JSON.stringify({ id: id, type: "go-battle-league", data: event }), err => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
            }).catch(_err => {
                for (var i = 0; i < bkp.length; i++) {
                    if (bkp[i].eventID == id) {
                        fs.writeFile(`files/temp/${id}.json`, JSON.stringify({ id: id, type: "go-battle-league", data: bkp[i].extraData }), err => {
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