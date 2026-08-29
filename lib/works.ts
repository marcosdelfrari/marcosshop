import type { Locale } from "@/lib/i18n";

export type Medium = "woodcut" | "linoleum" | "handmade" | "acrylic";

export type WorkContent = {
  title: string;
  description: string;
};

export type Work = {
  slug: string;
  unique: boolean;
  medium: Medium;
  year: number;
  dimensions: string;
  image?: string;
  images?: string[];
  price: {
    amount: number;
    currency: "EUR" | "USD" | "BRL" | "GBP";
  };
  available: boolean;
  content: Record<Locale, WorkContent>;
};

export const works: Work[] = [
  {
    slug: "oni",
    unique: true,
    medium: "linoleum",
    year: 2026,
    dimensions: "30 × 30 cm",
    images: [
      "/works/oni.webp",
      "/works/oni2.webp",
      "/works/oni3.webp",
      "/works/oni4.webp",
    ],
    price: { amount: 200, currency: "GBP" },
    available: true,
    content: {
      en: {
        title: "ONI",
        description:
          "In Japanese folklore, oni are demons — fierce figures that stand between the everyday world and the supernatural. This piece brings that presence into linoleum: carved by hand and printed with black ink, in the same spirit as traditional woodcut.\n\nEach line is cut into the block; each impression is pulled by hand. The deep blacks and sharp contrasts are meant to feel immediate — as if something from myth has just stepped onto the paper.\n\nUnique piece, 30 × 30 cm. Printed on archival paper. Ships unframed.",
      },
      es: {
        title: "ONI",
        description:
          "En el folclore japonés, los oni son demonios — figuras feroces entre el mundo cotidiano y lo sobrenatural. Esta pieza lleva esa presencia al linóleo: grabada a mano e impresa con tinta negra, al estilo de la xilografía tradicional.\n\nCada línea se talla en el bloque; cada impresión se tira a mano. Los negros profundos y los contrastes nítidos buscan sentirse inmediatos — como si algo del mito acabara de pisar el papel.\n\nPieza única, 30 × 30 cm. Impresa en papel de archivo. Se envía sin marco.",
      },
      fr: {
        title: "ONI",
        description:
          "Dans le folklore japonais, les oni sont des démons — des figures féroces entre le quotidien et le surnaturel. Cette pièce porte cette présence sur linoléum : gravée à la main et imprimée à l'encre noire, dans l'esprit de la gravure sur bois traditionnelle.\n\nChaque ligne est creusée dans le bloc ; chaque épreuve est tirée à la main. Les noirs profonds et les contrastes nets visent l'immédiat — comme si quelque chose du mythe venait de poser le pied sur le papier.\n\nPièce unique, 30 × 30 cm. Imprimée sur papier d'archives. Expédiée sans cadre.",
      },
    },
  },
  {
    slug: "demon",
    unique: true,
    medium: "woodcut",
    year: 2025,
    dimensions: "30 × 20 cm",
    images: [
      "/works/demon.webp",
      "/works/demon2.webp",
      "/works/demon3.webp",
      "/works/demon4.webp",
    ],
    price: { amount: 200, currency: "GBP" },
    available: true,
    content: {
      en: {
        title: "Demon",
        description:
          "A woodcut carved in wood and printed with black ink. The image draws on the contradictory mood of society: things that harm us and yet still evoke what feels pleasurable — vice dressed as temptation, pain mistaken for intensity.\n\nThe composition plays with that tension. What looks seductive from a distance reveals something sharper up close. It is a portrait of the double bind we live in: drawn to what hurts, calling it desire.\n\nUnique piece, 30 × 20 cm. Printed on archival paper. Ships unframed.",
      },
      es: {
        title: "Demon",
        description:
          "Xilografía en madera impresa con tinta negra. La imagen parte del sentimiento contradictorio de la sociedad: cosas que nos hacen daño y aun así remiten a lo placentero — el vicio disfrazado de tentación, el dolor confundido con intensidad.\n\nLa composición juega con esa tensión. Lo que parece seductor de lejos revela algo más afilado de cerca. Es un retrato del doble vínculo en el que vivimos: atraídos por lo que duele, llamándolo deseo.\n\nPieza única, 30 × 20 cm. Impresa en papel de archivo. Se envía sin marco.",
      },
      fr: {
        title: "Demon",
        description:
          "Gravure sur bois imprimée à l'encre noire. L'image part du sentiment contradictoire de la société : ce qui nous blesse et évoque pourtant le plaisant — le vice déguisé en tentation, la douleur prise pour de l'intensité.\n\nLa composition joue avec cette tension. Ce qui paraît séduisant de loin révèle quelque chose de plus tranchant de près. C'est le portrait du double lien dans lequel nous vivons : attirés par ce qui fait mal, en appelant cela du désir.\n\nPièce unique, 30 × 20 cm. Imprimée sur papier d'archives. Expédiée sans cadre.",
      },
    },
  },
  {
    slug: "curva-da-felicidade",
    unique: true,
    medium: "acrylic",
    year: 2021,
    dimensions: "50 × 70 cm",
    images: ["/works/curva.webp", "/works/curva2.webp", "/works/curva3.webp"],
    price: { amount: 900, currency: "GBP" },
    available: true,
    content: {
      en: {
        title: "Curva",
        description:
          "The Happiness Curve can be read as the arc life often draws: we believe we have reached the top, only to fall again soon. Extremes make it feel as if we have hit a limit — yet a larger wave always follows.\n\nThe work maps that rhythm visually. Peaks and troughs repeat; each summit promises permanence, each descent feels like an ending. But the pattern continues — until, perhaps, we reach the ceiling of happiness itself, and the only fall left is final.\n\nUnique piece, 50 × 70 cm. Acrylic painting on canvas. Ships unframed.",
      },
      es: {
        title: "Curva",
        description:
          "La Curva puede entenderse como el arco que la vida traza muchas veces: creemos estar en la cima para caer de nuevo. Los extremos hacen parecer que llegamos al límite — pero pronto viene una ola mayor.\n\nLa obra traza ese ritmo visualmente. Picos y valles se repiten; cada cumbre promete permanencia, cada caída parece un final. Pero el patrón continúa — hasta que, quizá, alcanzamos el cielo de la felicidad, y la única caída que queda es la definitiva.\n\nPieza única, 50 × 70 cm. Pintura acrílica sobre tela. Se envía sin marco.",
      },
      fr: {
        title: "Curva",
        description:
          "La Courbe peut se lire comme l'arc que la vie trace souvent : nous croyons être au sommet pour retomber aussitôt. Les extrêmes donnent l'impression d'avoir atteint une limite — puis une vague plus grande arrive.\n\nL'œuvre cartographie ce rythme visuellement. Pics et creux se répètent ; chaque sommet promet la permanence, chaque chute semble une fin. Mais le motif continue — jusqu'à ce que, peut-être, nous touchions le ciel du bonheur, et que la seule chute restante soit la dernière.\n\nPièce unique, 50 × 70 cm. Peinture acrylique sur toile. Expédiée sans cadre.",
      },
    },
  },
];

export function getWorkImages(work: Work): string[] {
  if (work.images?.length) return work.images;
  if (work.image) return [work.image];
  return [];
}

export function getWorkCover(work: Work): string {
  return getWorkImages(work)[0] ?? "";
}

export function getWork(slug: string): Work | undefined {
  return works.find((work) => work.slug === slug);
}

export function formatPrice(price: Work["price"], locale: Locale): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amount);
}
