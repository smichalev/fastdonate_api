const Server = require('models/server.model');

return Server.sync({force: true});