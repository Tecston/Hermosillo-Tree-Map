import React from "react";

const TreeDemo: React.FC = () => (
  <div className="h-full min-h-0 flex flex-col">
    <div className="flex-1 min-h-0">
      <iframe
        src="/hmotree/index.html"
        title="Árbolado (demo)"
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  </div>
);

export default TreeDemo;
