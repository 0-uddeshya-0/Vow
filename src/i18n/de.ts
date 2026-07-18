import type { Dict } from "./en";

/** du/ihr-Form — proofread by the couple before launch (README checklist). */
export const de: Dict = {
  langName: "Deutsch",

  common: {
    demoRibbon: "Demo-Inhalte — alles hier wird im Admin-CMS gepflegt",
    loading: "Lädt",
    back: "Zurück",
    save: "Speichern",
    cancel: "Abbrechen",
    signOut: "Nicht ihr? Gast wechseln",
  },

  nav: { home: "Start", event: "Event", rsvp: "Rückmeldung", admin: "Admin" },

  landing: {
    viewEvent: "Zum Event",
    until: "bis wir feiern",
    days: "Tage",
    hours: "Std.",
    minutes: "Min.",
    seconds: "Sek.",
    eventDayTitle: "Heute ist es so weit",
    eventDayLead: "Die Live-Übersicht kommt mit der nächsten Phase.",
  },

  identify: {
    title: "Eure Einladung finden",
    lead: "Gebt die E-Mail-Adresse oder Telefonnummer ein, an die eure Einladung ging.",
    placeholder: "E-Mail oder Telefonnummer",
    cta: "Finde mich",
    notFound: "Nicht gefunden — probiert den anderen Kontaktweg oder fragt das Paar direkt.",
    demoHint: "Demo-Gäste: demo@vow.app · witness@vow.app",
    welcome: "Willkommen",
    switch: "Gast wechseln",
  },

  schedule: {
    title: "Programm",
    lead: "Euer persönlicher Ablauf — nur für euch sichtbare Punkte sind markiert.",
    onlyForYou: "Nur für euch",
    notes: "Hinweise",
    google: "Google Maps",
    apple: "Apple Karten",
    osm: "OpenStreetMap",
    navigate: "Route",
  },

  rsvp: {
    title: "Feiert ihr mit?",
    lead: "Eine Minute für euch — eine große Hilfe für uns.",
    attending: "Eure Antwort",
    yes: "Mit Freude",
    maybe: "Vielleicht",
    no: "Leider nicht",
    dietTitle: "Essen, das für euch passt",
    diet: {
      vegetarian: "Vegetarisch",
      vegan: "Vegan",
      gluten_free: "Glutenfrei",
      lactose_free: "Laktosefrei",
    },
    allergies: "Allergien & Hinweise",
    allergiesPh: "z. B. starke Nussallergie …",
    message: "Ein paar Zeilen für das Paar (optional)",
    messagePh: "Wir lesen jedes Wort.",
    email: "E-Mail",
    phone: "Telefon",
    save: "Antwort senden",
    saving: "Wird gesendet…",
    savedYes: "Wie schön — wir freuen uns auf euch!",
    savedMaybe: "Danke — sagt fest Bescheid, sobald ihr es wisst.",
    savedNo: "Ihr werdet fehlen — danke fürs Bescheidgeben.",
    edit: "Antwort ändern",
    deadlineNote: "Ihr könnt eure Antwort ändern bis",
    closed: "Die Frist ist vorbei — meldet euch bitte direkt beim Paar.",
    identifyFirst: "Findet zuerst eure Einladung, um zu antworten.",
    plusOneTitle: "Begleitung mitbringen?",
    plusOneLead: "Sagt uns wer — das Paar bestätigt jede Begleitung persönlich.",
    plusOneName: "Voller Name",
    plusOneContact: "E-Mail oder Telefon",
    plusOneCta: "Begleitung anfragen",
    plusOnePending: "Angefragt — das Paar meldet sich",
    plusOneApproved: "Bestätigt",
    plusOneRejected: "Diesmal leider nicht möglich",
  },

  admin: {
    title: "Admin-CMS",
    stub: "Der Admin-Bereich kommt in Phase 3 — mit Gästeverwaltung, Programm-Editor, Hotel-Editor, Design-Einstellungen, RSVP-Übersicht und Erinnerungen. Er nutzt Firebase-Login und ist bis dahin deaktiviert.",
  },

  a11y: {
    themeToLight: "Zum hellen Design wechseln",
    themeToDark: "Zum dunklen Design wechseln",
    langSwitch: "Language: English",
    menu: "Menü",
  },
};
