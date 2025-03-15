"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bookmark, Calendar, Clock, RefreshCw, Sparkles } from "lucide-react"
import ContestList from "./ContestList"
import ThemeToggle from "./ThemeToggle"
import { Badge } from "./ui/badge"
import { Skeleton } from "./ui/skeleton"

export default function ContestTracker() {
  const [contests, setContests] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [sortPlatform, setSortPlatform] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchContests()
    loadBookmarks()
  }, [])

  const fetchContests = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("http://localhost:5000/api/contests")
      console.log(response.data);
      if (response.data?.success && Array.isArray(response.data.data)) {
        setContests(response.data.data)
      } else {
        setError("Unexpected API response format")
        setContests([])
      }
    } catch (error) {
      setError("Error fetching contests. Please try again later.")
      console.error("Error fetching contests:", error)
      setContests([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadBookmarks = () => {
    const saved = JSON.parse(localStorage.getItem("bookmarkedContests") || "[]")
    setBookmarks(saved)
  }

  const toggleBookmark = (contest) => {
    let updatedBookmarks
    if (bookmarks.some((b) => b._id === contest._id)) {
      updatedBookmarks = bookmarks.filter((b) => b._id !== contest._id)
    } else {
      updatedBookmarks = [...bookmarks, contest]
    }
    setBookmarks(updatedBookmarks)
    localStorage.setItem("bookmarkedContests", JSON.stringify(updatedBookmarks))
  }

  const isBookmarked = (contestId) => {
    return bookmarks.some((b) => b._id === contestId)
  }

  const upcomingContests = contests
    .filter((c) => !c.duration.includes("Ended"))
    .filter((c) => sortPlatform === "all" || c.platform === sortPlatform)

  const endedContests = contests
    .filter((c) => c.duration.includes("Ended"))
    .filter((c) => sortPlatform === "all" || c.platform === sortPlatform)

  const platforms = Array.from(new Set(contests.map((c) => c.platform)))

  return (
    <div className="relative min-h-screen p-6 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
    
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-400 opacity-10 blur-3xl dark:bg-blue-600"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-purple-400 opacity-10 blur-3xl dark:bg-purple-600"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 backdrop-blur-sm bg-white/30 dark:bg-slate-900/40 p-6 rounded-2xl border border-white/20 shadow-lg">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              Contest Tracker
            </h1>
            <p className="text-slate-600 dark:text-slate-300">Track programming contests across different platforms</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>

        {error && (
          <div className="backdrop-blur-sm bg-red-50/60 text-red-600 dark:bg-red-900/40 dark:text-red-300 p-4 rounded-xl border border-red-200 dark:border-red-800/40">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 backdrop-blur-sm bg-white/40 dark:bg-slate-900/40 p-4 rounded-xl border border-white/20 shadow-md">
          <div className="w-full sm:w-auto">
            <Select value={sortPlatform} onValueChange={setSortPlatform}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
                <SelectItem value="all">All Platforms</SelectItem>
                {platforms.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="outline" 
            onClick={fetchContests} 
            disabled={isLoading}
            className="bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-700/70 border-white/20 dark:border-slate-700/50 transition-all"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isLoading ? "Refreshing..." : "Refresh Contests"}
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3 backdrop-blur-sm bg-white/40 dark:bg-slate-900/40 rounded-xl p-1 border border-white/20 dark:border-slate-700/50">
            <TabsTrigger 
              value="upcoming"
              className="data-[state=active]:bg-white/70 dark:data-[state=active]:bg-slate-800/70 data-[state=active]:backdrop-blur-md transition-all duration-300"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Upcoming
              <Badge variant="outline" className="ml-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40">
                {upcomingContests.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="ended"
              className="data-[state=active]:bg-white/70 dark:data-[state=active]:bg-slate-800/70 data-[state=active]:backdrop-blur-md transition-all duration-300"
            >
              <Clock className="h-4 w-4 mr-2" />
              Ended
              <Badge variant="outline" className="ml-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/40">
                {endedContests.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="bookmarked"
              className="data-[state=active]:bg-white/70 dark:data-[state=active]:bg-slate-800/70 data-[state=active]:backdrop-blur-md transition-all duration-300"
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Bookmarked
              <Badge variant="outline" className="ml-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40">
                {bookmarks.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <Card className="backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border border-white/20 dark:border-slate-700/50 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="   bg-gradient-to-r from-blue-500/10 to-blue-600/10 dark:from-blue-800/20 dark:to-blue-900/20 border-b border-blue-100/30 dark:border-blue-900/30 ">
                <CardTitle className=" flex items-center text-xl mt-6 w-full gap-2 text-blue-600 dark:text-blue-400">
                 <Sparkles className="h-6 w-6" /> Upcoming Contests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full bg-blue-100/50 dark:bg-slate-700/50" />
                    ))}
                  </div>
                ) : (
                  <ContestList
                    contests={upcomingContests}
                    toggleBookmark={toggleBookmark}
                    isBookmarked={isBookmarked}
                    showStartTime={true}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ended">
            <Card className="backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border border-white/20 dark:border-slate-700/50 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 dark:from-purple-800/20 dark:to-purple-900/20 border-b border-purple-100/30 dark:border-purple-900/30">
                <CardTitle className="flex items-center mt-6 text-xl gap-2 text-purple-600 dark:text-purple-400">
                  <Clock className="h-6 w-6" />
                  Recently Ended Contests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full bg-purple-100/50 dark:bg-slate-700/50" />
                    ))}
                  </div>
                ) : (
                  <ContestList
                    contests={endedContests}
                    toggleBookmark={toggleBookmark}
                    isBookmarked={isBookmarked}
                    showStartTime={false}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookmarked">
            <Card className="backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border border-white/20 dark:border-slate-700/50 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 dark:from-amber-800/20 dark:to-amber-900/20 border-b border-amber-100/30 dark:border-amber-900/30">
                <CardTitle className="flex text-xl mt-6 items-center gap-2 text-amber-600 dark:text-amber-400">
                  <Bookmark className="h-6 w-6" />
                  Bookmarked Contests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {bookmarks.length > 0 ? (
                  <ContestList
                    contests={bookmarks}
                    toggleBookmark={toggleBookmark}
                    isBookmarked={isBookmarked}
                    showStartTime={true}
                  />
                ) : (
                  <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-amber-50/30 dark:bg-amber-900/10 rounded-xl border border-amber-100/30 dark:border-amber-800/30">
                    <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p>No contests bookmarked. Bookmark contests to see them here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}