const { createIconFetcher } = require("../scripts/get-icons");
const { createWebServer, prepareWebsiteList } = require("./setupWebServer");

function main() {

    const iconFetcher = createIconFetcher();

    let [WEBSITE_LIST, INDEXED_LIST, AGGREGATED_LIST] = prepareWebsiteList(iconFetcher)

    const server = createWebServer(WEBSITE_LIST, AGGREGATED_LIST, iconFetcher, INDEXED_LIST);

    return server;
}

module.exports = { main }