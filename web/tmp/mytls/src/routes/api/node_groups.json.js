import { apiClient } from './api_client';

export async function get () {

    const res = await apiClient.get('/node_groups')

    console.log (res.data)

    return {
        body: res.data
    }    
}

export async function post ( {params, request} ) {
    const body = await request.json()
    
    const res = await apiClient.post('/node_groups', body)

    return {
        body: res.data
    }    
}