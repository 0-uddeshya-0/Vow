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

  nav: { home: "Start", event: "Event", rsvp: "Rückmeldung", gallery: "Galerie", admin: "Admin" },

  landing: {
    viewEvent: "Zum Event",
    until: "bis wir feiern",
    days: "Tage",
    hours: "Std.",
    minutes: "Min.",
    seconds: "Sek.",
    eventDayTitle: "Heute ist es so weit",
    eventDayLive: "Im Event seht ihr, wo ihr gerade sein solltet.",
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
    parking: "Parken an diesem Ort",
  },

  rsvp: {
    title: "Feiert ihr mit?",
    lead: "Eine Minute für euch — eine große Hilfe für uns.",
    attending: "Eure Antwort",
    yes: "Mit Freude",
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
    savedNo: "Ihr werdet fehlen — danke fürs Bescheidgeben.",
    edit: "Antwort ändern",
    deadlineNote: "Ihr könnt eure Antwort ändern bis",
    closed: "Die Frist ist vorbei — meldet euch bitte direkt beim Paar.",
    bannerTitle: "Ihr habt noch nicht geantwortet",
    bannerLead: "Wir würden uns freuen zu wissen, ob ihr kommt. Bitte antwortet bis",
    bannerCta: "Jetzt antworten",
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

  live: {
    now: "Gerade jetzt",
    next: "Als Nächstes",
    in: "in",
    remaining: "noch",
    betweenEvents: "Eine kleine Pause — bis gleich.",
    allDone: "Das war's. Danke, dass ihr mit uns gefeiert habt.",
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

  messages: { title: "Nachrichten", lead: "Notizen des Paares an euch." },

  contact: { title: "Kontakt", lead: "Meldet euch jederzeit.", call: "Anrufen", email: "E-Mail" },

  parking: { title: "Parken", lead: "Wo ihr das Auto lasst." },

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
    lead: "Dass ihr da seid, ist genug — wer dennoch schenken mag, findet hier ein paar Wege.",
    view: "Link öffnen",
  },

  recommendations: {
    title: "Empfehlungen",
    lead: "Ein paar Orte und Menschen, die wir mögen — für euch ausgewählt.",
    visit: "Ansehen",
  },

  photos: {
    title: "Eure Fotos",
    lead: "Teilt jedes Foto mit uns — direkt vom Handy, ohne App.",
    upload: "Fotos hinzufügen",
    uploadHint: "Tippen zum Auswählen oder Bilder hierher ziehen. Sie werden vor dem Upload komprimiert.",
    yours: "Von euch hochgeladen",
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
