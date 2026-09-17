import type { FieldError } from 'react-hook-form'

const FALLBACK_ERROR = 'Invalid value'

export function getErrorMessage(
  error: FieldError | undefined,
): string | undefined {
  if (error === undefined) {
    return undefined
  }
  if (error.message === undefined || error.message === '') {
    return FALLBACK_ERROR
  }
  return error.message
}
