const dbuser = 'moe_admin';
const dbpassword = '12345';

const MONGODB_URI = `mongodb+srv://${dbuser}:${dbpassword}@cluster0-txkxx.mongodb.net/test?retryWrites=true&w=majority`;

module.exports = MONGODB_URI;