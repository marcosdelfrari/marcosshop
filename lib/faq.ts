import type { Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

export type FaqItem = {
  question: string;
  answer: string;
};

const homeFaqs: Record<Locale, FaqItem[]> = {
  en: [
    {
      question: "Do you ship original art to Europe?",
      answer:
        "Yes. Each piece ships unframed from Brazil to addresses across the UK and the European Union. Shipping cost and delivery time depend on destination and carrier — message on WhatsApp before purchase and Marcos will confirm options for your country.",
    },
    {
      question: "Are these prints original or reproductions?",
      answer:
        "Every listed work is an original handmade piece. Woodcuts and linoleum prints are carved and pulled by hand; paintings are unique acrylic works on canvas. There are no open-edition reproductions in this shop.",
    },
    {
      question: "What is this shop?",
      answer:
        "A personal space where Marcos Lucas shows work made over the years — woodcuts, linoleum prints and paintings. Not a gallery, not a brand. Just a place to put pieces that accumulated along the way.",
    },
    {
      question: "How does buying work here?",
      answer:
        "You choose a piece and message on WhatsApp. Marcos replies personally — no intermediary, no automated checkout. Availability, price in EUR and shipping to your country are agreed in conversation.",
    },
    {
      question: "How do I buy a work from this shop?",
      answer:
        "Choose a piece, tap “Inquire on WhatsApp”, and send your name and contact details. Marcos replies personally to confirm availability, price in EUR, and shipping to your European address.",
    },
    {
      question: "What printmaking techniques does Marcos Lucas use?",
      answer:
        "The catalogue includes traditional woodcut (xilogravura), hand-carved linoleum block printing, and acrylic painting on canvas. Each technique is executed manually — carved blocks, hand-pulled impressions, or direct painting.",
    },
    {
      question: "Are the artworks sold framed?",
      answer:
        "No. Works ship unframed so they travel safely and you can frame them locally to match your space. Dimensions are listed on each work page.",
    },
    {
      question: "Who is Marcos Lucas?",
      answer: `Marcos Lucas is a Brazilian artist and front-end engineer from Belo Horizonte. This shop is his personal space to show prints and paintings he has made over the years. More about his professional work is at ${siteConfig.portfolioUrl}.`,
    },
  ],
  es: [
    {
      question: "¿Envías obras originales a Europa?",
      answer:
        "Sí. Cada pieza se envía sin marco desde Brasil a direcciones en el Reino Unido y la Unión Europea. El coste y el plazo dependen del destino — escribe por WhatsApp antes de comprar y Marcos confirmará las opciones para tu país.",
    },
    {
      question: "¿Son grabados originales o reproducciones?",
      answer:
        "Cada obra publicada es una pieza original hecha a mano. Las xilografías y linoleos se tallan e imprimen manualmente; las pinturas son acrílicos únicos sobre tela. No hay reproducciones en edición abierta.",
    },
    {
      question: "¿Qué es esta tienda?",
      answer:
        "Un espacio personal donde Marcos Lucas muestra obra hecha a lo largo de los años — xilografías, linóleos y pinturas. No es una galería ni una marca. Solo un lugar para poner piezas que se fueron acumulando.",
    },
    {
      question: "¿Cómo funciona la compra aquí?",
      answer:
        "Eliges una pieza y escribes por WhatsApp. Marcos responde personalmente — sin intermediario, sin checkout automático. Disponibilidad, precio en EUR y envío a tu país se acuerdan en conversación.",
    },
    {
      question: "¿Cómo compro una obra?",
      answer:
        "Elige una pieza, pulsa “Consultar por WhatsApp” y envía tu nombre y datos de contacto. Marcos responde personalmente para confirmar disponibilidad, precio en EUR y envío a tu dirección europea.",
    },
    {
      question: "¿Qué técnicas de grabado utiliza Marcos Lucas?",
      answer:
        "El catálogo incluye xilografía tradicional, grabado en linóleo tallado a mano y pintura acrílica sobre tela. Cada técnica se ejecuta manualmente.",
    },
    {
      question: "¿Las obras se venden enmarcadas?",
      answer:
        "No. Se envían sin marco para viajar con seguridad y enmarcarlas localmente. Las dimensiones aparecen en cada ficha.",
    },
    {
      question: "¿Quién es Marcos Lucas?",
      answer: `Marcos Lucas es artista e ingeniero front-end brasileño, de Belo Horizonte. Esta tienda es su espacio personal para mostrar grabados y pinturas que ha hecho con los años. Más sobre su trabajo profesional en ${siteConfig.portfolioUrl}.`,
    },
  ],
  fr: [
    {
      question: "Expédiez-vous des œuvres originales en Europe ?",
      answer:
        "Oui. Chaque pièce est expédiée sans cadre depuis le Brésil vers le Royaume-Uni et l'Union européenne. Les frais et délais dépendent de la destination — écrivez sur WhatsApp avant l'achat et Marcos confirmera les options pour votre pays.",
    },
    {
      question: "S'agit-il d'estampes originales ou de reproductions ?",
      answer:
        "Chaque œuvre listée est une pièce originale faite main. Xylographies et linogravures sont gravées et tirées à la main ; les peintures sont des acryliques uniques sur toile. Pas de reproductions en édition ouverte.",
    },
    {
      question: "Qu'est-ce que cette boutique ?",
      answer:
        "Un espace personnel où Marcos Lucas montre des œuvres faites au fil des années — xylographies, linogravures et peintures. Pas une galerie, pas une marque. Juste un endroit pour mettre des pièces accumulées en chemin.",
    },
    {
      question: "Comment acheter ici ?",
      answer:
        "Vous choisissez une pièce et écrivez sur WhatsApp. Marcos répond personnellement — pas d'intermédiaire, pas de paiement automatique. Disponibilité, prix en EUR et livraison vers votre pays se règlent en conversation.",
    },
    {
      question: "Comment acheter une œuvre ?",
      answer:
        "Choisissez une pièce, appuyez sur « Demander sur WhatsApp » et envoyez votre nom et vos coordonnées. Marcos répond personnellement pour confirmer disponibilité, prix en EUR et livraison vers votre adresse européenne.",
    },
    {
      question: "Quelles techniques de gravure utilise Marcos Lucas ?",
      answer:
        "Le catalogue comprend xylographie traditionnelle, linogravure gravée à la main et peinture acrylique sur toile. Chaque technique est exécutée manuellement.",
    },
    {
      question: "Les œuvres sont-elles vendues encadrées ?",
      answer:
        "Non. Les pièces partent sans cadre pour voyager en sécurité et être encadrées chez vous. Les dimensions figurent sur chaque fiche.",
    },
    {
      question: "Qui est Marcos Lucas ?",
      answer: `Marcos Lucas est artiste et ingénieur front-end brésilien, originaire de Belo Horizonte. Cette boutique est son espace personnel pour montrer estampes et peintures faites au fil des années. En savoir plus sur ${siteConfig.portfolioUrl}.`,
    },
  ],
  de: [
    {
      question: "Versenden Sie Originalkunst nach Europa?",
      answer:
        "Ja. Jedes Werk wird ungerahmt aus Brasilien in das Vereinigte Königreich und die Europäische Union geliefert. Versandkosten und Lieferzeit hängen vom Ziel ab — schreiben Sie vor dem Kauf per WhatsApp, Marcos bestätigt die Optionen für Ihr Land.",
    },
    {
      question: "Sind das Originaldrucke oder Reproduktionen?",
      answer:
        "Jedes gelistete Werk ist ein handgemachtes Original. Holzschnitte und Linoldrucke werden geschnitzt und von Hand gedruckt; Gemälde sind einmalige Acrylarbeiten auf Leinwand. Es gibt keine offenen Auflagen-Reproduktionen.",
    },
    {
      question: "Was ist dieser Shop?",
      answer:
        "Ein persönlicher Raum, in dem Marcos Lucas Werke zeigt, die er über die Jahre gemacht hat — Holzschnitte, Linoldrucke und Gemälde. Keine Galerie, keine Marke. Einfach ein Ort für Stücke, die unterwegs entstanden sind.",
    },
    {
      question: "Wie funktioniert der Kauf hier?",
      answer:
        "Sie wählen ein Stück und schreiben per WhatsApp. Marcos antwortet persönlich — kein Mittler, kein automatischer Checkout. Verfügbarkeit, Preis in EUR und Versand in Ihr Land werden im Gespräch geklärt.",
    },
    {
      question: "Wie kaufe ich ein Werk?",
      answer:
        "Wählen Sie ein Stück, tippen Sie auf „Anfrage per WhatsApp“ und senden Sie Name und Kontaktdaten. Marcos antwortet persönlich zu Verfügbarkeit, Preis in EUR und Versand an Ihre europäische Adresse.",
    },
    {
      question: "Welche Drucktechniken verwendet Marcos Lucas?",
      answer:
        "Der Katalog umfasst traditionellen Holzschnitt, handgeschnitzten Linoldruck und Acrylmalerei auf Leinwand. Jede Technik wird manuell ausgeführt.",
    },
    {
      question: "Werden die Werke gerahmt verkauft?",
      answer:
        "Nein. Werke werden ungerahmt versendet, damit sie sicher ankommen und Sie sie vor Ort rahmen können. Maße stehen auf jeder Werkseite.",
    },
    {
      question: "Wer ist Marcos Lucas?",
      answer: `Marcos Lucas ist brasilianischer Künstler und Front-end-Entwickler aus Belo Horizonte. Dieser Shop ist sein persönlicher Raum, um Drucke und Gemälde zu zeigen, die er im Laufe der Jahre gemacht hat. Mehr unter ${siteConfig.portfolioUrl}.`,
    },
  ],
};

export function getFaqs(locale: Locale): FaqItem[] {
  return homeFaqs[locale];
}
