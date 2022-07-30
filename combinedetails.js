const fs = require('fs');

function main() {
    var events = JSON.parse(fs.readFileSync("./files/events.min.json"));

    fs.readdir("files/temp", function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        files.forEach(f => {
            var data = JSON.parse(fs.readFileSync("./files/temp/" + f));

            events.forEach(e => {
                if (e.eventID == data.id) {
                    switch (e.eventType) {
                        case "research-breakthrough":
                            e.extraData = { breakthrough: data.data }
                            break;
                        case "pokemon-spotlight-hour":
                            e.extraData = { spotlight: data.data }
                            break;
                        case "community-day":
                            e.extraData = { communityday: data.data }
                            break;
                        case "event":
                            e.extraData = { event: data.data }
                            break;
                        case "raid-battles":
                            e.extraData = { raidhour: data.data }
                            break;
                        case "raid-day":
                            e.extraData = { raidday: data.data }
                            break;
                        case "go-battle-league":
                            e.extraData = { gobattleleague: data.data }
                            break;
                        default:
                            break;
                    }
                }
            });
        });

        fs.writeFile('files/events.json', JSON.stringify(events, null, 4), err => {
            if (err) {
                console.error(err);
                return;
            }
        });
        fs.writeFile('files/events.min.json', JSON.stringify(events), err => {
            if (err) {
                console.error(err);
                return;
            }
        });

        fs.rmdir("files/temp", { recursive: true }, (err) => {
            if (err) { throw err; }
        });
    });
}

main();