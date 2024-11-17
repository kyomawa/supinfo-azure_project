import { JsonLd } from "jsonld/jsonld-spec";
import { Metadata } from "next";

// ==========================================================================================================

export const jsonLd: JsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Supinfo Azure Project",
  url: "https://supinfo-azure-project.fr/",
  description:
    "Supinfo Azure Project, la nouvelle plateforme sociale qui connecte les esprits créatifs. Rejoignez notre réseau social innovant dès aujourd'hui.",
  image: "https://supinfo-azure-project.fr/img/websiteimg.png",
  memberOf: {
    "@type": "Organization",
    name: "Supinfo Azure Project",
  },
  mainEntityOfPage: "https://supinfo-azure-project.fr/",
  primaryImageOfPage: {
    "@type": "ImageObject",
    "@id": "https://supinfo-azure-project.fr/img/websiteimg.png",
    url: "https://supinfo-azure-project.fr/img/websiteimg.png",
    width: 1200,
    height: 630,
  },
};

// ==========================================================================================================

export const commonMetadata: Metadata = {
  applicationName: "Supinfo Azure Project",
  creator: "Bryan Cellier",
  metadataBase: new URL("https://supinfo-azure-project.fr/"),
  title: {
    template: "%s - Supinfo Azure Project",
    default: "Supinfo Azure Project",
  },
  authors: { name: "Bryan Cellier", url: "https://supinfo-azure-project.fr/" },
  openGraph: {
    title: "Supinfo Azure Project - Connecter les esprits créatifs",
    type: "website",
    url: "https://supinfo-azure-project.fr/",
    images: [
      {
        url: "https://supinfo-azure-project.fr/img/websiteimg.png",
        width: 1200,
        height: 630,
        alt: "Carte de Supinfo Azure Project",
      },
    ],
    description:
      "Supinfo Azure Project, la nouvelle plateforme sociale pour connecter et partager vos idées. Rejoignez la communauté maintenant.",
    siteName: "Supinfo Azure Project",
  },
  twitter: {
    card: "summary_large_image",
    site: "@bryan_cellier",
    title: "Supinfo Azure Project - Connecter les esprits créatifs",
    description: "Rejoignez notre réseau social innovant et connectez-vous avec des personnes partageant vos intérêts.",
    creator: "@bryan_cellier",
    images: {
      width: "1200",
      height: "630",
      url: "https://supinfo-azure-project.fr/img/websiteimg.png",
      alt: "Carte de Supinfo Azure Project",
    },
  },
};

// ==========================================================================================================

export const homeMetadata: Metadata = {
  title: "Accueil",
  description: "Explorez les dernières publications et suivez les activités de votre réseau.",
  keywords: "réseau social, fil d'actualité, Supinfo Azure Project, connexions",
  alternates: {
    canonical: "https://supinfo-azure-project.fr/",
  },
};

// ==========================================================================================================

export const connexionMetadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à Supinfo Azure Project pour découvrir une expérience sociale enrichissante.",
  keywords: "Supinfo Azure Project, connexion, espace personnel, réseau social",
};

// ==========================================================================================================

export const verificationMetadata: Metadata = {
  title: "Vérification",
  description: "Vérifiez votre adresse e-mail pour vous connecter à votre compte.",
};

// ==========================================================================================================

export const connexionFailedMetadata: Metadata = {
  title: " Connexion échouée",
  description: " Veuillez vérifier vos informations d'identification et réessayer.",
};

// ==========================================================================================================

export const creationMetadata: Metadata = {
  title: "Création",
  description: "Créer un nouveau contenu sur Supinfo Azure Project.",
  keywords: "création, publication, Supinfo Azure Project",
};

// ==========================================================================================================

export const profileMetadata: Metadata = {
  title: "Profil",
  description: "Gérez et personnalisez votre profil utilisateur sur Supinfo Azure Project.",
  keywords: "Profil, paramètres utilisateur, Supinfo Azure Project",
};

// ==========================================================================================================

export const settingsMetadata: Metadata = {
  title: "Paramètres",
  description: "Personnalisez vos préférences et paramètres de compte.",
  keywords: "Paramètres, personnalisation, compte, Supinfo Azure Project",
};

// ==========================================================================================================

export const searchMetadata: Metadata = {
  title: "Recherche",
  description: "Rechercher un profil ou un contenu sur Supinfo Azure Project.",
  keywords: "Recherche, profil, contenu, Supinfo Azure Project",
};

// ==========================================================================================================

export const notificationsMetadata: Metadata = {
  title: "Notifications",
  description: "Gérez les notifications de votre compte sur Supinfo Azure Project.",
  keywords: "Notifications, alertes, compte, Supinfo Azure Project",
};

// ==========================================================================================================

export const discoveryMetadata: Metadata = {
  title: "Découvrir",
  description: "Découvrez les derniers contenus publiés sur Supinfo Azure Project.",
  keywords: "Découvrir, publications, contenus, Supinfo Azure Project",
};

// ==========================================================================================================
