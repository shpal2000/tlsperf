import apiClient from './api_client';

export async function get () {

    const res = await apiClient.get('/nodes');

    return {
        body: res.data
    }    
}

export async function post ( {params, request} ) {
    const body = await request.json()
    
    const res = await apiClient.post('/nodes', body);

    return {
        body: res.data
    }    
}

export async function del ( {params, request} ) {
    const body = await request.json()
    
    const res = await apiClient.delete('/nodes', {data: body});

    return {
        body: res.data
    }    
}