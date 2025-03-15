"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Bookmark, Calendar, Clock } from "lucide-react"
import  ContestList  from "./ContestList"
import  ThemeToggle  from "./ThemeToggle"
import { Badge } from "./ui/badge"
import { Skeleton } from "./ui/skeleton"



export default function ContestTracker() {
  const [contests, setContests] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [sortPlatform, setSortPlatform] = useState("")
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
    .filter((c) => !sortPlatform || c.platform === sortPlatform)

  const endedContests = contests
    .filter((c) => c.duration.includes("Ended"))
    .filter((c) => !sortPlatform || c.platform === sortPlatform)

  const platforms = Array.from(new Set(contests.map((c) => c.platform)))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contest Tracker</h1>
          <p className="text-muted-foreground">Track programming contests across different platforms</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      {error && <div className="bg-destructive/15 text-destructive p-4 rounded-md">{error}</div>}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <Select value={sortPlatform} onValueChange={setSortPlatform}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {platforms.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={fetchContests} disabled={isLoading}>
          {isLoading ? "Refreshing..." : "Refresh Contests"}
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming
            <Badge variant="outline" className="ml-2">
              {upcomingContests.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="ended">
            Ended
            <Badge variant="outline" className="ml-2">
              {endedContests.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="bookmarked">
            Bookmarked
            <Badge variant="outline" className="ml-2">
              {bookmarks.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Contests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recently Ended Contests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="h-5 w-5" />
                Bookmarked Contests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookmarks.length > 0 ? (
                <ContestList
                  contests={bookmarks}
                  toggleBookmark={toggleBookmark}
                  isBookmarked={isBookmarked}
                  showStartTime={true}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No contests bookmarked. Bookmark contests to see them here.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

