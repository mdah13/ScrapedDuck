class Utils {
    Graphics(imageTags) {
        var graphics = [];
        if (imageTags.length === 0) {
            return graphics;
        }
        for (let i = 0; i < imageTags.length; i++) {
            const img = imageTags[i];
            if (img.alt != null && img.alt === "Graphic" && img.src != null) {
                graphics.push(img.src)
            }
        }
        return graphics
    }

    Bonuses(bonusTags) {
        var bonuses = [];
        if (bonusTags.length === 0) {
            return bonuses;
        }
        for (let i = 0; i < bonusTags.length; i++) {
            const bonus = bonusTags[i];
            if (bonus.textContent) {
                bonuses.push("-" + bonus.textContent)
            }
        }
        return bonuses;
    }
}

module.exports = new Utils();