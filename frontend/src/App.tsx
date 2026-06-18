import { ApplicationsPage } from "./pages/ApplicationsPage";
import "./index.css";

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-inner">
          <span className="nav-logo"> JobTrackr</span>
        </div>
      </nav>
      <main className="main-content">
        <ApplicationsPage />
      </main>
    </div>
  );
}

export default App;
