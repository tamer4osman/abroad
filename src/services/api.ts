// Centralized API service for frontend-backend communication
import axios from "axios";

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Add a reasonable timeout to prevent hanging requests
  timeout: 30000, // 30 seconds
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
  const response = await api.post(
    "/citizens",
    data,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  return response.data;
}

export async function getCitizens(token?: string) {
  const response = await api.get(
    "/citizens",
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  return response.data;
}

export async function updateCitizen(
  id: string,
  data: Partial<CitizenRegistrationData>,
  token?: string
) {
  const response = await api.put(
    `/citizens/${id}`,
    data,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  return response.data;
}

export async function deleteCitizen(id: string, token?: string) {
  const response = await api.delete(
    `/citizens/${id}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  return response.data;
}

// Helper function to create and manage abortable API requests
export function createAbortableRequest(timeoutMs = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  const cleanup = () => {
    clearTimeout(timeoutId);
  };
  
  return {
    signal: controller.signal,
    cleanup,
    controller
  };
}

// Helper function to handle form data submissions properly
export async function submitFormData(
  endpoint: string,
  formData: FormData,
  token?: string,
  timeoutMs = 15000
): Promise<unknown> {
  const { signal, cleanup } = createAbortableRequest(timeoutMs);
  
  try {
    const response = await api.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      signal
    });
    cleanup();
    return response.data;
  } catch (error) {
    cleanup();
    if (axios.isCancel(error)) {
      throw new Error("تم إلغاء الطلب بسبب تجاوز الوقت المسموح به");
    }
    throw error;
  }
}

// Define the shape of passport registration data
export interface PassportRegistrationData {
  citizenId: string; // Assuming a passport is linked to a citizen
  passportNumber: string;
  issueDate: string; // Consider using Date type if appropriate
  expiryDate: string; // Consider using Date type if appropriate
  
  // Optional fields with simple types
  birthPlace?: string;
  birthDate?: string;
  gender?: string;
  holderName?: string;
  passportType?: string;
  pages?: string;
  processingType?: string;
  
  // Complex nested objects
  contactInfo?: {
    addressLibya?: string;
    phoneLibya?: string;
    addressAbroad?: string;
    phoneAbroad?: string;
    email?: string;
    emergencyContact?: {
      name?: string;
      relation?: string;
      phone?: string;
      [key: string]: string | undefined;
    };
    [key: string]: string | undefined | object;
  };
  
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
    [key: string]: string | undefined;
  };
  
  parentInfo?: {
    fatherName?: string;
    fatherNationality?: string;
    motherName?: string;
    motherNationality?: string;
    [key: string]: string | undefined;
  };
  
  previousPassport?: {
    number?: string;
    issueDate?: string;
    expiryDate?: string;
    issuePlace?: string;
    [key: string]: string | undefined;
  };
  
  personalInfo?: {
    fullName?: string;
    nationalNumber?: string;
    birthPlace?: string;
    birthDate?: string;
    gender?: string;
    maritalStatus?: string;
    occupation?: string;
    [key: string]: string | undefined;
  };
  
  documentInfo?: {
    [key: string]: string | boolean | undefined;
  };
  
  additionalInfo?: {
    travelReason?: string;
    travelDestination?: string;
    previousLost?: boolean;
    previousLostDetails?: string;
    [key: string]: string | boolean | undefined;
  };
  
  // For any other fields
  [key: string]: string | number | boolean | undefined | Record<string, unknown>;
}

export async function registerPassport(
  data: PassportRegistrationData | FormData,
  token?: string
) {
  // If FormData, use the specialized form data submission function
  if (data instanceof FormData) {
    return submitFormData("/passports", data, token);
  }
  
  // Otherwise handle as regular JSON submission
  const { signal, cleanup } = createAbortableRequest();
  try {
    const response = await api.post("/passports", data, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      signal
    });
    cleanup();
    return response.data;
  } catch (error) {
    cleanup();
    if (axios.isCancel(error)) {
      throw new Error("تم إلغاء الطلب بسبب تجاوز الوقت المسموح به");
    }
    throw error;
  }
}

export async function updatePassport(
  id: string,
  data: Partial<PassportRegistrationData> | FormData,
  token?: string
) {
  let headers = {};
  
  // Check if we're dealing with FormData
  if (data instanceof FormData) {
    headers = {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  } else {
    headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  const response = await api.put(`/passports/${id}`, data, { headers });
  return response.data;
}

export async function deletePassport(id: string, token?: string) {
  const response = await api.delete(
    `/passports/${id}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  return response.data;
}

// Mock register passport function for testing when backend isn't available
export async function mockRegisterPassport(

): Promise<{ applicationId: string }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { applicationId: `MOCK-${Math.floor(Math.random() * 1000000)}` };
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
  const response = await api.post(
    "/proxies",
    data,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  return response.data;
}

export async function updateProxy(
  id: string,
  data: Partial<ProxyRegistrationData>,
  token?: string
) {
  const response = await api.put(
    `/proxies/${id}`,
    data,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  return response.data;
}

export async function deleteProxy(id: string, token?: string) {
  const response = await api.delete(
    `/proxies/${id}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
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
  data: DocumentRegistrationData | FormData,
  token?: string
) {
  let headers = {};
  
  // Check if we're dealing with FormData
  if (data instanceof FormData) {
    headers = {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  } else {
    headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  const response = await api.post("/documents", data, { headers });
  return response.data;
}

export async function updateDocument(
  id: string,
  data: Partial<DocumentRegistrationData> | FormData,
  token?: string
) {
  let headers = {};
  
  // Check if we're dealing with FormData
  if (data instanceof FormData) {
    headers = {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  } else {
    headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  const response = await api.put(`/documents/${id}`, data, { headers });
  return response.data;
}

export async function deleteDocument(id: string, token?: string) {
  const response = await api.delete(
    `/documents/${id}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  return response.data;
}

// Define the shape of attestation request data
export interface AttestationRequestData {
  // Add relevant fields for attestation request
  // For example:
  citizenId: string;
  attestationType: string;
  details?: string;
  // Add other fields as needed
}

export async function registerAttestationRequest(
  data: AttestationRequestData | FormData
): Promise<{ applicationId: string }> {
  let headers = {};
  
  // Check if we're dealing with FormData
  if (data instanceof FormData) {
    headers = { "Content-Type": "multipart/form-data" };
  } else {
    headers = { "Content-Type": "application/json" };
  }

  const response = await api.post("/attestation", data, { headers });
  return response.data;
}

// Define the shape of visa registration data
export interface VisaRegistrationData {
  citizenId: string;
  visaType: string;
  country: string;
  applicationDate: string;
  expiryDate?: string;
  status?: string;
  // Add other relevant visa fields as needed
}

// Visa services
export const registerVisa = async (visaData: VisaRegistrationData | FormData, token?: string) => {
  let headers = {};
  
  // Check if we're dealing with FormData
  if (visaData instanceof FormData) {
    headers = {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  } else {
    headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }
  
  const response = await api.post('/visas', visaData, { headers });
  return response.data;
};

// Export default api instance
export default api;
