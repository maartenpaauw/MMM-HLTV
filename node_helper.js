const NodeHelper = require('node_helper');
const _ = require('lodash');
const { HLTV } = require('hltv');

module.exports = NodeHelper.create({

    // Module config.
    config: [],

    // Matches
    matches: [],

    // Monitored scorebots.
    scorebots: [],

    /**
     * Socket notification is received from the module.
     * 
     * @param  {string} notification notification key
     * @param  {mixed}  payload      notification payload
     * @return {void}
     */
    socketNotificationReceived(notification, payload) {

        switch(notification) {
            case 'CONFIG_SET':
                this.config = payload;
                break;
            case 'MATCHES_FETCH':
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
        this.connectToScorebots();
        this.sendSocketNotification('MATCHES_RECEIVED', this.matches);
    },

    /**
     * Get the current score for each live match.
     * 
     * @return {void}
     */
     connectToScorebots() {
        this.matches.filter(match => {
            return match.live;
        }).forEach(match => {
            const id = match.id;

            if(! _.includes(this.scorebots, id)) {
                HLTV.connectToScorebot({
                    id,
                    onScoreboardUpdate: (scoreboard) => {
                        this.sendSocketNotification('MATCH_UPDATE', {
                            id,
                            scoreboard,
                        });
                    },
                    onConnect: () => {
                        this.scorebots.push(id);
                    },
                    onDisconnect: () => {
                        this.scorebots = _.remove(this.scorebots, _id => id === _id);
                        this.sendSocketNotification('MATCH_ENDED', id);
                    }
                });
            }
        });
    },

    /**
     * Apply all config filters.
     * 
     * @return {void}
     */
    applyfilters () {
        this.filterStars();
        this.filterTeams();
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
    },

    /**
     * Only allow matches where a specific team is playing.
     *
     * @return {void}
     */
    filterTeams () {
        if (this.config.teams.length === 0) return;

        this.matches = this.matches.filter(match => {
            const isTeam1 = this.config.teams.includes(match.team1.id);
            const isTeam2 = this.config.teams.includes(match.team2.id);

            return isTeam1 || isTeam2;
        });
    }
});
