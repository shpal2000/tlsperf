import apiClient from "./api_client.js";
import "axios";
async function get() {
  const res = await apiClient.get("/node_groups");
  return {
    body: res.data
  };
}
async function post({ params, request }) {
  const body = await request.json();
  const res = await apiClient.post("/node_groups", body);
  return {
    body: res.data
  };
}
export { get, post };
