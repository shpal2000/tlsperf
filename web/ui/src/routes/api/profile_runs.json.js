import apiClient from './api_client';

export async function get ({url}) {
  const group = url.searchParams.get("group");
  const name = url.searchParams.get("name");

  let res;
  if (group && name) {
      res = await apiClient.get(`/profile_runs?group=${group}&name=${name}`);
  } else {
      res = await apiClient.get('/profile_runs');
  }

  return {
      body: res.data
  }    
}

export async function post ( {params, request} ) {
  const body = await request.json()
  
  const res = await apiClient.post('/profile_runs', body)

  return {
      body: res.data
  }    
}

export async function del ( {params, request} ) {
  const body = await request.json()
  
  const res = await apiClient.delete('/profile_runs', {data: body})

  return {
      body: res.data
  }    
}