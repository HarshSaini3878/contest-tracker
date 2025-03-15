import { Button } from "@/components/ui/button"
import { Bookmark, ExternalLink, Trophy } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ContestList({ contests, toggleBookmark, isBookmarked, showStartTime }) {
  if (contests.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-slate-50/30 dark:bg-slate-800/20 rounded-xl border border-slate-100/30 dark:border-slate-700/30">
        <Trophy className="h-8 w-8 mx-auto mb-2 opacity-40" />
        <p>No contests found.</p>
      </div>
    );
  }

  // Helper function to get platform-specific colors
  const getPlatformColors = (platform) => {
    const platformMap = {
      "Codeforces": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700/30",
      "LeetCode": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700/30",
      "HackerRank": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700/30",
      "CodeChef": "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700/30",
      "AtCoder": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-700/30",
      "TopCoder": "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-700/30",
      "HackerEarth": "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-700/30"
    };
    
    return platformMap[platform] || "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700/30";
  };

  return (
    <div className="overflow-x-auto rounded-xl">
      <Table className="border-collapse">
        <TableHeader className="bg-slate-50/30 dark:bg-slate-800/30 backdrop-blur-sm">
          <TableRow className="border-b border-slate-200/50 dark:border-slate-700/50">
            <TableHead className="font-medium text-slate-700 dark:text-slate-300">Name</TableHead>
            <TableHead className="font-medium text-slate-700 dark:text-slate-300">Platform</TableHead>
            {showStartTime ? (
              <TableHead className="font-medium text-slate-700 dark:text-slate-300">Start Time</TableHead>
            ) : (
              <TableHead className="font-medium text-slate-700 dark:text-slate-300">Solution URL</TableHead>
            )}
            <TableHead className="w-[100px] font-medium text-slate-700 dark:text-slate-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contests.map((contest, index) => (
            <TableRow 
              key={contest._id} 
              className={`
                border-b border-slate-200/50 dark:border-slate-700/50 
                hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors
                ${index % 2 === 0 ? 'bg-white/20 dark:bg-slate-900/20' : 'bg-white/10 dark:bg-slate-900/10'}
              `}
            >
              <TableCell className="font-medium text-slate-900 dark:text-slate-100">{contest.name}</TableCell>
              <TableCell>
                <div className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getPlatformColors(contest.platform)}`}>
                  {contest.platform}
                </div>
              </TableCell>
              {showStartTime ? (
                <TableCell className="text-slate-700 dark:text-slate-300">
                  {new Date(contest.startTime).toLocaleString()}
                </TableCell>
              ) : (
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild
                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-100/20 dark:hover:bg-blue-900/20"
                  >
                    <a href={contest.SolutionUrl} target="_blank" rel="noopener noreferrer">
                      View Solutions
                    </a>
                  </Button>
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleBookmark(contest)}
                    title={isBookmarked(contest._id) ? "Remove bookmark" : "Bookmark contest"}
                    className="hover:bg-amber-100/20 dark:hover:bg-amber-900/20 transition-colors"
                  >
                    <Bookmark 
                      className={`h-4 w-4 ${
                        isBookmarked(contest._id) 
                          ? "fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" 
                          : "text-slate-500 dark:text-slate-400"
                      }`} 
                    />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    asChild 
                    title="Visit contest page"
                    className="hover:bg-blue-100/20 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <a href={contest.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </a>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}