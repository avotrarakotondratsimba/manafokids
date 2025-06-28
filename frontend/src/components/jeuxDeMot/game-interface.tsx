"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {  Star, CheckCircle } from "lucide-react"

interface GameInterfaceProps {
  level: "facile" | "moyen" | "difficile"
  onBack: () => void
  onComplete: (stars: number) => void
}

const WORD_THEMES = {
  facile: {
    animals: ["CHAT", "CHIEN", "OISEAU", "POISSON"],
    colors: ["ROUGE", "BLEU", "VERT", "JAUNE"],
    fruits: ["POMME", "POIRE", "ORANGE", "BANANE"],
  },
  moyen: {
    technology: ["ORDINATEUR", "TELEPHONE", "INTERNET", "ROBOT"],
    science: ["PLANETE", "ETOILE", "TELESCOPE", "LABORATOIRE"],
    nature: ["MONTAGNE", "RIVIERE", "FORET", "DESERT"],
  },
  difficile: {
    advanced: ["PHOTOSYNTHESE", "BIODIVERSITE", "ECOSYSTEME", "ATMOSPHERE"],
    geography: ["CONTINENT", "ARCHIPEL", "MERIDIEN", "EQUATEUR"],
    history: ["CIVILISATION", "ARCHEOLOGIE", "PATRIMOINE", "MONUMENT"],
  },
}

