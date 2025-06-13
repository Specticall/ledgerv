import axios from "axios";
import { API_URL } from "./config";

export const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
