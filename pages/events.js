const fs = require('fs');
const moment = require('moment');
const jsd = require('jsdom');
const { JSDOM } = jsd;
const https = require('https');

function get() {
    return new Promise(resolve => {
        JSDOM.fromURL("https://www.leekduck.com/events/", {
        })
            .then((dom) => {

                var allEvents = [];

                ["current", "upcoming"].forEach(category => {

                    var events = dom.window.document.querySelectorAll(`div.events-list.${category}-events .event-header-item-wrapper`);

                    events.forEach(e => {
                        const itemLink = e.querySelector(":scope > .event-item-link")
                        var headingNode = itemLink.querySelector(":scope > .event-item-wrapper > h5")
                        if (headingNode == null) {
                            headingNode = itemLink.querySelector(":scope > .event-item-wrapper > p")
                        }
                        const heading = headingNode != null ? headingNode.innerHTML : ""
                        var name = itemLink.querySelector(":scope > .event-item-wrapper > .event-item > .event-text-container > .event-text > h2").innerHTML;
                        var image = itemLink.querySelector(":scope > .event-item-wrapper > .event-item > .event-img-wrapper > img").src;
                        var link = itemLink.href;
                        var eventID = link.split("/events/")[1];
                        eventID = eventID.substring(0, eventID.length - 1);

                        var eventItemWrapper = itemLink.querySelector(":scope > .event-item-wrapper");
                        var eventType = (eventItemWrapper.classList + "").replace("event-item-wrapper ", "");
                        eventType = eventType.replace("é", "e");

                        const timeHeader = e.querySelector(":scope > .event-header-time-period").attributes

                        var start = null
                        var end = null
                        var local = null

                        for (let i = 0; i < timeHeader.length; i++) {
                            const attr = timeHeader[i];
                            const nodeName = attr.nodeName;

                            if (nodeName.includes("start")) {
                                start = attr.value
                            } else if (nodeName.includes("end")) {
                                end = attr.value
                            } else if (nodeName.includes("local")) {
                                local = attr.value == "true"
                            }
                        }

                        if (start != null) {
                            if (!local) {
                                start = (new Date(start)).toISOString()
                            } else {
                                start = start.substr(0, start.length - 5) + ".000"
                            }
                        }

                        //Check for end date happening before start date and set end date to null
                        if (start != null && end != null && (new Date(end)) < (new Date(start))) {
                            end = null
                        }

                        if (end != null) {
                            if (!local) {
                                end = (new Date(end)).toISOString()
                            } else {
                                end = end.substr(0, end.length - 5) + ".000"
                            }
                        }

                        allEvents.push({ "eventID": eventID, "name": name, "eventType": eventType, "heading": heading, "link": link, "image": image, "start": start, "end": end, "extraData": null });
                    });
                });

                for (var i = 0; i < allEvents.length; i++) {
                    var event = allEvents[i];
                    if (allEvents.filter(e => e.eventID == event.eventID).length > 1) {
                        allEvents = allEvents.filter(e => e.eventID != event.eventID);
                        allEvents.splice(i, 0, event);

                        i--;
                    }
                }

                fs.writeFile('files/events.json', JSON.stringify(allEvents, null, 4), err => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
                fs.writeFile('files/events.min.json', JSON.stringify(allEvents), err => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
            }).catch(_err => {
                console.log(_err);
                https.get("https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/events.min.json", (res) => {
                    let body = "";
                    res.on("data", (chunk) => { body += chunk; });

                    res.on("end", () => {
                        try {
                            let json = JSON.parse(body);

                            fs.writeFile('files/events.json', JSON.stringify(json, null, 4), err => {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                            });
                            fs.writeFile('files/events.min.json', JSON.stringify(json), err => {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                            });
                        }
                        catch (error) {
                            console.error(error.message);
                        };
                    });

                }).on("error", (error) => {
                    console.error(error.message);
                });
            });
    })
}

module.exports = { get }