// Centralized API service for frontend-backend communication
import axios from "axios";
import { 
  transformToCamelCase, 
  transformToSnakeCase, 
  mapCitizenFormToApiSchema, 
  mapApiToCitizenForm 
} from "../utils/dataTransformer";

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Add a reasonable timeout to prevent hanging requests
  timeout: 30000, // 30 seconds
});

// Response interceptor to convert snake_case to camelCase
api.interceptors.response.use((response) => {
  if (response.data && typeof response.data === 'object') {
    response.data = transformToCamelCase(response.data);
  }
  return response;
});

// Request interceptor to convert camelCase to snake_case
api.interceptors.request.use((config) => {
  if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
    config.data = transformToSnakeCase(config.data);
  }
  return config;
});

// Define the shape of citizen registration data
export interface CitizenRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  fatherName?: string;
  grandfatherName?: string;
  birthPlace?: string;
  birthDate?: string;
  nationalId?: string;
  gender?: string;
  maritalStatus?: string;
  occupation?: string;
  // Add other fields that match the frontend form
}

export async function registerCitizen(
  data: CitizenRegistrationData,
  token?: string
) {
  // Transform specific fields that don't follow standard conversion
  const apiData = mapCitizenFormToApiSchema(data);
  
  const response = await api.post(
    "/citizens",
    apiData,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  
  return mapApiToCitizenForm(response.data);
}

export async function getCitizens(token?: string) {
  const response = await api.get(
    "/citizens",
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  
  // Transform the array of citizens
  return response.data.map((citizen: Citizen) => mapApiToCitizenForm(citizen));
}

export async function updateCitizen(
  id: string,
  data: Partial<CitizenRegistrationData>,
  token?: string
) {
  // Transform specific fields that don't follow standard conversion
  const apiData = mapCitizenFormToApiSchema(data);
  
  const response = await api.put(
    `/citizens/${id}`,
    apiData,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  
  return mapApiToCitizenForm(response.data);
}

export async function deleteCitizen(id: string, token?: string) {
  const response = await api.delete(
    `/citizens/${id}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  return response.data;
}

// Define the shape of citizen search parameters
export interface CitizenSearchParams {
  nameAr?: string;
  nameEn?: string;
  nationalId?: string;
  passportNumber?: string;
  gender?: string;
  maritalStatus?: string;
  birthDateFrom?: string;
  birthDateTo?: string;
  registrationDateFrom?: string;
  registrationDateTo?: string;
  isAlive?: boolean | string;
  familyMemberId?: string;
  relationship?: string;
  page?: number;
  pageSize?: number;
}

// Define the shape of a Citizen object (adjust fields as needed based on your backend response)
export interface Citizen {
  id: string;
  citizen_id?: number;  // Adding this to match backend schema
  firstName: string;
  lastName: string;
  email: string;
  nameAr?: string;
  nameEn?: string;
  nationalId?: string;
  passportNumber?: string;
  familyMemberId?: string;
  relationship?: string;
  birthDate?: string;
  date_of_birth?: string; // Adding date_of_birth to match backend field name
  registrationDate?: string;
  registration_date?: string; // Adding registration_date to match backend field name
  gender?: string;
  maritalStatus?: string;
  marital_status?: string; // Adding marital_status to match backend field name
  isAlive?: boolean;
  is_alive?: boolean; // Adding is_alive to match backend field name
  occupation?: string;
  place_of_birth?: string;
  birthPlace?: string;
  father_name_ar?: string;
  father_name_en?: string;
  first_name_ar?: string; // Adding snake_case properties from backend
  first_name_en?: string;
  last_name_ar?: string;
  last_name_en?: string;
  mother_name_ar?: string;
  mother_name_en?: string;
  fatherNameAr?: string;
  fatherNameEn?: string;
  motherNameAr?: string;
  motherNameEn?: string;
  contactInfo?: Array<{
    type: string;
    value: string;
  }>;
  passports?: Array<{
    passport_number: string;
    issue_date: string;
    expiry_date: string;
  }>;
  // Add other fields returned by your API
}

// Define the search results interface
export interface CitizenSearchResults {
  data: Citizen[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function searchCitizens(
  params: CitizenSearchParams,
  token?: string
): Promise<CitizenSearchResults> {
  // Convert params to URL query parameters
  const queryParams = new URLSearchParams();
  
  // Add all non-undefined parameters to the query
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      queryParams.append(key, String(value));
    }
  });
  
  const response = await api.get(
    `/citizens/search?${queryParams.toString()}`,
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
  
  // Otherwise handle as regular JSON submission with data transformation
  const { signal, cleanup } = createAbortableRequest();
  try {
    // Apply data transformation for JSON data
    const transformedData = transformToSnakeCase(data);
    
    const response = await api.post("/passports", transformedData, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      signal
    });
    cleanup();
    const transformed = transformToCamelCase(response.data);
    return { applicationId: String(transformed.applicationId ?? transformed.id ?? "") };
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
  // If FormData, handle as is
  if (data instanceof FormData) {
    const headers = {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const response = await api.put(`/passports/${id}`, data, { headers });
    const transformed = transformToCamelCase(response.data);
    return { applicationId: String(transformed.applicationId ?? transformed.id ?? "") };
  }
  
  // For JSON data, transform to snake_case
  const transformedData = transformToSnakeCase(data);
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  
  const response = await api.put(`/passports/${id}`, transformedData, { headers });
  const transformed = transformToCamelCase(response.data);
  return { applicationId: String(transformed.applicationId ?? transformed.id ?? "") };
}

export async function getPassport(id: string, token?: string) {
  const response = await api.get(
    `/passports/${id}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  const transformed = transformToCamelCase(response.data);
  return { applicationId: String(transformed.applicationId ?? transformed.id ?? "") };
}

export async function getPassports(citizenId: string, token?: string) {
  const response = await api.get(
    `/passports?citizen_id=${citizenId}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  return Array.isArray(response.data) 
    ? response.data.map(passport => transformToCamelCase(passport)) 
    : [];
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
  // Transform data to snake_case for backend
  const transformedData = transformToSnakeCase(data);
  
  const response = await api.post(
    "/proxies",
    transformedData,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  
  const transformed = transformToCamelCase(response.data);
  return { applicationId: String(transformed.applicationId ?? transformed.id ?? "") };
}

export async function getProxies(citizenId: string, token?: string) {
  const response = await api.get(
    `/proxies?citizen_id=${citizenId}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  
  return Array.isArray(response.data) 
    ? response.data.map(proxy => transformToCamelCase(proxy)) 
    : [];
}

export async function getProxy(id: string, token?: string) {
  const response = await api.get(
    `/proxies/${id}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  
  const transformed = transformToCamelCase(response.data);
  return { applicationId: String(transformed.applicationId ?? transformed.id ?? "") };
}

export async function updateProxy(
  id: string,
  data: Partial<ProxyRegistrationData>,
  token?: string
) {
  // Transform data to snake_case for backend
  const transformedData = transformToSnakeCase(data);
  
  const response = await api.put(
    `/proxies/${id}`,
    transformedData,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  
  const transformed = transformToCamelCase(response.data);
  return { applicationId: String(transformed.applicationId ?? transformed.id ?? "") };
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
  // If FormData, handle as is
  if (data instanceof FormData) {
    const headers = {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const response = await api.post("/documents", data, { headers });
    const transformed = transformToCamelCase(response.data);
    return { applicationId: String(transformed.applicationId ?? transformed.id ?? "") };
  }
  
  // For JSON data, transform to snake_case
  const transformedData = transformToSnakeCase(data);
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  
  const response = await api.post("/documents", transformedData, { headers });
  const transformed = transformToCamelCase(response.data);
  return { applicationId: String(transformed.applicationId ?? transformed.id ?? "") };
}

export async function getDocuments(citizenId: string, token?: string) {
  const response = await api.get(
    `/documents?citizen_id=${citizenId}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  
  return Array.isArray(response.data) 
    ? response.data.map(document => transformToCamelCase(document)) 
    : [];
}

export async function getDocument(id: string, token?: string) {
  const response = await api.get(
    `/documents/${id}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  
  const transformed = transformToCamelCase(response.data);
  return { applicationId: String(transformed.applicationId ?? transformed.id ?? "") };
}

export async function updateDocument(
  id: string,
  data: Partial<DocumentRegistrationData> | FormData,
  token?: string
) {
  // If FormData, handle as is
  if (data instanceof FormData) {
    const headers = {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const response = await api.put(`/documents/${id}`, data, { headers });
    const transformed = transformToCamelCase(response.data);
    return { applicationId: String(transformed.applicationId ?? transformed.id ?? "") };
  }
  
  // For JSON data, transform to snake_case
  const transformedData = transformToSnakeCase(data);
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  
  const response = await api.put(`/documents/${id}`, transformedData, { headers });
  const transformed = transformToCamelCase(response.data);
  return { applicationId: String(transformed.applicationId ?? transformed.id ?? "") };
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
  data: AttestationRequestData | FormData,
  token?: string
): Promise<{ applicationId: string }> {
  // If FormData, handle as is
  if (data instanceof FormData) {
    const headers = {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const response = await api.post("/attestation", data, { headers });
    const transformed = transformToCamelCase(response.data);
    return { applicationId: String(transformed.applicationId ?? transformed.id ?? "") };
  }
  
  // For JSON data, transform to snake_case
  const transformedData = transformToSnakeCase(data);
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  const response = await api.post("/attestation", transformedData, { headers });
  const transformed = transformToCamelCase(response.data);
  return { applicationId: String(transformed.applicationId ?? transformed.id ?? "") };
}

export async function getAttestations(citizenId: string, token?: string) {
  const response = await api.get(
    `/attestation?citizen_id=${citizenId}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  
  return Array.isArray(response.data) 
    ? response.data.map(attestation => transformToCamelCase(attestation)) 
    : [];
}

export async function getAttestation(id: string, token?: string) {
  const response = await api.get(
    `/attestation/${id}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  
  return transformToCamelCase(response.data);
}

export async function updateAttestation(
  id: string,
  data: Partial<AttestationRequestData> | FormData,
  token?: string
) {
  // If FormData, handle as is
  if (data instanceof FormData) {
    const headers = {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const response = await api.put(`/attestation/${id}`, data, { headers });
    return transformToCamelCase(response.data);
  }
  
  // For JSON data, transform to snake_case
  const transformedData = transformToSnakeCase(data);
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  
  const response = await api.put(`/attestation/${id}`, transformedData, { headers });
  return transformToCamelCase(response.data);
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
  // If FormData, handle as is
  if (visaData instanceof FormData) {
    const headers = {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const response = await api.post('/visas', visaData, { headers });
    return transformToCamelCase(response.data);
  }
  
  // For JSON data, transform to snake_case
  const transformedData = transformToSnakeCase(visaData);
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  
  const response = await api.post('/visas', transformedData, { headers });
  return transformToCamelCase(response.data);
};

export const getVisa = async (id: string, token?: string) => {
  const response = await api.get(
    `/visas/${id}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  
  return transformToCamelCase(response.data);
};

export const getVisas = async (citizenId?: string, status?: string, token?: string) => {
  const queryParams = new URLSearchParams();
  
  if (citizenId) {
    queryParams.append('citizen_id', citizenId);
  }
  
  if (status) {
    queryParams.append('status', status);
  }
  
  const endpoint = queryParams.toString() 
    ? `/visas?${queryParams.toString()}` 
    : '/visas';
  
  const response = await api.get(
    endpoint,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  
  return Array.isArray(response.data) 
    ? response.data.map(visa => transformToCamelCase(visa)) 
    : [];
};

export const updateVisa = async (
  id: string, 
  visaData: Partial<VisaRegistrationData> | FormData, 
  token?: string
) => {
  // If FormData, handle as is
  if (visaData instanceof FormData) {
    const headers = {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const response = await api.put(`/visas/${id}`, visaData, { headers });
    return transformToCamelCase(response.data);
  }
  
  // For JSON data, transform to snake_case
  const transformedData = transformToSnakeCase(visaData);
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  
  const response = await api.put(`/visas/${id}`, transformedData, { headers });
  return transformToCamelCase(response.data);
};

export const deleteVisa = async (id: string, token?: string) => {
  const response = await api.delete(
    `/visas/${id}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  
  return response.data;
};

// Export default api instance
export default api;
