export interface ChatQueryResponse {
    response: string;
    status: string;
}

export interface ChatQueryRequestBody {
    url: string;
    prompt: string;
}

export interface ChatMessageBean {
    question: string;
    answer?: string;
    isLoading: boolean
}