const NodeHelper = require("node_helper");
const { HLTV } = require('hltv');

module.exports = NodeHelper.create({

    // Module config.
    config: [],

    /**
     * Socket notification is received from the module.
     * 
     * @param  {string} notification notification key
     * @param  {mixed}  payload      notification payload
     * @return {void}
     */
    socketNotificationReceived(notification, payload) {

        switch(notification) {
            case 'MODULE_CONFIG':
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
    getMatchesAndNotify() {
        HLTV.getMatches().then((res) => {
            this.sendSocketNotification('MATCHES_RECEIVED', res.splice(0, this.config.amount));
        });
    }
});
