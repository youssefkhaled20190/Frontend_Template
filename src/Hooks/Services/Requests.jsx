// src/Hooks/Services/Requests.js
import axiosInstance from '../../Axios/AxiosInstance';

/**
 * ============================================
 * ERROR EXTRACTION LOGIC
 * ============================================
 * Handles 5 Backend Error Response Formats
 */
export const extractErrorMessage = (error) => {
  // If it's a standard JS error without axios response (like our manual throw)
  if (!error.response) return error.message || "Network Error";

  const { status, data } = error.response;
  if (!data) return error.message || "Unknown API Error";

  // Format A: Validation Errors Dictionary (RFC 7807)
  if (status === 400 && data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
    const firstKey = Object.keys(data.errors)[0];
    if (firstKey && data.errors[firstKey]?.length > 0) {
      return data.errors[firstKey][0];
    }
  }

  // Format D: Direct Identity Errors Array
  if (status === 400 && Array.isArray(data) && data.length > 0 && data[0].description) {
    return data[0].description;
  }

  // Format C: Unhandled Exception Middleware Array
  if (data.isFailure && Array.isArray(data.errors) && data.errors.length > 0 && data.errors[0].description) {
    return data.errors[0].description;
  }

  // Format B: Single Problem Details (RFC 7807)
  if (data.detail) {
    return data.detail;
  }

  // Format E: Custom Controller Action Objects (HTTP Error)
  if (data.message) {
    return data.message;
  }

  // Fallback
  if (data.title) {
    return data.title;
  }

  return error.message || "Unknown Error";
};

/**
 * ============================================
 * GENERIC API REQUESTS
 * ============================================
 */

export const parseJwt = () => {
  try {
    const token = localStorage.getItem('token');
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    console.log(payload);
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
};

/**
 * ============================================
 * GET REQUEST
 * ============================================
 */
export const createGetRequest = async (endPoint, params = {}) => {
  try {
    // Clean params - remove null, undefined, empty strings
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    console.log(`🌐 Fetching from API: ${endPoint}`);
    console.log(`📦 Params:`, cleanParams);

    // Replace any path placeholders like /User/{userId} with values from params
    let url = endPoint;
    try {
      url = endPoint.replace(/\{(.*?)\}/g, (match, key) => {
        if (cleanParams && Object.prototype.hasOwnProperty.call(cleanParams, key)) {
          const val = encodeURIComponent(cleanParams[key]);
          // remove used param so it won't be sent as query string
          delete cleanParams[key];
          return val;
        }
        return match;
      });
    } catch (e) {
      url = endPoint;
    }

    const response = await axiosInstance.get(url, { params: cleanParams });

    console.log(`✅ Full Response:`, response);
    console.log(`✅ Response.data:`, response.data);

    // Return response.data
    return response.data;

  } catch (error) {
    const msg = extractErrorMessage(error);
    console.error('❌ GET Error:', msg);
    throw new Error(msg);
  }
};

const formatResponse = (response) => {
  const isSuccess = response.status >= 200 && response.status < 300;

  // Format E: Custom Controller Action Objects (HTTP 200 but Logical Failure)
  if (response.data && typeof response.data === 'object' && response.data.rslt === false) {
    throw new Error(response.data.message || "Logical Operation Failed");
  }

  if (response.data && typeof response.data === 'object' && 'result' in response.data) {
    return {
      ...response.data,
      status: response.status,
      isSuccess,
    };
  }
  return {
    result: isSuccess,
    isSuccess,
    status: response.status,
    data: response.data,
  };
};

/**
 * ============================================
 * POST REQUEST
 * ============================================
 */
export const createPostRequest = async (endPoint, body) => {
  try {
    console.log(`🌐 Posting to API: ${endPoint}`);
    const response = await axiosInstance.post(endPoint, body);
    return formatResponse(response);
  } catch (error) {
    const msg = extractErrorMessage(error);
    console.error('POST Error:', msg);
    throw new Error(msg);
  }
};

/**
 * ============================================
 * PUT REQUEST
 * ============================================
 */
export const createUpdateRequest = async (endPoint, body) => {
  try {
    console.log(`🌐 Updating via API: ${endPoint}`);
    const response = await axiosInstance.put(endPoint, body);
    return formatResponse(response);
  } catch (error) {
    const msg = extractErrorMessage(error);
    console.error('PUT Error:', msg);
    throw new Error(msg);
  }
};

/**
 * ============================================
 * DELETE REQUEST
 * ============================================
 */
export const createDeleteRequest = async (endPoint, id) => {
  try {
    const hasIdInEndpoint = endPoint.includes('?') || endPoint.includes('=');
    const idToAppend = id !== undefined && id !== null && !hasIdInEndpoint ? id : '';
    const finalUrl = `${endPoint}${idToAppend}`;

    console.log(`🌐 Deleting via API: ${finalUrl}`);
    const response = await axiosInstance.delete(finalUrl);
    return formatResponse(response);
  } catch (error) {
    const msg = extractErrorMessage(error);
    console.error('DELETE Error:', msg);
    throw new Error(msg);
  }
};
