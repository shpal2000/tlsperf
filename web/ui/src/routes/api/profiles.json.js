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

export async function put ( {params, request} ) {
    const body = await request.json()
    
    const res = await apiClient.put('/profiles', body)

    return {
        body: res.data
    }    
}

export async function del ( {params, request} ) {
    const body = await request.json()
    
    const res = await apiClient.delete('/profiles', {data: body})

    return {
        body: res.data
    }    
}