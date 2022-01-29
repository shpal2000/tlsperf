import { MongoClient } from 'mongodb';

const DB_CSTRING = 'mongodb://localhost:27017';
const client = new MongoClient(DB_CSTRING);
const connectPromise = client.connect();

export default connectPromise;
