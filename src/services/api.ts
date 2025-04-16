// Centralized API service for frontend-backend communication
// Add more methods as needed for other modules

import axios from "axios";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Define the shape of citizen registration data
export interface CitizenRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  // Add other required fields based on your application needs
}

export async function registerCitizen(
  data: CitizenRegistrationData,
  token?: string
) {
  const response = await api.post("/citizens", data, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  return response.data;
}

export async function getCitizens(token?: string) {
  const response = await api.get("/citizens", token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  return response.data;
}

export async function updateCitizen(
  id: string,
  data: Partial<CitizenRegistrationData>,
  token?: string
) {
  const response = await api.put(`/citizens/${id}`, data, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  return response.data;
}

export async function deleteCitizen(id: string, token?: string) {
  const response = await api.delete(`/citizens/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  return response.data;
}

// Define the shape of passport registration data
export interface PassportRegistrationData {
  citizenId: string; // Assuming a passport is linked to a citizen
  passportNumber: string;
  issueDate: string; // Consider using Date type if appropriate
  expiryDate: string; // Consider using Date type if appropriate
  // Add other relevant passport fields
}

export async function registerPassport(
  data: PassportRegistrationData,
  token?: string
) {
  const response = await api.post("/passports", data, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  return response.data;
}

export async function updatePassport(
  id: string,
  data: Partial<PassportRegistrationData>,
  token?: string
) {
  const response = await api.put(`/passports/${id}`, data, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  return response.data;
}

export async function deletePassport(id: string, token?: string) {
  const response = await api.delete(`/passports/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  return response.data;
}

// Define the shape of proxy registration data
export interface ProxyRegistrationData {
  citizenId: string; // ID of the citizen granting the proxy
  proxyHolderId: string; // ID of the person acting as proxy
  proxyType: string; // e.g., 'General', 'Specific Task'
  startDate: string; // Consider using Date type
  endDate?: string; // Optional, consider using Date type
  // Add other relevant proxy fields
}

export async function registerProxy(
  data: ProxyRegistrationData,
  token?: string
) {
  const response = await api.post("/proxies", data, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  return response.data;
}

export async function updateProxy(
  id: string,
  data: Partial<ProxyRegistrationData>,
  token?: string
) {
  const response = await api.put(`/proxies/${id}`, data, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  return response.data;
}

export async function deleteProxy(id: string, token?: string) {
  const response = await api.delete(`/proxies/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  return response.data;
}

// Define the shape of document registration data
export interface DocumentRegistrationData {
  citizenId: string; // ID of the citizen the document belongs to
  documentType: string; // e.g., 'Birth Certificate', 'Visa Application'
  fileName: string;
  fileUrl?: string; // URL if stored externally
  uploadDate: string; // Consider using Date type
  // Add other relevant document fields
}

export async function registerDocument(
  data: DocumentRegistrationData,
  token?: string
) {
  const response = await api.post("/documents", data, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  return response.data;
}

export async function updateDocument(
  id: string,
  data: Partial<DocumentRegistrationData>,
  token?: string
) {
  const response = await api.put(`/documents/${id}`, data, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  return response.data;
}

export async function deleteDocument(id: string, token?: string) {
  const response = await api.delete(`/documents/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  return response.data;
}
