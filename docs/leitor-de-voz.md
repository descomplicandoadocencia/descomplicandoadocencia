# Leitor em voz alta dos posts (Text-to-Speech)

Barra de controle no topo de cada post que lê o artigo em voz alta usando **somente a Web Speech API do navegador** (`window.speechSynthesis`): gratuito, sem back-end e sem serviço externo.

| Controle | O que faz |
| --- | --- |
| **Ouvir / Pausar / Retomar** | Um só botão que muda de texto e de ícone conforme o estado |
| **Parar** | Cancela a fala e volta ao início do artigo |
| **Velocidade** | 0,75x · 1x · 1,25x · 1,5x · 2x (a escolha fica salva no navegador) |
| Contador | "Trecho 3 de 12", só em telas a partir de 36 rem |

Enquanto lê, o bloco atual ganha a classe `.tts-lendo` (fundo suave + barra lateral) e a página rola sozinha só quando o bloco sai da área visível.

---

## Onde cada bloco foi inserido

| # | Arquivo | Onde | O que entrou |
| --- | --- | --- | --- |
| 1 | `assets/js/leitor-voz.js` | **arquivo novo** | Toda a lógica (voz, fila, controles, destaque, cancelamento ao sair) |
| 2 | `templates/post.html` | `<head>`, linha 30, logo após `shell.js` | `<script type="module" src="../assets/js/leitor-voz.js">` |
| 3 | `templates/post.html` | `<article class="post">`, linhas 79–101, entre `{{byline}}` e `{{cover}}` | Marcação da barra (`.leitor-voz`) |
| 4 | `templates/post.html` | Linha 108 | `data-no-tts` no parágrafo "← Voltar ao blog", para não ser lido |
| 5 | `assets/css/styles.css` | Nova seção **6.4**, linhas 879–997 (antes da seção 7) | Estilos da barra e do destaque `.tts-lendo`; tokens `--leitura-bg` (escuro e claro) |
| 6 | `assets/css/styles.css` | Seção 7: `@media (forced-colors)` e `@media print` | Contorno do bloco lido em alto contraste; barra e destaque ocultos na impressão |
| 7 | `assets/css/styles.css` | `.prose` (linha 702) | `overflow-wrap: break-word` — correção à parte: URL longa em um texto causava rolagem horizontal no celular |
| 8 | `blog/*.html` | Gerados | Rode `npm run build`; as páginas dos posts passam a incluir a barra |

> `build-blog.mjs` **não foi alterado**: a barra é marcação fixa do template, sem novo `{{marcador}}`.

### 2 · Script (head)

```html
<script type="module" src="../assets/js/shell.js"></script>
<script type="module" src="../assets/js/leitor-voz.js"></script>
```

### 3 · Barra (corpo do artigo)

```html
<p class="meta">{{byline}}</p>

<div class="leitor-voz" role="group" aria-label="Ouvir este artigo" data-leitor-voz hidden>
  <button type="button" class="btn primary" data-leitor-voz-alternar>
    <svg class="leitor-voz__icone" data-icone="tocar" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z" /></svg>
    <svg class="leitor-voz__icone" data-icone="pausar" viewBox="0 0 24 24" aria-hidden="true" focusable="false" hidden><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
    <span data-leitor-voz-rotulo>Ouvir</span>
  </button>
  <button type="button" class="btn secondary" data-leitor-voz-parar aria-disabled="true">
    <svg class="leitor-voz__icone" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6h12v12H6z" /></svg>
    <span class="leitor-voz__texto-parar">Parar</span>
  </button>
  <div class="leitor-voz__velocidade">
    <label for="leitor-voz-velocidade">Velocidade</label>
    <select id="leitor-voz-velocidade" data-leitor-voz-velocidade>
      <option value="0.75">0,75x</option>
      <option value="1" selected>1x</option>
      <option value="1.25">1,25x</option>
      <option value="1.5">1,5x</option>
      <option value="2">2x</option>
    </select>
  </div>
  <span class="leitor-voz__progresso" data-leitor-voz-progresso></span>
  <span class="visually-hidden" role="status" data-leitor-voz-status></span>
</div>

{{cover}}
```

A barra nasce com `hidden`. O JavaScript só a exibe se o navegador tiver `speechSynthesis`; sem suporte (ou sem JavaScript) o post fica exatamente como era, sem botões inúteis.

---

## Como o `leitor-voz.js` atende a cada requisito

