import axios from "axios";
const apiClient = axios.create({
  baseURL: "http://" + process.env.HOST + ":" + process.env.BPORT + "/api",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  }
});
export { apiClient as default };
