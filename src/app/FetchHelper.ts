export type ApiResponse<T> = {
    success: boolean;
    data: any;
    error: any;
}
export const FetchHelper = async <T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    try {
        const response = await fetch(url, options)
        const data = await response.json()

        if (!response.ok) {
            return { success: false, data: null, error: data.detail || "An error occurred" }
        }

        return { success: true, data, error: null }
    } catch (error) {
        console.error("Fetch error:", error);
        console.log(error)
        return { success: false, data: null, error: "Network error" }
    }
}