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
      question: "What is conceptual indie art?",
      answer:
        "Conceptual, here, means the idea carries the work — folklore, social mood, contradiction, the arc of happiness. Indie means artist-run: no gallery roster, no mass production, no commercial brand behind the catalogue. Alternative because it sits outside the mainstream art market — a direct studio outlet from Belo Horizonte to collectors in Europe and elsewhere.",
    },
    {
      question: "Is this a gallery or a brand?",
      answer:
        "Neither, really. This is an artist-run shop — a personal channel between Marcos Lucas and whoever connects with the work. You inquire directly on WhatsApp; there is no intermediary, no drop-shipping, no reproduction line. It is closer to a small indie label than to a gallery or lifestyle brand.",
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
      answer: `Marcos Lucas is a Brazilian conceptual artist and front-end engineer from Belo Horizonte. This shop is his indie, artist-run outlet for alternative prints and paintings — not a gallery representation. More about his professional work is at ${siteConfig.portfolioUrl}.`,
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
      question: "¿Qué es el arte conceptual indie?",
      answer:
        "Conceptual, aquí, significa que la idea sostiene la obra — folclore, atmósfera social, contradicción, el arco de la felicidad. Indie significa tienda del artista: sin roster de galería, sin producción en masa, sin marca comercial detrás del catálogo. Alternativo porque queda fuera del mercado artístico mainstream — un espacio de estudio directo desde Belo Horizonte hacia coleccionistas en Europa y otros lugares.",
    },
    {
      question: "¿Es una galería o una marca?",
      answer:
        "Ninguna de las dos, en realidad. Es una tienda del artista — un canal personal entre Marcos Lucas y quien conecta con la obra. Consultas directamente por WhatsApp; no hay intermediario, ni dropshipping, ni línea de reproducción. Está más cerca de un sello indie pequeño que de una galería o una marca lifestyle.",
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
      answer: `Marcos Lucas es artista conceptual e ingeniero front-end brasileño, de Belo Horizonte. Esta tienda es su espacio indie dirigido por el artista para grabados y pinturas alternativas — no una representación de galería. Más sobre su trabajo profesional en ${siteConfig.portfolioUrl}.`,
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
      question: "Qu'est-ce que l'art conceptuel indie ?",
      answer:
        "Conceptuel, ici, signifie que l'idée porte l'œuvre — folklore, humeur sociale, contradiction, l'arc du bonheur. Indie signifie boutique d'artiste : pas de roster de galerie, pas de production de masse, pas de marque commerciale derrière le catalogue. Alternatif parce que cela se situe en dehors du marché de l'art mainstream — un atelier direct de Belo Horizonte vers les collectionneurs en Europe et ailleurs.",
    },
    {
      question: "Est-ce une galerie ou une marque ?",
      answer:
        "Ni l'un ni l'autre, vraiment. C'est une boutique d'artiste — un canal personnel entre Marcos Lucas et celles et ceux qui se connectent à l'œuvre. Vous écrivez directement sur WhatsApp ; pas d'intermédiaire, pas de dropshipping, pas de ligne de reproduction. C'est plus proche d'un petit label indie que d'une galerie ou d'une marque lifestyle.",
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
      answer: `Marcos Lucas est artiste conceptuel et ingénieur front-end brésilien, originaire de Belo Horizonte. Cette boutique est son espace indie dirigé par l'artiste pour estampes et peintures alternatives — pas une représentation en galerie. En savoir plus sur ${siteConfig.portfolioUrl}.`,
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
      question: "Was ist konzeptuelle Indie-Kunst?",
      answer:
        "Konzeptuell heißt hier: Die Idee trägt das Werk — Folklore, gesellschaftliche Stimmung, Widerspruch, der Bogen des Glücks. Indie bedeutet künstlergeführter Shop: kein Galerie-Roster, keine Massenproduktion, keine Commercial Brand hinter dem Katalog. Alternativ, weil es außerhalb des Mainstream-Kunstmarkts steht — ein direktes Atelier von Belo Horizonte zu Sammlern in Europa und anderswo.",
    },
    {
      question: "Ist das eine Galerie oder eine Marke?",
      answer:
        "Weder noch, eigentlich. Es ist ein Künstler-Shop — ein persönlicher Kanal zwischen Marcos Lucas und allen, die sich mit dem Werk verbinden. Sie fragen direkt per WhatsApp an; kein Mittler, kein Dropshipping, keine Reproduktionslinie. Es ist näher an einem kleinen Indie-Label als an einer Galerie oder Lifestyle-Marke.",
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
      answer: `Marcos Lucas ist brasilianischer Konzeptkünstler und Front-end-Entwickler aus Belo Horizonte. Dieser Shop ist sein indie, künstlergeführter Raum für alternative Drucke und Gemälde — keine Galerievertretung. Mehr unter ${siteConfig.portfolioUrl}.`,
    },
  ],
};

export function getHomeFaqs(locale: Locale): FaqItem[] {
  return homeFaqs[locale];
}
