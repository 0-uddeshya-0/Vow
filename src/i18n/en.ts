/**
 * UI chrome strings only. Event CONTENT (welcome text, schedule items, FAQ …)
 * is data, localized per-document as LocalizedText and edited in the Admin
 * CMS — never hardcoded here.
 */
export const en = {
  langName: "English",

  common: {
    demoRibbon: "Demo content — everything here is edited in the Admin CMS",
    loading: "Loading",
    back: "Back",
    save: "Save",
    cancel: "Cancel",
    signOut: "Not you? Switch guest",
  },

  nav: { home: "Home", event: "Event", info: "Info", rsvp: "RSVP", gallery: "Gallery", admin: "Admin" },

  landing: {
    viewEvent: "View event",
    until: "until we celebrate",
    days: "days",
    hours: "hours",
    minutes: "min",
    seconds: "sec",
    eventDayTitle: "Today is the day",
    eventDayLive: "Open the event for where to be, right now.",
  },

  identify: {
    title: "Find your invitation",
    lead: "Enter the email address or phone number your invitation was sent to.",
    placeholder: "Email or phone number",
    cta: "Find me",
    notFound: "We couldn't find that — try the other contact detail, or ask the couple directly.",
    demoHint: "Demo guests: demo@vow.app · witness@vow.app",
    welcome: "Welcome",
    switch: "Switch guest",
  },

  schedule: {
    title: "Schedule",
    lead: "Your personal programme — items only you can see are marked.",
    onlyForYou: "Visible to you",
    notes: "Notes",
    google: "Google Maps",
    apple: "Apple Maps",
    osm: "OpenStreetMap",
    navigate: "Navigate",
    parking: "Parking at this stop",
  },

  rsvp: {
    title: "Will you join us?",
    lead: "It takes a minute — and helps more than you know.",
    attending: "Your answer",
    yes: "With joy",
    no: "Sadly not",
    dietTitle: "Any dietary restrictions? (optional)",
    diet: {
      vegetarian: "Vegetarian",
      vegan: "Vegan",
      gluten_free: "Gluten-free",
      lactose_free: "Lactose-free",
    },
    allergies: "Allergies & notes",
    allergiesPh: "e.g. severe nut allergy …",
    message: "A line for the couple (optional)",
    messagePh: "We read every word.",
    email: "Email",
    phone: "Phone",
    save: "Send my answer",
    saving: "Sending…",
    savedYes: "Wonderful — we can't wait to see you!",
    savedNo: "You'll be missed — thank you for telling us.",
    edit: "Change my answer",
    deadlineNote: "You can change your answer until",
    closed: "The RSVP deadline has passed — reach out to the couple directly.",
    bannerTitle: "You haven't replied yet",
    bannerLead: "We'd love to know if you're coming. Please reply by",
    bannerCta: "RSVP now",
    identifyFirst: "Find your invitation first to reply.",
    plusOneTitle: "Bring someone?",
    plusOneLead: "Tell us who — the couple confirms every plus one personally.",
    plusOneName: "Their full name",
    plusOneContact: "Their email or phone",
    plusOneCta: "Request plus one",
    plusOnePending: "Requested — waiting for the couple",
    plusOneApproved: "Approved",
    plusOneRejected: "Not possible this time",
  },

  live: {
    now: "Happening now",
    next: "Up next",
    in: "in",
    remaining: "still",
    betweenEvents: "A little pause — see you at the next one.",
    allDone: "That's a wrap. Thank you for celebrating with us.",
    title: "Today",
  },

  stay: {
    title: "Where to stay",
    lead: "Our recommendations near the celebration.",
    recommended: "Recommended",
    call: "Call",
    book: "Book",
    website: "Website",
    min: "min",
  },

  weather: {
    title: "Weather on the day",
    lead: "From the forecast for the venue.",
    rain: "rain",
    clear: "Clear skies",
    cloudy: "Partly cloudy",
    rainy: "Rain likely",
    snow: "Snow",
    storm: "Thunderstorms",
  },

  gallery: {
    title: "Gallery",
    lead: "Moments we have collected so far.",
    empty: "No photos yet — they'll appear here.",
  },

  messages: { title: "Messages", lead: "Notes from the couple to you." },

  contact: { title: "Contact", lead: "Reach us any time.", call: "Call", email: "Email" },

  parking: { title: "Parking", lead: "Where to leave the car." },

  emergency: { title: "Emergency", lead: "Just in case — keep these handy." },

  calendar: {
    add: "Add to calendar",
    google: "Google Calendar",
    outlook: "Outlook",
    apple: "Apple / .ics file",
  },

  faq: { title: "Good to know" },

  gifts: {
    title: "Gifts",
    lead: "Your presence is all we ask — but if you'd like to give, here are a few ways.",
    view: "Open link",
  },

  recommendations: {
    title: "Recommendations",
    lead: "A few places and people we love, hand-picked for you.",
    visit: "Visit",
  },

  photos: {
    title: "Your photos",
    lead: "Share every photo you take with us — straight from your phone, no app.",
    upload: "Add photos",
    uploadHint: "Tap to choose, or drop images here. They're compressed on your phone before upload.",
    yours: "Uploaded by you",
    reviewNote: "the couple reviews photos before they appear in the gallery.",
  },

  admin: {
    title: "Admin CMS",
    stub: "The admin area arrives in Phase 3 — with guest management, schedule editor, hotel editor, theme settings, RSVP dashboard and reminders. It authenticates with Firebase and is disabled until then.",
  },

  a11y: {
    themeToLight: "Switch to light theme",
    themeToDark: "Switch to dark theme",
    langSwitch: "Sprache: Deutsch",
    menu: "Menu",
  },
};

export type Dict = typeof en;
