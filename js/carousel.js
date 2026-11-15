/**
 * @module carousel
 * @description Carrossel de Publicações — Descomplicando a Docência
 * @version 2.0.0
 * @tech ES2020: Módulos, Optional Chaining (?.), Nullish Coalescing (??),
 *              Promise.allSettled, globalThis
 *
 * ARQUITETURA:
 *  1. fetchPublicacoes()   → Busca o JSON de dados
 *  2. renderizarCards()    → Gera o HTML dos cards via template literals
 *  3. iniciarCarrossel()   → Controla navegação por setas e drag (touch)
 *  4. init()               → Orquestra tudo via DOMContentLoaded
 */

// ─── Constantes de Configuração ───────────────────────────────────────────────
const CONFIG = {
  jsonPath: 'js/publicacoes.json',
  seletorTrack: '#carousel-track',
  seletorBtnPrev: '#carousel-prev',
  seletorBtnNext: '#carousel-next',
  seletorDots: '#carousel-dots',
  larguraScroll: 380, // px por clique de navegação
  autoPlay: false,
  autoPlayInterval: 5000,
};

// ─── Mapa de Configuração Visual por Categoria ────────────────────────────────
// Cada categoria tem: ícone Font Awesome, cor de fundo da tag, cor do texto
const CATEGORIA_CONFIG = {
  'Gestão':     { icon: 'fas fa-chart-line',       bg: '#fff3e0', color: '#e65100', border: '#ffb74d' },
  'BNCC':       { icon: 'fas fa-graduation-cap',   bg: '#e8f5e9', color: '#2e7d32', border: '#81c784' },
  'Tecnologia': { icon: 'fas fa-microchip',        bg: '#e3f2fd', color: '#1565c0', border: '#64b5f6' },
};

// ─── 1. FETCH DE DADOS ─────────────────────────────────────────────────────────
/**
 * Busca as publicações do arquivo JSON local.
 * Usa Optional Chaining para proteger acesso ao array.
 * @returns {Promise<Array>} Lista de publicações ou array vazio
 */
const fetchPublicacoes = async () => {
  try {
    const response = await fetch(CONFIG.jsonPath);

    // Verifica se a resposta HTTP foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} — ${response.statusText}`);
    }

    const data = await response.json();

    // Optional Chaining (?.) + Nullish Coalescing (??) → ES2020
    // Se data.publicacoes for null/undefined, retorna [] sem quebrar
    return data?.publicacoes ?? [];

  } catch (error) {
    console.error('[Carrossel] Falha ao carregar publicacoes.json:', error);
    return []; // Retorno seguro em caso de falha
  }
};

// ─── 2. FORMATAÇÃO DE DATA ──────────────────────────────────────────────────────
/**
 * Formata uma string ISO de data para o padrão brasileiro (dd/mm/aaaa).
 * @param {string} dataISO — Ex: "2025-04-10"
 * @returns {string} — Ex: "10 abr. 2025"
 */
const formatarData = (dataISO) => {
  // Optional Chaining para proteger caso dataISO seja undefined
  const data = new Date(dataISO?.replace(/-/g, '/') ?? new Date());
  return data.toLocaleDateString('pt-BR', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  });
};

// ─── 3. RENDERIZAÇÃO DOS CARDS (Template Literals ES2020) ──────────────────────
/**
 * Gera o HTML de um card de publicação com glassmorphism.
 * @param {Object} pub — Objeto publicação do JSON
 * @returns {string} HTML do card
 */
