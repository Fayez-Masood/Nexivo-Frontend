"use client";
import React from "react";
import { useTutorial } from "@/components/tutorial/TutorialProvider";

export function SkipTutorialButton() {
  const { skipTutorial, tutorialSteps, loading } = useTutorial();

  if (loading) return null;

  const isTutorialActive =
    !tutorialSteps.includes(9) && !tutorialSteps.includes(-1);

  if (!isTutorialActive) return null;

  return (
    <button
      onClick={() => {
        if (confirm("Skip the tutorial? This will mark it as finished.")) {
          skipTutorial();
        }
      }}
      className="skip-tutorial-btn w-full px-3 py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
    >
      Skip tutorial
    </button>
  );
}
