import apiClient from './api_client';

export async function get () {

    const res = await apiClient.get('/profiles')

    return {
        body: res.data
    }    
}

export async function post ( {params, request} ) {
    const body = await request.json()
    
    const res = await apiClient.post('/profiles', body)

    return {
        body: res.data
    }    
}