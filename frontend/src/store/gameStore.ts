import { create } from "zustand"
import { persist } from "zustand/middleware"
import axios from "axios"

interface KidUser {
  kidId: string
  kidUserName: string
  birthDate: string
  profilePic?: string
  sessionDuration: number
  weekXp: number
  totalXp: number
  divisionName: string
  badges: string[]
  level: number
}

interface GameStore {
  currentKid: KidUser | null
  loading: boolean
  error: string | null
  setCurrentKid: (kid: KidUser) => void
  updateXp: (kidId: string, xpGained: number, badge?: string) => Promise<void>
  calculateLevel: (totalXp: number) => number
  getDivisionColor: (division: string) => string
}

const API_BASE_URL = "https://e9f6-102-68-192-174.ngrok-free.app/api"

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      currentKid: null,
      loading: false,
      error: null,

      setCurrentKid: (kid) => {
        const level = get().calculateLevel(kid.totalXp)
        set({
          currentKid: {
            ...kid,
            level,
            badges: kid.badges || [],
          },
        })
      },

      calculateLevel: (totalXp) => {
        return Math.floor(totalXp / 100) + 1
      },

      getDivisionColor: (division) => {
        switch (division.toLowerCase()) {
          case "gold":
            return "from-yellow-400 to-yellow-600"
          case "silver":
            return "from-gray-300 to-gray-500"
          case "bronze":
            return "from-orange-400 to-orange-600"
          default:
            return "from-gray-400 to-gray-600"
        }
      },

      updateXp: async (kidId, xpGained, badge) => {
        const state = get()
        if (!state.currentKid) return

        set({ loading: true, error: null })

        try {
          // Calculer les nouvelles valeurs
          const newWeekXp = state.currentKid.weekXp + xpGained
          const newTotalXp = state.currentKid.totalXp + xpGained
          const newLevel = state.calculateLevel(newTotalXp)

          // Déterminer la nouvelle division basée sur le niveau
          let newDivision = state.currentKid.divisionName
          if (newLevel >= 10) newDivision = "gold"
          else if (newLevel >= 5) newDivision = "silver"
          else newDivision = "bronze"

          // Ajouter le badge s'il n'existe pas déjà
          const newBadges =
            badge && !state.currentKid.badges.includes(badge)
              ? [...state.currentKid.badges, badge]
              : state.currentKid.badges

          // Préparer les données pour l'API
          const updateData = {
            weekXp: newWeekXp,
            totalXp: newTotalXp,
            divisionName: newDivision,
          }

          // Envoyer la requête à l'API
          const response = await axios.put(`${API_BASE_URL}/kids/xp/${kidId}`, updateData, {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          })

          // Mettre à jour le state local avec les données de la réponse
          const updatedKid: KidUser = {
            ...state.currentKid,
            weekXp: response.data.weekXp || newWeekXp,
            totalXp: response.data.totalXp || newTotalXp,
            divisionName: response.data.divisionName || newDivision,
            badges: newBadges,
            level: newLevel,
          }

          set({
            currentKid: updatedKid,
            loading: false,
          })

          console.log("XP mis à jour avec succès:", response.data)
        } catch (error) {
          console.error("Erreur lors de la mise à jour XP:", error)
          set({
            error: "Erreur lors de la mise à jour des données",
            loading: false,
          })

          // En cas d'erreur, mettre à jour localement quand même
          const updatedKid: KidUser = {
            ...state.currentKid,
            weekXp: state.currentKid.weekXp + xpGained,
            totalXp: state.currentKid.totalXp + xpGained,
            badges:
              badge && !state.currentKid.badges.includes(badge)
                ? [...state.currentKid.badges, badge]
                : state.currentKid.badges,
            level: state.calculateLevel(state.currentKid.totalXp + xpGained),
          }

          set({ currentKid: updatedKid })
        }
      },
    }),
    {
      name: "game-progress-storage",
    },
  ),
)
