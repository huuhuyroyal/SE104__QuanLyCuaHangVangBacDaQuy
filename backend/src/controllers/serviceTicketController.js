import * as service from "../service/serviceTicketService.js";

export const getAll = async (req, res) => {
    const { q } = req.query;
    const response = await service.getAllServiceTickets(q);
    return res.status(200).json(response);
};

export const getById = async (req, res) => {
    const response = await service.getServiceTicketById(req.params.id);
    return res.status(200).json(response);
};

export const create = async (req, res) => {
    const response = await service.createServiceTicket(req.body);
    return res.status(200).json(response);
};

export const updateStatus = async (req, res) => {
    const { id, status } = req.body;
    const response = await service.updateTicketStatus(id, status);
    return res.status(200).json(response);
};

export const deleteTickets = async (req, res) => {
    const { ids } = req.body;
    const response = await service.deleteServiceTickets(ids);
    return res.status(200).json(response);
};