Module.register('MMM-HLTV', {

    // All matches.
    matches: [],

    // Scorebots
    scorebots: {},

    // Module config defaults.
    defaults: {
        'updateInterval': 60 * 1000,
        'amount': 5,
        'stars': 0,
        'teams': [],
        'preferWhite': false,
        'template': 'strafe',
        'showLogos': true,
    },

    // Interval
    interval: null,

    /**
     * Is called when the module is started.
     * 
     * @return {void}
     */
    start() {
        this.sendSocketNotification('CONFIG_SET', this.config);
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
        ];
    },

    /**
     * Returns a list of stylesheets the module requires to be loaded.
     * 
     * @return {Array<string>} An array with filenames.
     */
    getStyles() {
        return [
            'MMM-HLTV.css',
        ];
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
     * Get the Nunjucks template.
     */
    getTemplate() {
        return `templates/${this.config.template}.njk`;
    },

    /**
     * Get the Nunjucks template data.
     */
    getTemplateData() {
        return {
            config: this.config,
            matches: this.matches,
            scorebots: this.scorebots,
            moment,

            is: (side, team, scoreboard) => {
                const key = side === 'T' ? 'tTeamId' : 'ctTeamId';
                return typeof scoreboard !== 'undefined' && team.id === scoreboard[key];
            }
        };
    },

    /**
     * This method is called when a module is hidden.
     */
    suspend() {
        clearInterval(this.interval);
    },

    /**
     * This method is called when a module is shown.
     */
    resume() {
        this.scheduleFetch();
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
            case 'MATCH_ENDED':
                this.removeFromScoreboards(payload);
                break;
            case 'MATCH_UPDATE':
                this.updateScoreboard(payload);
                break;
        };
    },

    /**
     * Schedule new matches fetch.
     * 
     * @return {void}
     */
    scheduleFetch() {
        this.interval = setInterval(() => {
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
        this.updateDom(500);
    },

    /**
     * 
     * @param {object} update scoreboard update.
     */
     updateScoreboard(update) {
        const exists = update.id in this.scorebots;
        this.scorebots[update.id] = update.scoreboard;
        if(! exists) this.updateDom(500);
    },

    /**
     * 
     * @param {int} id match id to remove from object.
     */
    removeFromScoreboards(id) {
        delete this.scorebots[id];
    },
});
