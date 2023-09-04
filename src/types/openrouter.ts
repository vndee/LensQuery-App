export type TGetKeyLimitResponse = {
  data: {
    label: string,
    usage: number, // Number of credits used
    limit: number | null, // Credit limit for the key, or null if unlimited
    limit_remaining: number | null, // Number of credits remaining, or null if unlimited
    rate_limit: {
      requests: number, // Number of requests allowed...
      interval: string // in this interval, e.g. "10s"
    }
  }
};

export type TGetModelPropertiesResponse = {
  id: string,
  pricing: {
    prompt: number,
    completion: number
  },
  context_length: number,
  per_request_limits: {
    prompt_tokens: number,
    completion_tokens: number
  }
};