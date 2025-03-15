import React from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, ExternalLink } from "lucide-react";

const ContestList = ({ contests, toggleBookmark, isBookmarked, showStartTime }) => {
  if (contests.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No contests found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Platform</th>
            {showStartTime && <th className="px-4 py-2 text-left">Start Time</th>}
            <th className="px-4 py-2 text-left w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contests.map((contest) => (
            <tr key={contest._id} className="border-b">
              <td className="px-4 py-2 font-medium">{contest.name}</td>
              <td className="px-4 py-2">
                <div className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                  {contest.platform}
                </div>
              </td>
              {showStartTime && <td className="px-4 py-2">{new Date(contest.startTime).toLocaleString()}</td>}
              <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleBookmark(contest)}
                    title={isBookmarked(contest._id) ? "Remove bookmark" : "Bookmark contest"}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked(contest._id) ? "fill-primary" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="icon" title="Visit contest page">
                    <a href={contest.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContestList;
