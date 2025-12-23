import axios from "./axios";

export const getAllServiceTickets = (q) => {
    const url = q ? `/api/service-tickets?q=${encodeURIComponent(q)}` : "/api/service-tickets";
    return axios.get(url);
};

export const getServiceTicketById = (id) => {
    return axios.get(`/api/service-tickets/${id}`);
};

export const createServiceTicket = (data) => {
    return axios.post("/api/service-tickets/create", data);
};

export const updateServiceTicketStatus = (id, status) => {
    return axios.post("/api/service-tickets/status", { id, status });
};

export const deleteServiceTickets = (ids) => {
    return axios.post("/api/service-tickets/delete", { ids });
};