import axios from 'axios';
axios.interceptors.response.use((response) => response.data);

class HendelseService {

}

export let hendelseService = new HendelseService();
