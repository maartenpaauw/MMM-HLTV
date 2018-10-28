Module.register("MMM-HLTV", {

    // All matches.
    matches: [],

    // Module config defaults.
    defaults: {
        'amount': 5,
        'updateInterval': 60 * 1000,
    },

    /**
     * Is called when the module is started.
     * 
     * @return {void}
     */
    start() {
        this.sendSocketNotification('MODULE_CONFIG', this.config);
        this.sendSocketNotification('MATCHES_FETCH');
        this.scheduleFetch();
    },

    /**
     * Returns a list of scripts the module requires to be loaded.
     * 
     * @return {Array<string>} An array with filenames.
     */
    getScripts() {
        return [
            'moment.js',
        ]
    },

    /**
     * Returns a list of stylesheets the module requires to be loaded.
     * 
     * @return {Array<string>} An array with filenames.
     */
    getStyles() {
        return [
            'MMM-HLTV.css',
        ]
    },

    /**
     * Returns a map of translation files the module requires to be loaded.
     * 
     * @return {Map<string, string} A map with langKeys and filenames.
     */
    getTranslations() {
        return {
            en: 'translations/en.json',
            nl: 'translations/nl.json',
        };
    },

    /**
     * This method is called when a socket notification arrives.
     * 
     * @param  {string} notification The identifier of the notification.
     * @param  {mixed}  payload      The payload of the notification.
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
     * This method generates the dom which needs to be displayed. This method is called by the Magic Mirror core.
     * This method can to be subclassed if the module wants to display info on the mirror.
     * Alternatively, the getTemplete method could be subclassed.
     * 
     * @return {DomObject | Promise} The dom or a promise with the dom to display.
     */
    getDom() {
        const table = this.getTable();

        this.matches.forEach(match => {
            table.append(this.getMatch(match));
        });

        return table;
    },

    /**
     * Schedule new matches fetch.
     * 
     * @return {void}
     */
    scheduleFetch() {
        setInterval(() => {
            this.sendSocketNotification('MATCHES_FETCH');
        }, this.config.updateInterval);
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
        live.append(this.translate('LIVE'));
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
