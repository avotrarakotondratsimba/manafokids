import axios from "axios"

const API_BASE_URL = "https://e9f6-102-68-192-174.ngrok-free.app/api"

// Configuration axios par défaut
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true"

export interface KidUserAPI {
  kidId: string
  kidUserName: string
  birthDate: string
  profilePic?: string
  sessionDuration: number
  weekXp: number
  totalXp: number
  divisionName: string
}

export const kidAPI = {
  // Récupérer les données d'un enfant
  getKid: async (kidId: string): Promise<KidUserAPI> => {
    const response = await axios.get(`${API_BASE_URL}/kids/${kidId}`)
    return response.data
  },

  // Mettre à jour l'XP d'un enfant
  updateXp: async (kidId: string, data: { weekXp: number; totalXp: number; divisionName: string }) => {
    const response = await axios.put(`${API_BASE_URL}/kids/xp/${kidId}`, data)
    return response.data
  },

  // Mettre à jour la photo de profil
  updateProfilePic: async (kidId: string, profilePic: string) => {
    const response = await axios.put(`${API_BASE_URL}/kids/${kidId}`, { profilePic })
    return response.data
  },
}
