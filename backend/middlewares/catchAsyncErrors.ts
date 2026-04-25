type HandlerFunction<T extends unknown[], R> = (...args: T) => Promise<R>;

interface IValidationError {
  message: string;
}

interface ErrorWithResponse {
  name?: string;
  message?: string;
  errors?: Record<string, IValidationError>;
  response?: {
    data?: {
      message?: string;
    };
  };
}

function extractErrors(error: ErrorWithResponse) {
  if (error?.name === "ValidationError") {
    return {
      message: Object.values<IValidationError>(error?.errors ?? {})
        .map((value) => value.message)
        .join(", "),
      statusCode: 400,
    };
  }

  if (error?.response?.data?.message) {
    return {
      message: error?.response?.data?.message,
      statusCode: 400,
    };
  }

  if (error?.message) {
    return {
      message: error.message,
      statusCode: 400,
    };
  }

  return {
    message: "Internal Server Error",
    statusCode: 500,
  };
}

export const catchAsyncErrors = <T extends unknown[], R>(
  handler: HandlerFunction<T, R>
) =>
  async (...args: T) => {
    try {
      return await handler(...args);
    } catch (error: unknown) {
      const { message, statusCode } = extractErrors(error as ErrorWithResponse);

      return {
        error: {
          message,
          statusCode,
        },
      };
    }
  };