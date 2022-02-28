import apiClient from './api_client';

export async function get ({url}) {
  const group = url.searchParams.get("group");
  const name = url.searchParams.get("name");

  let res;
  res = await apiClient.get(`/profile_tcpdump?group=${group}&name=${name}`);

  return {
      body: res.data
  }    
}

export async function post ( {params, request} ) {
  const body = await request.json()
  
  const res = await apiClient.post('/profile_tcpdump', body)

  return {
      body: res.data
  }    
}

export async function del ( {params, request} ) {
  const body = await request.json()
  
  const res = await apiClient.delete('/profile_tcpdump', {data: body})

  return {
      body: res.data
  }    
}