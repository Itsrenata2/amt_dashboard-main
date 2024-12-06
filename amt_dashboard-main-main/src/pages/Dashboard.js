import React from "react";
import { DataDisplay } from "../components/DataDisplay";

export function Dashboard() {
  return (
    <div id="dashboard-container" className="bg-secondary w-screen min-h-screen font-outfit font-bold">
      <div className="flex flex-col">
        <h1 className="mt-6 ml-8 text-white uppercase">Dashboard</h1>
      </div>
      <DataDisplay />
    </div>
  );
}
