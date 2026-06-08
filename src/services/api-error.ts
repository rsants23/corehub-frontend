export interface NestJsErrorBody {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

const STATUS_MESSAGES: Record<number, string> = {
  400: "Requisição inválida. Verifique os dados informados.",
  401: "Sessão expirada ou credenciais inválidas. Faça login novamente.",
  403: "Você não tem permissão para realizar esta ação.",
  404: "Recurso não encontrado.",
  409: "Conflito ao processar a operação. O registro pode já existir.",
  422: "Dados inválidos. Revise os campos do formulário.",
  500: "Erro interno do servidor. Tente novamente em instantes.",
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: NestJsErrorBody,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** @deprecated Use ApiError — mantido para compatibilidade com imports existentes */
export { ApiError as HttpError };

function extractMessage(data: NestJsErrorBody | null | undefined): string | null {
  if (!data?.message) return null;

  if (Array.isArray(data.message)) {
    return data.message.join(". ");
  }

  return data.message;
}

export function normalizeApiError(
  status: number,
  data?: NestJsErrorBody | null,
): ApiError {
  const apiMessage = extractMessage(data);
  const friendlyMessage =
    apiMessage ?? STATUS_MESSAGES[status] ?? `Erro na requisição (${status}).`;

  return new ApiError(status, friendlyMessage, data ?? undefined);
}

export function createConnectionError(): ApiError {
  return new ApiError(
    0,
    "Não foi possível conectar à API. Verifique se o backend está em execução.",
  );
}

export function getErrorMessage(error: unknown, fallback?: string): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback ?? "Ocorreu um erro inesperado.";
}
