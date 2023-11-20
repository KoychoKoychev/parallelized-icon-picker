const { main } = require('./web-server');

require('dotenv').config()

const server = main()

server.listen(process.env.PORT, process.env.HOSTNAME, () => {
    console.log(`Server is runnig at http://${process.env.HOSTNAME}:${process.env.PORT}/`);
})
