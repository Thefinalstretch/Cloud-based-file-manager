import React from "react";
import { createRoot } from "react-dom/client";

import AuthProvider from "./components/authflow/authProvider";
import { App } from "./components/App";

// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);

("https://www.youtube.com/watch?v=XmSQtyPjbxY");
