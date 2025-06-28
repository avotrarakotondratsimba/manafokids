"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Trophy, Medal, Target, Calendar } from "lucide-react"

interface UserProfileProps {
  userProgress: {
    facileCompleted: number
    moyenCompleted: number
    difficileCompleted: number
    totalStars: number
    unlockedLevels: string[]
  }
  onBack: () => void
}

export default function UserProfile({ userProgress, onBack }: UserProfileProps) {
  const totalLevelsCompleted =
    userProgress.facileCompleted + userProgress.moyenCompleted + userProgress.difficileCompleted

  const achievements = [
    {
      id: "first-word",
      name: "Premier Mot",
      description: "Trouve ton premier mot",
      icon: "🎯",
      unlocked: userProgress.totalStars > 0,
    },
    {
      id: "star-collector",
      name: "Collectionneur d'Étoiles",
      description: "Collecte 10 étoiles",
      icon: "⭐",
      unlocked: userProgress.totalStars >= 10,
    },
    {
      id: "level-master",
      name: "Maître des Niveaux",
      description: "Termine 5 niveaux",
      icon: "🏆",
      unlocked: totalLevelsCompleted >= 5,
    },
    {
      id: "word-hunter",
      name: "Chasseur de Mots",
      description: "Trouve 50 mots au total",
      icon: "🎪",
      unlocked: userProgress.totalStars >= 25,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Mon Profil</h1>
            <p className="text-white/80">Découvre tes exploits et tes progrès !</p>
          </div>
          <div className="w-16"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Statistiques principales */}
          <Card className="bg-white/95 shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Mes Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">{userProgress.totalStars}</div>
                  <div className="text-sm text-gray-600">Étoiles collectées</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{totalLevelsCompleted}</div>
                  <div className="text-sm text-gray-600">Niveaux terminés</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>🌟 Facile</span>
                    <span>{userProgress.facileCompleted}/5</span>
                  </div>
                  <Progress value={(userProgress.facileCompleted / 5) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>🔥 Moyen</span>
                    <span>{userProgress.moyenCompleted}/10</span>
                  </div>
                  <Progress value={(userProgress.moyenCompleted / 10) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>⚡ Difficile</span>
                    <span>{userProgress.difficileCompleted}/15</span>
                  </div>
                  <Progress value={(userProgress.difficileCompleted / 15) * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Succès et badges */}
          <Card className="bg-white/95 shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="w-6 h-6 text-purple-500" />
                Mes Succès
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`
                      p-4 rounded-lg border-2 text-center transition-all
                      ${achievement.unlocked ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 opacity-50"}
                    `}
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <div className="font-semibold text-sm">{achievement.name}</div>
                    <div className="text-xs text-gray-600 mt-1">{achievement.description}</div>
                    {achievement.unlocked && <Badge className="mt-2 bg-green-500">Débloqué</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Objectifs quotidiens */}
          <Card className="bg-white/95 shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6 text-green-500" />
                Objectifs du Jour
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Trouver 5 mots</span>
                  <Badge variant="outline">3/5</Badge>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Terminer 1 niveau</span>
                  <Badge className="bg-green-500">Terminé ✓</Badge>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Jouer 10 minutes</span>
                  <Badge variant="outline">7/10 min</Badge>
                </div>
                <Progress value={70} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Historique récent */}
          <Card className="bg-white/95 shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-500" />
                Activité Récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-sm">Niveau Facile 3</div>
                    <div className="text-xs text-gray-600">Il y a 2 heures</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-bold">+3</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-sm">Niveau Facile 2</div>
                    <div className="text-xs text-gray-600">Hier</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-bold">+3</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-sm">Badge débloqué</div>
                    <div className="text-xs text-gray-600">Il y a 2 jours</div>
                  </div>
                  <div className="text-lg">🏆</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section de motivation */}
        <Card className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl border-0">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Continue comme ça ! 🚀</h2>
            <p className="mb-4">Tu es sur la bonne voie pour devenir un maître des mots !</p>
            <div className="flex justify-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm opacity-80">niveaux jusqu'au prochain badge</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm opacity-80">étoiles jusqu'au niveau Moyen</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
