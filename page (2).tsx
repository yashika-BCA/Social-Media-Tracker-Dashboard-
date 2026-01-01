"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Trophy,
  Youtube,
  Instagram,
  Linkedin,
  Clock,
  Sparkles,
  RefreshCw,
  Sun,
  Moon,
  Facebook,
  CalendarIcon,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SocialStats {
  youtube: { followers: string; views: string; growth: string }
  instagram: { followers: string; views: string; growth: string }
  linkedin: { followers: string; views: string; growth: string }
}

interface BaselineStats {
  youtube: { followers: number; views: number }
  instagram: { followers: number; views: number }
  linkedin: { followers: number; views: number }
}

interface ContentChecklist {
  youtubeShorts: boolean[]
  youtubeCommunity: boolean[]
  digitalArt: boolean[]
  linkedinPost: boolean[]
}

interface Achievements {
  sevenDay: boolean
  thirtyDay: boolean
  sixMonth: boolean
  oneYear: boolean
}

interface StreakData {
  currentStreak: number
  lastCheckIn: string // YYYY-MM-DD
  history: string[] // List of completed dates
}

interface Mood {
  emoji: string
  label: string
}

const toggleChecklistItem = (
  category: keyof ContentChecklist,
  index: number,
  setChecklist: React.Dispatch<React.SetStateAction<ContentChecklist>>,
) => {
  setChecklist((prev) => ({
    ...prev,
    [category]: prev[category].map((item, i) => (i === index ? !item : item)),
  }))
}

