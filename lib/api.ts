const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const API_VERSION = "/api/v1"
const BASE_URL = `${API_BASE_URL}${API_VERSION}`
const API_KEY = "Ethan-credits-api"

// Helper function for making API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("accessToken")

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY,
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  // Handle unauthorized response
  if (response.status === 401) {
    localStorage.removeItem("accessToken")
    window.location.href = "/login"
    throw new Error("Unauthorized. Please login again.")
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong")
  }

  return data
}

// Authentication endpoints
export const authApi = {
  requestRegisterCode: (email: string) =>
    apiRequest("/auth/register/request", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  confirmRegister: (email: string, code: string, password: string) =>
    apiRequest("/auth/register/confirm", {
      method: "POST",
      body: JSON.stringify({ email, code, password }),
    }),

  login: async (email: string, password: string) => {
    const formData = new URLSearchParams()
    formData.append("username", email)
    formData.append("password", password)

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-API-Key": API_KEY,
      },
      body: formData.toString(),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.detail || "Login failed")
    }

    localStorage.setItem("accessToken", data.access_token)
    return data
  },

  requestPasswordReset: (email: string) =>
    apiRequest("/auth/password-reset/request", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  confirmPasswordReset: (email: string, code: string, newPassword: string) =>
    apiRequest("/auth/password-reset/confirm", {
      method: "POST",
      body: JSON.stringify({
        email,
        code,
        new_password: newPassword,
      }),
    }),

  getCurrentUser: () => apiRequest("/users/me"),

  updateCurrentUser: (userData: { password?: string }) =>
    apiRequest("/users/me", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
}

// Training Program endpoints
export const trainingProgramApi = {
  createProgram: (programData: { name: string; total_credits: number }) =>
    apiRequest("/training-programs/", {
      method: "POST",
      body: JSON.stringify(programData),
    }),

  getPrograms: (options?: { skip?: number; limit?: number; public_only?: boolean }) => {
    const params = new URLSearchParams()
    if (options?.skip) params.append("skip", options.skip.toString())
    if (options?.limit) params.append("limit", options.limit.toString())
    if (options?.public_only) params.append("public_only", "true")

    return apiRequest(`/training-programs/?${params.toString()}`)
  },

  getProgram: (id: string) => apiRequest(`/training-programs/${id}`),

  updateProgram: (id: string, programData: { name?: string; total_credits?: number; is_public?: boolean }) =>
    apiRequest(`/training-programs/${id}`, {
      method: "PUT",
      body: JSON.stringify(programData),
    }),

  deleteProgram: (id: string) =>
    apiRequest(`/training-programs/${id}`, {
      method: "DELETE",
    }),

  publishProgram: (id: string, isPublic: boolean) =>
    apiRequest(`/training-programs/${id}/publish`, {
      method: "POST",
      body: JSON.stringify({ is_public: isPublic }),
    }),
}

// Course Category endpoints
export const courseCategoryApi = {
  createCategory: (categoryData: {
    name: string
    required_credits: number
    training_program_id: string
    parent_id?: string | null
  }) =>
    apiRequest("/course-categories/", {
      method: "POST",
      body: JSON.stringify(categoryData),
    }),

  getProgramCategories: (programId: string) => apiRequest(`/course-categories/training-program/${programId}`),

  getCategory: (id: string) => apiRequest(`/course-categories/${id}`),

  updateCategory: (id: string, categoryData: { name?: string; required_credits?: number }) =>
    apiRequest(`/course-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    }),

  deleteCategory: (id: string) =>
    apiRequest(`/course-categories/${id}`, {
      method: "DELETE",
    }),
}

// Course endpoints
export const courseApi = {
  createCourse: (courseData: {
    name: string
    credits: number
    grading_system: "percentage" | "pass_fail"
    grade?: number
    passed?: boolean
    category_id: string
  }) =>
    apiRequest("/courses/", {
      method: "POST",
      body: JSON.stringify(courseData),
    }),

  getCourses: (options?: { skip?: number; limit?: number }) => {
    const params = new URLSearchParams()
    if (options?.skip) params.append("skip", options.skip.toString())
    if (options?.limit) params.append("limit", options.limit.toString())

    return apiRequest(`/courses/?${params.toString()}`)
  },

  getCourse: (id: string) => apiRequest(`/courses/${id}`),

  updateCourse: (
    id: string,
    courseData: {
      name?: string
      credits?: number
      grade?: number
      passed?: boolean
      category_id?: string
    },
  ) =>
    apiRequest(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(courseData),
    }),

  deleteCourse: (id: string) =>
    apiRequest(`/courses/${id}`, {
      method: "DELETE",
    }),
}

// Dashboard endpoints
export const dashboardApi = {
  getCreditSummary: (programId: string) => apiRequest(`/dashboard/credit-summary/${programId}`),
}
