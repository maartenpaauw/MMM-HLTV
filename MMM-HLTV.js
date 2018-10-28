Module.register("MMM-HLTV", {

    // All matches.
    matches: [],

    /**
     * Default configurations.
     */
    defaults: {
        'amount': 5,
    },

    /**
     * Get the stylesheets.
     * 
     * @return {Array<string>} list of files to load
     */
    getStyles() {
        return [
            'MMM-HLTV.css',
        ]
    },

    /**
     * Get the scripts.
     * 
     * @return {Array<string>} list of files to load
     */
    getScripts() {
        return [
            'moment.js',
        ]
    },

    /**
     * 
     */
    start() {
        this.sendSocketNotification('MODULE_START');
    },

    /**
     * Socket notification is received
     * 
     * @param  {string} notification the notification key
     * @param  {mixed}  payload      the payload
     * @return {void}
     */
    socketNotificationReceived(notification, payload) {
        switch (notification) {
            case 'MATCHES_RECEIVED':
                this.setMatches(payload);
                break;
        }
    },

    /**
     * Set the matches.
     * 
     * @param  {Array} matches All current matches from HLTV
     * @return {void}
     */
    setMatches(matches) {
        this.matches = matches;
        this.updateDom();
    },

    /**
     * Get the dom to render.
     * 
     * @return {string} the dom elements as string.
     */
    getDom() {
        const table = this.getTable();
        const matches = this.matches.splice(0, this.config.amount);

        matches.forEach(match => {
            table.append(this.getMatch(match));
        });

        return table;
    },

    /**
     * Get table.
     * 
     * @return {string} table
     */
    getTable() {
        const table = document.createElement('table');
        return table.cloneNode();
    },

    /**
     * Generate a table row.
     * 
     * @return {string} row
     */
    getTableRow() {
        const tr = document.createElement('tr');
        return tr.cloneNode();
    },

    /**
     * Generate a table cell.
     * 
     * @return {string} cell
     */
    getTableCell() {
        const td = document.createElement('td');
        return td.cloneNode();
    },

    /**
     * Generate a basic info cell.
     * 
     * @return {string} info cell
     */
    getInfoCell() {
        const cell = this.getTableCell();

        cell.setAttribute('colspan', 2);
        cell.classList.add('xsmall', 'light', 'dimmed');

        return cell;
    },

    /**
     * Get the match time row.
     * 
     * @param  {string}  time match time.
     * @param  {boolean} live match is live.
     * 
     * @return {string} time row
     */
    getTimeRow(date, live) {
        const row = this.getTableRow();
        const cell = this.getInfoCell();
        const time = moment(date).format('HH:mm');

        live ? cell.append(this.getLive()) : cell.append(time);

        row.append(this.getTableCell());
        row.append(cell);

        return row;
    },

    /**
     * Get live icon.
     * 
     * @return {string} live icon
     */
    getLive() {
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
    getTeamRow(logo, name, score, won) {
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
    getEventRow(name) {
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
        table.classList.add('match');

        const name1 = match.team1 ? match.team1.name : 'TBA';
        const name2 = match.team2 ? match.team2.name : 'TBA';
        const event = match.event ? match.event.name : 'TBA';

        table.append(this.getTimeRow(match.date, match.live));
        table.append(this.getTeamRow(null, name1, 1, this.isWinner()));
        table.append(this.getTeamRow(null, name2, 1, this.isWinner()));
        table.append(this.getEventRow(event));

        return table;
    },

    /**
     * Check if the team won.
     * Currently only live and upcoming match are supported.
     * So there is no winner yet.
     * 
     * @return {boolean} is winner
     */
    isWinner() {
        return false;
    }
});
