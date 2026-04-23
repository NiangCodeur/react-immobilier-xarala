import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Logement from './models/Logement';
import SiteTouristique from './models/SiteTouristique';

dotenv.config();

const LOGEMENTS_DATA = [
  {
    titre: "Appartement moderne avec vue sur l'océan",
    quartier: "Almadies", categorie: "Appartement", prix: 35000,
    description: "Magnifique appartement de 2 chambres avec une vue imprenable sur l'océan Atlantique.",
    equipements: ["WiFi", "Climatisation", "Cuisine équipée", "TV", "Parking", "Piscine"],
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
    capacite: 4, chambres: 2, sallesDeBain: 2, superficie: 85,
  },
  {
    titre: "Villa spacieuse à Ngor",
    quartier: "Ngor", categorie: "Villa", prix: 75000,
    description: "Superbe villa de 4 chambres dans le quartier calme de Ngor.",
    equipements: ["WiFi", "Climatisation", "Cuisine équipée", "TV", "Parking", "Jardin", "Terrasse", "Barbecue"],
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"],
    capacite: 8, chambres: 4, sallesDeBain: 3, superficie: 200,
  },
  {
    titre: "Studio cosy au Plateau",
    quartier: "Plateau", categorie: "Appartement", prix: 25000,
    description: "Studio parfaitement situé au cœur du Plateau.",
    equipements: ["WiFi", "Climatisation", "Kitchenette", "TV", "Bureau"],
    images: ["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800"],
    capacite: 2, chambres: 1, sallesDeBain: 1, superficie: 35,
  },
  {
    titre: "Maison traditionnelle à Ouakam",
    quartier: "Ouakam", categorie: "Maison", prix: 45000,
    description: "Charmante maison de 3 chambres dans le quartier authentique d'Ouakam.",
    equipements: ["WiFi", "Climatisation", "Cuisine équipée", "TV", "Parking", "Terrasse"],
    images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"],
    capacite: 6, chambres: 3, sallesDeBain: 2, superficie: 120,
  },
  {
    titre: "Appartement de luxe aux Almadies",
    quartier: "Almadies", categorie: "Appartement", prix: 65000,
    description: "Appartement haut de gamme de 3 chambres dans une résidence sécurisée.",
    equipements: ["WiFi", "Climatisation", "Cuisine équipée", "TV", "Parking", "Piscine", "Salle de sport", "Sécurité 24/7"],
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"],
    capacite: 6, chambres: 3, sallesDeBain: 2, superficie: 150,
  },
];

const SITES_DATA = [
  { nom: "Île de Gorée", description: "Classée au patrimoine mondial de l'UNESCO.", image: "https://images.unsplash.com/photo-1758061290777-33c64d1e8369?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aWxlJTIwZGUlMjBnb3IlQzMlQTllfGVufDB8fDB8fHww", quartier: "Gorée", type: "Site historique", dureeVisite: "3-4 heures", tarif: "Gratuit (ferry ~5000 FCFA)", horaires: "Tous les jours" },
  { nom: "Monument de la Renaissance", description: "Statue monumentale de 52 mètres surplombant Dakar.", image: "https://images.unsplash.com/photo-1721013244188-5c4f4593ee72?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", quartier: "Ouakam", type: "Monument", dureeVisite: "1-2 heures", tarif: "3000 FCFA", horaires: "Mar-Dim 9h-18h45" },
  { nom: "Lac Rose", description: "Lac salé célèbre pour sa couleur rose unique.", image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800", quartier: "Niaga", type: "Nature", dureeVisite: "Demi-journée", tarif: "Variable", horaires: "Toute la journée" },
  { nom: "Marché Sandaga", description: "Le plus grand marché de Dakar.", image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TWFyY2glQzMlQTl8ZW58MHx8MHx8fDA%3D", quartier: "Plateau", type: "Marché", dureeVisite: "2-3 heures", tarif: "Gratuit", horaires: "Lun-Sam 8h-19h" },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('✅ Connecté à MongoDB');

  await Logement.deleteMany({});
  await SiteTouristique.deleteMany({});

  await Logement.insertMany(LOGEMENTS_DATA);
  await SiteTouristique.insertMany(SITES_DATA);

  console.log('🌱 Base de données peuplée avec succès !');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});