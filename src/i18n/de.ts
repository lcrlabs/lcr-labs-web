import type { en } from './en';

/**
 * German.
 *
 * Typed against the English dictionary, so a key that exists there and not
 * here is a build error rather than an English sentence appearing on a German
 * page. Product and brand names are never translated; the legal wording on
 * `/de/privacy/` and `/de/imprint/` is the finalized German text and lives in
 * those pages rather than here.
 */
export const de: typeof en = {
  document: {
    lang: 'de',
    ogLocale: 'de_DE',
  },

  site: {
    tagline: 'Durchdachte Software für macOS.',
    description:
      'LCR Labs ist ein unabhängiges Software-Label und entwickelt kleine, fokussierte macOS-Werkzeuge: nativ, datensparsam und bewusst einfach.',
    homeTitle: 'LCR Labs — Durchdachte Software für macOS',
    pageTitle: (title: string) => `${title} — LCR Labs`,
  },

  languages: {
    en: 'Englisch',
    de: 'Deutsch',
  },

  a11y: {
    skipToContent: 'Zum Inhalt springen',
    brandHome: 'LCR Labs — Startseite',
    mainNav: 'Hauptnavigation',
    footerNav: 'Fußzeile',
    breadcrumb: 'Seitenpfad',
    menu: 'Menü',
    languageNav: 'Sprache',
    languageCurrent: (language: string) => `Aktuelle Sprache: ${language}`,
    languageSwitch: (language: string) => `Sprache auf ${language} umstellen`,
    appearanceSwitch: 'Erscheinungsbild wechseln',
    appearanceLight: 'Zum hellen Erscheinungsbild wechseln',
    appearanceDark: 'Zum dunklen Erscheinungsbild wechseln',
  },

  nav: {
    products: 'Produkte',
    about: 'Über uns',
    support: 'Support',
    privacy: 'Datenschutz',
    imprint: 'Impressum',
  },

  footer: {
    tagline: 'Unabhängige Software für macOS.',
    copyright: (year: number) => `© ${year} LCR Labs`,
  },

  status: {
    available: 'Verfügbar',
    beta: 'Beta',
    'coming-soon': 'Demnächst',
    'in-development': 'In Entwicklung',
    'in-planning': 'In Planung',
  },

  product: {
    minimumOS: (version: string) => `${version} oder neuer`,
    specs: {
      platform: 'Plattform',
      requires: 'Erfordert',
      architecture: 'Architektur',
      version: 'Version',
      status: 'Status',
    },
    overview: 'Überblick',
    features: 'Was die App leistet',
    screenshots: 'Screenshots',
    availability: 'Verfügbarkeit',
    availableNote: (name: string) =>
      `${name} ist verfügbar. Die Einzelheiten zur Veröffentlichung stehen hier.`,
    unavailableNote: (name: string) =>
      `${name} ist noch nicht verfügbar. Wie die App vertrieben wird, wird bekanntgegeben; die Einzelheiten zur Veröffentlichung erscheinen hier.`,
    learnMore: 'Mehr erfahren',
    learnMoreAbout: (name: string) => ` über ${name}`,
    supportQuestion: (name: string) => `Fragen zu ${name}?`,
    supportLink: 'Zum Support',
  },

  home: {
    heroText:
      'Kleine, fokussierte Werkzeuge, die sich auf dem Mac selbstverständlich anfühlen — schnell, datensparsam und bewusst einfach.',
    heroAction: (name: string) => `${name} kennenlernen`,

    leadEyebrow: 'Aktueller Schwerpunkt',
    leadHeading: 'Die App, an der LCR Labs gerade arbeitet.',

    principlesEyebrow: 'Grundsätze',
    principlesHeading: 'Wie die Apps entstehen.',
    principles: [
      {
        title: 'Nativ',
        text: 'Entwickelt mit Apples eigenen Frameworks und entlang der macOS-Konventionen, damit sich die Apps so verhalten wie der Rest des Mac.',
      },
      {
        title: 'Datensparsam',
        text: 'Local First, wo immer es praktikabel ist. Kein Konto, kein Analyse-SDK und kein Grund, warum Daten das Gerät verlassen müssten.',
      },
      {
        title: 'Fokussiert',
        text: 'Kleine Werkzeuge mit jeweils einer klaren Aufgabe, bewusst eng gehalten statt zu etwas ausgebaut, das alles ein wenig schlecht kann.',
      },
    ],

    restEyebrow: 'Ebenfalls von LCR Labs',
    restHeading: 'Was danach kommt.',
    restLede:
      'Produkte in einer frühen Phase. Was hier steht, beschreibt die beabsichtigte Richtung und keine fertige Software; einen Veröffentlichungstermin gibt es für beide nicht.',

    aboutHeading: 'Über LCR Labs',
    aboutText:
      'LCR Labs ist ein unabhängiges Software-Label und entwickelt kleine, sorgfältig gestaltete Werkzeuge für macOS. Im Vordergrund stehen native Bedienung, Datenschutz, Performance und langfristiger Nutzen — nicht die Zahl der Funktionen.',
    aboutLink: 'Mehr über LCR Labs',

    ctaTitle: 'Alle Produkte von LCR Labs',
    ctaText: 'Was jedes Produkt leistet, wo es steht und was es voraussetzt.',
    ctaAction: 'Alle Produkte ansehen',
  },

  products: {
    title: 'Produkte',
    description:
      'Alle Produkte von LCR Labs: kleine, native macOS-Werkzeuge, was sie leisten und wo sie stehen.',
    eyebrow: 'Produkte',
    heading: 'Werkzeuge für den Mac',
    lede: 'Jede App hat genau eine Aufgabe. Sie teilen eine Gestaltungssprache, eine Haltung zum Datenschutz und die Vorliebe, die Arbeit auf dem eigenen Rechner zu erledigen.',
    noteReleased: 'Die Verfügbarkeit steht auf der jeweiligen Produktseite.',
    noteUnreleased:
      'Noch ist nichts davon verfügbar. Der Vertriebsweg wird bekanntgegeben, und die Einzelheiten zur Veröffentlichung erscheinen hier.',
    noteCommon: 'Diese Website verkauft und liefert selbst keine Software.',
  },

  about: {
    title: 'Über uns',
    description:
      'LCR Labs ist ein unabhängiges Software-Label und entwickelt kleine, native und datensparsame Werkzeuge für macOS.',
    eyebrow: 'Über uns',
    heading: 'Ein unabhängiges Software-Label',
    intro:
      'LCR Labs entwickelt kleine, sorgfältig gestaltete Werkzeuge für macOS: Programme, die eine Aufgabe richtig erledigen, aussehen und sich verhalten wie das System, auf dem sie laufen, und ansonsten nicht im Weg stehen.',
    practiceHeading: 'Was das in der Praxis bedeutet',
    practiceOne:
      'Die Apps sind in Swift und SwiftUI mit Apples eigenen Frameworks geschrieben und keine verpackten Weboberflächen. Das ist keine technische Vorliebe um ihrer selbst willen — es ist das, was eine App nativ wirken lässt: die richtige Typografie, die richtigen Abstände, funktionierende Tastaturbedienung, sinnvolles Fensterverhalten, korrekte helle und dunkle Erscheinungsbilder und ein Ressourcenbedarf, der klein genug ist, um die App dauerhaft laufen zu lassen.',
    practiceTwo:
      'Daten bleiben standardmäßig auf dem Gerät. Ein Systemmonitor braucht kein Konto, ein Begleiter für Notizen muss keine E-Mails hochladen, und ein Zeiger-Werkzeug hat sich nicht dafür zu interessieren, wie Bildschirme genutzt werden. Wo ein Produkt später von Synchronisierung profitiert, ist nutzergesteuertes iCloud vorgesehen und keine Datenbank in der Hand von LCR Labs.',
    availabilityHeading: 'Verfügbarkeit',
    availabilityText:
      'Bisher ist nichts veröffentlicht. Wie die Apps vertrieben werden, ist noch nicht entschieden und wird hier bekanntgegeben, sobald es feststeht — die Einzelheiten zur Veröffentlichung erscheinen auf der jeweiligen Produktseite. Diese Website erklärt die Produkte; sie ist kein Shop, wickelt keine Zahlungen ab und stellt keine kostenpflichtigen Downloads bereit.',
    contactHeading: 'Kontakt',
    contactBefore: 'Fragen zu den Produkten, Fehlerberichte und Rückmeldungen sind willkommen unter ',
    contactMiddle: ' oder über die ',
    contactSupportLink: 'Support-Seite',
    contactAfter:
      ', auf der steht, was ein Bericht enthalten sollte. Die rechtlichen Kontaktangaben stehen im ',
    contactImprintLink: 'Impressum',
    contactEnd: '.',
    action: 'Zu den Produkten',
  },

  support: {
    title: 'Support',
    description:
      'Hilfe zu einer LCR-Labs-Anwendung: die Kontaktadresse und was ein Bericht enthalten sollte, damit ein Problem nachvollziehbar wird.',
    eyebrow: 'Support',
    heading: 'Hilfe erhalten',
    lede: 'Fragen zu den Produkten, Fehlerberichte und Vorschläge gehen alle an dieselbe Adresse.',
    contactHeading: 'Kontakt zu LCR Labs',
    contactBefore: 'Nachrichten gehen an ',
    contactAfter: '. Dort liest ein Mensch und kein Ticketsystem — formloser Text genügt.',
    reportHeading: 'Was in einen Fehlerbericht gehört',
    reportIntro: 'Vier Angaben machen aus einem Bericht etwas, mit dem sich arbeiten lässt:',
    reportItems: [
      'Die App und ihre Versionsnummer.',
      'Die verwendete macOS-Version.',
      'Was erwartet wurde und was stattdessen passiert ist.',
      'Die Schritte, die das Problem reproduzieren, in der Reihenfolge, in der sie ausgeführt wurden.',
    ],
    reportOutro:
      'Die Schritte sind das Wichtigste. Ein Problem, das sich reproduzieren lässt, lässt sich meist auch beheben; eines, das sich nicht reproduzieren lässt, nur selten.',
    perProductHeading: 'Hinweise zu den einzelnen Produkten',
    privacyHeading: 'Datenschutz',
    privacyBefore:
      'Was die einzelnen Apps mit Daten tun, steht auf ihrer Produktseite; wie diese Website selbst mit Daten umgeht, steht in der ',
    privacyLink: 'Datenschutzerklärung',
    privacyAfter: '.',
  },

  legal: {
    eyebrow: 'Rechtliches',
    updated: 'Stand: September 2026',
    privacyTitle: 'Datenschutzerklärung',
    privacyDescription:
      'Datenschutzerklärung für die Website von LCR Labs: Hosting, Kontaktaufnahme, Speicherdauer und Ihre Rechte nach der DSGVO.',
    privacyLede:
      'Welche personenbezogenen Daten beim Besuch dieser Website verarbeitet werden, zu welchen Zwecken das geschieht und welche Rechte Sie dabei haben.',
    imprintTitle: 'Impressum',
    imprintDescription: 'Anbieterkennzeichnung und Kontaktinformationen für LCR Labs.',
    imprintLede: 'Anbieterkennzeichnung und Kontaktinformationen.',
  },

  notFound: {
    title: 'Seite nicht gefunden',
    description: 'Diese Seite existiert nicht.',
    heading: 'Diese Seite existiert nicht.',
    lede: 'Der Link ist möglicherweise veraltet oder die Seite wurde verschoben. Die Produkte sind ein guter Ausgangspunkt.',
    products: 'Produkte ansehen',
    home: 'Zur Startseite',
  },
};
