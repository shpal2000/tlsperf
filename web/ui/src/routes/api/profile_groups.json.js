import apiClient from './api_client';

export async function get () {

    const res = await apiClient.get('/profile_groups')

    return {
        body: res.data
    }    
}

export async function post ( {params, request} ) {
    const body = await request.json()
    
    const res = await apiClient.post('/profile_groups', body)

    return {
        body: res.data
    }    
}

export async function del ( {params, request} ) {
    const body = await request.json()
    
    const res = await apiClient.delete('/profile_groups', {data: body})

    return {
        body: res.data
    }    
}