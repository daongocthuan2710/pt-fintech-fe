// Libraries
import { TResponse } from '@/types/Api';
import { Method } from 'axios';

// Constants

// Types
type TCallAPIParams = {
  baseURL?: string;
  method: Method;
  url: string;
  params?: Record<string, any>;
  data?: any;
  version?: string;
  token?: string;
};

export async function callApi<T>({
  baseURL = process.env.NEXT_PUBLIC_API_URL,
  method,
  url,
  params,
  data,
  token,
}: TCallAPIParams): Promise<TResponse<T>> {
  let newUrl = `${url}`;

  if (params) {
    const queryParams = new URLSearchParams(params).toString();
    newUrl += `?${queryParams}`;
  }

  try {
    const response = await fetch(newUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: method !== 'GET' && data ? JSON.stringify(data) : null,
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.message || 'API call failed');
    }

    const results = await response.json();
    return {
      success: true,
      data: results,
    };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message || 'API call failed',
    };
  }
}
