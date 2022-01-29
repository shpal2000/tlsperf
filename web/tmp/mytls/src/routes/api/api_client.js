import axios from "axios";

const apiClient = axios.create ({
    baseURL: 'http://0.0.0.0:8887/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

export default { apiClient };