const gerarCardHTML = (pub) => {
  // Optional Chaining para acessar config da categoria com segurança
  const cat = CATEGORIA_CONFIG[pub?.categoria] ?? CATEGORIA_CONFIG['Tecnologia'];

  // Gera as tags coloridas da publicação
  const tagsHTML = (pub?.tags ?? [])
    .map(tag => `<span class="blog-tag">#${tag}</span>`)
    .join('');

  // Badge de destaque condicional
  const destaqueBadge = pub?.destaque
    ? `<div class="destaque-badge">
         <i class="fas fa-star"></i> Destaque
       </div>`
    : '';

  return `
    <article class="blog-card glass-card" data-id="${pub?.id ?? 0}">

      ${destaqueBadge}

      <!-- Cabeçalho visual: imagem de fundo simulada com gradiente + categoria -->
      <div class="card-visual"
           style="background: linear-gradient(135deg,
                  ${cat.border}44 0%,
                  var(--primary-blue) 100%)">
        <div class="card-categoria-badge"
             style="background:${cat.bg}; color:${cat.color}; border:1px solid ${cat.border}">
          <i class="${cat.icon}"></i>
          ${pub?.categoria ?? 'Geral'}
        </div>
      </div>

      <!-- Corpo do card com efeito glassmorphism -->
      <div class="card-glass-body">

        <!-- Tempo de leitura -->
        <div class="card-meta-top">
          <span class="tempo-leitura">
            <i class="fas fa-clock"></i>
            ${pub?.tempo_leitura ?? '5 min'}
          </span>
          <span class="data-pub">
            <i class="fas fa-calendar-alt"></i>
            ${formatarData(pub?.data)}
          </span>
        </div>

        <!-- Título e Resumo -->
        <h3 class="card-titulo">${pub?.titulo ?? 'Sem título'}</h3>
        <p class="card-resumo">${pub?.resumo ?? ''}</p>

        <!-- Tags coloridas de impacto -->
        <div class="card-tags">${tagsHTML}</div>

        <!-- Rodapé: autor + CTA -->
        <footer class="card-footer">
          <div class="autor-info">
            <div class="autor-avatar">
              <i class="fas fa-user-circle"></i>
            </div>
            <span class="autor-nome">${pub?.autor ?? 'Equipe DD'}</span>
          </div>
          <a href="${pub?.url ?? '#'}" class="card-cta" aria-label="Ler: ${pub?.titulo}">
            Ler artigo
            <i class="fas fa-arrow-right"></i>
          </a>
        </footer>

      </div>
    </article>
  `;
};

// ─── 4. RENDERIZAÇÃO DO CARROSSEL ──────────────────────────────────────────────
/**
 * Injeta os cards no DOM e os dots de navegação.
 * @param {Array} publicacoes — Array de objetos publicação
 */
const renderizarCards = (publicacoes) => {
  const track = document.querySelector(CONFIG.seletorTrack);
  const dotsContainer = document.querySelector(CONFIG.seletorDots);

  // Guarda de proteção: encerra se elementos não existirem no DOM
  if (!track || !dotsContainer) {
    console.warn('[Carrossel] Elementos do DOM não encontrados.');
    return;
  }

  // Renderiza todos os cards via template literals
  track.innerHTML = publicacoes.map(gerarCardHTML).join('');

  // Renderiza os dots de paginação
  dotsContainer.innerHTML = publicacoes
    .map((_, i) => `
      <button
        class="carousel-dot ${i === 0 ? 'active' : ''}"
        aria-label="Ir para publicação ${i + 1}"
        data-index="${i}">
      </button>
    `)
    .join('');
};

// ─── 5. LÓGICA DE NAVEGAÇÃO DO CARROSSEL ──────────────────────────────────────
/**
 * Inicializa os controles: setas, dots, drag (touch/mouse) e teclado.
 * @param {number} total — Total de cards para controle dos dots
 */
