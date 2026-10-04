"use client";

import { useState } from "react";
import ExploreTab from "@/components/ExploreTab";
import Header, { type TabId } from "@/components/Header";
import MyMapTab from "@/components/MyMapTab";
import TripPlannerTab from "@/components/TripPlannerTab";
import { useAppState } from "@/lib/useAppState";

export default function Home() {
  const [tab, setTab] = useState<TabId>("map");
  const { state, update } = useAppState();

  return (
    <div className="min-h-screen">
      <Header tab={tab} onTab={setTab} />
      <main>
        {tab === "map" && <MyMapTab state={state} update={update} />}
        {tab === "explore" && <ExploreTab state={state} update={update} />}
        {tab === "trip" && <TripPlannerTab state={state} update={update} goExplore={() => setTab("explore")} />}
      </main>
      <footer className="border-t border-sand-line px-5 py-8 text-center text-[15px] leading-relaxed text-ink-soft">
        <p>বাংলাদেশের জন্য ভালোবাসা দিয়ে তৈরি ♥ · আপনার বাছাই ও ছবি শুধু আপনার ব্রাউজারেই থাকে</p>
        <p className="mt-1 text-sm">
          ম্যাপের সীমানা: © geoBoundaries (geoboundaries.org), CC BY 4.0
        </p>
      </footer>
    </div>
  );
}
