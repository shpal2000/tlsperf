import apiClient from './api_client';

export async function get ({url}) {
  const group = url.searchParams.get("group");
  const name = url.searchParams.get("name");


  let res;
  res = await apiClient.get(`/profile_tcpdump?group=${group}&name=${name}&iface=server`);

  return {
      body: res.data
  }    
}
