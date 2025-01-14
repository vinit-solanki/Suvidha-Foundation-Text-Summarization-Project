import React, { useState } from "react";

function Sidebar() {
  const [activeTab, setActiveTab] = useState("Paraphraser");

  const tabs = ["Paraphraser", "Grammar Checker", "AI Detector", "Plagiarism Checker", "More"];

  return (
    <div className="w-1/4 bg-gray-100 p-5 border-r">
      <h1 className="text-lg font-bold">QuillBot</h1>
      <ul className="mt-5 space-y-3">
        {tabs.map((tab) => (
          <li
            key={tab}
            className={`cursor-pointer ${activeTab === tab ? "text-green-500 font-semibold" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
