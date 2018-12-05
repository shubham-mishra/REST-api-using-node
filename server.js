const http = require('http');
let users = require('./lib/users');
let url = require('url');

let server = http.createServer(requestHandler);

function requestHandler(req, res) {
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