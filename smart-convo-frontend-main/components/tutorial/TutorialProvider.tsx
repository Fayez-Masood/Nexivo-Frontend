"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from "react";
import { driver } from "driver.js";
import Cookies from "js-cookie";
import "driver.js/dist/driver.css";



const TutorialContext = createContext<any>(null);

export const useTutorial = () => {
  const ctx = useContext(TutorialContext);
  if (!ctx) throw new Error("useTutorial must be used inside TutorialProvider");
  return ctx;
};

export const TutorialProvider = ({ children }: { children: React.ReactNode }) => {
  const [tutorialSteps, setTutorialSteps] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const driverRef = useRef<any>(null); // use ref instead of state




  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get("Token") || "";

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    }),
    [token]
  );

  const updateTutorialProgress = useCallback(
    (stepId: number) => {
      setTutorialSteps((prevSteps) => {
        if (prevSteps.includes(9) || prevSteps.includes(stepId)) return prevSteps; 
        const updatedSteps = [...prevSteps, stepId];
        console.log("Updating tutorial progress to:", updatedSteps);
        localStorage.setItem("tutorial_setup", JSON.stringify(updatedSteps));
        // send to backend
        fetch(`${BASE_URL}/companies/update_tutorial/`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ tutorial_setup: updatedSteps }),
        }).catch((err) => console.error("Error updating tutorial progress:", err));

        return updatedSteps;
      });
    },
    [BASE_URL, headers]
  );

  const handleTutorialClose = useCallback(() => {
  setTutorialSteps((prevSteps) => {
    // Avoid duplicates
    if (prevSteps.includes(-1) && prevSteps.includes(9)) return prevSteps;

    const updatedSteps = [...prevSteps];
    if (!updatedSteps.includes(9)) updatedSteps.push(9);
    if (!updatedSteps.includes(-1)) updatedSteps.push(-1);

    console.log("Closing tutorial, updating steps:", updatedSteps);

    // Send updated array to backend
    fetch(`${BASE_URL}/companies/update_tutorial/`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ tutorial_setup: updatedSteps }),
    }).catch((err) => console.error("Error updating tutorial on close:", err));

    return updatedSteps;
  });

  // Properly destroy driver instance if open
  if (driverRef.current) {
    driverRef.current.destroy();
    driverRef.current = null;
  }
}, [BASE_URL, headers]);


  // Fetch tutorial once on mount
  useEffect(() => {
  const fetchTutorialProgress = async () => {
    try {
      const res = await fetch(`${BASE_URL}/companies/get_tutorial/`, { method: "GET", headers });
      if (!res.ok) {
        return;
        // throw new Error("Failed to fetch tutorial progress");
      }

      const data = await res.json();
      const tutorialArray: number[] = data.tutorial_setup || [];
      console.log("Fetched tutorial progress:", tutorialArray);

      setTutorialSteps(tutorialArray);
    

      // If step 1 is not in the array, trigger it in the tutorial
      if (!tutorialArray.includes(1)) {
        // updateTutorialProgress(1); // mark step 1 for frontend
        // driverRef.current?.moveNext(); // highlight step 1 in driver.js
      }
    } catch (err) {
      console.error("Error fetching tutorial:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchTutorialProgress();
}, []);
// BASE_URL, headers, updateTutorialProgress, driverRef


  // Update tutorial progress (functional setState)
  
  // Skip tutorial
  // inside TutorialProvider (replace existing skipTutorial)
const skipTutorial = useCallback(() => {
  setTutorialSteps((prevSteps) => {
    // create updated array with 9 and -1 appended (no duplicates)
    const updated = [...prevSteps];
    if (!updated.includes(9)) updated.push(9);
    if (!updated.includes(-1)) updated.push(-1);

     localStorage.setItem("tutorial_setup", JSON.stringify(updated));

    // persist to backend
    fetch(`${BASE_URL}/companies/update_tutorial/`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ tutorial_setup: updated }),
    }).catch((err) => console.error("Error skipping tutorial:", err));

    return updated;
  });

  // destroy driver if running
  if (driverRef.current) {
    try {
      driverRef.current.destroy();
    } catch (e) {
      console.warn("Error destroying driver instance on skip:", e);
    } finally {
      driverRef.current = null;
    }
  }
}, [BASE_URL, headers]);

  // Start tutorial
  const startTutorial = useCallback(async (isModalOpen: boolean = false) => {
    if(tutorialSteps.includes(9)){
        
        return;
    }
  if (tutorialSteps.includes(-1)) return; // tutorial skipped
    if (tutorialSteps.includes(-1) || tutorialSteps.includes(9)) return;
  const pathname = window.location.pathname;
  const isAgentsPage = pathname === "/dashboard/agents";

const highlightAdditionalElement = (selector: string) => {
  const el = document.querySelector(selector);
  if (!el) return;

  el.classList.add("driver-highlighted-element");
};

  const steps: any[] = [];

  const stepsWithButtons = [3, 4, 6, 7];

// Helper to toggle footer buttons dynamically
// Helper to toggle footer buttons dynamically
const toggleButtonsVisibility = (show: boolean) => {
  setTimeout(() => {
    const footer = document.querySelector(".driver-popover-footer");
    if (!footer) return;
    footer.style.display = show ? "flex" : "none";
  }, 50); // ← delay ensures it overrides Driver.js render
};


  

  // Step 1: Click sidebar Agents
  // Step 1: Click sidebar Agents
if (!isAgentsPage && !isModalOpen && !tutorialSteps.includes(1)) {
  steps.push({
  tutorialId: 1,
  element: ".sidebar-agents-link",
  popover: {
    title: "Agents",
    description: "Click here to manage your agents.",
    side: "right",
    align: "start",
  },
  onHighlightStarted: () => {
    toggleButtonsVisibility(false); // now truly hides buttons
    highlightAdditionalElement(".skip-tutorial-btn");
  },
  onHighlightEnded: () => {
    const el = document.querySelector(".skip-tutorial-btn");
    if (el) el.classList.remove("driver-highlighted-element");
  },
});

}


  // Step 2: Click Create Agent
  if (!isModalOpen && isAgentsPage && !tutorialSteps.includes(2)) {
    
    steps.push({
      tutorialId: 2,
      element: ".create-agent-button",
      popover: {
        title: "Create Agent",
        description: "Click this button to create a new agent.",
        side: "bottom",
      },
      onHighlightStarted: () => toggleButtonsVisibility(false),
    //   onNextClick: () => updateTutorialProgress(2),
    });
  }


  if (isModalOpen){
  // Step 3: Enter Agent Name
  if (isAgentsPage && !tutorialSteps.includes(3)) {
    steps.push({
  tutorialId: 3,
  element: ".agent-modal-input-name",
  popover: {
    title: "Agent Name",
    description: "Enter the name for your new agent here.",
    side: "top",
  },
  onHighlightStarted: () => toggleButtonsVisibility(true), // ✅ show buttons
});
  }

  // Step 4: Persona field
  if (isAgentsPage && !tutorialSteps.includes(4)) {
    steps.push({
      tutorialId: 4,
      element: "#persona",
      popover: {
        title: "Agent Persona",
        description: "Describe your agent's personality here.",
        side: "top",
      },
    //   onNextClick: () => updateTutorialProgress(4),
    });
  }
  if (isAgentsPage && !tutorialSteps.includes(5)) {
  steps.push({
    tutorialId: 5,
    element: ".agent-modal-next-btn", // give your Next button a dedicated class
    popover: {
      title: "Next Step",
      description: "Click the Next button to proceed to the next step.",
      side: "top",
    },
    onNextClick: () => updateTutorialProgress(5),
    onHighlightStarted: () => toggleButtonsVisibility(false),
  });
}

  // Step 5: Goals field
  if (isAgentsPage && !tutorialSteps.includes(6)) {
    steps.push({
      tutorialId: 6,
      element: "#goals",
      popover: {
        title: "Agent Goals",
        description: "Specify what you want your agent to accomplish.",
        side: "top",
      },
    //   onNextClick: () => updateTutorialProgress(5),
    });
  }

  // Step 6: System Prompt field
  if (isAgentsPage && !tutorialSteps.includes(7)) {
    steps.push({
      tutorialId: 7,
      element: "#prompt",
      popover: {
        title: "System Prompt",
        description: "Add instructions or context for the agent here.",
        side: "top",
      },
    //   onNextClick: () => updateTutorialProgress(6),
    });
  }

  if (isAgentsPage && !tutorialSteps.includes(8)) {
  steps.push({
    tutorialId: 8,
    element: ".agent-modal-next-btn", // give your Next button a dedicated class
    popover: {
      title: "Next Step",
      description: "Click the Next button to proceed to the next step.",
      side: "top",
    },
    onNextClick: () => updateTutorialProgress(5),
    onHighlightStarted: () => toggleButtonsVisibility(false),
  });
  
}
  
  

  

//   // Step 8: Upload Voice (optional)
//   if (!tutorialSteps.includes(9)) {
//     steps.push({
//       element: "#voice-upload",
//       popover: {
//         title: "Upload Your Voice",
//         description: "Upload a custom voice file if desired.",
//         side: "top",
//       },
//     //   onNextClick: () => updateTutorialProgress(8),
//     });
//   }

  // Step 9: Click Finish/Create Agent
if (isAgentsPage && !tutorialSteps.includes(9)) {
  steps.push({
    tutorialId: 9,
    element: ".agent-modal-finish-btn", // now targeting the new class
    popover: {
      title: "Finish",
      description: "Click here to create your agent.",
      side: "top",
    },
    onHighlightStarted: () => toggleButtonsVisibility(false),
    // optional: you can also auto-move next if needed:
    // onNextClick: () => updateTutorialProgress(9),
  });
}
  }

steps.push({
  
    element: ".skip-tutorial-btn",
    popover: {
      title: "Skip Tutorial",
      description: "Click here anytime to exit the tutorial.",
      side: "left",
    },
  });

  // Only keep steps that haven't been done
const pendingSteps = steps.filter((step) => {
  const stepId = step.tutorialId; // we need a unique id for each step
  return stepId && !tutorialSteps.includes(stepId);
});


  // Start Driver.js only if there are steps
  // if (steps.length > 0) {
  //   const drv = driver({
  //     showProgress: true,
  //     allowClose: true,
  //     showButtons: false,
  //     overlayClickNext: false, 
  //     disableInteraction: false, 
  //     steps,
  //     onDestroy: handleTutorialClose,
  //   });
  //   drv.drive();
  //   driverRef.current = drv;
    
  // }

  if (pendingSteps.length > 0) {
    const stepsInDom = pendingSteps.filter((step) => {
      if (!step?.element || typeof step.element !== "string") return false;
      try {
        return document.querySelector(step.element) != null;
      } catch {
        return false;
      }
    });
    if (stepsInDom.length === 0) return;
    try {
      const drv = driver({
        showProgress: true,
        allowClose: true,
        showButtons: false,
        overlayClickNext: false,
        disableInteraction: false,
        steps: stepsInDom,
        onDestroy: handleTutorialClose,
      });
      drv.drive();
      driverRef.current = drv;
    } catch (e) {
      console.error("Tutorial driver failed:", e);
    }
  }

}, [tutorialSteps, updateTutorialProgress, skipTutorial, handleTutorialClose]);


  // Reset tutorial
  const resetTutorial = useCallback(() => {
    if (driverRef.current) {
      driverRef.current.destroy();
      driverRef.current = null;
    }
    setTutorialSteps([]);
  }, []);

  return (
    <TutorialContext.Provider
      value={{
        startTutorial,
        resetTutorial,
        skipTutorial,
        tutorialSteps,
        skipAndMarkFinished: skipTutorial,
        loading,
        updateTutorialProgress,  // ← expose this
    driverRef,  
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};
