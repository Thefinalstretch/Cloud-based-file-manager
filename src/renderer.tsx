import React from "react";
import { createRoot } from "react-dom/client";
import Profile from "./components/Profile";
import AuthProvider from "./components/authflow/authProvider";

// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );

const App = () => {
  return (
    <>
      <Profile />
    </>
  );
};
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
