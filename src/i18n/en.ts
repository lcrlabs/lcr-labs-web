/**
 * English — the site's default language and the source dictionary.
 *
 * `de.ts` is typed against `typeof en`, so a key added here without a German
 * counterpart is a type error rather than a page that silently falls back to
 * English. Values that vary with a product name or a status take an argument
 * instead of being assembled from fragments at the call site: German word
 * order is not English word order, and a sentence built by concatenation can
 * only ever be right in one language.
 *
 * Brand and product names, technical identifiers, URLs and email addresses are
 * deliberately absent — they are the same in both languages and live in the
 * product data or in `lib/site.ts`.
 */
export const en = {
  /** Values for the document itself, not for reading. */
  document: {
    /** `<html lang>`. */
    lang: 'en',
    /** Open Graph locale. */
    ogLocale: 'en_US',
  },

  site: {
    tagline: 'Thoughtful software for macOS.',
    description:
      'LCR Labs is the independent software studio of a solo developer, building small, focused macOS utilities that are native, private and deliberately simple.',
    /** The homepage title, which carries no page name. */
    homeTitle: 'LCR Labs — Thoughtful software for macOS',
    /** Every other page title. */
    pageTitle: (title: string) => `${title} — LCR Labs`,
  },

  /** Names of the site's languages, written in this language. */
  languages: {
    en: 'English',
    de: 'German',
  },

  a11y: {
    skipToContent: 'Skip to content',
    brandHome: 'LCR Labs — home',
    mainNav: 'Main',
    footerNav: 'Footer',
    breadcrumb: 'Breadcrumb',
    menu: 'Menu',
    languageNav: 'Language',
    /** The control that is already active. */
    languageCurrent: (language: string) => `Current language: ${language}`,
    languageSwitch: (language: string) => `Switch language to ${language}`,
    /** Before the appearance is known; replaced by the script below. */
    appearanceSwitch: 'Switch appearance',
    appearanceLight: 'Switch to light appearance',
    appearanceDark: 'Switch to dark appearance',
  },

  nav: {
    products: 'Products',
    about: 'About',
    support: 'Support',
    privacy: 'Privacy',
    imprint: 'Imprint',
  },

  footer: {
    tagline: 'Independent macOS software, built by one developer.',
    copyright: (year: number) => `© ${year} LCR Labs`,
  },

  status: {
    available: 'Available',
    beta: 'Beta',
    'coming-soon': 'Coming soon',
    'in-development': 'In development',
    'in-planning': 'In planning',
  },

  product: {
    /** Requirement line on cards and the spec table. */
    minimumOS: (version: string) => `${version} or later`,
    specs: {
      platform: 'Platform',
      requires: 'Requires',
      architecture: 'Architecture',
      version: 'Version',
      status: 'Status',
    },
    overview: 'Overview',
    features: 'What it does',
    screenshots: 'Screenshots',
    availability: 'Availability',
    availableNote: (name: string) => `${name} is available. Release details are published here.`,
    unavailableNote: (name: string) =>
      `${name} is not yet available. Distribution will be announced, and release details will be published here.`,
    learnMore: 'Learn more',
    learnMoreAbout: (name: string) => ` about ${name}`,
    supportQuestion: (name: string) => `Questions about ${name}?`,
    supportLink: 'Get support',
  },

  home: {
    heroText:
      'Small, focused tools designed to feel at home on the Mac — fast, private and deliberately simple.',
    heroAction: (name: string) => `Meet ${name}`,

    leadEyebrow: 'The current focus',
    leadHeading: 'The app LCR Labs is building right now.',

    principlesEyebrow: 'Principles',
    principlesHeading: 'How the apps are built.',
    principles: [
      {
        title: 'Native',
        text: 'Built with Apple’s own frameworks and designed around macOS conventions, so the apps behave the way the rest of your Mac does.',
      },
      {
        title: 'Private',
        text: 'Local-first wherever it is practical. No account to create, no analytics SDK, and no reason for your data to leave the device.',
      },
      {
        title: 'Focused',
        text: 'Small tools with one clear job each, kept deliberately narrow instead of grown into something that does everything poorly.',
      },
    ],

    /** Fallback eyebrow when the listed products share no single status. */
    restEyebrow: 'Also from LCR Labs',
    restHeading: 'What comes after that.',
    restLede:
      'Early-stage products. What is written about them is intended direction rather than finished software, and neither has a release date.',

    aboutHeading: 'About LCR Labs',
    aboutText:
      'LCR Labs is my independent software studio: one developer building small, carefully designed tools for macOS, with an emphasis on native interaction, privacy, performance and long-term usefulness rather than feature count.',
    aboutLink: 'More about LCR Labs',

    ctaTitle: 'Every LCR Labs product',
    ctaText: 'What each one does, where it stands and what it requires.',
    ctaAction: 'View all products',
  },

  products: {
    title: 'Products',
    description:
      'Every LCR Labs product: small, native macOS utilities, what each one does and where it stands.',
    eyebrow: 'Products',
    heading: 'Utilities for the Mac',
    lede: 'Each app does one job. They share a design language, a privacy stance and a preference for doing the work on your own machine.',
    noteReleased: 'Availability is listed on each product page.',
    noteUnreleased:
      'None of these are available yet. Distribution will be announced, and release details will be published here.',
    noteCommon: 'This site does not sell or deliver software itself.',
  },

  about: {
    title: 'About',
    description:
      'LCR Labs is the independent software studio of a solo developer, building small, native, privacy-respecting utilities for macOS.',
    eyebrow: 'About',
    heading: 'An independent software studio',
    intro:
      'LCR Labs is my independent software studio. As a solo developer I build small, carefully designed tools for macOS: utilities that do one job properly, look and behave like the system they run on, and stay out of the way the rest of the time.',
    practiceHeading: 'What that means in practice',
    practiceOne:
      'I write the apps in Swift and SwiftUI using Apple’s own frameworks, rather than wrapping web interfaces. That is not a technical preference for its own sake — it is what makes an app feel native: the right typography, the right spacing, working keyboard navigation, sensible window behaviour, correct dark and light appearances, and a resource footprint small enough that you can leave the app running.',
    practiceTwo:
      'Data stays on the device by default. A system monitor should not need an account, a note-taking companion should not upload your email, and a pointer utility should not be interested in how you use your displays. Where a product later benefits from synchronisation, the intent is user-controlled iCloud rather than a database owned by LCR Labs.',
    availabilityHeading: 'Availability',
    availabilityText:
      'Nothing has been released yet. How the apps will be distributed has not been decided, and it will be announced here once it is — release details for each product are published on its own page. This website exists to explain the products; it is not a shop, it processes no payments and it hosts no paid downloads.',
    contactHeading: 'Contact',
    /** Split around the three links the sentence carries. */
    contactBefore: 'Product questions, bug reports and feedback are welcome at ',
    contactMiddle: ', or through the ',
    contactSupportLink: 'support page',
    contactAfter: ', which says what is worth including. Legal contact details are listed in the ',
    contactImprintLink: 'imprint',
    contactEnd: '.',
    action: 'View the products',
  },

  support: {
    title: 'Support',
    description:
      'Get help with an LCR Labs application: where to write, and what to include so a problem can be reproduced.',
    eyebrow: 'Support',
    heading: 'Getting help',
    lede: 'Product questions, bug reports and feature suggestions all go to the same place.',
    contactHeading: 'Contacting LCR Labs',
    contactBefore: 'Write to ',
    contactAfter: '. I read it myself — there is no ticket system, so plain prose is fine.',
    reportHeading: 'What to include in a bug report',
    reportIntro: 'Four things make a report something that can actually be acted on:',
    reportItems: [
      'The app and its version number.',
      'Your macOS version.',
      'What you expected to happen, and what happened instead.',
      'The steps that reproduce it, in the order you took them.',
    ],
    reportOutro:
      'The steps matter most. A problem that can be reproduced is usually a problem that can be fixed; one that cannot be reproduced rarely is.',
    perProductHeading: 'Per-product notes',
    privacyHeading: 'Privacy',
    privacyBefore:
      'What each app does with your data is described on its product page, and this website’s own data handling is described in the ',
    privacyLink: 'privacy notice',
    privacyAfter: '.',
  },

  legal: {
    eyebrow: 'Legal',
    updated: 'Last updated: September 2026',
    privacyTitle: 'Privacy Policy',
    privacyDescription:
      'Privacy policy for the LCR Labs website: hosting, contact by email, storage periods and your rights under the GDPR.',
    privacyLede:
      'Which personal data is processed when you visit this website, for what purposes, and what rights you have.',
    imprintTitle: 'Legal Notice',
    imprintDescription: 'Provider identification and contact details for LCR Labs.',
    imprintLede: 'Provider identification and contact details.',
  },

  notFound: {
    title: 'Page not found',
    description: 'This page does not exist.',
    heading: 'This page does not exist.',
    lede: 'The link may be out of date, or the page may have moved. The products are a good place to start.',
    products: 'View products',
    home: 'Go to the homepage',
  },
};
