

// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import CallToActionButtons from './components/CallToActionButtons';
// import ProtectedRoute from './components/ProtectedRoute';

// import HomePage from './pages/HomePage';
// import LogementDetailsPage from './pages/LogementDetailsPage';
// import TourismePage from './pages/TourismePage';
// import ContactPage from './pages/ContactPage';
// import LoginPage from './pages/LoginPage';
// import DashboardLayout from './layouts/DashboardLayout';

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Route login — sans Navbar/Footer */}
//         <Route path="/login" element={<LoginPage />} />

//         {/* Route admin protégée — sans Navbar/Footer */}
//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute>
//               <DashboardLayout />
//             </ProtectedRoute>
//           }
//         />

//         {/* Routes publiques — avec Navbar/Footer */}
//         <Route
//           path="/*"
//           element={
//             <div className="min-h-screen flex flex-col">
//               <Navbar />
//               <main className="flex-grow">
//                 <Routes>
//                   <Route path="/" element={<HomePage />} />
//                   <Route path="/logement/:id" element={<LogementDetailsPage />} />
//                   <Route path="/tourisme" element={<TourismePage />} />
//                   <Route path="/contact" element={<ContactPage />} />
//                 </Routes>
//               </main>
//               <CallToActionButtons />
//               <Footer />
//             </div>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CallToActionButtons from './components/CallToActionButtons';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LogementDetailsPage from './pages/LogementDetailsPage';
import TourismePage from './pages/TourismePage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';

import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/admin/DashboardHome';
import GererLogements from './pages/admin/GererLogements';
import DemandesClients from './pages/admin/DemandesClients';
import Parametres from './pages/admin/Parametres';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login — sans Navbar */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin — protégé, sans Navbar */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="logements" element={<GererLogements />} />
          <Route path="demandes" element={<DemandesClients />} />
        </Route>

        <Route path="parametres" element={<Parametres />} />

        {/* Public — avec Navbar/Footer */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/logement/:id" element={<LogementDetailsPage />} />
                  <Route path="/tourisme" element={<TourismePage />} />
                  <Route path="/contact" element={<ContactPage />} />
                </Routes>
              </main>
              <CallToActionButtons />
              <Footer />
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}