/**
 * Data Transformer Utility
 * 
 * This utility provides functions to transform data between frontend and backend formats,
 * specifically converting between camelCase and snake_case property names.
 */

type NestedObject = { [key: string]: any };

/**
 * Converts snake_case string to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (match, group) => group.toUpperCase());
}

/**
 * Converts camelCase string to snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Transforms an object's keys from snake_case to camelCase
 * Works recursively for nested objects and arrays
 */
export function transformToCamelCase<T extends NestedObject>(obj: T): NestedObject {
  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'object' && item !== null) {
        return transformToCamelCase(item);
      }
      return item;
    });
  }
  
  const result: NestedObject = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = snakeToCamel(key);
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)) {
      // Recursively transform nested objects
      result[camelKey] = transformToCamelCase(value);
    } else if (Array.isArray(value)) {
      // Transform arrays
      result[camelKey] = value.map(item => 
        typeof item === 'object' && item !== null 
          ? transformToCamelCase(item) 
          : item
      );
    } else {
      // Direct assignment for primitive values
      result[camelKey] = value;
    }
  }
  
  return result;
}

/**
 * Transforms an object's keys from camelCase to snake_case
 * Works recursively for nested objects and arrays
 */
export function transformToSnakeCase<T extends NestedObject>(obj: T): NestedObject {
  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'object' && item !== null) {
        return transformToSnakeCase(item);
      }
      return item;
    });
  }
  
  const result: NestedObject = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = camelToSnake(key);
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)) {
      // Recursively transform nested objects
      result[snakeKey] = transformToSnakeCase(value);
    } else if (Array.isArray(value)) {
      // Transform arrays
      result[snakeKey] = value.map(item => 
        typeof item === 'object' && item !== null 
          ? transformToSnakeCase(item) 
          : item
      );
    } else {
      // Direct assignment for primitive values
      result[snakeKey] = value;
    }
  }
  
  return result;
}

/**
 * Maps frontend citizen form data to backend schema
 * 
 * @param formData The frontend form data
 * @returns Data formatted for the backend API
 */
export function mapCitizenFormToApiSchema(formData: any): any {
  // Start with converting camelCase to snake_case
  const snakeCaseData = transformToSnakeCase(formData);
  
  // Add any specific field mappings that don't follow the standard conversion
  const apiData = {
    ...snakeCaseData,
    // Any special case field mappings go here
    // For example:
    // first_name_ar: formData.firstName,
    // last_name_ar: formData.familyName,
  };
  
  return apiData;
}

/**
 * Maps backend citizen data to frontend schema
 * 
 * @param apiData The data from the API
 * @returns Data formatted for the frontend
 */
export function mapApiToCitizenForm(apiData: any): any {
  // Start with converting snake_case to camelCase
  const camelCaseData = transformToCamelCase(apiData);
  
  // Add any specific field mappings that don't follow the standard conversion
  const formData = {
    ...camelCaseData,
    // Any special case field mappings go here
    // For example:
    // firstName: apiData.first_name_ar,
    // familyName: apiData.last_name_ar,
  };
  
  return formData;
}