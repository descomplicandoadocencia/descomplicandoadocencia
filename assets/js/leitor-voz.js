/**
 * leitor-voz.js — leitura em voz alta (Text-to-Speech) dos posts do blog.
 *
 * Usa SOMENTE a Web Speech API nativa (window.speechSynthesis): sem serviço
 * externo, sem back-end, sem custo. Carregado por templates/post.html.
 *
 * O que o módulo faz
 *  1. Escolhe automaticamente a voz mais natural em pt-BR que o navegador tiver
 *     (Microsoft "Natural/Online" > Google > Apple "Enhanced/Premium" > outras),
 *     com fallback para qualquer voz "pt" e, por fim, para o padrão do sistema.
 *  2. Divide o artigo em blocos (h1–h6, p, li, blockquote, dt, dd) e cada bloco
 *     em trechos de até MAX_CARACTERES. As falas são enfileiradas UMA DE CADA VEZ:
 *     o Chrome interrompe falas longas (≈15 s) e perde eventos de falas
 *     acumuladas, então só a próxima é criada quando a atual termina.
 *  3. Ignora <pre>, <code>, legendas (<figcaption>), navegação, tags, texto só
 *     para leitor de tela (.visually-hidden) e qualquer [data-no-tts].
 *  4. Destaca o bloco lido com a classe .tts-lendo (estilo em styles.css, 6.3).
 *  5. Controles: Ouvir/Pausar/Retomar, Parar e velocidade (salva em localStorage).
 *  6. Cancela a fala ao sair/recarregar a página (beforeunload e pagehide).
 *
 * Melhoria progressiva: a barra (`[data-leitor-voz]`) nasce com `hidden` e só é
 * exibida se o navegador tiver speechSynthesis. Sem suporte ou sem JavaScript, a
 * página continua igual, sem botões que não funcionam.
 *
 * As funções puras (escolherVoz, dividirTexto, coletarBlocos...) são exportadas
 * para facilitar testes.
 */

/* ---------- Configuração (ajuste aqui) ------------------------------------ */

/**
 * Tamanho máximo de cada fala. Textos longos numa só chamada travam no Chrome e as
 * vozes "Google" (de rede) cortam a fala por volta de 15 s. A ~17 caracteres/s,
 * 150 caracteres levam ≈ 9 s em 1x e ≈ 12 s em 0,75x: fica abaixo do corte.
 */
export const MAX_CARACTERES = 150;

/** Velocidades oferecidas — devem coincidir com os <option> da barra no template. */
const VELOCIDADES = [0.75, 1, 1.25, 1.5, 2];

/** Classe CSS aplicada ao bloco que está sendo lido. */
const CLASSE_DESTAQUE = "tts-lendo";

/** Blocos de texto que viram "parágrafos" da fila. */
const SELETOR_BLOCOS = "h1, h2, h3, h4, h5, h6, p, li, blockquote, dt, dd";

/** Elementos que NUNCA são lidos (nem o que estiver dentro deles). */
const SELETOR_IGNORAR = [
  "pre",
  "code",
  "figcaption",
  "nav",
  "script",
  "style",
  "noscript",
  "svg",
  "iframe",
  "audio",
  "video",
  "[hidden]",
  "[aria-hidden='true']",
  "[data-no-tts]",
  ".visually-hidden", // ex.: "(abre em nova aba)" dentro dos links
  ".meta-list", // lista de tags do post
  ".leitor-voz", // a própria barra de controle
].join(", ");

/** Blocos aninhados: cada um é lido como item próprio, não junto com o pai. */
const SELETOR_ANINHADOS = "ul, ol, dl, p, li, blockquote, table, h1, h2, h3, h4, h5, h6";

const CHAVE_VELOCIDADE = "leitor-voz:velocidade";
const ATRASO_APOS_CANCELAR_MS = 60; // alguns navegadores ignoram speak() colado em cancel()
const ESPERA_RETOMAR_MS = 600; // tempo para conferir se resume() realmente funcionou
const MAX_ERROS_SEGUIDOS = 3;

/* ---------- Texto: extração e divisão ------------------------------------- */

