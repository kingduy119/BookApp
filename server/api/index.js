const { tokenRequire, tokenLogin } = require("../validators/auth")
const auth = require("./auth");
const user = require("./user.route");
const post = require("./post");
const notification = require("./notification.route");

function api({ server, app }) {
    let path = '/v1';
    server.use(`${path}/`, auth);
    server.use(`${path}/user`, user);
    server.use(`${path}/post`, post);
    server.use(`${path}/notification`, notification);

    // Router with custom special
    server.get('/', tokenRequire, (req, res) => {
        app.render(req, res, '/');
    })
    server.get('/login', tokenLogin, (req, res) => {
        app.render(req, res, '/login');
    })
}

module.exports = api;

