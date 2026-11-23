type LotusWindow = Window & {
  lotus?: {
    track: (name: string, properties?: Record<string, string>) => void;
  };
};

const queue: Array<[string, Record<string, string> | undefined]> = [];
let waiting = false;

function lotusWindow() {
  return window as LotusWindow;
}

function flush() {
  const track = lotusWindow().lotus?.track;
  if (!track) return false;

  for (const [name, properties] of queue.splice(0)) {
    track(name, properties);
  }

  return true;
}

export function trackLotus(
  name: string,
  properties?: Record<string, string>,
) {
  if (typeof window === "undefined") return;

  queue.push([name, properties]);
  if (flush() || waiting) return;

  waiting = true;
  const started = Date.now();
  const timer = window.setInterval(() => {
    if (flush() || Date.now() - started > 8000) {
      window.clearInterval(timer);
      waiting = false;
      if (!lotusWindow().lotus) queue.length = 0;
    }
  }, 200);
}

export function trackWhatsApp() {
  trackLotus("contato", { botao: "whatsapp" });
}

export function trackCompra() {
  trackLotus("compra", { botao: "compra" });
}

export function trackCarrinho() {
  trackLotus("carrinho", { botao: "carrinho" });
}
