export function getFrontendBaseURL () {
    const host = process.env.NEXT_PUBLIC_FRONTEND_HOST;
    const port = process.env.NEXT_PUBLIC_FRONTEND_PORT;
    return `${host}:${port}`;
};

export function getReadURLFor (model: string, id: number) {
    return `${getFrontendBaseURL()}/admin/${model}/read/${id}`;
};

export function getEditURLFor (model: string, id: number) {
    return `${getFrontendBaseURL()}/admin/${model}/edit/${id}`;
};

export function getCreateURLFor (model: string) {
    return `${getFrontendBaseURL()}/admin/${model}/create`;
}

export function getDeleteURLFor (model: string, id: number) {
    return `${getFrontendBaseURL()}/api/${model}/delete/${id}`;
};