import React from "react";
import { DataDisplay } from "../components/DataDisplay";

export function Dashboard() {
  return (
    <div id="dashboard-container" className="bg-secondary w-full min-h-screen font-outfit font-bold">
      <div className="flex flex-col max-x-screen-xl mx-auto">
        <h1 className="mt-6 ml-6 text-white uppercase">Dashboard</h1>
      </div>
      <DataDisplay />
    </div>
  );
}

