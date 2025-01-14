import React from "react";
import Sidebar from "./components/Sidebar";
import Summarizer from "./components/Summarizer";

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Summarizer />
    </div>
  );
}

export default App;
