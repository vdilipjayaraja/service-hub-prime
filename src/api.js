import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/", // Your FastAPI base URL
  headers: { "Content-Type": "application/json" }
});

api.get("/")
  .then(res => console.log(res.data))
  .catch(err => console.error(err));

export default api;