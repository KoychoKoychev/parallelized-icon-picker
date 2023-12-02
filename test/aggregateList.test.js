const assert = require('assert');
const { aggregateList } = require('../src/helpers/aggregateList');

const WEBSITE_LIST = [{ "domain": "google.com", "position": "1" },
{ "domain": "youtube.com", "position": "2" },
{ "domain": "facebook.com", "position": "3" },
{ "domain": "netflix.com", "position": "4" },
{ "domain": "microsoft.com", "position": "5" },
{ "domain": "instagram.com", "position": "6" },
{ "domain": "twitter.com", "position": "7" },
{ "domain": "baidu.com", "position": "8" },
{ "domain": "linkedin.com", "position": "9" },
{ "domain": "wikipedia.org", "position": "10" },
{ "domain": "apple.com", "position": "11" },
{ "domain": "yahoo.com", "position": "12" },
{ "domain": "amazonaws.com", "position": "13" },
{ "domain": "cloudflare.com", "position": "14" },
{ "domain": "bilibili.com", "position": "15" },
{ "domain": "amazon.com", "position": "16" },
{ "domain": "live.com", "position": "17" },
{ "domain": "googletagmanager.com", "position": "18" },
{ "domain": "wordpress.org", "position": "19" },
{ "domain": "yandex.ru", "position": "20" },
{ "domain": "bing.com", "position": "21" },
{ "domain": "whatsapp.com", "position": "22" },
{ "domain": "pinterest.com", "position": "23" },
{ "domain": "github.com", "position": "24" },
{ "domain": "reddit.com", "position": "25" },
{ "domain": "office.com", "position": "26" },
{ "domain": "aa.com", "position": "27" },
{ "domain": "youtu.be", "position": "28" },
{ "domain": "adobe.com", "position": "29" },
{ "domain": "zoom.us", "position": "30" }]

describe('Aggregate List testing', function () {
    const aggregatedList = aggregateList(WEBSITE_LIST)
    describe('The function returns an obect with keys equal to 1st 1,2,3 characters of the DOMAIN', function () {
        it('Should return an obect', function () {
            assert.equal(typeof aggregatedList, 'object');
            assert.ok(!Array.isArray(aggregatedList));
            assert.notEqual(aggregatedList, null);
        });
        it('Should return an object with keys equal to each combination of the 1st 1,2,3 characters', function () {
            assert.equal(Object.keys(aggregatedList).length, (10 + 26) + (10 + 26) * (1 + 10 + 26) + (10 + 26) * (1 + 10 + 26) * (10 + 26))
            //Total number entries for the aggregated object includes all the possible letter combinations for the 1st 3 characters of a domain
            //hyphen - 1, numbers - 10, characters - 26
            //1st character cannot be a hyphen and there cannot be two consecutive hyphens
            //1 character entries - (10 + 26) ; 2 character entries - (10 + 26) * (1 + 10 + 26) ; 3 character entries - (10 + 26) * (1 + 10 + 26) * (10 + 26)
        });
        it('Should have every list entry included in the aggregated object', function () {
            let result = []
            for (let el of Object.values(aggregatedList)) {
                result.push(...el)
            }
            let twoCharacterDomains = 0
            for(let el of WEBSITE_LIST){
                if(el.domain.split('.')[0].length === 2){
                    twoCharacterDomains ++
                }
            }
            assert.equal(result.length, WEBSITE_LIST.length * 3 - twoCharacterDomains)
        });
    });
    describe('The values of the aggregated Object should be arrays with entry POSITIONS', function () {
        it('Values should be arrays', function () {
            for (let el of Object.values(aggregatedList)) {
                assert.ok(Array.isArray(el))
            }
        });
        it('Aggregated object values include entry POSITIONS', function () {
            for (let el of Object.values(aggregatedList)) {
                if (el.length > 0) {
                    assert.ok(!isNaN(el[0]))
                }
            }
        });
        it('Every entry is included in the relevant aggregated object key/value pair', function () {
            for (let el of WEBSITE_LIST) {
                let { domain, position } = el;
                if(domain[2] !== '.'){
                    assert.ok(aggregatedList[domain.substring(0,3)].includes(position))
                }
                assert.ok(aggregatedList[domain.substring(0,2)].includes(position))
                assert.ok(aggregatedList[domain.substring(0,1)].includes(position))
            }
        });
    });
});