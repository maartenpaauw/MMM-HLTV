const NodeHelper = require("node_helper");
const { HLTV } = require('hltv');

module.exports = NodeHelper.create({

    // Module config.
    config: [],

    // Matches
    matches: [],

    /**
     * Socket notification is received from the module.
     * 
     * @param  {string} notification notification key
     * @param  {mixed}  payload      notification payload
     * @return {void}
     */
    socketNotificationReceived(notification, payload) {

        switch(notification) {
            case 'SET_CONFIG':
                this.config = payload;
                break;
            case 'FETCH_MATCHES':
                this.getMatchesAndNotify();
                break;
        }

    },

    /**
     * Get all matches from HLTV and notify the module.
     * 
     * @return {void}
     */
    async getMatchesAndNotify() {
        this.matches = await HLTV.getMatches();
        this.applyfilters();
        this.sendSocketNotification('MATCHES_RECEIVED', this.matches);
    },

    /**
     * Apply all config filters.
     * 
     * @return {void}
     */
    applyfilters () {
        this.filterStars();
        this.filterAmount();
    },

    /**
     * Show the first X matches based on amount.
     * 
     * @return {void}
     */
    filterAmount () {
        this.matches = this.matches.slice(0, this.config.amount);
    },

    /**
     * Only allow matches with enough stars.
     * 
     * @return {void}
     */
    filterStars () {
        this.matches = this.matches.filter(match => {
            return match.stars >= this.config.stars;
        });
    }
});
