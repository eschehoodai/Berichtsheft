export interface Lernfeld {
  id: number;
  number: string;
  title: string;
  ausbildungsjahr: 1 | 2 | 3;
  richtwertStunden: number;
  fokus: string;
  typischeThemen: string[];
}

export interface IntegrativePosition {
  id: string;
  category: 'HYGIENE' | 'SAFETY' | 'ENVIRONMENT' | 'ORGANIZATION';
  title: string;
  description: string;
  vorschlaege: string[];
}

export const KMK_LERNFELDER: Lernfeld[] = [
  {
    id: 1,
    number: 'LF 1',
    title: 'Die eigene Rolle im Betrieb mitgestalten sowie Beruf und Betrieb repräsentieren',
    ausbildungsjahr: 1,
    richtwertStunden: 40,
    fokus: 'Betriebsorganisation, Rolle des Auszubildenden, Leistungserstellung.',
    typischeThemen: [
      'Rechte und Pflichten im Ausbildungsverhältnis (BBiG)',
      'Arbeits- und Tarifrecht im Gastgewerbe',
      'Betriebsstrukturen und Organisationsplan der Küche',
      'Kundenorientiertes Verhalten und Teamarbeit in der Brigade',
      'Personal- und Betriebshygiene nach HACCP'
    ]
  },
  {
    id: 2,
    number: 'LF 2',
    title: 'Waren bestellen, annehmen, lagern und pflegen',
    ausbildungsjahr: 1,
    richtwertStunden: 40,
    fokus: 'Warenannahme, Frischeprüfung, Lagerung, Qualitätskontrolle.',
    typischeThemen: [
      'Warenannahme & Temperaturmessung bei Kühlware',
      'Lagerarten (Kühlraum, Tiefkühlzelle, Trockenlager)',
      'First-In-First-Out (FIFO) Prinzip',
      'Lagerhygiene und Schädlingsprophylaxe',
      'Lieferscheinprüfung und Mängelrüge'
    ]
  },
  {
    id: 3,
    number: 'LF 3',
    title: 'In der Küche arbeiten',
    ausbildungsjahr: 1,
    richtwertStunden: 120,
    fokus: 'Mise en Place, grundlegende Schnitt- und Arbeitstechniken, Küchengeräte.',
    typischeThemen: [
      'Messerführung und Schneidtechniken (Julienne, Brunoise, Paysanne)',
      'Pflege und Handhabung von Groß- und Kleingeräten (Kombidämpfer, Fritteuse)',
      'Garverfahren: Kochen, Dünsten, Dämpfen, Braten',
      'Mise en Place Vorbereitung für den Posten',
      'Reinigung und Desinfektion von Arbeitsflächen und Schneidbrettern'
    ]
  },
  {
    id: 4,
    number: 'LF 4',
    title: 'Das Restaurant vorbereiten und pflegen',
    ausbildungsjahr: 1,
    richtwertStunden: 40,
    fokus: 'Vorbereitung des Gastraums, Pflege von Textilien und Serviergeräten.',
    typischeThemen: [
      'Eindecken von Tischen nach Anlass',
      'Pflege und Lagerung von Wäsche, Besteck und Porzellan',
      'Bereitstellung von Serviergeräten und Beistelltischen',
      'Gastraumbelüftung und Beleuchtungskonzepte',
      'Abfalltrennung und Entsorgung im Servicebereich'
    ]
  },
  {
    id: 5,
    number: 'LF 5',
    title: 'Gastbezogenen Service im Restaurant durchführen',
    ausbildungsjahr: 1,
    richtwertStunden: 80,
    fokus: 'Serviceregeln, Gästebetreuung, Speisen- und Getränkeausgabe.',
    typischeThemen: [
      'Servierarten (Teller- und Plattenservice)',
      'Kommunikation mit dem Gast und Reklamationsannahme',
      'Speisen- und Getränkeausgabe am Küchenpass',
      'Allergen- und Zusatzstoffkennzeichnung im Gästekontakt',
      'Kassensysteme und Abrechnungsgrundlagen'
    ]
  },
  {
    id: 6,
    number: 'LF 6',
    title: 'Suppen und Saucen herstellen und präsentieren',
    ausbildungsjahr: 2,
    richtwertStunden: 40,
    fokus: 'Brühen, Grundsaucen, Suppeneinlagen, Reduktionen, Anrichten.',
    typischeThemen: [
      'Herstellung von weißen und braunen Grundbrühen (Fond)',
      'Klassische Grundsaucen (Béchamel, Velouté, Demiglace)',
      'Emulsionssaucen (Hollandaise, Béarnaise)',
      'Gebundene Suppen, Püreesuppen und Consommés',
      'Suppeneinlagen und Garnituren'
    ]
  },
  {
    id: 7,
    number: 'LF 7',
    title: 'Gerichte aus Fleischteilen herstellen und präsentieren',
    ausbildungsjahr: 2,
    richtwertStunden: 60,
    fokus: 'Schwein, Rind, Geflügel; Garverfahren (Kochen, Braten, Schmoren).',
    typischeThemen: [
      'Teilstücke von Rind, Schwein, Kalb und Geflügel',
      'Garstufen und Kerntemperaturmessung',
      'Schmorgerichte (Gulasch, Rinderbraten) und Kurzbraten (Steaks, Schnitzel)',
      'Zubereitung von Hackfleischgerichten',
      'Fachgerechte Tranchier- und Anrichtetechniken'
    ]
  },
  {
    id: 8,
    number: 'LF 8',
    title: 'Gerichte aus Fisch herstellen und präsentieren',
    ausbildungsjahr: 2,
    richtwertStunden: 40,
    fokus: 'Süß- und Seewasserfische, Pochieren, Dünsten, Fischgerichte.',
    typischeThemen: [
      'Unterscheidung von Rund- und Plattfischen, Süß- und Seewasserfischen',
      'Fisch filetieren, entgräten und säubern',
      'Garmethoden: Pochieren in Sud, Braten auf der Haut, Dämpfen',
      'Meeresfrüchte (Garnelen, Muscheln) zubereiten',
      'Fischsaucen und Beilagenabstimmung'
    ]
  },
  {
    id: 9,
    number: 'LF 9',
    title: 'Pflanzliche Rohstoffe und Pilze verarbeiten',
    ausbildungsjahr: 2,
    richtwertStunden: 80,
    fokus: 'Sättigungsbeilagen, Gemüsegerichte, Pilzverarbeitung, Vegetarismus.',
    typischeThemen: [
      'Zubereitung von Gemüsegarnituren und Rohkostsalaten',
      'Kartoffel- und Getreidebeilagen (Reis, Teigwaren, Knödel)',
      'Zubereitung von Zucht- und Waldpilzen',
      'Vegetarische und vegane Gerichte zusammenstellen',
      'Schonende Garverfahren zur Nährstofferhaltung'
    ]
  },
  {
    id: 10,
    number: 'LF 10',
    title: 'Süßspeisen herstellen und präsentieren',
    ausbildungsjahr: 2,
    richtwertStunden: 60,
    fokus: 'Warm- und Kaltsüßspeisen, Fruchtkomponenten, Dessertsauce.',
    typischeThemen: [
      'Puddinge, Flammeris und Creme-Desserts (Bayerische Creme, Panna Cotta)',
      'Warme Süßspeisen (Kaiserschmarrn, Aufläufe)',
      'Fruchtspiegel, Kompotte und Coulis',
      'Geliermittel (Gelatine, Agar-Agar) fachgerecht anwenden',
      'Anrichten von Desserttellern mit Dekorelementen'
    ]
  },
  {
    id: 11,
    number: 'LF 11',
    title: 'Speiseeis und Backwaren herstellen und Desserts anrichten',
    ausbildungsjahr: 2,
    richtwertStunden: 40,
    fokus: 'einfache Teige, Speiseeisherstellung, Dessertteller anrichten.',
    typischeThemen: [
      'Teigarten: Rührteig, Mürbeteig, Brandteig und Biskuit',
      'Herstellung von Fruchtsorbets und Rahmeis',
      'Hygienemaßnahmen bei der Eisherstellung',
      'Komposition komplexer Dessertteller',
      'Verwendung von Schokolade und Krokant'
    ]
  },
  {
    id: 12,
    number: 'LF 12',
    title: 'Speisenangebote für Veranstaltungen gastorientiert planen',
    ausbildungsjahr: 2,
    richtwertStunden: 80,
    fokus: 'Menükunde, Buffetplanung, Mengen- und Wareneinsatzberechnung.',
    typischeThemen: [
      'Klassische und moderne 3- bis 5-Gang-Menüfolgen',
      'Buffetkonzepte (Kalt-Warmes Buffet, Fingerfood)',
      'Berechnung von Portionsgrößen und Wareneinsatz',
      'Arbeits- und Ablaufpläne für Bankette erstellen',
      'Nachhaltige Speisenplanung zur Vermeidung von Food Waste'
    ]
  }
];