export default function GameInterface({ level, onBack, onComplete }: GameInterfaceProps) {
  const [grid, setGrid] = useState<string[][]>([])
  const [wordsToFind, setWordsToFind] = useState<string[]>([])
  const [foundWords, setFoundWords] = useState<string[]>([])
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [, setGameCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const gridSize = level === "facile" ? 8 : level === "moyen" ? 10 : 12

  useEffect(() => {
    generateGrid()
  }, [level])

const generateGrid = () => {
  const themes = WORD_THEMES[level]
  const allWords = Object.values(themes).flat()
  const selectedWords = allWords.slice(0, level === "facile" ? 4 : level === "moyen" ? 6 : 8)

  setWordsToFind(selectedWords)

  const newGrid = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(""))

  // Placer les mots horizontalement dans la grille
  selectedWords.forEach((word, index) => {
    const row = Math.floor(index / 2) * 2
    const col = (index % 2) * 4

    for (let i = 0; i < word.length && col + i < gridSize; i++) {
      newGrid[row][col + i] = word[i]
    }
  })

  // ✅ Lister toutes les lettres des mots placés
  const requiredLetters = selectedWords.join("").split("")

  // ✅ Remplir les cases vides avec des lettres ALÉATOIRES
  // mais en forçant l'inclusion de toutes les lettres utiles
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const flatGrid = newGrid.flat()
  const lettersInGrid = flatGrid.filter((l) => l !== "")

  const missingLetters = requiredLetters.filter(
    (char) => !lettersInGrid.includes(char)
  )

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (newGrid[row][col] === "") {
        if (missingLetters.length > 0) {
          // ⚠️ Forcer une lettre manquante
          const nextLetter = missingLetters.pop()!
          newGrid[row][col] = nextLetter
        } else {
          // Lettre totalement aléatoire
          const randomChar = alphabet[Math.floor(Math.random() * 26)]
          newGrid[row][col] = randomChar
        }
      }
    }
  }

  setGrid(newGrid)
}



  const handleCellClick = (row: number, col: number) => {
    if (!isSelecting) {
      setIsSelecting(true)
      setSelectedCells([{ row, col }])
    } else {
      const newSelection = [...selectedCells, { row, col }]
      setSelectedCells(newSelection)
    }
  }

  const handleSubmit = () => {
    if (selectedCells.length === 0) return

    // Construire le mot sélectionné
    const selectedWord = selectedCells.map((cell) => grid[cell.row][cell.col]).join("")

    // Vérifier si le mot est dans la liste
    if (wordsToFind.includes(selectedWord) && !foundWords.includes(selectedWord)) {
      setFoundWords([...foundWords, selectedWord])

      // Vérifier si tous les mots sont trouvés
    if (foundWords.length + 1 === wordsToFind.length) {
  setGameCompleted(true)
  setShowCelebration(true)

  // Met à jour la progression dans localStorage
  const nextLevel = level === "facile" ? "moyen" : level === "moyen" ? "difficile" : null
  const unlocked = JSON.parse(localStorage.getItem("unlockedLevels") || "{}")
  const updated = {
    ...unlocked,
    [level]: true,
    ...(nextLevel ? { [nextLevel]: true } : {}),
  }
  localStorage.setItem("unlockedLevels", JSON.stringify(updated))

  setTimeout(() => {
    const stars = level === "facile" ? 3 : level === "moyen" ? 5 : 7
    onComplete(stars)
  }, 3000)
}

    }

    setSelectedCells([])
    setIsSelecting(false)
  }

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some((cell) => cell.row === row && cell.col === col)
  }

  const isCellInFoundWord = (row: number, col: number) => {
    // Logique simplifiée pour marquer les cellules des mots trouvés
    return foundWords.length > 0 && row < 4 && col < 6
  }

  const progress = (foundWords.length / wordsToFind.length) * 100
  

  return (
    <div className="min-h-screen  dark:to-blue-900/20 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Niveau {level.charAt(0).toUpperCase() + level.slice(1)}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={progress} className="w-32 h-2 bg-white/20" />
              <span className="text-white text-sm">
                {foundWords.length}/{wordsToFind.length}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
            <Star className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-bold">
              {level === "facile" ? "3" : level === "moyen" ? "5" : "7"} étoiles
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* Grille de jeu */}
          <Card className="bg-white/95 shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-extrabold bg-blue-00 text-transparent bg-clip-text">Trouve les mots cachés !</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-center p-4">
                <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
                  {grid.map((row, rowIndex) =>
                    row.map((letter, colIndex) => (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        className={`
            w-10 h-10 rounded-lg font-bold text-lg transition-all duration-200 
            border-2 shadow-md hover:shadow-lg transform hover:scale-105
            ${
              isCellSelected(rowIndex, colIndex)
                ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white border-blue-300 shadow-blue-200"
                : isCellInFoundWord(rowIndex, colIndex)
                  ? "bg-gradient-to-br from-green-300 to-green-500 text-green-900 border-green-400 shadow-green-200"
                  : "bg-gradient-to-br from-white to-gray-50 text-gray-800 border-gray-200 hover:from-blue-50 hover:to-blue-100 hover:border-blue-300"
            }
            active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
          `}
                      >
                        {letter}
                      </button>
                    )),
                  )}
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button
                  onClick={handleSubmit}
                  disabled={selectedCells.length === 0}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  ✨ Valider la sélection
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Panneau latéral */}
          <div className="space-y-4">
            {/* Mots à trouver */}
            <Card className="bg-white/95 shadow-xl border-0 text-blue-800 font-semibold">
              <CardHeader>
                <CardTitle className="text-xl font-extrabold bg-gradient-to-r from-pink-500 via-orange-500 to-purple-500 text-transparent bg-clip-text ">Mots à trouver</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {wordsToFind.map((word) => (
                    <div
                      key={word}
                      className={`
                        flex items-center justify-between p-2 rounded
                        ${foundWords.includes(word) ? "bg-green-100 text-green-800" : "bg-gray-100"}
                      `}
                    >
                      <span className={foundWords.includes(word) ? "line-through" : ""}>{word}</span>
                      {foundWords.includes(word) && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Thèmes */}
            <Card className="bg-white/95 shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-lg font-extrabold bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 text-transparent bg-clip-text">Thèmes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.keys(WORD_THEMES[level]).map((theme) => (
                    <Badge key={theme} variant="outline" className="mr-2 h-10 px-3 py-1 text-sm font-semibold bg-gradient-to-r from-blue-200 to-blue-400 text-blue-800">
                      {theme === "animals"
                        ? "🐾 Animaux"
                        : theme === "colors"
                          ? "🎨 Couleurs"
                          : theme === "fruits"
                            ? "🍎 Fruits"
                            : theme === "technology"
                              ? "💻 Technologie"
                              : theme === "science"
                                ? "🔬 Science"
                                : theme === "nature"
                                  ? "🌿 Nature"
                                  : theme === "advanced"
                                    ? "🧬 Avancé"
                                    : theme === "geography"
                                      ? "🌍 Géographie"
                                      : theme === "history"
                                        ? "🏛️ Histoire"
                                        : theme}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Animation de célébration */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-white p-8 text-center max-w-md mx-4">
              <div className="space-y-4">
                <div className="text-6xl">🎉</div>
                <h2 className="text-2xl font-bold text-green-600">Félicitations !</h2>
                <p className="text-gray-600">Tu as trouvé tous les mots du niveau {level} !</p>
                <div className="flex justify-center gap-1">
                  {Array.from({ length: level === "facile" ? 3 : level === "moyen" ? 5 : 7 }).map((_, i) => (
                    <Star key={i} className="w-8 h-8 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  +{level === "facile" ? 3 : level === "moyen" ? 5 : 7} étoiles gagnées !
                </p>
                
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
