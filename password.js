var crypto = require('crypto');
var sqlquery = require('./sqlquery.js')
var mysql = require('mysql');

var password = module.exports = {
    createUser: function (connection, username, plainTextPassword, mobileNo, email) {
        passwordData = saltHashPassword(plainTextPassword);
        sqlquery.runCommitQuery(connection, "INSERT INTO DOCTOR(NAME, PASSWORD, MOBILE, SALT, EMAIL) VALUES('" + username + "', '" + passwordData.passwordHash + "', '" + mobileNo + "', '" + passwordData.salt + "', '" + email + "')", function(rows, res){}, null);
    },
    checkPassword: function(plainTextPassword, salt, passwordHash) {
        // console.log(plainTextPassword + 'salt' + salt + 'hash' + passwordHash);
        sha512(plainTextPassword, salt);
        var hash = sha512(plainTextPassword, salt).passwordHash;
        console.log(hash);
        console.log(passwordHash);
        if (hash == passwordHash) {
            console.log('Password Match!');
            return true;
        } else {
            console.log('Password failed');
            return false;
        }
    }
};

var generateSalt = function(length){
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
};

var sha512 = function(password, salt) {
    // console.log('password' + password + ' salt' + salt);
    var hash = crypto.createHmac('sha512', salt.toString()); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
//    console.log(value);
    return {
        salt: salt,
        passwordHash: value
    };
};

function saltHashPassword(userpassword) {
    var salt = generateSalt(16); /** Gives us salt of length 16 */
    return sha512(userpassword, salt);
}
