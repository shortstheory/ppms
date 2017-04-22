var crypto = require('crypto');
var sqlquery = require('./sqlquery.js')
var mysql = require('mysql');

var password = module.exports = {
    createUser: function (connection, username, plainTextPassword, mobileNo) {
        passwordData = saltHashPassword(plainTextPassword);
        sqlquery.runCommitQuery(connection, "INSERT INTO DOCTOR(NAME, PASSWORD, MOBILE, SALT) VALUES('" + username + "', '" + passwordData.passwordHash + "', '" + mobileNo + "', '" + passwordData.salt + "')", function(rows, res){}, null);
    }
};

var generateSalt = function(length){
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
};

var sha512 = function(password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

function saltHashPassword(userpassword) {
    var salt = generateSalt(16); /** Gives us salt of length 16 */
    return sha512(userpassword, salt);
}
