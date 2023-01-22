const { MongoClient, ServerApiVersion } = require('mongodb');

const DbService = {
    database: null,
    boards: null,
    expenses: null,
    banks: null,
    connectDb() {
        const dbUser = encodeURIComponent(process.env.MONGODB_USER);
        const dbPass = encodeURIComponent(process.env.MONGODB_PASSWORD);
        const dbUserPassword = `${dbUser}${dbUser && dbPass ? ":" : ""}${dbPass}`;
        const dbUriOptions = process.env.MONGODB_OPTIONS ? `/${process.env.MONGODB_OPTIONS}` : '';
        const dbUri = `${process.env.MONGODB_PREFIX}${dbUserPassword}${dbUserPassword ? '@':""}${process.env.MONGODB_CLUSTER}${dbUriOptions}`

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverApi: ServerApiVersion.v1
        }

        const client = new MongoClient(dbUri, process.env.MONGODB_CLIENT_OPTIONS === 'true' ? options : undefined);
        const database = client.db(process.env.MONGODB_NAME);
        this.database = database;
        this.boards = database.collection('boards');
        this.banks = database.collection('banks');
        this.expenses = database.collection('expenses');
        this.tags = database.collection('tags');
        console.log('db connected')
    }
}

module.exports = DbService;