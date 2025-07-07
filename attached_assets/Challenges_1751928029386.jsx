import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Clock, Target, AlertCircle } from "lucide-react";
import { useChallenges } from "@/components/hooks/useChallenges";
import BaseCard from "@/components/shared/BaseCard";
import LoadingCard from "@/components/shared/LoadingCard";

const categories = [
  { name: "All Categories", slug: "all" },
  { name: "Mindfulness", slug: "mindfulness" },
  { name: "Nutrition", slug: "nutrition" },
  { name: "Fitness", slug: "fitness" },
  { name: "Sleep", slug: "sleep" },
  { name: "Detox", slug: "detox" },
  { name: "Self-Care", slug: "self-care" }
];

const difficulties = [
  { name: "All Levels", slug: "all" },
  { name: "Beginner", slug: "beginner" },
  { name: "Intermediate", slug: "intermediate" },
  { name: "Advanced", slug: "advanced" }
];

const difficultyColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800"
};

const categoryColors = {
  mindfulness: "bg-purple-100 text-purple-800",
  nutrition: "bg-green-100 text-green-800",
  fitness: "bg-orange-100 text-orange-800",
  sleep: "bg-blue-100 text-blue-800",
  detox: "bg-teal-100 text-teal-800",
  "self-care": "bg-pink-100 text-pink-800"
};

export default function Challenges() {
  const {
    filteredChallenges,
    filters,
    isLoading,
    hasError,
    updateFilters,
    joinChallenge,
    getChallengeProgress,
    currentUser,
    totalChallenges,
    filteredCount,
    activeCount,
    completedCount
  } = useChallenges({
    initialFilters: { category: 'all', difficulty: 'all' },
    autoFetch: true
  });

  const handleJoinChallenge = async (challengeId) => {
    try {
      await joinChallenge(challengeId);
      // Challenge joined successfully - the hook will update the state
    } catch (error) {
      console.error('Failed to join challenge:', error);
      alert('Failed to join challenge. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">Wellness Challenges</h1>
              <p className="text-xl text-muted-foreground">Transform your wellness journey one challenge at a time</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingCard key={i} type="challenge" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Unable to Load Challenges</h2>
          <p className="text-muted-foreground mb-6">There was an issue loading the challenges.</p>
          <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary/90">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-primary mr-3" />
              <span className="text-primary font-medium uppercase tracking-wider">Wellness Challenges</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Transform Your Wellness Journey
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join structured challenges designed to build lasting wellness habits and achieve your health goals.
            </p>
            
            {/* User Stats */}
            {currentUser && (
              <div className="flex justify-center gap-8 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{activeCount}</div>
                  <div className="text-sm text-muted-foreground">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{completedCount}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-12">
          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 text-center">Filter by Category</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.slug}
                  variant={filters.category === cat.slug ? "default" : "outline"}
                  onClick={() => updateFilters({ category: cat.slug })}
                  className="rounded-full"
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 text-center">Filter by Difficulty</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {difficulties.map((diff) => (
                <Button
                  key={diff.slug}
                  variant={filters.difficulty === diff.slug ? "default" : "outline"}
                  onClick={() => updateFilters({ difficulty: diff.slug })}
                  className="rounded-full"
                >
                  {diff.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          {(filters.category !== 'all' || filters.difficulty !== 'all') && (
            <div className="text-center mb-8">
              <p className="text-muted-foreground">
                {filteredCount === 0 
                  ? 'No challenges found' 
                  : `Showing ${filteredCount} of ${totalChallenges} challenges`
                }
                {filters.category !== 'all' && ` in ${filters.category}`}
                {filters.difficulty !== 'all' && ` for ${filters.difficulty} level`}
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No challenges found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filter criteria to see more challenges.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredChallenges.map((challenge) => {
              const progress = getChallengeProgress(challenge.id);
              const isJoined = !!progress;
              const isCompleted = progress?.is_completed;

              return (
                <BaseCard
                  key={challenge.id}
                  title={challenge.title}
                  description={challenge.description}
                  image={challenge.image_url}
                  imageAlt={challenge.title}
                  href={`/challenges/${challenge.id}`}
                  badgeText={challenge.category}
                  badgeColor={categoryColors[challenge.category] || "bg-gray-100 text-gray-800"}
                  className="h-full"
                >
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {challenge.duration_days} days
                    </div>
                    <Badge className={difficultyColors[challenge.difficulty_level] || "bg-gray-100 text-gray-800"}>
                      {challenge.difficulty_level}
                    </Badge>
                  </div>

                  {isJoined ? (
                    <div className="space-y-2">
                      {isCompleted ? (
                        <Badge className="w-full bg-green-100 text-green-800 justify-center py-2">
                          <Trophy className="w-4 h-4 mr-1" />
                          Completed
                        </Badge>
                      ) : (
                        <>
                          <div className="text-sm text-muted-foreground">
                            Day {progress.current_day} of {challenge.duration_days}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(progress.current_day / challenge.duration_days) * 100}%` }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentUser) {
                          handleJoinChallenge(challenge.id);
                        } else {
                          alert('Please sign in to join challenges');
                        }
                      }}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Join Challenge
                    </Button>
                  )}
                </BaseCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}