export const INTEGRATIVE_POSITIONEN: IntegrativePosition[] = [
  {
    id: 'haccp',
    category: 'HYGIENE',
    title: 'HACCP & Betriebshygiene',
    description: 'Einhaltung der Lebensmittelhygiene-Verordnung und Eigenkontrollsystem',
    vorschlaege: [
      'Wareneingangskontrolle inkl. Kerntemperaturmessung durchgeführt und dokumentiert.',
      'Tägliche Kühl- und Tiefkühltemperaturprotokolle kontrolliert.',
      'Desinfektions- und Reinigungsplan auf der Postenstation eingehalten.',
      'Probenahme und Beschriftung von Rückstellproben vorgenommen.'
    ]
  },
  {
    id: 'safety',
    category: 'SAFETY',
    title: 'Arbeitssicherheit & Gesundheitsschutz',
    description: 'Verhütung von Arbeitsunfällen und Handhabung von Arbeitsmitteln',
    vorschlaege: [
      'Sicherheitsunterweisung zur Handhabung von Allschneider und Kutter erhalten.',
      'Prüfung und Tragen der persönlichen Schutzausrüstung (Sicherheitsschuhe, Hitzeschutzhandschuhe).',
      'Verhalten bei Fettbränden und Notfallabschaltung der Küchengeräte wiederholt.',
      'Ergonomisches Heben und Tragen von Schwergut (z.B. Gemüsekisten) angewendet.'
    ]
  },
  {
    id: 'environment',
    category: 'ENVIRONMENT',
    title: 'Umweltschutz & Nachhaltigkeit',
    description: 'Ressourcenschonender Umgang mit Energie, Wasser und Lebensmitteln',
    vorschlaege: [
      'Abfalltrennung (Bioabfall, Wertstoffe, Alt-Speiseöl) konsequent durchgeführt.',
      'Energiesparende Nutzung von Gar- und Spülgeräten beachtet.',
      'Vermeidung von Lebensmittelverschwendung durch gezieltes Tail-to-Table Verwerten.',
      'Verwendung von biologisch abbaubaren Reinigern unterstützt.'
    ]
  }
];
