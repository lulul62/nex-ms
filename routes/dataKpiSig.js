let express = require('express');
let router = express.Router();
let request = require('request');

/**
 * Get all issue with delivery in production status 
 */
router.post('/rest/api/globalIssueResolutionPerformance', (req, res, next) => {
    let options = {
        rejectUnauthorized: false,
        url: 'https://jira.nexity.fr/rest/api/2/search?jql=project=' + req.body.applicationId + ' AND status in ("11. Livrée en Production") &fields=components ,customfield_10582, summary, status, customfield_10525, customfield_10542, customfield_10501, customfield_10520, customfield_10578, customfield_10559, customfield_10608,customfield_10577,customfield_10545, customfield_10600, tpsEstimeIssue, customfield_10544, aggregatetimespent, aggregatetimeestimate, aggregatetimeoriginalestimate, issuetype, customfield_10580, customfield_10587, customfield_10578, customfield_10570, customfield_10571, customfield_10593, customfield_10603, customfield_10607, customfield_10538, duedate,  name_u155, assignee,  status, &maxResults=-1',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.body.token
        }
    };

    /**
     * Data response 
     * @param {*} error 
     * @param {*} response 
     * @param {*} body 
     */
    function callback(error, response, body) {
        let items = []
        if (!error && response.statusCode == 200) {
            JSON.parse(body).forEach(i => {
                let currentIssue = {
                    started: null,
                    resolved: null
                }
                i.changelog.histories.forEach((history, i) => {
                    history.items.forEach(item => {
                        if (item.field === 'status' && item.fromString === '01. Demande créée Nexity') {
                            currentIssue.started = history[i].created
                        }
                        if (item.field === 'status' && item.fromString === '11. Livrée en production') {
                            currentIssue.resolved = history[i].created
                        }
                    })
                })
                items.push(currentIssue)
            })
            res.send(items);
        }
    }

    request(options, callback);
});

module.exports = router;