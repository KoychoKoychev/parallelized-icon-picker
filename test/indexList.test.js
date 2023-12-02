const assert = require('assert');
const { indexList } = require('../src/helpers/indexList');

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
{ "domain": "amazon.com", "position": "15" },
{ "domain": "qq.com", "position": "15" },
{ "domain": "live.com", "position": "15" },
{ "domain": "googletagmanager.com", "position": "19" },
{ "domain": "wordpress.org", "position": "20" },
{ "domain": "bing.com", "position": "21" },
{ "domain": "whatsapp.com", "position": "22" },
{ "domain": "pinterest.com", "position": "23" },
{ "domain": "github.com", "position": "24" },
{ "domain": "reddit.com", "position": "17" },
{ "domain": "office.com", "position": "26" },
{ "domain": "vimeo.com", "position": "27" },
{ "domain": "youtu.be", "position": "28" },
{ "domain": "adobe.com", "position": "29" },
{ "domain": "yandex.ru", "position": "17" },
{ "domain": "zoom.us", "position": "15" }]

describe('Index List testing', function () {
    describe('The function returns an obect with keys equal to the entry DOMAIN', function () {
    const indexedList = indexList(WEBSITE_LIST)
      it('Should return an obect', function () {
        assert.equal(typeof indexedList, 'object');
        assert.ok(!Array.isArray(indexedList));
        assert.notEqual(indexedList, null);
      });
      it('Should be indexed based on the DOMAIN', function () {
        assert.equal(typeof indexedList['vimeo.com'], 'object');
        assert.equal(indexedList['reddit.com'].domain, 'reddit.com');
        assert.equal(indexedList['github.com'].position, '24');
      });
      it('Should include every entry from the list', function () {
        assert.equal(Object.entries(indexedList).length, WEBSITE_LIST.length);
        for(let el of WEBSITE_LIST){
          assert.ok(indexedList.hasOwnProperty(el.domain))
        }
      });
    });
});