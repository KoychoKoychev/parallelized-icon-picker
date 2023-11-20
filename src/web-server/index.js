const { createWebServer } = require("./setupWebServer");

function main() {

    const server = createWebServer();

    return server;
}

module.exports = { main }