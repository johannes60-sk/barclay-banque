"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type Language = "en" | "fr"

const translations = {
  en: {
    "nav.currentAccounts": "Current accounts",
    "nav.creditCards": "Credit cards",
    "nav.savings": "Savings",
    "nav.loans": "Loans",
    "nav.mortgages": "Mortgages",
    "nav.insurance": "Insurance",
    "nav.investments": "Investments",
    "nav.about": "About us",
    "nav.login": "Login",
    "nav.signup": "Sign up",

    "footer.products": "Products",
    "footer.company": "Company",
    "footer.legal": "Legal",
    "footer.privacyPolicy": "Privacy policy",
    "footer.terms": "Terms and conditions",
    "footer.copyright": "Barclays. For demonstration purposes only.",

    "home.heroTitle": "Your Barclays experience starts here",
    "home.heroSubtitle":
      "See how we can help you with current accounts, mortgages, insurance, loans, credit cards and savings accounts.",
    "home.openAccount": "Open an account",
    "home.login": "Login",
    "home.heroPanel":
      "Banking made simple, secure and always within reach — whether you're checking your balance, sending money, or managing your spending.",
    "home.sectionTitle": "Your Barclays experience starts here",
    "home.simpleTitle": "Banking made simple, secure and always within reach",
    "home.simpleDesc":
      "From smart budgeting tools to instant notifications and card controls, Barclays online banking helps you stay in control — wherever life takes you.",

    "product.currentAccounts.title": "Current accounts",
    "product.currentAccounts.desc": "Find a current account that works for you.",
    "product.creditCards.title": "Credit cards",
    "product.creditCards.desc": "Choice is the key to finding the right credit card.",
    "product.savings.title": "Savings accounts",
    "product.savings.desc": "Whatever you're dreaming of, you can start saving today.",
    "product.loans.title": "Loans",
    "product.loans.desc": "Focus on the future with a personal loan.",
    "product.mortgages.title": "Mortgages",
    "product.mortgages.desc": "Take a look at the range of mortgages we can offer to help with your plans.",
    "product.insurance.title": "Insurance",
    "product.insurance.desc": "A safety net for unpredictable events.",
    "product.investments.title": "Investments",
    "product.investments.desc":
      "Whether you're a beginner or an expert, we can help you make the most of your money.",

    "about.title": "About Barclays",
    "about.intro1":
      "Barclays is a modern online bank that is changing the way you manage your money. Our mission is to make banking accessible, simple and secure for everyone in the UK.",
    "about.intro2":
      "We combine technological innovation with a long banking tradition to deliver a superior banking experience, in line with the strictest standards of the UK financial sector.",
    "about.valuesTitle": "Our values",
    "about.security.title": "Security",
    "about.security.desc":
      "Your data is protected by the most advanced encryption technologies, compliant with UK banking standards.",
    "about.service.title": "Customer service",
    "about.service.desc": "Our UK-based team is available 24/7 to answer all your questions.",
    "about.international.title": "International",
    "about.international.desc":
      "Make transfers to more than 150 countries in a few clicks, with competitive exchange rates.",
    "about.certifications.title": "Certifications",
    "about.certifications.desc": "Authorised and regulated by the Financial Conduct Authority (FCA).",
    "about.visionTitle": "Our vision",
    "about.vision.p1":
      "We believe banking should be transparent, accessible and adapted to the modern world. That's why we built a fully digital platform that gives you complete control over your finances, while upholding the security and trust that banking traditions are built on.",
    "about.vision.p2":
      "With Barclays, there are no hidden fees and no unnecessary paperwork — just a simple, fast and secure banking experience, accessible from any device, wherever you are in the UK.",
    "about.vision.p3":
      "Our team of financial and technology experts works every day to improve our services and give you the best possible banking experience, always keeping your interests at the heart of what we do.",

    "placeholder.comingSoon": "This section is coming soon.",

    "auth.login.title": "Log in to your account",
    "auth.login.subtitle": "Welcome back — access your Barclays online banking.",
    "auth.login.email": "Email",
    "auth.login.emailPlaceholder": "you@example.com",
    "auth.login.password": "Password",
    "auth.login.remember": "Remember me",
    "auth.login.forgot": "Forgot password?",
    "auth.login.submit": "Log in",
    "auth.login.noAccount": "Don't have an account?",
    "auth.login.signupLink": "Sign up",
    "auth.login.errorCredentials": "Incorrect email or password.",
    "auth.login.error": "Something went wrong while logging in. Please try again.",
    "auth.login.terms": "By continuing, you agree to our",
    "auth.login.termsLink": "Terms and conditions",
    "auth.login.and": "and",
    "auth.login.privacy": "Privacy policy",

    "auth.register.title": "Open your Barclays account",
    "auth.register.subtitle": "Create your account in a few minutes.",
    "auth.register.firstName": "First name",
    "auth.register.firstNamePlaceholder": "John",
    "auth.register.lastName": "Last name",
    "auth.register.lastNamePlaceholder": "Smith",
    "auth.register.email": "Email",
    "auth.register.emailPlaceholder": "you@example.com",
    "auth.register.phone": "Phone number",
    "auth.register.phonePlaceholder": "+44 7911 123456",
    "auth.register.password": "Password",
    "auth.register.confirmPassword": "Confirm password",
    "auth.register.submit": "Create account",
    "auth.register.haveAccount": "Already have an account?",
    "auth.register.loginLink": "Log in",
    "auth.register.passwordMismatch": "Passwords do not match.",
    "auth.register.passwordShort": "Password must be at least 6 characters long.",
    "auth.register.phoneRequired": "Phone number is required.",
    "auth.register.phoneInvalid": "Please enter a valid phone number (e.g. +447911123456).",
    "auth.register.error": "Something went wrong while creating your account. Please try again.",
    "auth.register.terms": "By continuing, you agree to our",
    "auth.register.termsLink": "Terms and conditions",
    "auth.register.and": "and",
    "auth.register.privacy": "Privacy policy",

    "dashboard.welcome": "Welcome back",
    "dashboard.subtitle": "Here's an overview of your account.",
    "dashboard.balance": "Balance",
    "dashboard.accountNumber": "Account number",
    "dashboard.show": "Show",
    "dashboard.hide": "Hide",
    "dashboard.recentTransactions": "Recent transactions",
    "dashboard.viewAll": "View all transactions",
    "dashboard.quickActions": "Quick actions",
    "dashboard.transfer": "Transfer money",
    "dashboard.viewTransactions": "View transactions",
    "dashboard.settings": "Settings",
    "dashboard.settingsDescription": "Manage your account settings, including permanently deleting your account.",
    "dashboard.deleteAccount": "Delete account",
    "dashboard.nav.balance": "Balance",
    "dashboard.nav.transfer": "Transfer",
    "dashboard.nav.transactions": "Transactions",
    "dashboard.nav.logout": "Log out",

    "transactions.title": "Transactions",
    "transactions.empty": "No transactions yet.",
    "transactions.loading": "Loading...",
    "transactions.details.title": "Transaction details",
    "transactions.details.amount": "Amount",
    "transactions.details.recipient": "Recipient",
    "transactions.details.sender": "Sender",
    "transactions.details.reference": "Reference",
    "transactions.details.status": "Status",
    "transactions.details.success": "Completed",
    "transactions.details.footer": "This transaction has been securely processed by Barclays.",

    "delete.button": "Delete account",
    "delete.title": "Delete your account",
    "delete.description": "This action is permanent and cannot be undone. All your data will be deleted.",
    "delete.passwordLabel": "Confirm your password",
    "delete.passwordPlaceholder": "Enter your password",
    "delete.passwordRequired": "Please enter your password to confirm.",
    "delete.error": "Something went wrong while deleting your account.",
    "delete.cancel": "Cancel",
    "delete.confirm": "Delete my account",
    "delete.deleting": "Deleting...",
  },
  fr: {
    "nav.currentAccounts": "Comptes courants",
    "nav.creditCards": "Cartes de crédit",
    "nav.savings": "Épargne",
    "nav.loans": "Prêts",
    "nav.mortgages": "Hypothèques",
    "nav.insurance": "Assurance",
    "nav.investments": "Investissements",
    "nav.about": "À propos",
    "nav.login": "Connexion",
    "nav.signup": "S'inscrire",

    "footer.products": "Produits",
    "footer.company": "Entreprise",
    "footer.legal": "Mentions légales",
    "footer.privacyPolicy": "Politique de confidentialité",
    "footer.terms": "Conditions générales",
    "footer.copyright": "Barclays. À des fins de démonstration uniquement.",

    "home.heroTitle": "Votre expérience Barclays commence ici",
    "home.heroSubtitle":
      "Découvrez comment nous pouvons vous aider avec les comptes courants, les hypothèques, les assurances, les prêts, les cartes de crédit et les comptes d'épargne.",
    "home.openAccount": "Ouvrir un compte",
    "home.login": "Connexion",
    "home.heroPanel":
      "Une banque simple, sécurisée et toujours accessible — que vous consultiez votre solde, envoyiez de l'argent ou gériez vos dépenses.",
    "home.sectionTitle": "Votre expérience Barclays commence ici",
    "home.simpleTitle": "Une banque simple, sécurisée et toujours accessible",
    "home.simpleDesc":
      "Des outils de budget intelligents aux notifications instantanées et au contrôle de vos cartes, la banque en ligne Barclays vous aide à garder le contrôle, où que vous soyez.",

    "product.currentAccounts.title": "Comptes courants",
    "product.currentAccounts.desc": "Trouvez le compte courant qui vous convient.",
    "product.creditCards.title": "Cartes de crédit",
    "product.creditCards.desc": "Le choix est essentiel pour trouver la bonne carte de crédit.",
    "product.savings.title": "Comptes d'épargne",
    "product.savings.desc": "Quel que soit votre projet, commencez à épargner dès aujourd'hui.",
    "product.loans.title": "Prêts",
    "product.loans.desc": "Préparez l'avenir avec un prêt personnel.",
    "product.mortgages.title": "Hypothèques",
    "product.mortgages.desc": "Découvrez notre gamme d'hypothèques pour vous aider dans vos projets.",
    "product.insurance.title": "Assurance",
    "product.insurance.desc": "Une protection face aux imprévus.",
    "product.investments.title": "Investissements",
    "product.investments.desc":
      "Que vous soyez débutant ou expert, nous vous aidons à tirer le meilleur parti de votre argent.",

    "about.title": "À propos de Barclays",
    "about.intro1":
      "Barclays est une banque en ligne moderne qui révolutionne la façon dont vous gérez votre argent. Notre mission est de rendre la banque accessible, simple et sécurisée pour tous au Royaume-Uni.",
    "about.intro2":
      "Nous combinons l'innovation technologique avec une longue tradition bancaire pour offrir une expérience bancaire de qualité supérieure, conforme aux normes les plus strictes du secteur financier britannique.",
    "about.valuesTitle": "Nos valeurs",
    "about.security.title": "Sécurité",
    "about.security.desc":
      "Vos données sont protégées par les technologies de cryptage les plus avancées, conformes aux standards bancaires britanniques.",
    "about.service.title": "Service client",
    "about.service.desc": "Notre équipe basée au Royaume-Uni est disponible 24/7 pour répondre à toutes vos questions.",
    "about.international.title": "International",
    "about.international.desc":
      "Effectuez des virements vers plus de 150 pays en quelques clics, avec des taux de change compétitifs.",
    "about.certifications.title": "Certifications",
    "about.certifications.desc": "Agréée et régulée par la Financial Conduct Authority (FCA).",
    "about.visionTitle": "Notre vision",
    "about.vision.p1":
      "Nous croyons que la banque doit être transparente, accessible et adaptée au monde moderne. C'est pourquoi nous avons créé une plateforme entièrement digitale qui vous donne le contrôle total de vos finances, tout en respectant la sécurité et la confiance propres à la tradition bancaire.",
    "about.vision.p2":
      "Avec Barclays, pas de frais cachés, pas de paperasse inutile. Juste une expérience bancaire simple, rapide et sécurisée, accessible depuis n'importe quel appareil, où que vous soyez au Royaume-Uni.",
    "about.vision.p3":
      "Notre équipe d'experts financiers et technologiques travaille chaque jour pour améliorer nos services et vous offrir la meilleure expérience bancaire possible, en gardant toujours vos intérêts au cœur de nos priorités.",

    "placeholder.comingSoon": "Cette rubrique arrive bientôt.",

    "auth.login.title": "Connectez-vous à votre compte",
    "auth.login.subtitle": "Bon retour — accédez à votre banque en ligne Barclays.",
    "auth.login.email": "Email",
    "auth.login.emailPlaceholder": "vous@exemple.com",
    "auth.login.password": "Mot de passe",
    "auth.login.remember": "Se souvenir de moi",
    "auth.login.forgot": "Mot de passe oublié ?",
    "auth.login.submit": "Se connecter",
    "auth.login.noAccount": "Vous n'avez pas de compte ?",
    "auth.login.signupLink": "S'inscrire",
    "auth.login.errorCredentials": "Email ou mot de passe incorrect.",
    "auth.login.error": "Une erreur est survenue lors de la connexion. Veuillez réessayer.",
    "auth.login.terms": "En continuant, vous acceptez nos",
    "auth.login.termsLink": "Conditions générales",
    "auth.login.and": "et notre",
    "auth.login.privacy": "Politique de confidentialité",

    "auth.register.title": "Ouvrez votre compte Barclays",
    "auth.register.subtitle": "Créez votre compte en quelques minutes.",
    "auth.register.firstName": "Prénom",
    "auth.register.firstNamePlaceholder": "Jean",
    "auth.register.lastName": "Nom",
    "auth.register.lastNamePlaceholder": "Dupont",
    "auth.register.email": "Email",
    "auth.register.emailPlaceholder": "vous@exemple.com",
    "auth.register.phone": "Numéro de téléphone",
    "auth.register.phonePlaceholder": "+33 6 12 34 56 78",
    "auth.register.password": "Mot de passe",
    "auth.register.confirmPassword": "Confirmer le mot de passe",
    "auth.register.submit": "Créer un compte",
    "auth.register.haveAccount": "Vous avez déjà un compte ?",
    "auth.register.loginLink": "Se connecter",
    "auth.register.passwordMismatch": "Les mots de passe ne correspondent pas.",
    "auth.register.passwordShort": "Le mot de passe doit contenir au moins 6 caractères.",
    "auth.register.phoneRequired": "Le numéro de téléphone est requis.",
    "auth.register.phoneInvalid": "Veuillez entrer un numéro de téléphone valide (ex. +33612345678).",
    "auth.register.error": "Une erreur est survenue lors de la création du compte. Veuillez réessayer.",
    "auth.register.terms": "En continuant, vous acceptez nos",
    "auth.register.termsLink": "Conditions générales",
    "auth.register.and": "et notre",
    "auth.register.privacy": "Politique de confidentialité",

    "dashboard.welcome": "Bon retour",
    "dashboard.subtitle": "Voici un aperçu de votre compte.",
    "dashboard.balance": "Solde",
    "dashboard.accountNumber": "Numéro de compte",
    "dashboard.show": "Afficher",
    "dashboard.hide": "Masquer",
    "dashboard.recentTransactions": "Transactions récentes",
    "dashboard.viewAll": "Voir toutes les transactions",
    "dashboard.quickActions": "Actions rapides",
    "dashboard.transfer": "Faire un virement",
    "dashboard.viewTransactions": "Voir les transactions",
    "dashboard.settings": "Paramètres",
    "dashboard.settingsDescription": "Gérez les paramètres de votre compte, y compris la suppression définitive de votre compte.",
    "dashboard.deleteAccount": "Supprimer le compte",
    "dashboard.nav.balance": "Solde",
    "dashboard.nav.transfer": "Virement",
    "dashboard.nav.transactions": "Transactions",
    "dashboard.nav.logout": "Déconnexion",

    "transactions.title": "Transactions",
    "transactions.empty": "Aucune transaction pour le moment.",
    "transactions.loading": "Chargement...",
    "transactions.details.title": "Détails de la transaction",
    "transactions.details.amount": "Montant",
    "transactions.details.recipient": "Bénéficiaire",
    "transactions.details.sender": "Expéditeur",
    "transactions.details.reference": "Référence",
    "transactions.details.status": "Statut",
    "transactions.details.success": "Terminée",
    "transactions.details.footer": "Cette transaction a été traitée de manière sécurisée par Barclays.",

    "delete.button": "Supprimer le compte",
    "delete.title": "Supprimer votre compte",
    "delete.description": "Cette action est définitive et irréversible. Toutes vos données seront supprimées.",
    "delete.passwordLabel": "Confirmez votre mot de passe",
    "delete.passwordPlaceholder": "Entrez votre mot de passe",
    "delete.passwordRequired": "Veuillez entrer votre mot de passe pour confirmer.",
    "delete.error": "Une erreur est survenue lors de la suppression du compte.",
    "delete.cancel": "Annuler",
    "delete.confirm": "Supprimer mon compte",
    "delete.deleting": "Suppression...",
  },
} as const

export type TranslationKey = keyof typeof translations.en

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    const stored = window.localStorage.getItem("barclays-language")
    if (stored === "en" || stored === "fr") {
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    window.localStorage.setItem("barclays-language", lang)
  }

  const t = (key: TranslationKey): string => translations[language][key] ?? translations.en[key]

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
