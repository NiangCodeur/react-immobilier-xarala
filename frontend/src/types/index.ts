// export interface Logement {
//   id: string;
//   titre: string;
//   quartier: string;
//   categorie: 'Appartement' | 'Maison' | 'Villa';
//   prix: number;
//   description: string;
//   equipements: string[];
//   images: string[];
//   capacite: number;
//   chambres: number;
//   sallesDeBain: number;
//   superficie: number;
// }

// export interface SiteTouristique {
//   id: string;
//   nom: string;
//   description: string;
//   image: string;
//   quartier: string;
//   type: string;
//   dureeVisite: string;
//   tarif: string;
//   horaires: string;
// }

// export interface FormDataReservation {
//   nomComplet: string;
//   email: string;
//   telephone: string;
//   dateDebut: string;
//   dateFin: string;
//   nombrePersonnes: number;
//   message: string;
// }

// export interface FormDataContact {
//   nom: string;
//   prenom: string;
//   email: string;
//   telephone: string;
//   objet: string;
//   message: string;
// }

export interface Logement {
  id: string;
  _id?: string;
  titre: string;
  quartier: string;
  categorie: 'Appartement' | 'Maison' | 'Villa';
  prix: number;
  description: string;
  equipements: string[];
  images: string[];
  capacite: number;
  chambres: number;
  sallesDeBain: number;
  superficie: number;
  disponible?: boolean;
}

export interface SiteTouristique {
  id: string;
  _id?: string;
  nom: string;
  description: string;
  image: string;
  quartier: string;
  type: string;
  dureeVisite: string;
  tarif: string;
  horaires: string;
}

export interface FormDataReservation {
  nomComplet: string;
  email: string;
  telephone: string;
  dateDebut: string;
  dateFin: string;
  nombrePersonnes: number;
  message: string;
}

export interface FormDataContact {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  objet: string;
  message: string;
}