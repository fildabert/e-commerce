var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
function encrypt(password){
    var hash = bcrypt.hashSync(password, salt)
    return hash
}

module.exports = encrypt