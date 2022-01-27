const { MongoClient } = require ('mongodb');

export async function get () {
    return {
        body: [{Name: "Dev"}, {Name: "FQA"}]
    }    
}

export async function post ( {params, request} ) {
    const body = await request.json()
    console.log (body);
    return {
        body: {status : 0}
    }    
}