| Requisito | Solução |
| --- | --- |
| Voz pt-BR natural | `escolherVoz()`: entre as vozes `pt-BR` pontua Microsoft *Natural/Online* (100) > Google (70) > Apple *Enhanced/Premium/Siri* (60) > Microsoft comum (50). Sem pt-BR, usa qualquer `pt-*`; sem nenhuma, deixa `lang="pt-BR"` e o navegador usa o padrão do sistema. Aceita `pt_BR` (Android). Reage a `voiceschanged` (o Chrome carrega as vozes de forma assíncrona). |
| Textos longos no Chrome | `coletarBlocos()` separa `h1–h6, p, li, blockquote, dt, dd`; `dividirTexto()` quebra blocos acima de 150 caracteres em frases (≈ 9 s de fala em 1x e ≈ 12 s em 0,75x, abaixo do corte de ~15 s das vozes Google de rede). Só **uma** `SpeechSynthesisUtterance` existe por vez: a seguinte é criada no `onend` da anterior. |
| Ouvir/Pausar/Retomar e Parar | `iniciar()`, `pausar()`, `retomar()`, `parar()`; estados `parado → lendo → pausado`. |
| Velocidade | `<select>`; mudar durante a leitura repete o trecho atual já no novo ritmo. |
| Destaque do bloco lido | Classe `.tts-lendo` no elemento do trecho em `onstart`. |
| Ignorar código, legendas, navegação | `SELETOR_IGNORAR`: `pre, code, figcaption, nav, script, style, svg, [hidden], [aria-hidden=true], [data-no-tts], .visually-hidden, .meta-list, .leitor-voz`. O `<code>` dentro de um parágrafo é removido do texto lido. |
| Parar ao sair/recarregar | `speechSynthesis.cancel()` em `beforeunload` (registrado só enquanto há leitura, para não prejudicar o cache de páginas do navegador) e em `pagehide` (mais confiável em celulares). |

### Cuidados de robustez já tratados

- **Pausa que não funciona:** no Android, `pause()` encerra a fala; em alguns navegadores `resume()` após pausa longa não faz nada. Nesses casos o trecho atual é repetido ao retomar.
- **`cancel()` deixa o Chrome "preso" em pausa:** a fila é limpa com `cancel()` + `resume()` quando `paused` continua verdadeiro.
- **Eventos atrasados:** cada fala recebe uma "ficha"; eventos de falas já canceladas são ignorados.
- **Erros:** `not-allowed` para na hora; três erros seguidos param com aviso; um erro isolado pula o trecho.
- **Voltar do cache (bfcache):** `pageshow` com `persisted` devolve a barra ao estado inicial.
- **Foco:** "Parar" usa `aria-disabled` (e não `disabled`), então o foco do teclado não se perde ao clicar nele.

### Acessibilidade da barra

Grupo rotulado, botões com texto visível, ícones decorativos (`aria-hidden`), região `role="status"` anunciando "Leitura iniciada / pausada / retomada / parada / concluída", alvos de 44 px, foco visível do tema, destaque que não depende só de cor (barra lateral), respeito a `prefers-reduced-motion` (rolagem sem animação), `forced-colors` e impressão.

---

## Ajustes rápidos (topo do `leitor-voz.js`)

| Constante | Para quê |
| --- | --- |
| `MAX_CARACTERES` (150) | Tamanho máximo de cada fala; reduza se uma voz ainda cortar frases |
| `VELOCIDADES` | Velocidades aceitas — mantenha igual aos `<option>` do template |
| `SELETOR_BLOCOS` | Quais elementos viram "parágrafos" da fila |
| `SELETOR_IGNORAR` | O que nunca é lido (acrescente `[data-no-tts]` em qualquer trecho do post para pulá-lo) |
| `escolherVoz()` | Pesos das vozes preferidas |

Para ocultar um trecho de um post em Markdown, use HTML bruto: `<p data-no-tts>…</p>`.

---

## Limites conhecidos

- **As vozes pertencem ao navegador e ao sistema.** Windows/Edge e Android/Chrome costumam ter boas vozes pt-BR; Linux sem *speech-dispatcher* pode não ter nenhuma. Nesse caso a barra aparece e, ao clicar em Ouvir, avisa "Não foi possível reproduzir a voz neste navegador."
- O efeito da velocidade depende da voz usada.
- **Tabelas e imagens não são lidas** (texto alternativo de imagem fica para leitores de tela). Texto solto fora de `p/li/h*/blockquote/dt/dd` também não.
- Um item de lista com sublista é destacado inteiro enquanto o próprio item é lido.
- Pessoas que usam leitor de tela já têm leitura própria; a barra é pensada para quem quer ouvir o artigo sem esse recurso.
- **Não há `<!-- comentário -->` no template:** `scripts/check-comments.mjs` (CI) reprova comentários HTML nas páginas geradas.

---

## Como testar

1. `npm run build` e `python3 -m http.server 8000`; abra `http://localhost:8000/blog/<post>.html` (módulos ES não funcionam via `file://`).
2. Teste em pelo menos Chrome/Edge (desktop) e no celular: Ouvir → Pausar → Retomar → mudar velocidade → Parar → recarregar durante a leitura (o áudio deve parar).
3. Alterne tema claro/escuro e confira o destaque.

**Verificação automática feita nesta entrega** (Chromium + simulador de `speechSynthesis`, 146 verificações; fora do repositório): seleção de voz, divisão de texto sem perdas, exclusões, ordem e destaque, pausa/retomada/parada, velocidade, cancelamento ao sair, navegadores problemáticos (Android, `resume()` morto, pausa "presa", erros), teclado, tamanhos de toque, ausência de rolagem horizontal em 1280/360/320 px, contraste do destaque (≥ 4,5:1) e axe-core (WCAG 2.1 A/AA) em tema claro e escuro. **Não foi testado com vozes reais em Chrome, Edge, Safari/iOS e Android** — faça essa conferência manual antes de publicar.
