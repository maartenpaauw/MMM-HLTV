const { HLTV } = require('hltv');

HLTV.getMatch({id: 2327815}).then((res) => {
    console.log(JSON.stringify(res));
})
