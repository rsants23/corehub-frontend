import { RATE_LIMIT_LOGIN_MESSAGE } from "@/constants/session";

export interface NestJsErrorBody {
  statusCode?: number;
  message?: string | string[];
  error?: string;
  code?: string;
  retryAfterSeconds?: number;
}

const STATUS_MESSAGES: Record<number, string> = {
  400: "Requisição inválida. Verifique os dados informados.",
  401: "Sessão expirada ou credenciais inválidas. Faça login novamente.",
  403: "Você não tem permissão para realizar esta ação.",
  404: "Recurso não encontrado.",
  409: "Conflito ao processar a operação. O registro pode já existir.",
  422: "Dados inválidos. Revise os campos do formulário.",
  429: RATE_LIMIT_LOGIN_MESSAGE,
  500: "Erro interno do servidor. Tente novamente em instantes.",
};

const TECHNICAL_MESSAGE_PATTERNS = [
  /throttlerexception/i,
  /too many requests/i,
  /internal server error/i,
];

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

function isTechnicalMessage(message: string): boolean {
  return TECHNICAL_MESSAGE_PATTERNS.some((pattern) => pattern.test(message));
}

function resolveFriendlyMessage(
  status: number,
  data?: NestJsErrorBody | null,
): string {
  if (data?.code === "TOO_MANY_LOGIN_ATTEMPTS") {
    return RATE_LIMIT_LOGIN_MESSAGE;
  }

  const apiMessage = extractMessage(data);
  if (apiMessage && !isTechnicalMessage(apiMessage)) {
    return apiMessage;
  }

  return STATUS_MESSAGES[status] ?? `Erro na requisição (${status}).`;
}

export function normalizeApiError(
  status: number,
  data?: NestJsErrorBody | null,
): ApiError {
  const friendlyMessage = resolveFriendlyMessage(status, data);

  return new ApiError(status, friendlyMessage, data ?? undefined);
}

export function createConnectionError(): ApiError {
  return new ApiError(
    0,
    "Não foi possível conectar à API. Verifique se o backend está em execução.",
  );
}

export interface IdentityExistsConflictBody {
  code: "IDENTITY_EXISTS";
  message: string;
  identity: {
    id: string;
    name: string;
    email: string;
    username: string | null;
  };
}

function isIdentityExistsBody(
  value: unknown,
): value is IdentityExistsConflictBody {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    (value as IdentityExistsConflictBody).code === "IDENTITY_EXISTS"
  );
}

/** Extrai conflito IDENTITY_EXISTS de resposta 409 do NestJS. */
export function parseIdentityExistsConflict(
  error: unknown,
): IdentityExistsConflictBody | null {
  if (!(error instanceof ApiError) || error.status !== 409) {
    return null;
  }

  const message = error.data?.message;
  if (isIdentityExistsBody(message)) {
    return message;
  }

  if (isIdentityExistsBody(error.data)) {
    return error.data as IdentityExistsConflictBody;
  }

  return null;
}

export function getErrorMessage(error: unknown, fallback?: string): string {
  if (error instanceof ApiError) {
    const identityConflict = parseIdentityExistsConflict(error);
    if (identityConflict) {
      return identityConflict.message;
    }

    if (error.data?.code === "TOO_MANY_LOGIN_ATTEMPTS") {
      return RATE_LIMIT_LOGIN_MESSAGE;
    }

    if (isTechnicalMessage(error.message)) {
      return STATUS_MESSAGES[error.status] ?? fallback ?? "Ocorreu um erro inesperado.";
    }

    return error.message;
  }

  if (error instanceof Error) {
    if (isTechnicalMessage(error.message)) {
      return fallback ?? "Ocorreu um erro inesperado.";
    }

    return error.message;
  }

  return fallback ?? "Ocorreu um erro inesperado.";
}
