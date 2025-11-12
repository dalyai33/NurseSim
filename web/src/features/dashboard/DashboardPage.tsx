import { NavbarMinimal } from "../../components/NavBar";
import '../../styles/dashboard/DashboardPage.css';

export default function DashboardPage() {
    return (
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <NavbarMinimal />
        </aside>
  
        <main className="dashboard-main">
          <h2>Welcome to NurseSim!</h2>
          <p>You successfully logged in!</p>
        </main>
      </div>
    );
}