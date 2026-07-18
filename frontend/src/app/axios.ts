import axios from 'axios';

axios.defaults.withCredentials = true;

axios.interceptors.response.use((response) => response.data);
