import type { Logement, SiteTouristique } from '../types';
//import { imgGorée } from '../assets/siteTouristiques/gorée.jpeg';

export const LOGEMENTS: Logement[] = [ 
  {
    id: "1",
    titre: "Appartement moderne avec vue sur l'océan",
    quartier: "Almadies",
    categorie: "Appartement",
    prix: 35000,
    description: "Magnifique appartement de 2 chambres avec une vue imprenable sur l'océan Atlantique. Situé dans le quartier prisé des Almadies, cet espace moderne offre tout le confort nécessaire pour un séjour agréable.",
    equipements: ["WiFi", "Climatisation", "Cuisine équipée", "TV", "Parking", "Piscine"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
    ],
    capacite: 4,
    chambres: 2,
    sallesDeBain: 2,
    superficie: 85
  },
  {
    id: "2",
    titre: "Villa spacieuse à Ngor",
    quartier: "Ngor",
    categorie: "Villa",
    prix: 75000,
    description: "Superbe villa de 4 chambres dans le quartier calme de Ngor. Jardin tropical, terrasse spacieuse et à quelques minutes de la plage. Idéale pour les familles ou groupes d'amis.",
    equipements: ["WiFi", "Climatisation", "Cuisine équipée", "TV", "Parking", "Jardin", "Terrasse", "Barbecue"],
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"
    ],
    capacite: 8,
    chambres: 4,
    sallesDeBain: 3,
    superficie: 200
  },
  {
    id: "3",
    titre: "Studio cosy au Plateau",
    quartier: "Plateau",
    categorie: "Appartement",
    prix: 25000,
    description: "Studio parfaitement situé au cœur du Plateau, à proximité des commerces et restaurants. Idéal pour les voyageurs d'affaires ou les courts séjours.",
    equipements: ["WiFi", "Climatisation", "Kitchenette", "TV", "Bureau"],
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800"
    ],
    capacite: 2,
    chambres: 1,
    sallesDeBain: 1,
    superficie: 35
  },
  {
    id: "4",
    titre: "Maison traditionnelle à Ouakam",
    quartier: "Ouakam",
    categorie: "Maison",
    prix: 45000,
    description: "Charmante maison de 3 chambres dans le quartier authentique d'Ouakam, près des Mamelles. Architecture traditionnelle sénégalaise avec tout le confort moderne.",
    equipements: ["WiFi", "Climatisation", "Cuisine équipée", "TV", "Parking", "Terrasse"],
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
    ],
    capacite: 6,
    chambres: 3,
    sallesDeBain: 2,
    superficie: 120
  },
  {
    id: "5",
    titre: "Appartement de luxe aux Almadies",
    quartier: "Almadies",
    categorie: "Appartement",
    prix: 65000,
    description: "Appartement haut de gamme de 3 chambres dans une résidence sécurisée avec piscine, salle de sport et conciergerie. Vue panoramique sur l'océan.",
    equipements: ["WiFi", "Climatisation", "Cuisine équipée", "TV", "Parking", "Piscine", "Salle de sport", "Sécurité 24/7"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800"
    ],
    capacite: 6,
    chambres: 3,
    sallesDeBain: 2,
    superficie: 150
  }
];

export const SITES_TOURISTIQUES: SiteTouristique[] = [
  {
    id: "1",
    nom: "Île de Gorée",
    description: "Classée au patrimoine mondial de l'UNESCO, l'île de Gorée est un lieu de mémoire symbolique de la traite négrière. Accessible en 20 minutes de bateau depuis Dakar.",
    // Use Vite's URL resolution so the asset is included in the build and served correctly
    image: new URL('../assets/siteTouristiques/gorée.jpeg', import.meta.url).href,
    quartier: "Gorée",
    type: "Site historique",
    dureeVisite: "3-4 heures",
    tarif: "Gratuit (ferry ~5000 FCFA)",
    horaires: "Tous les jours"
  },
  {
    id: "2",
    nom: "Monument de la Renaissance",
    description: "Statue monumentale de 52 mètres surplombant Dakar. Vue panoramique exceptionnelle sur la ville et l'océan.",
    image: new URL('../assets/siteTouristiques/monument_rennaissance.jpg', import.meta.url).href,
    quartier: "Ouakam",
    type: "Monument",
    dureeVisite: "1-2 heures",
    tarif: "3000 FCFA",
    horaires: "Mar-Dim 9h-18h45"
  },
  {
    id: "3",
    nom: "Lac Rose",
    description: "Lac salé célèbre pour sa couleur rose unique. Site naturel exceptionnel à 35km de Dakar.",
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800",
    quartier: "Niaga",
    type: "Nature",
    dureeVisite: "Demi-journée",
    tarif: "Variable",
    horaires: "Toute la journée"
  },
  {
    id: "4",
    nom: "Marché Sandaga",
    description: "Le plus grand marché de Dakar. Lieu vibrant pour découvrir l'artisanat sénégalais.",
    image: new URL('../assets/siteTouristiques/sandaga.jpg', import.meta.url).href,
    quartier: "Plateau",
    type: "Marché",
    dureeVisite: "2-3 heures",
    tarif: "Gratuit",
    horaires: "Lun-Sam 8h-19h"
  }
];