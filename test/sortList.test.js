const assert = require('assert');
const { sortList } = require('../src/helpers/sortList');

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

describe('Sort List testing', function () {
  describe('The function sorts the list based on the POSITION of the element', function () {
    it('Should reverse the given list', function () {
      let sortedList = sortList([{ domain: 'a', position: 3 }, { domain: 'b', position: 2 }, { domain: 'c', position: 1 }]);
      assert.equal(sortedList[0].domain, 'c');
      assert.equal(sortedList[2].domain, 'a');
    });
    it('Should sort the list based on the POSITION and than the DOMAIN', function () {
      let sortedList = sortList([{ domain: 'a', position: 3 }, { domain: 'ab', position: 2 }, { domain: 'cc', position: 2 }]);
      assert.equal(sortedList[0].domain, 'ab');
      assert.equal(sortedList[2].domain, 'a');
    });
    it('Should renumber the list so it starts from POSITION 1', function () {
      let sortedList = sortList([{ domain: 'foo', position: 33 }, { domain: 'bar', position: 12 }, { domain: 'cat', position: 124 }]);
      assert.equal(sortedList[0].position, 1);
      assert.equal(sortedList[2].position, 3);
    });
  });
  describe('The function works with a full more complex list', function () {
    const sortedList = sortList(WEBSITE_LIST)
    it('Sorts the list first based on the POSITION', function () {
      assert.equal(sortedList[30].domain, 'adobe.com');
      assert.equal(sortedList[0].domain, 'google.com');
    });
    it('Sorts the list first based on the DOMAIN as a second criteria', function () {
      assert.equal(sortedList[14].domain, 'amazon.com');
      assert.equal(sortedList[13].domain, 'cloudflare.com');
      assert.equal(sortedList[18].domain, 'zoom.us');
    });
    it('Renumbers the whole list based on the POSITION', function () {
      assert.equal(sortedList[0].position, 1);
      assert.equal(sortedList[17].position, 18);
      assert.equal(sortedList[23].position, 24);
      for (let i = 0; i < sortedList.length; i++) {
        const curr = sortedList[i];
        assert.equal(curr.position, i+1);
      }
    });
  });
  describe('The function returns an empty array on wrong input', function () {
    it('Returns empty array it the passed argument is an object', function () {
      let sortedList = sortList({ domain: 'a', position: 3 });
      assert.ok(Array.isArray(sortedList));
      assert.equal(sortedList.length, 0);
    });
    it('Returns empty array it the passed argument is a string', function () {
      let sortedList = sortList('google.com');
      assert.ok(Array.isArray(sortedList));
      assert.equal(sortedList.length, 0);
    });
  });
});