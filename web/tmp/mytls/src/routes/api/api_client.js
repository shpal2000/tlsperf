import axios from "axios";

console.log ('Api on '+ process.env.HOST + ':' + process.env.BPORT);

const apiClient = axios.create ({
    baseURL: 'http://' + process.env.HOST + ':' + process.env.BPORT + '/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

export default apiClient;
