import apiClient from './api_client';

export async function get ({url}) {
    const group = url.searchParams.get("group");
    const name = url.searchParams.get("name");

    const res = await apiClient.get(`/stats?group=${group}&name=${name}`);

    return {
        body: res.data
    }    
}
