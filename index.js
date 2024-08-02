const server = require('./api/server');

const port = 9000;

// console.log('welcome you!')

server.listen(port, () => { 
 console.log('listen on', port)
})

