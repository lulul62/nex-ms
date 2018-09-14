let express = require('express');
let router = express.Router();
let request = require('request');
var mLab = require('mongolab-data-api')('mqZL_DwTTvjcbABJ-OmwUx2wfRKxoUbc')
var convert = require('xml-js')
var apicache = require('apicache')

let cache = apicache.middleware


router.post('/rest/api/run', cache('5 minutes'), (req, res, next) => {
    let options = {
        rejectUnauthorized: false,
        url: 'https://jira.nexity.fr/rest/api/2/search?jql=project=' + req.body.applicationId + ' AND status not in ("12. Fermée", Abandonnée, "11. Livrée en Production") &fields=components ,customfield_10582, summary, status, customfield_10525, customfield_10542, customfield_10501, customfield_10520, customfield_10578, customfield_10559, customfield_10608,customfield_10577,customfield_10545, customfield_10600, tpsEstimeIssue, customfield_10544, aggregatetimespent, aggregatetimeestimate, aggregatetimeoriginalestimate, issuetype, customfield_10580, customfield_10587, customfield_10578, customfield_10570, customfield_10571, customfield_10593, customfield_10603, customfield_10607, customfield_10538, duedate,  name_u155, assignee,  status, &maxResults=-1&expand=changelog',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.body.token
        }
    };
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            res.send(info);
        }
    }

    request(options, callback);
});


router.post('/rest/api/runWithChangelog', cache('5 minutes'), (req, res, next) => {
    let options = {
        rejectUnauthorized: false,
        url: 'https://jira.nexity.fr/rest/api/2/search?jql=project=' + req.body.applicationId + ' AND status not in ("12. Fermée", Abandonnée, "11. Livrée en Production")&maxResults=-1&expand=changelog&fields=""',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.body.token
        }
    };
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            res.send(info);
        }
    }

    request(options, callback);
});


router.post('/rest/api/getOneIssueChangelog', (req, res, next) => {
    let options = {
        rejectUnauthorized: false,
        url: 'https://jira.nexity.fr/rest/api/2/issue/'+ req.body.issue_key +'?expand=changelog&fields=""',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.body.token
        }
    };
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            res.send(info);
        }
    }

    request(options, callback);
});


router.post('/rest/api/build', cache('5 minutes'), (req, res, next) => {
    let options = {
        rejectUnauthorized: false,
        url: 'https://jira.nexity.fr/rest/api/2/latest/search?jql=project=' + req.body.applicationId + ' AND issuetype = Change AND status in (DELIVERED, NEW, STARTED, TESTED, ACCEPTED, DEVELOPED, QUALIFIED, QUOTED, STUDIED, "TAKEN INTO ACCOUNT", VALIDATED)&fields=components ,customfield_10582, summary, status, customfield_10525, customfield_10542, customfield_10501, customfield_10520, customfield_10578, customfield_10559, customfield_10608,customfield_10577,customfield_10545, customfield_10600, tpsEstimeIssue, customfield_10544, aggregatetimespent, aggregatetimeestimate, aggregatetimeoriginalestimate, issuetype, customfield_10580, customfield_10587, customfield_10578, customfield_10570, customfield_10571, customfield_10593, customfield_10603, customfield_10607, customfield_10538, duedate,  name_u155, assignee,  status, &maxResults=-1',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.body.token
        }
    };
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            res.send(info);
        }
    }

    request(options, callback);
});


router.post('/rest/api/getCurrentUser', (req, res, next) => {
    let options = {
        rejectUnauthorized: false,
        url: 'https://jira.nexity.fr/rest/api/2/user?username=' + req.body.username,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.body.token
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            res.send(info);
        }
    }

    request(options, callback);
})

router.post('/rest/api/worklog', cache('5 minutes'), (req, res, next) => {
    let options = {
        rejectUnauthorized: false,
        url: 'https://jira.nexity.fr/rest/api/2/activity?maxResults=100&os_authType=basic&title=undefined',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.body.token
        }
    };
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = convert.xml2json(body , {compact: true, space: 4});
            res.send(info);
        }
    }

    request(options, callback);
})

router.post('/rest/api/r7', cache('5 minutes'), (req, res, next) => {
    let options = {
        rejectUnauthorized: false,
        url: 'https://jira.nexity.fr/rest/api/2/latest/search?jql=project=' + req.body.applicationId + ' AND issuetype = Bug&fields=customfield_10551, status, aggregatetimespent, aggregatetimeoriginalestimate, aggregateprogress, aggregatetimeestimate, summary, customfield_10608, customfield_10578, customfield_10582, customfield_10545, customfield_10509, customfield_10579, components, duedate, assignee &maxResults=-1',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.body.token
        }
    };
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            res.send(info);
        }
    }

    request(options, callback);
});
module.exports = router;
