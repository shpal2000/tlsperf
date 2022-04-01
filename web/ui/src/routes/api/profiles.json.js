import apiClient from './api_client';

export async function get ({url}) {
    const group = url.searchParams.get("group");
    const name = url.searchParams.get("name");
    const newcsg = url.searchParams.get("newcsg");

    let res;
    if (group && name) {
        if (newcsg) {
            res = await apiClient.get(`/profiles?group=${group}&name=${name}&newcsg=${newcsg}`)
        } else {
            res = await apiClient.get(`/profiles?group=${group}&name=${name}`)
        }
    } else {
        res = await apiClient.get('/profiles')
    }

    return {
        body: res.data
    }    
}

export async function post ( {params, request} ) {
    const body = await request.json();
    const cloned = url.searchParams.get("cloned");
    
    let res;

    if (cloned) {
        res = await apiClient.post('/profiles?cloned=1', body);
    } else {
        res = await apiClient.post('/profiles', body);
    }

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