const iniciarCarrossel = (total) => {
  const track       = document.querySelector(CONFIG.seletorTrack);
  const btnPrev     = document.querySelector(CONFIG.seletorBtnPrev);
  const btnNext     = document.querySelector(CONFIG.seletorBtnNext);
  const dotsContainer = document.querySelector(CONFIG.seletorDots);

  // Estado interno do carrossel (encapsulado no escopo da função)
  let indiceAtual = 0;
  let isDragging  = false;
  let startX      = 0;
  let scrollStart = 0;

  // ── Atualiza dot ativo com base na posição de scroll ──
  const atualizarDots = () => {
    const dots = dotsContainer?.querySelectorAll('.carousel-dot');
    const scrollPos = track?.scrollLeft ?? 0;
    indiceAtual = Math.round(scrollPos / CONFIG.larguraScroll);

    dots?.forEach((dot, i) => {
      dot.classList.toggle('active', i === indiceAtual);
    });
  };

  // ── Scroll suave programático ──
  const scrollPara = (direcao) => {
    const delta = direcao === 'next'
      ? CONFIG.larguraScroll
      : -CONFIG.larguraScroll;

    track?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // ── Eventos: Setas de Navegação ──
  btnPrev?.addEventListener('click', () => scrollPara('prev'));
  btnNext?.addEventListener('click', () => scrollPara('next'));

  // ── Eventos: Dots de Paginação ──
  dotsContainer?.addEventListener('click', (e) => {
    const dot = e.target?.closest('.carousel-dot');
    if (!dot) return;

    const index = parseInt(dot.dataset?.index ?? '0', 10);
    track?.scrollTo({ left: index * CONFIG.larguraScroll, behavior: 'smooth' });
  });

  // ── Eventos: Atualiza dots ao scrollar ──
  track?.addEventListener('scroll', atualizarDots, { passive: true });

  // ── Drag com Mouse (Desktop) ──
  track?.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX     = e.pageX;
    scrollStart = track.scrollLeft;
    track.style.cursor = 'grabbing';
    track.style.userSelect = 'none';
  });

  globalThis.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const distancia = e.pageX - startX;
    if (track) track.scrollLeft = scrollStart - distancia;
  });

  globalThis.addEventListener('mouseup', () => {
    isDragging = false;
    if (track) {
      track.style.cursor = 'grab';
      track.style.userSelect = '';
    }
  });

  // ── Swipe Touch (Mobile) ──
  track?.addEventListener('touchstart', (e) => {
    startX = e.touches?.[0]?.clientX ?? 0;
    scrollStart = track.scrollLeft;
  }, { passive: true });

  track?.addEventListener('touchmove', (e) => {
    const distancia = (e.touches?.[0]?.clientX ?? 0) - startX;
    if (track) track.scrollLeft = scrollStart - distancia;
  }, { passive: true });

  // ── Navegação por Teclado (Acessibilidade) ──
  track?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  scrollPara('prev');
    if (e.key === 'ArrowRight') scrollPara('next');
  });

  // ── AutoPlay (opcional, desativado por padrão) ──
  if (CONFIG.autoPlay) {
    setInterval(() => scrollPara('next'), CONFIG.autoPlayInterval);
  }
};

// ─── 6. RENDERIZAÇÃO DO IMPACT-STRIP ──────────────────────────────────────────
/**
 * Gera a faixa de números de impacto social com base nos dados do JSON.
 * Utiliza .impact-strip conforme especificação de componentes reutilizáveis.
 * @param {Array} publicacoes
 */
const renderizarImpactStrip = (publicacoes) => {
  const strip = document.querySelector('#carousel-impact-strip');
  if (!strip) return;

  // Agrega dados de impacto das publicações em destaque
  const destaques = publicacoes.filter(p => p?.destaque === true);

  strip.innerHTML = destaques
    .map(pub => `
      <div class="impact-item">
        <i class="fas fa-bolt impact-icon"></i>
        <strong class="impact-numero">${pub?.impacto ?? ''}</strong>
        <span class="impact-label">${pub?.titulo?.split(':')[0] ?? ''}</span>
      </div>
    `)
    .join('');
};

// ─── 7. FUNÇÃO PRINCIPAL (ORQUESTRADOR) ───────────────────────────────────────
/**
 * Ponto de entrada do módulo.
 * Orquestra: fetch → render → iniciar controles.
 */
const init = async () => {
  // Aguarda o DOM estar completamente carregado
  if (document.readyState !== 'loading') {
    await executar();
  } else {
    document.addEventListener('DOMContentLoaded', executar);
  }
};

const executar = async () => {
  console.info('[Carrossel] Inicializando módulo...');

  // Busca dados do JSON
  const publicacoes = await fetchPublicacoes();

  if (publicacoes.length === 0) {
    console.warn('[Carrossel] Nenhuma publicação encontrada.');
    return;
  }

  // Renderiza cards e controles
  renderizarCards(publicacoes);
  iniciarCarrossel(publicacoes.length);
  renderizarImpactStrip(publicacoes);

  console.info(`[Carrossel] ${publicacoes.length} publicações carregadas com sucesso.`);
};

// Exportação como módulo ES2020
export { init, fetchPublicacoes, gerarCardHTML };

// Auto-inicialização
init();
