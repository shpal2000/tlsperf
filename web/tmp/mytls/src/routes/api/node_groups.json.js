import connectPromise from "$lib/mongodb-client";

const DB_NAME = 'tlsperf_db';
const NODE_GROUPS= 'tlsperf_node_groups';

export async function get () {

    const connection = await connectPromise;
    const db = connection.db(DB_NAME);
    const nodeGroupsCol = db.collection(NODE_GROUPS);
    const nodeGroups = await nodeGroupsCol.find({}).toArray();
    console.log (nodeGroups);

    return {
        body: nodeGroups
    }    
}

export async function post ( {params, request} ) {
    const body = await request.json()
    
    const connection = await connectPromise;
    const db = connection.db(DB_NAME);
    const nodeGroupsCol = db.collection(NODE_GROUPS);

    const nodeGroup = await nodeGroupsCol.findOne({ 'Name': body['Name'] });
    console.log (nodeGroup);

    if (nodeGroup) {
        return {
            body: {status : -1, message: 'already exist'}
        }   
    }

    await nodeGroupsCol.insertOne (body);

    return {
        body: {status : 0}
    }    
}