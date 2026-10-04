
"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useState } from "react";
import ExploreTab from "@/components/ExploreTab";
import Footer from "@/components/Footer";
import Header, { type TabId } from "@/components/Header";
import MyMapTab from "@/components/MyMapTab";
import TripPlannerTab from "@/components/TripPlannerTab";
import { useAppState } from "@/lib/useAppState";

export default function Home() {
  const [tab, setTab] = useState<TabId>("map");
  const { state, update } = useAppState();

  const go = (t: TabId) => {
    setTab(t);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen">
        <Header tab={tab} onTab={go} />

        <AnimatePresence mode="wait">
          <motion.main
            key={tab}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}
          >
            {tab === "map" && (
              <MyMapTab
                state={state}
                update={update}
              />
            )}

            {tab === "explore" && (
              <ExploreTab
                state={state}
                update={update}
                goTrip={() => go("trip")}
              />
            )}

            {tab === "trip" && (
              <TripPlannerTab
                state={state}
                update={update}
                goExplore={() => go("explore")}
              />
            )}
          </motion.main>
        </AnimatePresence>

        <Footer />
      </div>
    </MotionConfig>
  );
}

