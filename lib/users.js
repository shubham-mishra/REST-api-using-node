let queryString = require('querystring');
let url = require('url');

let users = ['Sam', 'John'];

exports.getUsers = function(req, res, message = {}) {
    var body = '';
    if(message['content']) {
        body += ( message['content'] + '\n' );
    }

    body += 'Users list :\n';
    body += users.map((user, index) => {
        return (index + 1) + ') ' + user
    }).join('\n');

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', Buffer.byteLength(body));
    res.end(body);
};

exports.addUser = function (req, res) {
    req.setEncoding('utf8');
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', () => {
        body = queryString.parse(body);
        users.push(body['user']);
        let content = user + ' is added';
        exports.getUsers(req, res, {"content": content});
    });
}

exports.deleteUser = function (req, res) {
    req.setEncoding('utf8')
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', () => {
        let user = queryString.parse(body)['user'];
        let index = users.indexOf(user);
        if(index < 0) {
            let content = user + ' is not available';
            exports.getUsers(req, res, {"content": content});
        } else {
            let content = user + ' is deleted';
            users.splice(index, 1);
            exports.getUsers(req, res, {"content": content});
        }
        res.end('');
    });
}

exports.updateUser = function (req, res) {
    req.setEncoding('utf8');
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', () => {
        body = queryString.parse(body);
        let currUser = body['user'];
        
        let index = users.indexOf(currUser);
        let newUser = body['newUser'];
        
        if( index < 0 ) {
            let content = currUser + ' is not available';
            exports.getUsers(req, res, {"content": content});
        } else {
            let content = currUser + ' is updated as ' + newUser;
            users.splice(index, 1, newUser);
            exports.getUsers(req, res, {"content": content});
        }

    });
}