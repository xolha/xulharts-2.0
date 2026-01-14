import { NextResponse } from 'next/server';
import type { ApiSuccessResponse, ApiErrorResponse } from '@/lib/types';

/**
 * helpers de resposta da API para formatação consistente
 */
export const apiResponse = {
  /**
   * resposta de sucesso
   */
  success: <T = any>(data: T): NextResponse<ApiSuccessResponse<T>> => {
    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  },

  /**
   * resposta de erro
   */
  error: (message: string, status: number = 400): NextResponse<ApiErrorResponse> => {
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status }
    );
  },

  /**
   * resposta de não autorizado
   */
  unauthorized: (): NextResponse<ApiErrorResponse> => {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized. Please login to access this resource.',
      },
      { status: 401 }
    );
  },

  /**
   * resposta de não encontrado
   */
  notFound: (resource: string = 'Resource'): NextResponse<ApiErrorResponse> => {
    return NextResponse.json(
      {
        success: false,
        error: `${resource} not found.`,
      },
      { status: 404 }
    );
  },

  /**
   * resposta de erro do servidor
   */
  serverError: (message: string = 'Internal server error'): NextResponse<ApiErrorResponse> => {
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  },
};