/** Limpa o texto para a fala: sem espaços repetidos, URLs soltas ou separadores visuais. */
function limpar(texto) {
  return texto
    .replace(/[​-‍﻿­]/g, "") // caracteres invisíveis
    .replace(/\bhttps?:\/\/\S+/gi, "link") // URL lida letra por letra é ruim de ouvir
    .replace(/[·•▪◦|]+/g, ", ") // separadores visuais (ex.: "data · autoria")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Texto que ESTE bloco fala: o que sobra depois de tirar código, legendas etc.
 * e os blocos filhos (que entram na fila como itens próprios).
 */
export function textoDoBloco(el) {
  const copia = el.cloneNode(true);
  copia.querySelectorAll(`${SELETOR_IGNORAR}, ${SELETOR_ANINHADOS}`).forEach((no) => no.remove());
  copia.querySelectorAll("br").forEach((br) => br.replaceWith(" "));
  return limpar(copia.textContent ?? "");
}

/** Lista, em ordem de leitura, os blocos com texto falável dentro de `raiz`. */
export function coletarBlocos(raiz) {
  const blocos = [];
  raiz.querySelectorAll(SELETOR_BLOCOS).forEach((el) => {
    if (el.closest(SELETOR_IGNORAR)) return;
    const texto = textoDoBloco(el);
    if (/[\p{L}\p{N}]/u.test(texto)) blocos.push({ el, texto }); // descarta "—", "•", emojis soltos
  });
  return blocos;
}

/**
 * Divide um texto em trechos de até `max` caracteres, preferindo o fim de frase
 * (agrupa frases curtas) e, só se uma frase for longa demais, vírgulas e espaços.
 * Nada é perdido: juntar os trechos devolve o texto original.
 */
export function dividirTexto(texto, max = MAX_CARACTERES) {
  const limpo = texto.replace(/\s+/g, " ").trim();
  if (!limpo) return [];
  if (limpo.length <= max) return [limpo];

  const frases = limpo.match(/[^.!?…]+[.!?…]*["”’')\]]*\s*|[.!?…]+\s*/g) ?? [limpo];
  const trechos = [];
  let atual = "";
  const fechar = () => {
    if (atual.trim()) trechos.push(atual.trim());
    atual = "";
  };

  for (const frase of frases) {
    if ((atual + frase).trim().length <= max) {
      atual += frase;
      continue;
    }
    fechar();
    if (frase.trim().length <= max) {
      atual = frase;
      continue;
    }
    // Frase maior que o limite: corta na última vírgula/pausa (ou espaço) que couber.
    let resto = frase.trim();
    while (resto.length > max) {
      const pausa = Math.max(
        resto.lastIndexOf(", ", max - 1),
        resto.lastIndexOf("; ", max - 1),
        resto.lastIndexOf(": ", max - 1),
        resto.lastIndexOf(" – ", max - 1)
      );
      let corte = pausa >= max * 0.4 ? pausa + 1 : resto.lastIndexOf(" ", max);
      if (corte <= 0) corte = max; // palavra gigante, sem espaço: corte seco
      trechos.push(resto.slice(0, corte).trim());
      resto = resto.slice(corte).trim();
    }
    atual = resto;
  }
  fechar();
  return trechos;
}

/** Fila de falas: cada item sabe a qual bloco (elemento) pertence, para o destaque. */
export function montarFila(blocos) {
  const fila = [];
  blocos.forEach((bloco, i) => {
    dividirTexto(bloco.texto).forEach((texto) => fila.push({ el: bloco.el, texto, bloco: i }));
  });
  return { fila, totalBlocos: blocos.length };
}

/* ---------- Voz ----------------------------------------------------------- */

const normalizarLang = (voz) => String(voz.lang || "").replace("_", "-").toLowerCase(); // Android usa "pt_BR"

/**
 * Escolhe a melhor voz pt-BR disponível. Devolve null se não houver nenhuma voz
 * "pt": nesse caso a fala usa lang="pt-BR" e o navegador decide (padrão do sistema).
 */
export function escolherVoz(vozes) {
  let candidatas = vozes.filter((voz) => normalizarLang(voz) === "pt-br");
  if (!candidatas.length) candidatas = vozes.filter((voz) => normalizarLang(voz).startsWith("pt"));
  if (!candidatas.length) return null;

  const pontos = (voz) => {
    let p = 0;
    if (/natural|neural|online/i.test(voz.name)) p += 100; // Edge/Microsoft "Online (Natural)": as mais naturais
    if (/google/i.test(voz.name)) p += 70;
    if (/microsoft/i.test(voz.name)) p += 50;
    if (/premium|enhanced|aprimorad|siri/i.test(voz.name)) p += 60; // vozes melhoradas do macOS/iOS
    if (voz.default) p += 5;
    return p;
  };

  return candidatas
    .map((voz, ordem) => ({ voz, ordem, p: pontos(voz) }))
    .sort((a, b) => b.p - a.p || a.ordem - b.ordem)[0].voz; // empate: mantém a ordem do navegador
}

/* ---------- Preferência de velocidade ------------------------------------- */

function lerVelocidade() {
  try {
    const salva = Number(localStorage.getItem(CHAVE_VELOCIDADE));
    return VELOCIDADES.includes(salva) ? salva : 1;
  } catch {
    return 1; // localStorage bloqueado (janela privada, política do navegador)
  }
}

function salvarVelocidade(valor) {
  try {
    localStorage.setItem(CHAVE_VELOCIDADE, String(valor));
  } catch {
    /* sem persistência: a escolha vale só nesta visita */
  }
}

/* ---------- Leitor -------------------------------------------------------- */

/**
 * Liga a barra de controle ao texto de `raiz`.
 * @param {HTMLElement} barra  elemento [data-leitor-voz] do template
 * @param {HTMLElement} raiz   elemento cujo texto será lido (o <article> do post)
 * @returns controle { parar } ou null se o navegador não tiver síntese de voz
 */
export function iniciarLeitorVoz(barra, raiz) {
  const synth = window.speechSynthesis;
  if (!synth || typeof window.SpeechSynthesisUtterance !== "function") return null; // barra continua oculta

  const campo = (nome) => barra.querySelector(`[data-leitor-voz-${nome}]`);
  const el = {
    alternar: campo("alternar"),
    parar: campo("parar"),
    velocidade: campo("velocidade"),
    rotulo: campo("rotulo"),
    progresso: campo("progresso"),
    status: campo("status"),
    iconeTocar: barra.querySelector('[data-icone="tocar"]'),
    iconePausar: barra.querySelector('[data-icone="pausar"]'),
  };
  if (Object.values(el).some((item) => !item)) return null; // template incompleto

  /* Estado ---------------------------------------------------------------- */
  let estado = "parado"; // "parado" | "lendo" | "pausado"
  let fila = [];
  let totalBlocos = 0;
  let indice = 0; // posição na fila
  let ficha = 0; // sobe a cada nova fala/cancelamento: eventos de falas antigas são ignorados
  let falaAtual = null; // referência forte: o Chrome descarta falas sem referência e perde o "end"
  let atividade = 0; // conta eventos da fala; detecta um resume() que não fez nada
  let reiniciarAoRetomar = false; // a fala pausada não pode ser continuada (ex.: Android) ou mudou o ritmo
  let errosSeguidos = 0;
  let voz = null;
  let velocidade = lerVelocidade();
  let destacado = null;

  const atualizarVoz = () => {
    voz = escolherVoz(synth.getVoices());
  };

  /* Interface ------------------------------------------------------------- */
  const anunciar = (mensagem) => {
    el.status.textContent = mensagem; // região role="status": leitores de tela anunciam mudanças de estado
  };

  function atualizarInterface() {
    el.rotulo.textContent = { parado: "Ouvir", lendo: "Pausar", pausado: "Retomar" }[estado];
    // toggleAttribute (e não a propriedade .hidden): elementos SVG não têm .hidden.
    el.iconeTocar.toggleAttribute("hidden", estado === "lendo");
    el.iconePausar.toggleAttribute("hidden", estado !== "lendo");
    barra.dataset.estado = estado; // gancho para CSS
    // aria-disabled (e não disabled) mantém o botão focável: o foco não se perde ao clicar em "Parar".
    el.parar.setAttribute("aria-disabled", String(estado === "parado"));
    if (estado === "parado") el.progresso.textContent = "";
  }

  function mostrarProgresso() {
    const item = fila[indice];
    if (item) el.progresso.textContent = `Trecho ${item.bloco + 1} de ${totalBlocos}`;
  }

  /** Altura da área coberta pelo cabeçalho fixo (e pela barra, quando ela está "grudada"). */
  function alturaCoberta() {
    const cabecalho = document.querySelector(".site-header");
    const base = cabecalho ? cabecalho.getBoundingClientRect().bottom : 0;
    const r = barra.getBoundingClientRect();
    return r.top <= base + 1 ? Math.max(base, r.bottom) : base;
  }

  /** Destaca o bloco e só rola a página se ele estiver fora da área visível. */
  function destacar(bloco) {
    if (destacado === bloco) return;
    destacado?.classList.remove(CLASSE_DESTAQUE);
    destacado = bloco;
    if (!bloco) return;
    bloco.classList.add(CLASSE_DESTAQUE);

    const r = bloco.getBoundingClientRect();
    if (r.top >= alturaCoberta() && r.bottom <= window.innerHeight) return;
    const reduzir = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    bloco.scrollIntoView({
      block: r.height > window.innerHeight * 0.6 ? "start" : "center",
      behavior: reduzir ? "auto" : "smooth",
    });
  }

  /* Fala ------------------------------------------------------------------ */

  /** Cancela tudo e garante que o navegador não fique "preso" em pausa. */
  function limparFila() {
    synth.cancel();
    if (synth.paused) synth.resume(); // Chrome mantém paused=true após cancel() e a próxima fala não toca
  }

  /** Fala o trecho `indice` com a voz e a velocidade atuais. */
  function falar() {
    const item = fila[indice];
    if (!item) return;
    const minha = ++ficha;
    if (!voz) atualizarVoz(); // as vozes podem ter carregado depois do início da página

    const fala = new window.SpeechSynthesisUtterance(item.texto);
    if (voz) {
      fala.voice = voz;
      fala.lang = String(voz.lang).replace("_", "-");
    } else {
      fala.lang = "pt-BR"; // sem voz pt: o navegador usa o padrão do sistema para este idioma
    }
    fala.rate = velocidade;

    fala.onstart = () => {
      if (minha !== ficha) return;
      atividade += 1;
      destacar(item.el);
      mostrarProgresso();
    };
    fala.onend = () => {
      if (minha !== ficha) return;
      atividade += 1;
      errosSeguidos = 0;
      aoTerminarTrecho();
    };
    fala.onerror = (evento) => {
      if (minha !== ficha) return;
      atividade += 1;
      aoErro(evento);
    };

    falaAtual = fala;
    synth.speak(fala);
  }

  /** Cancela a fala corrente e repete o trecho atual (nova velocidade, retomada, início). */
  function reiniciarTrecho() {
    const minha = ++ficha;
    limparFila();
    setTimeout(() => {
      if (minha === ficha && estado === "lendo") falar();
    }, ATRASO_APOS_CANCELAR_MS);
  }

  function aoTerminarTrecho() {
    if (estado === "pausado") {
      reiniciarAoRetomar = true; // pause() encerrou a fala (Android): repete o trecho ao retomar
      return;
    }
    if (estado !== "lendo") return;
    indice += 1;
    if (indice >= fila.length) {
      concluir();
      return;
    }
    falar();
  }

  function aoErro(evento) {
    const tipo = evento && evento.error;
    if (tipo === "canceled" || tipo === "interrupted") {
      // Cancelamento que não partiu daqui (outra aba, extensão, o próprio navegador).
      if (estado === "pausado") reiniciarAoRetomar = true;
      else parar("Leitura interrompida.");
      return;
    }
    if (tipo === "not-allowed") {
      parar("O navegador bloqueou o áudio. Use o botão Ouvir novamente.");
      return;
    }
    errosSeguidos += 1; // synthesis-failed, audio-busy, network, voice-unavailable...
    if (errosSeguidos >= MAX_ERROS_SEGUIDOS) {
      parar("Não foi possível reproduzir a voz neste navegador.");
      return;
    }
    aoTerminarTrecho(); // pula o trecho com problema
  }

  /* Ações ----------------------------------------------------------------- */

  function redefinir() {
    ficha += 1;
    estado = "parado";
    indice = 0;
    reiniciarAoRetomar = false;
    errosSeguidos = 0;
    falaAtual = null;
    destacar(null);
    atualizarInterface();
    desligarSaida();
  }

  function concluir() {
    redefinir();
    anunciar("Leitura concluída.");
  }

  function parar(mensagem = "Leitura parada.") {
    limparFila();
    redefinir();
    anunciar(mensagem);
  }

  function iniciar() {
    const montada = montarFila(coletarBlocos(raiz));
    if (!montada.fila.length) {
      anunciar("Não há texto para ler neste artigo.");
      return;
    }
    fila = montada.fila;
    totalBlocos = montada.totalBlocos;
    indice = 0;
    errosSeguidos = 0;
    reiniciarAoRetomar = false;
    estado = "lendo";
    atualizarInterface();
    ligarSaida();
    anunciar("Leitura iniciada.");
    reiniciarTrecho(); // cancela qualquer fila "presa" de antes e começa pelo título
  }

  function pausar() {
    if (synth.speaking) synth.pause();
    else reiniciarAoRetomar = true; // pausou no intervalo entre dois trechos
    estado = "pausado";
    atualizarInterface();
    anunciar("Leitura pausada.");
  }

  function retomar() {
    estado = "lendo";
    atualizarInterface();
    anunciar("Leitura retomada.");
    if (reiniciarAoRetomar || !synth.paused) {
      reiniciarAoRetomar = false;
      reiniciarTrecho();
      return;
    }
    const marca = atividade;
    synth.resume();
    // Em alguns navegadores resume() após uma pausa longa não faz nada: se nenhum
    // evento chegou e nada está sendo falado, repete o trecho.
    setTimeout(() => {
      if (estado === "lendo" && atividade === marca && !synth.speaking) reiniciarTrecho();
    }, ESPERA_RETOMAR_MS);
  }

  function mudarVelocidade(valor) {
    if (!VELOCIDADES.includes(valor)) return;
    velocidade = valor;
    salvarVelocidade(valor);
    if (estado === "lendo") reiniciarTrecho(); // vale já para o trecho atual
    else if (estado === "pausado") reiniciarAoRetomar = true; // a fala pausada manteria o ritmo antigo
  }

  /* Saída da página ------------------------------------------------------- */
  // Interrompe o áudio ao recarregar/fechar/navegar. O "beforeunload" só fica
  // registrado enquanto há leitura em andamento, para não impedir o cache de
  // páginas (bfcache) de quem não usou o leitor.
  const cancelarAoSair = () => synth.cancel();
  const ligarSaida = () => window.addEventListener("beforeunload", cancelarAoSair);
  function desligarSaida() {
    window.removeEventListener("beforeunload", cancelarAoSair);
  }
  window.addEventListener("pagehide", cancelarAoSair); // mais confiável em celulares
  window.addEventListener("pageshow", (evento) => {
    if (evento.persisted) redefinir(); // voltou do cache: a fala foi cancelada em pagehide
  });

  /* Ligações -------------------------------------------------------------- */
  el.alternar.addEventListener("click", () => {
    if (estado === "parado") iniciar();
    else if (estado === "lendo") pausar();
    else retomar();
  });
  el.parar.addEventListener("click", () => {
    if (estado !== "parado") parar();
  });

  el.velocidade.value = String(velocidade);
  el.velocidade.addEventListener("change", () => mudarVelocidade(Number(el.velocidade.value)));

  if (typeof synth.addEventListener === "function") synth.addEventListener("voiceschanged", atualizarVoz);
  else synth.onvoiceschanged = atualizarVoz;
  atualizarVoz();

  // A barra grudada deve ficar logo abaixo do cabeçalho fixo, qualquer que seja a altura dele.
  const cabecalho = document.querySelector(".site-header");
  if (cabecalho && "ResizeObserver" in window) {
    const medir = () => document.documentElement.style.setProperty("--leitor-topo", `${cabecalho.offsetHeight}px`);
    new ResizeObserver(medir).observe(cabecalho);
    medir();
  }

  atualizarInterface();
  barra.hidden = false;

  return { parar: () => estado !== "parado" && parar() };
}

/* ---------- Início automático --------------------------------------------- */
if (typeof document !== "undefined") {
  const barra = document.querySelector("[data-leitor-voz]");
  const raiz = barra?.closest("article");
  if (barra && raiz) iniciarLeitorVoz(barra, raiz);
}
