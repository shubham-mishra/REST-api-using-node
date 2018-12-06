const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
let users = require('./lib/users');
let url = require('url');

if(cluster.isMaster) {
    for(let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker '+ worker.process.pid + ' died with code: '+code+', signal: '+signal);
        console.log('starting new worker');
        cluster.fork();
    });
} else {
    childProcessTask();
}

function childProcessTask() {
    let server = http.createServer(requestHandler);

    function requestHandler(req, res) {
        console.log('request recieved at '+process.pid);
        let pathname = url.parse(req.url).pathname;
        switch(req.method) {
            case 'GET':{
                switch(pathname) {    
                    case '/getUsers':
                        users.getUsers(req, res);
                    break
                }    
                break;    
            }
            
            case 'POST':{
                switch(pathname) {
                    case '/addUser':
                        users.addUser(req, res);
                        break;
                }
                break;
            }
            
            case 'DELETE': {
                switch(pathname) {
                    case '/deleteUser':
                        users.deleteUser(req, res);
                        break;
                }
                break;
            }
            case 'PUT':{
                switch(pathname) {
                    case '/updateUser':
                        users.updateUser(req, res);
                        break;
                }   
                break;
            }
        }
    }

    server.listen(8000, () => {
        console.log('server started');
    });
}