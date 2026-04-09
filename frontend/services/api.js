"use client"

import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE = 'http://127.0.0.1:5000'

// ✅ Create instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
})


// -----------------------------
// 🔹 REQUEST INTERCEPTOR
// -----------------------------
api.interceptors.request.use(config => {
  // avoid spam (only for main APIs)
  if (!config.url.includes('graph_data')) {
    toast.loading(`Loading ${config.url}`, { id: config.url })
  }
  return config
})


// -----------------------------
// 🔹 RESPONSE INTERCEPTOR
// -----------------------------
api.interceptors.response.use(
  response => {
    toast.dismiss()
    return response.data   // ✅ always return data directly
  },
  error => {
    toast.dismiss()

    const msg =
      error.response?.data?.error ||
      error.message ||
      "Server error"

    toast.error(msg)

    console.error("API ERROR:", msg)

    return Promise.reject(msg)
  }
)


// -----------------------------
// 🔹 API CALLS
// -----------------------------
export const loadData = async (type = 'synthetic', options = {}) => {
  return await api.post('/load_data', { type, ...options })
}

export const getGraphStats = async () => {
  return await api.get('/graph_stats')
}

export const getTopInfluencers = async (k = 20) => {
  return await api.get(`/top_influencers?k=${k}`)
}

export const getGraphData = async () => {
  return await api.get('/graph_data')
}

export const searchUser = async (userId) => {
  return await api.get(`/search_user?user_id=${userId}`)
}


// -----------------------------
// 🔹 EXPORT CSV (FIXED)
// -----------------------------
export const exportCSV = async () => {
  try {
    const res = await axios.get(`${API_BASE}/export_csv`, {
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'influencers.csv')
    document.body.appendChild(link)
    link.click()

    toast.success("CSV Downloaded ✅")

  } catch (err) {
    toast.error("Download failed")
  }
}

export default api