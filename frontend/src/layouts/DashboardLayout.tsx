import { Outlet, NavLink } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-stone-100">
      {/* Sidebar Gauche */}
      <aside className="w-64 bg-cyan-900 text-white p-6 hidden md:block">
        <h2 className="text-xl font-black mb-10 bg-gradient-to-r from-cyan-400 to-cyan-400 bg-clip-text text-transparent">
          AFROLAB ADMIN
        </h2>
        <nav className="space-y-4">
          <NavLink to="/admin" end className={({isActive}) => `block p-3 rounded-lg ${isActive ? 'bg-cyan-500' : 'hover:bg-cyan-800'}`}>
            Tableau de bord
          </NavLink>
          <NavLink to="/admin/logements" className={({isActive}) => `block p-3 rounded-lg ${isActive ? 'bg-cyan-500' : 'hover:bg-cyan-800'}`}>
            Gérer Logements
          </NavLink>
          <NavLink to="/admin/demandes" className={({isActive}) => `block p-3 rounded-lg ${isActive ? 'bg-cyan-500' : 'hover:bg-cyan-800'}`}>
            Demandes Clients
          </NavLink>
        </nav>
      </aside>

      {/* Zone de contenu principale */}
      <main className="flex-grow p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-stone-800">Gestionnaire</h1>
          <button className="bg-white px-4 py-2 rounded-lg shadow-sm border text-sm font-medium">Déconnexion</button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}