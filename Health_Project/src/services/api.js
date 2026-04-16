import axios from "axios";

/* ── Base instance ── */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

/* ── Attach JWT token to every request automatically ── */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ── Handle 401 globally (token expired) ── */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("phone");
      localStorage.removeItem("userRole");
      window.location.reload();
    }
    return Promise.reject(err);
  },
);

/* ─────────────────────────────────────────
   AUTH
───────────────────────────────────────── */
export const authAPI = {
  /**
   * Login or auto-register by phone number + role
   * Returns { token, user }
   */
  login: (phone, role) =>
    api.post("/auth/login", { phone, role }).then((r) => r.data),

  /** Get current user from token */
  getMe: () => api.get("/auth/me").then((r) => r.data),
};

/* ─────────────────────────────────────────
   USER / PROFILE
───────────────────────────────────────── */
export const userAPI = {
  /** Get logged-in user's profile */
  getProfile: () => api.get("/users/profile").then((r) => r.data),

  /**
   * Save / update profile
   * @param {{ name, location, age, gender }} data
   */
  saveProfile: (data) => api.put("/users/profile", data).then((r) => r.data),
};

/* ─────────────────────────────────────────
   DOCTORS
───────────────────────────────────────── */
export const doctorAPI = {
  /** Get all doctors. Pass role='pharmacist'|'dermatologist' to filter */
  getAll: (role) =>
    api.get("/doctors", { params: role ? { role } : {} }).then((r) => r.data),

  /**
   * Add a new doctor (pharmacist / dermatologist only)
   * @param {{ name, storeName, specialty, experience, location, email, phone, qualifications }} data
   */
  add: (data) => api.post("/doctors", data).then((r) => r.data),

  /** Delete a doctor by id */
  remove: (id) => api.delete(`/doctors/${id}`).then((r) => r.data),
};

/* ─────────────────────────────────────────
   QUIZ
───────────────────────────────────────── */
export const quizAPI = {
  /**
   * Save completed quiz answers to the backend
   * @param {boolean[]} answers
   */
  save: (answers) => api.post("/quiz/save", { answers }).then((r) => r.data),

  /** Get past quiz results for the logged-in user */
  history: () => api.get("/quiz/history").then((r) => r.data),
};

export default api;
