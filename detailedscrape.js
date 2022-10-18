const fs = require('fs');
const https = require('https');

const breakthrough = require('./pages/detailed/breakthrough')
const spotlight = require('./pages/detailed/spotlight')
const communityday = require('./pages/detailed/communityday')
const event = require('./pages/detailed/event')
const raidbattles = require('./pages/detailed/raidbattles')
const raidday = require('./pages/detailed/raidday')
const gobattleleague = require('./pages/detailed/gobattleleague')

function main() {
    var events = JSON.parse(fs.readFileSync("./files/events.min.json"));

    https.get("https://raw.githubusercontent.com/mdah13/ScrapedDuck/data/events.min.json", (res) => {
        let body = "";
        res.on("data", (chunk) => { body += chunk; });

        res.on("end", () => {
            try {
                let bkp = JSON.parse(body);

                events.forEach(e => {
                    switch (e.eventType) {
                        case "research-breakthrough":
                            breakthrough.get(e.link, e.eventID, bkp);
                            break;
                        case "pokemon-spotlight-hour":
                            spotlight.get(e.link, e.eventID, bkp);
                            break;
                        case "community-day":
                            communityday.get(e.link, e.eventID, bkp);
                            break;
                        case "season":
                        case "event":
                            event.get(e.link, e.eventID, bkp);
                            break;
                        case "raid-battles":
                            raidbattles.get(e.link, e.eventID, bkp);
                            break;
                        case "raid-day":
                            raidday.get(e.link, e.eventID, bkp);
                            break;
                        case "go-battle-league":
                            gobattleleague.get(e.link, e.eventID, bkp);
                            break;
                        default:
                            break;
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
}

main();