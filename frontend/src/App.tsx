 import { BrowserRouter, Routes, Route } from 'react-router-dom';

 // Layout Components
 import Navbar from './components/Navbar';
 import Footer from './components/Footer';
 import CallToActionButtons from './components/CallToActionButtons';

 // Pages
 import HomePage from './pages/HomePage';
 import LogementDetailsPage from './pages/LogementDetailsPage';
 import TourismePage from './pages/TourismePage';
 import ContactPage from './pages/ContactPage';
 import DashboardLayout from './layouts/DashboardLayout';

 export default function App() {
   return (
     <BrowserRouter>
       <div className="min-h-screen flex flex-col">
         <Navbar />
         <main className="flex-grow">
           <Routes>
             <Route path="/" element={<HomePage />} />
             <Route path="/logement/:id" element={<LogementDetailsPage />} />
             <Route path="/tourisme" element={<TourismePage />} />
             <Route path="/contact" element={<ContactPage />} /> 

             {/* <Route path="/login" element={<LoginPage />} /> */}

             {/* Dashboard */}
               <Route path="/admin" element={<DashboardLayout />} />
             
           </Routes>
         </main>
         <CallToActionButtons />
         <Footer />
       </div>
     </BrowserRouter>
   );
 }

