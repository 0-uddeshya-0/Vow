import type { Dict } from "./en";

/**
 * German copy — du/ihr-Form on purpose: twenty close friends and family.
 * NOTE FOR LAUNCH: Michael & Dina proof this dictionary before deploy;
 * see README "Launch checklist".
 */
export const de: Dict = {
  langName: "Deutsch",

  topbar: { rsvp: "Rückmeldung" },

  hero: {
    markSub: "wir trauen uns",
    dateLine: "Freitag, 18. September 2026",
    timeLine: "11:30 Uhr · Standesamt Neu-Ulm",
    intro:
      "Wir wünschen uns nichts mehr, als diesen Tag mit euch zu feiern — vom Ja-Wort am Morgen bis zum letzten Tanz an der Donau.",
    cta: "Bis 30. August antworten",
    calendar: "Termin in den Kalender legen",
  },

  day: {
    title: "Unser Tag",
    lead: "Ein Freitag, sechs kleine Kapitel. Tippt auf einen Ort für die Route.",
    directions: "Route",
    moments: {
      ceremony: { title: "Die Trauung", desc: "Wir sagen Ja auf dem Standesamt." },
      photosMinster: { title: "Fotos am Münster", desc: "Eine stille Stunde unter dem höchsten Kirchturm der Welt." },
      photosPark: { title: "Fotos in der Friedrichsau", desc: "Grünes Licht, alte Bäume, wir zwei — und ihr ganz nah." },
      parade: { title: "Autokorso & Mittagessen", desc: "Wir treffen uns am Parkplatz Friedrichsau und rollen hupend durch die Stadt — danach essen wir zusammen." },
      reception: { title: "Empfang", desc: "Die Gläser hoch im Henrichs 161, direkt am Wasser." },
      dinner: { title: "Abendessen", desc: "Eine lange Tafel, gutes Essen, und der Abend lässt sich Zeit — bis zehn." },
    },
  },

  stay: {
    title: "Übernachten",
    lead: "Bis zum 30. August halten wir in diesen Hotels je zwei Zimmer frei. Bucht telefonisch und nennt unseren Buchungscode.",
    bookingCodeLabel: "Buchungscode",
    bookingCodePending: "kommt mit eurer Einladung",
    visit: "Zur Hotelseite",
  },

  travel: {
    title: "Unterwegs",
    lead: "Zwischen den Orten organisiert ihr euch selbst — alles liegt nah beieinander, und die Taxis kennen den Weg.",
    taxiSearch: "Taxi in der Nähe finden",
  },

  asks: {
    title: "Ein paar Herzensbitten",
    items: [
      { title: "Seid hier, nicht am Handy", desc: "Macht ein Foto, wenn das Herz es will — dann Handy in die Tasche und her zu uns. Der Tag kommt nur einmal." },
      { title: "Wenig Glitzer", desc: "Festliche Kleidung — und den großen Glitzer lasst bitte zuhause." },
      { title: "Nur geladene Gäste", desc: "Wir feiern bewusst klein — dabei sein kann nur, wer eingeladen ist." },
      { title: "Klare Köpfe", desc: "Bitte keine Drogen. Die Bar kümmert sich gut um alle." },
    ],
    emergency: "Wenn am Tag selbst etwas ist, ruft Michael an:",
    emergencyPending: "Nummer kommt mit eurer Einladung",
  },

  faq: {
    title: "Gut zu wissen",
    items: [
      { q: "Was ziehe ich an?", a: "Festlich. Anzug, Kleid, Eleganz — und bequeme Schuhe für den Abend." },
      { q: "Dürfen Kinder mitkommen?", a: "Wir lieben eure Kleinen, aber dieser Tag gehört den Erwachsenen." },
      { q: "Bis wann kann ich antworten?", a: "Bitte bis zum 30. August 2026. Bis dahin könnt ihr eure Antwort über denselben Link jederzeit ändern." },
      { q: "Was gibt es zu essen?", a: "Das Menü entsteht gerade — nennt uns bei der Rückmeldung Allergien und Vorlieben, wir kümmern uns um den Rest." },
    ],
  },

  rsvp: {
    title: "Feiert ihr mit?",
    lead: "Eine Minute für euch — eine große Hilfe für unsere Planung.",
    name: "Euer Name",
    namePlaceholder: "Vor- und Nachname",
    attending: "Seid ihr dabei?",
    yes: "Mit Freude",
    no: "Leider nicht",
    plusOne: "Begleitung?",
    plusOneToggle: "Ich möchte eine Begleitung mitbringen",
    plusOneName: "Name der Begleitung",
    dietTitle: "Essen, das für euch passt",
    dietLead: "Wählt alles Zutreffende — und schreibt uns Allergien in euren eigenen Worten.",
    diet: { vegan: "Vegan", vegetarian: "Vegetarisch", glutenFree: "Glutenfrei", lactoseFree: "Laktosefrei" },
    allergies: "Allergien & Hinweise",
    allergiesPlaceholder: "z. B. starke Nussallergie, kein Alkohol …",
    message: "Ein paar Zeilen für uns (optional)",
    messagePlaceholder: "Wir lesen jedes Wort.",
    send: "Antwort senden",
    thanksYes: "Wie schön — wir freuen uns auf euch!",
    thanksNo: "Ihr werdet uns fehlen — danke fürs Bescheidgeben.",
    editHint: "Bis zum 30. August könnt ihr eure Antwort jederzeit ändern.",
    previewBadge: "Vorschau — Antworten werden noch nicht gespeichert",
  },

  photos: {
    title: "Fotos",
    lead: "Nach der Hochzeit könnt ihr hier alle eure Fotos mit uns teilen — direkt vom Handy, ohne App, ohne Konto.",
    soon: "Öffnet am Hochzeitstag",
  },

  gate: {
    title: "Diese Feier ist nur mit Einladung",
    lead: "Öffnet den persönlichen Link aus eurer Einladung — oder gebt euren Einladungscode ein.",
    placeholder: "Einladungscode",
    enter: "Weiter",
    wrong: "Dieser Code passt nicht — schaut auf eure Einladung oder fragt uns direkt.",
  },

  footer: {
    line: "Mit Liebe gemacht, für einen Freitag im September.",
    monogramAria: "Monogramm von Michael und Dina",
  },

  a11y: {
    themeToLight: "Zum hellen Design wechseln",
    themeToDark: "Zum dunklen Design wechseln",
    langSwitch: "Language: English",
    skip: "Zum Inhalt springen",
  },
};
