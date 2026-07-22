import type { Dict } from "./en";

/** du-Form (personal, singular) — proofread by the couple before launch. */
export const de: Dict = {
  langName: "Deutsch",

  common: {
    demoRibbon: "Demo-Inhalte — alles hier wird im Admin-CMS gepflegt",
    loading: "Lädt",
    back: "Zurück",
    save: "Speichern",
    cancel: "Abbrechen",
    signOut: "Nicht du? Gast wechseln",
  },

  nav: { home: "Start", event: "Event", info: "Infos", rsvp: "Antwort", gallery: "Galerie", admin: "Admin" },

  landing: {
    viewEvent: "Zum Event",
    until: "bis wir feiern",
    days: "Tage",
    hours: "Std.",
    minutes: "Min.",
    seconds: "Sek.",
    eventDayTitle: "Heute ist es so weit",
    eventDayLive: "Im Event siehst du, wo du gerade sein solltest.",
  },

  identify: {
    title: "Deine Einladung finden",
    lead: "Gib die E-Mail-Adresse oder Telefonnummer ein, an die deine Einladung ging.",
    placeholder: "E-Mail oder Telefonnummer",
    cta: "Finde mich",
    notFound: "Nicht gefunden — probiere den anderen Kontaktweg oder frag das Paar direkt.",
    failed: "Die Verbindung hat gehakt — bitte tippe noch einmal.",
    demoHint: "Demo-Gäste: demo@vow.app · witness@vow.app",
    welcome: "Willkommen",
    switch: "Gast wechseln",
  },

  schedule: {
    title: "Programm",
    lead: "Dein persönlicher Ablauf — nur für dich sichtbare Punkte sind markiert.",
    onlyForYou: "Nur für dich",
    notes: "Hinweise",
    google: "Google Maps",
    apple: "Apple Karten",
    osm: "OpenStreetMap",
    navigate: "Route",
    parking: "Parken an diesem Ort",
  },

  rsvp: {
    title: "Feierst du mit?",
    lead: "Eine Minute für dich — eine große Hilfe für uns.",
    attending: "Deine Antwort",
    yes: "Mit Freude",
    no: "Leider nicht",
    dietTitle: "Unverträglichkeiten? (optional)",
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
    savedYes: "Wie schön — wir freuen uns auf dich!",
    savedNo: "Du wirst fehlen — danke fürs Bescheidgeben.",
    edit: "Antwort ändern",
    deadlineNote: "Du kannst deine Antwort ändern bis",
    closed: "Die Frist ist vorbei — melde dich bitte direkt beim Paar.",
    bannerTitle: "Du hast noch nicht geantwortet",
    bannerLead: "Wir würden uns freuen zu wissen, ob du kommst. Bitte antworte bis",
    bannerCta: "Jetzt antworten",
    identifyFirst: "Finde zuerst deine Einladung, um zu antworten.",
    plusOneTitle: "Begleitung mitbringen?",
    plusOneLead: "Sag uns wer — das Paar bestätigt jede Begleitung persönlich.",
    plusOneName: "Voller Name der Begleitung",
    plusOneContact: "E-Mail oder Telefon der Begleitung",
    plusOneCta: "Begleitung anfragen",
    plusOnePending: "Angefragt — das Paar meldet sich",
    plusOneApproved: "Bestätigt",
    plusOneRejected: "Diesmal leider nicht möglich",
  },

  live: {
    now: "Gerade jetzt",
    next: "Als Nächstes",
    in: "in",
    remaining: "noch",
    betweenEvents: "Eine kleine Pause — bis gleich.",
    allDone: "Das war's. Danke, dass du mit uns gefeiert hast.",
    title: "Heute",
  },

  stay: {
    title: "Übernachten",
    lead: "Unsere Empfehlungen in der Nähe.",
    recommended: "Empfohlen",
    call: "Anrufen",
    book: "Buchen",
    website: "Website",
    min: "Min.",
  },

  weather: {
    title: "Wetter am Tag",
    lead: "Aus der Vorhersage für den Veranstaltungsort.",
    rain: "Regen",
    clear: "Klarer Himmel",
    cloudy: "Teils bewölkt",
    rainy: "Regen wahrscheinlich",
    snow: "Schnee",
    storm: "Gewitter",
  },

  gallery: {
    title: "Galerie",
    lead: "Momente, die wir bisher gesammelt haben.",
    empty: "Noch keine Fotos — sie erscheinen hier.",
  },

  messages: { title: "Nachrichten", lead: "Notizen des Paares an dich." },

  contact: { title: "Kontakt", lead: "Melde dich jederzeit.", call: "Anrufen", email: "E-Mail" },

  parking: { title: "Parken", lead: "Wo du das Auto lässt." },

  emergency: { title: "Notfall", lead: "Für alle Fälle — griffbereit." },

  calendar: {
    add: "Zum Kalender hinzufügen",
    google: "Google Kalender",
    outlook: "Outlook",
    apple: "Apple / .ics-Datei",
  },

  faq: { title: "Gut zu wissen" },

  gifts: {
    title: "Geschenke",
    lead: "Dass du da bist, ist genug — wer dennoch schenken mag, findet hier ein paar Wege.",
    view: "Link öffnen",
  },

  recommendations: {
    title: "Empfehlungen",
    lead: "Ein paar Orte und Menschen, die wir mögen — für dich ausgewählt.",
    visit: "Ansehen",
  },

  photos: {
    title: "Deine Fotos",
    lead: "Teilt jedes Foto mit uns — direkt vom Handy, ohne App.",
    upload: "Fotos hinzufügen",
    uploadHint: "Tippen zum Auswählen oder Bilder hierher ziehen. Sie werden vor dem Upload komprimiert.",
    yours: "Von dir hochgeladen",
    reviewNote: "das Paar prüft Fotos, bevor sie in der Galerie erscheinen.",
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
