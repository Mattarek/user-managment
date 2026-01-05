import axios from "axios";

const API_URL = "https://patients-care-toci-server.onrender.com/api";

export const api = axios.create({
    baseURL: API_URL,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach(cb => cb(token));
    refreshSubscribers = [];
};

api.interceptors.request.use(config => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


api.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config;

        if (
            error?.response?.status === 401 &&
            originalRequest?.url !== "/refresh-token"
        ) {
            if (originalRequest._retry) return Promise.reject(error);
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise(resolve => {
                    subscribeTokenRefresh((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    });
                });
            }
            console.log("wykonane")
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                const {data} = await api.post("/refresh-token", {
                    refreshToken
                });

                localStorage.setItem("accessToken", data.accessToken);

                isRefreshing = false;
                onRefreshed(data.accessToken);

                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

                return api(originalRequest);

            } catch (err) {
                isRefreshing = false;
                refreshSubscribers = [];
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);
