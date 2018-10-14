Module.register("MMM-HLTV",{

    defaults: {
        'matches': [
            {"team1":{"name":"LDLC","id":4674},"team2":{"name":"Epsilon","id":4688},"date":1539502200000,"format":"Best of 3 (LAN)","additionalInfo":"* Consolidation final","event":{"name":"ESL Pro European Championship","id":3987},"maps":[{"name":"d2","result":"16:7 (12:3; 4:4)"},{"name":"mrg","result":"13:16 (9:6; 4:10)"},{"name":"ovp","result":""}],"players":{"team1":[{"name":"ALEX","id":8184},{"name":"to1nou","id":7982},{"name":"LOGAN","id":13042},{"name":"AmaNEk","id":9616},{"name":"devoduvek","id":10569}],"team2":[{"name":"frei","id":11467},{"name":"blameF","id":15165},{"name":"Surreal","id":9019},{"name":"CRUC1AL","id":7996},{"name":"kioShiMa","id":4959}]},"streams":[{"name":"ESL TV","link":"https://player.twitch.tv/?channel=esl_csgo","viewers":2997},{"name":"RuHub 2","link":"https://player.twitch.tv/?channel=csruhub2","viewers":2462},{"name":"ESL TV","link":"https://player.twitch.tv/?channel=esl_csgo_pl","viewers":835},{"name":"99Damage (ESL)","link":"https://player.twitch.tv/?channel=esl_99damage","viewers":625},{"name":"ESL TV 2","link":"https://player.twitch.tv/?channel=esl_csgo_fr2","viewers":501},{"name":"HLTV Live","link":"/live?matchId=2327815","viewers":0}],"live":true,"hasScorebot":true,"highlightedPlayer":{"name":"blameF","id":15165},"headToHead":[{"date":1539422609000,"map":"ovp","winner":{"name":"Epsilon","id":4688},"event":{"name":"ESL Pro European Championship","id":3987},"result":"14 - 16"},{"date":1535488307000,"map":"ovp","winner":{"name":"LDLC","id":4674},"event":{"name":"ESL Pro European Championship Qualifier","id":3988},"result":"16 - 12"}],"vetoes":[{"team":{"name":"LDLC","id":4674},"map":"inf","type":"removed"},{"team":{"name":"Epsilon","id":4688},"map":"nuke","type":"removed"},{"team":{"name":"LDLC","id":4674},"map":"d2","type":"picked"},{"team":{"name":"Epsilon","id":4688},"map":"mrg","type":"picked"},{"team":{"name":"LDLC","id":4674},"map":"cch","type":"removed"},{"team":{"name":"Epsilon","id":4688},"map":"trn","type":"removed"}],"highlights":[],"demos":[]}
        ]
    },

    /**
     * Get the stylesheets to use.
     * 
     * @return {Array<string>} list of files to load
     */
    getStyles () {
        return [
            'MMM-HLTV.css',
        ]
    },

    getScripts () {
        return [
            'moment.js',
        ]
    },

    /**
     * Get the dom to render.
     * 
     * @return {string} the dom elements as string.
     */
    getDom () {
        const table = this.getTable();

        this.config.matches.forEach(match => {
            table.append(this.getMatch(match));
        });

        return table;
    },

    /**
     * Get table.
     * 
     * @return {string} table
     */
    getTable () {
        const table = document.createElement('table');
        return table.cloneNode();
    },

    /**
     * Generate a table row.
     * 
     * @return {string} row
     */
    getTableRow () {
        const tr = document.createElement('tr');
        return tr.cloneNode();
    },

    /**
     * Generate a table cell.
     * 
     * @return {string} cell
     */
    getTableCell () {
        const td = document.createElement('td');
        return td.cloneNode();
    },

    /**
     * Generate a basic info cell.
     * 
     * @return {string} info cell
     */
    getInfoCell () {
        const cell = this.getTableCell();

        cell.setAttribute('colspan', 2);
        cell.classList.add('xsmall', 'light', 'dimmed');

        return cell;
    },

    /**
     * Get the match time row.
     * 
     * @param  {string} time match time.
     * @param  {boolean} live match is live.
     * 
     * @return {string} time row
     */
    getTimeRow (date, live) {
        const row = this.getTableRow();
        const cell = this.getInfoCell();
        const time = moment(date).format('HH:mm');

        live ? cell.append(this.getLive(), time) : cell.append(time);

        row.append(this.getTableCell());
        row.append(cell);

        return row;
    },

    /**
     * Get live icon.
     * 
     * @return {string} live icon
     */
    getLive () {
        const live = document.createElement('span');
        live.append('live');
        live.classList.add('bold', 'live');
        return live;
    },

    /**
     * Generate team row.
     * 
     * @param  {string}  logo  team logo url
     * @param  {string}  name  team name
     * @param  {number}  score team score
     * @param  {boolean} won   team won
     * 
     * @return {string} team row
     */
    getTeamRow (logo, name, score, won) {
        const row = this.getTableRow();
        const cellLogo = this.getTableCell();
        const cellName = this.getTableCell();
        const cellScore = this.getTableCell();

        cellLogo.innerHTML = logo;
        cellLogo.classList.add('small');

        cellName.append(name);
        cellScore.append(score);
        
        const classes = won ? ['small', 'bold', 'bright'] : ['small', 'light'];

        cellName.classList.add(...classes);
        cellScore.classList.add(...classes, 'align-right');

        row.append(cellLogo, cellName, cellScore);

        return row;
    },

    /**
     * Get event row.
     * 
     * @param  {string} name event name
     * 
     * @return {string} event row
     */
    getEventRow (name) {
        const row = this.getTableRow();
        const cell = this.getInfoCell();

        cell.append(name);
        row.append(this.getTableCell(), cell);

        return row;
    },

    /**
     * Get a match.
     * 
     * @param  {object} match match object
     * 
     * @return {string} match inside a table
     */
    getMatch(match) {
        const table = this.getTable();

        table.append(this.getTimeRow(match.date, match.live));
        table.append(this.getTeamRow(null, match.team1.name, 0, this.isWinner(match.team1.id, match.live)));
        table.append(this.getTeamRow(null, match.team2.name, 1, this.isWinner(match.team2.id, match.live)));
        table.append(this.getEventRow(match.event.name));

        return table;
    },

    /**
     * Check if the team won.
     * 
     * @param  {string}  teamId team id
     * @param  {boolean} live   match live
     * 
     * @return {boolean} team is winner
     */
    isWinner (teamId, live) {
        if (live) {
            return false;
        }

        return teamId === match.winnerTeam.id;
    }
});