const QUOTES = [
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  {
    text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
    author: "Steve Jobs",
  },
  { text: "Consistency is what transforms average into excellence.", author: "Unknown" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
]

const MOODS: Mood[] = [
  { emoji: "😊", label: "Happy & Positive" },
  { emoji: "🚀", label: "Highly Productive" },
  { emoji: "💪", label: "Strong & Disciplined" },
  { emoji: "✨", label: "Creative & Inspired" },
  { emoji: "🔥", label: "On Fire!" },
  { emoji: "🎯", label: "Focused & Determined" },
  { emoji: "💡", label: "Idea Mode" },
  { emoji: "🌟", label: "Legacy Building" },
]

export default function SocialDashboard() {
  const { toast } = useToast()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedMood, setSelectedMood] = useState(MOODS[0])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [fbAutoSync, setFbAutoSync] = useState(false)
  const [winOfTheDay, setWinOfTheDay] = useState("")

  const [baselineStats, setBaselineStats] = useState<BaselineStats | null>(null)
  const [showBaselineSetup, setShowBaselineSetup] = useState(false)
  const [baselineInputs, setBaselineInputs] = useState({
    youtube: { followers: "", views: "" },
    instagram: { followers: "", views: "" },
    linkedin: { followers: "", views: "" },
  })

  const [socialStats, setSocialStats] = useState<SocialStats>({
    youtube: { followers: "", views: "", growth: "" },
    instagram: { followers: "", views: "", growth: "" },
    linkedin: { followers: "", views: "", growth: "" },
  })

  const [checklist, setChecklist] = useState<ContentChecklist>({
    youtubeShorts: [false],
    youtubeCommunity: [false, false],
    digitalArt: [false, false],
    linkedinPost: [false, false],
  })

  const [achievements, setAchievements] = useState<Achievements>({
    sevenDay: false,
    thirtyDay: false,
    sixMonth: false,
    oneYear: false,
  })

  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    lastCheckIn: "",
    history: [],
  })

  const [dailyQuote, setDailyQuote] = useState(QUOTES[0])
  const [countdown, setCountdown] = useState("")
  const [hasNotified, setHasNotified] = useState(false)

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("socialDashboard")
    const today = new Date().toISOString().split("T")[0]

    if (saved) {
      const data = JSON.parse(saved)
      const lastVisit = data.lastVisitDate || ""

      if (lastVisit && lastVisit !== today) {
        setChecklist({
          youtubeShorts: Array(1).fill(false),
          youtubeCommunity: Array(1).fill(false),
          digitalArt: Array(1).fill(false),
          linkedinPost: Array(1).fill(false),
        })
        setSelectedMood(MOODS[0])
        setWinOfTheDay("")
      } else {
        setChecklist(data.checklist || checklist)
        setSelectedMood(data.selectedMood || MOODS[0])
        setWinOfTheDay(data.winOfTheDay || "")
      }

      setSocialStats(data.socialStats || socialStats)
      setIsDarkMode(data.isDarkMode || false)
      setFbAutoSync(data.fbAutoSync || false)
      setAchievements(data.achievements || achievements)
      setStreakData(data.streakData || { currentStreak: 0, lastCheckIn: "", history: [] })
    }

    const savedBaseline = localStorage.getItem("socialDashboardBaseline")
    if (savedBaseline) {
      setBaselineStats(JSON.parse(savedBaseline))
    } else {
      setShowBaselineSetup(true)
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    localStorage.setItem(
      "socialDashboard",
      JSON.stringify({
        socialStats,
        checklist,
        achievements,
        winOfTheDay,
        fbAutoSync,
        selectedMood,
        isDarkMode,
        streakData,
        lastVisitDate: today,
      }),
    )
  }, [socialStats, checklist, achievements, winOfTheDay, fbAutoSync, selectedMood, isDarkMode, streakData])

  const getTimeUntilPosting = () => {
    const now = new Date()
    const postingTime = new Date()
    postingTime.setHours(20, 30, 0, 0)

    if (now > postingTime) {
      postingTime.setDate(postingTime.getDate() + 1)
    }

    const diff = postingTime.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return `${hours}h ${minutes}m ${seconds}s`
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeUntilPosting()
      setCountdown(remaining)

      // Trigger notification when timer hits 0
      if (remaining === "0h 0m 0s" && !hasNotified) {
        toast({
          title: "Posting Time! 🚀",
          description: "It's 8:30 PM. Time to publish your daily content and build your legacy!",
          duration: 10000,
        })
        setHasNotified(true)

        // Play a subtle notification sound if browser allows
        try {
          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3")
          audio.volume = 0.5
          audio.play()
        } catch (e) {
          console.log("[v0] Audio playback failed:", e)
        }
      }

      // Reset notification state if it's no longer 8:30 PM (to be ready for next day)
      if (remaining !== "0h 0m 0s") {
        setHasNotified(false)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [hasNotified, toast])

  const calculateGrowth = (current: number, baseline: number): string => {
    if (baseline === 0) return "0"
    const growth = ((current - baseline) / baseline) * 100
    return growth.toFixed(1)
  }

  const updateSocialStat = (platform: keyof SocialStats, field: string, value: string) => {
    setSocialStats((prev) => {
      const updated = {
        ...prev,
        [platform]: { ...prev[platform], [field]: value },
      }

      // Auto-calculate growth if baseline exists and we have current numbers
      if (baselineStats && (field === "followers" || field === "views")) {
        const currentFollowers = Number.parseFloat(field === "followers" ? value : updated[platform].followers) || 0
        const currentViews = Number.parseFloat(field === "views" ? value : updated[platform].views) || 0
        const baselineFollowers = baselineStats[platform].followers
        const baselineViews = baselineStats[platform].views

        const followerGrowth = calculateGrowth(currentFollowers, baselineFollowers)
        const viewGrowth = calculateGrowth(currentViews, baselineViews)

        // Calculate average growth
        const avgGrowth = ((Number.parseFloat(followerGrowth) + Number.parseFloat(viewGrowth)) / 2).toFixed(1)
        updated[platform].growth = avgGrowth
      }

      return updated
    })
  }

  const saveBaseline = () => {
    const baseline: BaselineStats = {
      youtube: {
        followers: Number.parseFloat(baselineInputs.youtube.followers) || 0,
        views: Number.parseFloat(baselineInputs.youtube.views) || 0,
      },
      instagram: {
        followers: Number.parseFloat(baselineInputs.instagram.followers) || 0,
        views: Number.parseFloat(baselineInputs.instagram.views) || 0,
      },
      linkedin: {
        followers: Number.parseFloat(baselineInputs.linkedin.followers) || 0,
        views: Number.parseFloat(baselineInputs.linkedin.views) || 0,
      },
    }

    localStorage.setItem("socialDashboardBaseline", JSON.stringify(baseline))
    setBaselineStats(baseline)
    setShowBaselineSetup(false)
  }

  const handleDailySync = () => {
    const today = new Date().toISOString().split("T")[0]
    const allTasksCompleted = [
      ...checklist.youtubeShorts,
      ...checklist.youtubeCommunity,
      ...checklist.digitalArt,
      ...checklist.linkedinPost,
    ].every(Boolean)

    if (!allTasksCompleted) {
      alert("Complete all checklist tasks before syncing for streak!")
      return
    }

    if (streakData.lastCheckIn === today) {
      alert("You've already synced for today!")
      return
    }

    // Update streak logic
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split("T")[0]

    let newStreak = streakData.currentStreak
    if (streakData.lastCheckIn === yesterdayStr) {
      newStreak += 1
    } else if (streakData.lastCheckIn === "") {
      newStreak = 1
    } else {
      // Streak broken
      newStreak = 1
    }

    const updatedStreakData = {
      currentStreak: newStreak,
      lastCheckIn: today,
      history: [...streakData.history, today],
    }

    setStreakData(updatedStreakData)

    // Update Achievements based on streak
    setAchievements({
      sevenDay: newStreak >= 7,
      thirtyDay: newStreak >= 30,
      sixMonth: newStreak >= 180,
      oneYear: newStreak >= 365,
    })

    // Existing Baseline update logic
    setBaselineStats({
      youtube: Number(socialStats.youtube.followers),
      instagram: Number(socialStats.instagram.followers),
      linkedin: Number(socialStats.linkedin.followers),
    })

    // Reset inputs but keep current values as baseline
    setSocialStats({
      youtube: { followers: "", views: "", growth: socialStats.youtube.growth },
      instagram: { followers: "", views: "", growth: socialStats.instagram.growth },
      linkedin: { followers: "", views: "", growth: socialStats.linkedin.growth },
    })

    alert(`Sync Successful! Current Streak: ${newStreak} days.`)
  }

  const totalTasks = [
    ...checklist.youtubeShorts,
    ...checklist.youtubeCommunity,
    ...checklist.digitalArt,
    ...checklist.linkedinPost,
  ].length
  const completedTasks = [
    ...checklist.youtubeShorts,
    ...checklist.youtubeCommunity,
    ...checklist.digitalArt,
    ...checklist.linkedinPost,
  ].filter(Boolean).length

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen animated-gradient text-foreground p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {showBaselineSetup && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="glass-card max-w-2xl w-full">
                <CardHeader>
                  <CardTitle className="text-2xl">Set Your Starting Stats</CardTitle>
                  <CardDescription>
                    Enter your current follower and view counts as your baseline. Growth will be calculated from these
                    numbers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* YouTube Baseline */}
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2 text-red-600 dark:text-red-400">
                      <Youtube className="w-5 h-5" />
                      YouTube
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Followers</Label>
                        <Input
                          type="number"
                          value={baselineInputs.youtube.followers}
                          onChange={(e) =>
                            setBaselineInputs((prev) => ({
                              ...prev,
                              youtube: { ...prev.youtube, followers: e.target.value },
                            }))
                          }
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Views</Label>
                        <Input
                          type="number"
                          value={baselineInputs.youtube.views}
                          onChange={(e) =>
                            setBaselineInputs((prev) => ({
                              ...prev,
                              youtube: { ...prev.youtube, views: e.target.value },
                            }))
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Instagram Baseline */}
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2 text-pink-600 dark:text-pink-400">
                      <Instagram className="w-5 h-5" />
                      Instagram
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Followers</Label>
                        <Input
                          type="number"
                          value={baselineInputs.instagram.followers}
                          onChange={(e) =>
                            setBaselineInputs((prev) => ({
                              ...prev,
                              instagram: { ...prev.instagram, followers: e.target.value },
                            }))
                          }
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Views</Label>
                        <Input
                          type="number"
                          value={baselineInputs.instagram.views}
                          onChange={(e) =>
                            setBaselineInputs((prev) => ({
                              ...prev,
                              instagram: { ...prev.instagram, views: e.target.value },
                            }))
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* LinkedIn Baseline */}
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Linkedin className="w-5 h-5" />
                      LinkedIn
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Followers</Label>
                        <Input
                          type="number"
                          value={baselineInputs.linkedin.followers}
                          onChange={(e) =>
                            setBaselineInputs((prev) => ({
                              ...prev,
                              linkedin: { ...prev.linkedin, followers: e.target.value },
                            }))
                          }
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Views</Label>
                        <Input
                          type="number"
                          value={baselineInputs.linkedin.views}
                          onChange={(e) =>
                            setBaselineInputs((prev) => ({
                              ...prev,
                              linkedin: { ...prev.linkedin, views: e.target.value },
                            }))
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={saveBaseline} className="w-full">
                    Save Baseline Stats
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-balance bg-gradient-to-r from-accent via-primary to-chart-2 bg-clip-text text-transparent">
                  Yashika Sorani
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mt-1 text-pretty">
                  Building a Legacy, One Post at a Time.
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Dark Mode Toggle */}
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                  <Moon className="w-4 h-4" />
                </div>

                {/* Glass Card for Clock & Date */}
                <Card className="glass-card border-2">
                  <CardContent className="p-3">
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 border-b sm:border-b-0 sm:border-r border-white/20 pb-2 sm:pb-0 sm:pr-4">
                        <CalendarIcon className="w-5 h-5 text-primary" />
                        <span className="text-sm font-semibold whitespace-nowrap">
                          {currentTime.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pt-1 sm:pt-0">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="font-mono text-lg font-semibold">{currentTime.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Glass Card for Mood Picker */}
            <Card className="glass-card bg-gradient-to-r from-accent/20 to-primary/10 border-2 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex items-center gap-3 flex-wrap justify-center">
                    <Label className="text-sm font-semibold mr-2">Mood of the Day:</Label>
                    {MOODS.map((mood) => (
                      <button
                        key={mood.emoji}
                        onClick={() => setSelectedMood(mood)}
                        className={`text-2xl transition-all duration-300 relative group ${
                          selectedMood.emoji === mood.emoji
                            ? "scale-150 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10"
                            : "hover:scale-125 opacity-60 hover:opacity-100"
                        }`}
                        title={mood.label}
                      >
                        {mood.emoji}
                        {selectedMood.emoji === mood.emoji && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 px-4 py-2 rounded-full border border-white/20 animate-in fade-in slide-in-from-left duration-500">
                    <span className="text-4xl animate-bounce">{selectedMood.emoji}</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Current Vibe</span>
                      <span className="text-sm font-medium whitespace-nowrap">{selectedMood.label}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </header>

          {/* Impact Counter */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Impact Counter
              <Button onClick={handleDailySync} variant="outline" size="sm" className="ml-auto bg-transparent">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Day & Track Streak
              </Button>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Glass Card for YouTube */}
              <Card className="glass-card bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border-2 border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <Youtube className="w-5 h-5" />
                    YouTube
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs">Followers</Label>
                    <Input
                      value={socialStats.youtube.followers}
                      onChange={(e) => updateSocialStat("youtube", "followers", e.target.value)}
                      placeholder="0"
                      className="bg-white/50 dark:bg-black/20"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Views</Label>
                    <Input
                      value={socialStats.youtube.views}
                      onChange={(e) => updateSocialStat("youtube", "views", e.target.value)}
                      placeholder="0"
                      className="bg-white/50 dark:bg-black/20"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Growth %</Label>
                    <Input
                      value={socialStats.youtube.growth}
                      onChange={(e) => updateSocialStat("youtube", "growth", e.target.value)}
                      placeholder="0%"
                      className="bg-white/50 dark:bg-black/20"
                      readOnly
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Glass Card for Instagram */}
              <Card className="glass-card bg-gradient-to-br from-pink-50 to-purple-100 dark:from-pink-950/30 dark:to-purple-900/20 border-2 border-pink-200 dark:border-pink-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-pink-700 dark:text-pink-400">
                    <Instagram className="w-5 h-5" />
                    Instagram
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs">Followers</Label>
                    <Input
                      value={socialStats.instagram.followers}
                      onChange={(e) => updateSocialStat("instagram", "followers", e.target.value)}
                      placeholder="0"
                      className="bg-white/50 dark:bg-black/20"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Views</Label>
                    <Input
                      value={socialStats.instagram.views}
                      onChange={(e) => updateSocialStat("instagram", "views", e.target.value)}
                      placeholder="0"
                      className="bg-white/50 dark:bg-black/20"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Growth %</Label>
                    <Input
                      value={socialStats.instagram.growth}
                      onChange={(e) => updateSocialStat("instagram", "growth", e.target.value)}
                      placeholder="0%"
                      className="bg-white/50 dark:bg-black/20"
                      readOnly
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Glass Card for LinkedIn */}
              <Card className="glass-card bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950/30 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <Linkedin className="w-5 h-5" />
                    LinkedIn
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs">Followers</Label>
                    <Input
                      value={socialStats.linkedin.followers}
                      onChange={(e) => updateSocialStat("linkedin", "followers", e.target.value)}
                      placeholder="0"
                      className="bg-white/50 dark:bg-black/20"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Views</Label>
                    <Input
                      value={socialStats.linkedin.views}
                      onChange={(e) => updateSocialStat("linkedin", "views", e.target.value)}
                      placeholder="0"
                      className="bg-white/50 dark:bg-black/20"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Growth %</Label>
                    <Input
                      value={socialStats.linkedin.growth}
                      onChange={(e) => updateSocialStat("linkedin", "growth", e.target.value)}
                      placeholder="0%"
                      className="bg-white/50 dark:bg-black/20"
                      readOnly
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Matrix */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-2xl">📝</span>
                The Content Matrix
              </h2>

              {/* Glass Card for YouTube Content */}
              <Card className="glass-card bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20 backdrop-blur-sm border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Youtube className="w-5 h-5 text-red-600" />
                    YouTube Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-semibold mb-2 block">CS Shorts</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={checklist.youtubeShorts[0]}
                          onCheckedChange={() => toggleChecklistItem("youtubeShorts", 0, setChecklist)}
                        />
                        <Label className="cursor-pointer">Daily CS Short (Upload & Optimize)</Label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="font-semibold mb-2 block">Community Posts (Engagement/Festivals)</Label>
                    <div className="space-y-2">
                      {["Engagement Post", "Festival Post"].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Checkbox
                            checked={checklist.youtubeCommunity[index]}
                            onCheckedChange={() => toggleChecklistItem("youtubeCommunity", index, setChecklist)}
                          />
                          <Label className="cursor-pointer">{item}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Glass Card for Instagram/Facebook */}
              <Card className="glass-card bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 backdrop-blur-sm border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Instagram className="w-5 h-5 text-pink-600" />
                    Instagram / Facebook
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-semibold mb-2 block">Content Tasks</Label>
                    <div className="space-y-2">
                      {["Primary Post: MS Paint Digital Art", "Secondary Post: Promotion / Behind the Scenes"].map(
                        (item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Checkbox
                              checked={checklist.digitalArt[index]}
                              onCheckedChange={() => toggleChecklistItem("digitalArt", index, setChecklist)}
                            />
                            <Label className="cursor-pointer">{item}</Label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-white/20">
                    <div className="flex items-center gap-2">
                      <Facebook className="w-5 h-5 text-blue-600" />
                      <Label>Facebook Auto-Sync</Label>
                    </div>
                    <Switch checked={fbAutoSync} onCheckedChange={setFbAutoSync} />
                  </div>
                </CardContent>
              </Card>

              {/* Glass Card for LinkedIn */}
              <Card className="glass-card bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-900/20 backdrop-blur-sm border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    Professional Career/Coding Post
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-semibold mb-2 block">Professional Career/Coding Post</Label>
                    <div className="space-y-2">
                      {["Career Update", "Coding Insight"].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Checkbox
                            checked={checklist.linkedinPost[index]}
                            onCheckedChange={() => toggleChecklistItem("linkedinPost", index, setChecklist)}
                          />
                          <Label className="cursor-pointer">{item}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Glass Card for Global Posting Timer */}
              <Card className="glass-card bg-gradient-to-r from-primary/20 via-accent/20 to-chart-2/20 backdrop-blur-sm border-2 border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-center justify-center">
                    <Clock className="w-6 h-6" />
                    Global Posting Timer
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Time Until Batch Posting (8:30 PM)</p>
                    <p className="text-4xl font-bold font-mono bg-gradient-to-r from-primary via-accent to-chart-2 bg-clip-text text-transparent">
                      {countdown}
                    </p>
                  </div>
                  <Button className="w-full" size="lg">
                    Start Posting Session
                  </Button>
                </CardContent>
              </Card>

              {/* Glass Card for Vision Board */}
              <Card className="glass-card bg-gradient-to-br from-amber-50/50 to-yellow-50/50 dark:from-amber-950/20 dark:to-yellow-900/20 backdrop-blur-sm border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    Today&apos;s Big Win
                  </CardTitle>
                  <CardDescription>Write down your daily success and celebrate it!</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={winOfTheDay}
                    onChange={(e) => setWinOfTheDay(e.target.value)}
                    placeholder="Today, I achieved..."
                    className="min-h-24 bg-white/50 dark:bg-black/20"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Trophy Room Sidebar */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                The Trophy Room
              </h2>

              {/* Glass Card for Trophy Room */}
              <Card className="glass-card bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950/30 dark:to-yellow-900/30 border-2 border-amber-200 dark:border-amber-800">
                <CardHeader>
                  <CardTitle>Gamified Rewards</CardTitle>
                  <CardDescription>
                    Current Streak: <span className="font-bold text-primary">{streakData.currentStreak} Days</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 7-Day Streak */}
                  <div
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievements.sevenDay
                        ? "bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 border-amber-300 dark:border-amber-700"
                        : "bg-muted/50 border-border opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Trophy
                        className={`w-8 h-8 ${achievements.sevenDay ? "text-amber-600" : "text-muted-foreground"}`}
                      />
                      <div>
                        <p className="font-semibold">7-Day Streak</p>
                        <p className="text-xs text-muted-foreground">Consistency Champion</p>
                      </div>
                    </div>
                  </div>

                  {/* 30-Day Streak */}
                  <div
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievements.thirtyDay
                        ? "bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 border-amber-300 dark:border-amber-700"
                        : "bg-muted/50 border-border opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Trophy
                        className={`w-8 h-8 ${achievements.thirtyDay ? "text-amber-600" : "text-muted-foreground"}`}
                      />
                      <div>
                        <p className="font-semibold">30-Day Streak</p>
                        <p className="text-xs text-muted-foreground">Dedication Master</p>
                      </div>
                    </div>
                  </div>

                  {/* 6-Month Streak */}
                  <div
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievements.sixMonth
                        ? "bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 border-amber-300 dark:border-amber-700"
                        : "bg-muted/50 border-border opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Trophy
                        className={`w-8 h-8 ${achievements.sixMonth ? "text-amber-600" : "text-muted-foreground"}`}
                      />
                      <div>
                        <p className="font-semibold">6-Month Streak</p>
                        <p className="text-xs text-muted-foreground">Elite Performer</p>
                      </div>
                    </div>
                  </div>

                  {/* 1-Year Streak */}
                  <div
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievements.oneYear
                        ? "bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 border-amber-300 dark:border-amber-700"
                        : "bg-muted/50 border-border opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Trophy
                        className={`w-8 h-8 ${achievements.oneYear ? "text-amber-600" : "text-muted-foreground"}`}
                      />
                      <div>
                        <p className="font-semibold">1-Year Streak</p>
                        <p className="text-xs text-muted-foreground">Legend Status</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Glass Card for Motivational Quote */}
              <Card className="glass-card bg-gradient-to-br from-primary/10 to-accent/10 border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Daily Inspiration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <blockquote className="italic text-sm text-muted-foreground text-pretty">
                    &quot;{dailyQuote.text}&quot;
                    <footer className="mt-2 text-xs font-semibold">— {dailyQuote.author}</footer>
                  </blockquote>
                </CardContent>
              </Card>

              {/* Glass Card for Quick Stats */}
              <Card className="glass-card bg-gradient-to-br from-chart-2/10 to-chart-3/10 border-2">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tasks Completed Today</span>
                    <span className="font-bold text-lg">
                      {completedTasks}/{totalTasks}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                      style={{
                        width: `${(completedTasks / totalTasks) * 100}%`,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
