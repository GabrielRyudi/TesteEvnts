import axios from "axios";

const api = axios.create({
	baseURL: "https://developers.zomato.com/api/v2.1/",
	headers:{
		'user-key':'73e956373e3fb186d8c00f83998c16a7' 
	}
});

export default api;