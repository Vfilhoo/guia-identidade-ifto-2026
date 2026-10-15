(function () {
  const G = window.GUIA;
  const $ = (id) => document.getElementById(id);
  const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");

  // Cada atividade ganha um id estável, usado na agenda salva.
  G.atividades.forEach((a, i) => { a.id = "a" + (i + 1); });
  const porId = Object.fromEntries(G.atividades.map((a) => [a.id, a]));

  // ---------- Agenda salva (localStorage pode falhar: o guia funciona sem ele)
  const CHAVE = "guia-identidade-ifto-2026";
  let favoritos = new Set();
  try { favoritos = new Set(JSON.parse(localStorage.getItem(CHAVE) || "[]").filter((id) => porId[id])); } catch (e) {}
  function salvarFavoritos() {
    try { localStorage.setItem(CHAVE, JSON.stringify([...favoritos])); } catch (e) {}
  }

  // ---------- "Agora": ?agora=2026-11-05T09:30 permite testar fora do evento
  function agoraData() {
    const p = new URLSearchParams(location.search).get("agora");
    const d = p ? new Date(p) : new Date();
    return isNaN(d) ? new Date() : d;
  }
  const mins = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const diaIso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  function acontecendo(a, d) {
    if (a.dia !== diaIso(d)) return false;
    const m = d.getHours() * 60 + d.getMinutes();
    return a.h.some(([i, f]) => m >= mins(i) && m < mins(f));
  }
  function proxima(a, d) {
    if (a.dia !== diaIso(d)) return false;
    const m = d.getHours() * 60 + d.getMinutes();
    return a.h.some(([i]) => mins(i) > m && mins(i) - m <= 90);
  }

  // ---------- Estado
  const ids = G.dias.map((d) => d.id);
  const hoje = diaIso(agoraData());
  const estado = {
    dia: ids.includes(hoje) ? hoje : (hoje > ids[ids.length - 1] ? ids[ids.length - 1] : ids[0]),
    evento: "Todos",
    local: "todos",
    busca: ""
  };

  // ---------- Cabeçalho e rodapé
  $("titulo").textContent = G.titulo;
  $("subtitulo").textContent = G.subtitulo;
  // Botão "Avaliar o guia": só aparece se houver um link seguro (https) de formulário configurado.
  if (/^https:\/\/(docs\.google\.com\/forms|forms\.gle)\//.test(G.avaliacaoUrl || "")) {
    const bt = $("btn-avaliar");
    bt.href = G.avaliacaoUrl;
    bt.hidden = false;
  }
  $("link-mapa").href = "https://www.openstreetmap.org/?mlat=" + G.campus.lat + "&mlon=" + G.campus.lon + "#map=17/" + G.campus.lat + "/" + G.campus.lon;

  // ---------- Elementos
  function el(tag, props, ...filhos) {
    const e = document.createElement(tag);
    Object.assign(e, props || {});
    filhos.forEach((f) => e.append(f));
    return e;
  }
  const horario = (a) => a.h.map(([i, f]) => i + " às " + f).join(" e ");
  const classeEv = (ev) => slug(ev);

  function cartao(a, agoraD) {
    const li = el("li", { className: "cartao " + classeEv(a.evento) + (acontecendo(a, agoraD) ? " agora-ativa" : "") });
    const dia = G.dias.find((d) => d.id === a.dia);
    li.append(el("div", { className: "hora", textContent: (dia ? dia.rotulo + " · " : "") + horario(a) }));
    li.append(el("div", { className: "titulo" },
      el("span", { className: "rotulo " + classeEv(a.evento), textContent: a.evento }), a.titulo));
    if (a.detalhe) li.append(el("div", { className: "detalhe", textContent: a.detalhe }));
    const local = G.locais[a.local];
    const onde = el("div", { className: "onde" }, "Onde: ");
    const botao = el("button", { type: "button", textContent: local.curto + (a.sala ? " · " + a.sala : "") });
    botao.addEventListener("click", () => { abrirLocal(a.local); });
    onde.append(botao);
    li.append(onde);
    const fav = favoritos.has(a.id);
    const estrela = el("button", {
      type: "button", className: "estrela", textContent: fav ? "★" : "☆",
      ariaLabel: (fav ? "Remover da" : "Adicionar à") + " minha agenda: " + a.titulo
    });
    estrela.setAttribute("aria-pressed", String(fav));
    estrela.addEventListener("click", () => {
      if (favoritos.has(a.id)) favoritos.delete(a.id); else favoritos.add(a.id);
      salvarFavoritos();
      renderTudo();
    });
    li.append(estrela);
    return li;
  }

  // ---------- Programação
  function filtrar() {
    const q = slug(estado.busca);
    return G.atividades.filter((a) => {
      if (a.dia !== estado.dia) return false;
      if (estado.evento !== "Todos" && a.evento !== estado.evento && a.evento !== "Geral") return false;
      if (estado.local !== "todos" && a.local !== estado.local) return false;
      if (q) {
        const texto = slug([a.titulo, a.detalhe || "", a.sala || "", G.locais[a.local].nome, a.evento].join(" "));
        if (!texto.includes(q)) return false;
      }
      return true;
    }).sort((x, y) => mins(x.h[0][0]) - mins(y.h[0][0]));
  }

  function renderDias() {
    const c = $("dias"); c.replaceChildren();
    G.dias.forEach((d) => {
      const b = el("button", { type: "button", className: "dia", ariaLabel: d.nome },
        el("span", { className: "dia-data", textContent: d.data }),
        el("span", { className: "dia-semana", textContent: d.semana }));
      b.setAttribute("aria-pressed", String(d.id === estado.dia));
      b.addEventListener("click", () => { estado.dia = d.id; renderTudo(); });
      c.append(b);
    });
  }
  function renderChips() {
    const c = $("chips"); c.replaceChildren();
    ["Todos", ...G.eventos].forEach((ev) => {
      const b = el("button", { type: "button", className: "chip-" + slug(ev === "Todos" ? "Geral" : ev), textContent: ev === "Todos" ? "Geral" : ev });
      b.title = ev === "Todos" ? "Todas as atividades do dia" : G.eventosInfo[ev];
      b.setAttribute("aria-pressed", String(ev === estado.evento));
      b.addEventListener("click", () => { estado.evento = ev; renderTudo(); });
      c.append(b);
    });
  }
  function renderSeletorLocal() {
    const s = $("filtro-local");
    if (!s.options.length) {
      s.append(el("option", { value: "todos", textContent: "Todos os locais" }));
      Object.entries(G.locais).forEach(([id, l]) => s.append(el("option", { value: id, textContent: l.curto })));
      s.addEventListener("change", () => { estado.local = s.value; renderTudo(); });
    }
    s.value = estado.local;
  }
  function renderLista() {
    const lista = filtrar();
    const agoraD = agoraData();
    const ul = $("lista"); ul.replaceChildren();
    const dia = G.dias.find((d) => d.id === estado.dia);
    $("resumo").textContent = lista.length + (lista.length === 1 ? " atividade" : " atividades") + " · " + dia.nome;
    if (!lista.length) ul.append(el("li", { className: "vazio", textContent: "Nada encontrado com esses filtros. Tente limpar a busca ou escolher outro dia." }));
    lista.forEach((a) => ul.append(cartao(a, agoraD)));
  }

  // ---------- Agora / próximas
  function renderAgora() {
    const d = agoraData();
    const c = $("agora"); c.replaceChildren();
    const em = G.atividades.filter((a) => acontecendo(a, d));
    const prox = G.atividades.filter((a) => proxima(a, d) && !acontecendo(a, d));
    if (em.length || prox.length) {
      if (em.length) {
        c.append(el("h2", { textContent: "Acontecendo agora (" + em.length + ")" }));
        const ul = el("ul");
        em.slice(0, 4).forEach((a) => ul.append(el("li", { textContent: a.titulo + " · " + G.locais[a.local].curto + (a.sala ? ", " + a.sala : "") })));
        if (em.length > 4) ul.append(el("li", { textContent: "e mais " + (em.length - 4) + " na programação do dia" }));
        c.append(ul);
      }
      if (prox.length) c.append(el("p", { textContent: "Começa em breve: " + prox.slice(0, 2).map((a) => a.h.find(([i]) => mins(i) > d.getHours() * 60 + d.getMinutes())[0] + " " + a.titulo).join(" · ") }));
      c.hidden = false;
      return;
    }
    const inicio = new Date(ids[0] + "T00:00:00");
    const dias = Math.ceil((inicio - d) / 86400000);
    if (dias > 0) c.textContent = "O evento começa em " + dias + (dias === 1 ? " dia" : " dias") + ", em 3 de novembro. Salve suas atividades na estrela ☆.";
    else if (hoje > ids[ids.length - 1]) c.textContent = "O evento já terminou. Obrigado por participar!";
    else c.textContent = "Nenhuma atividade neste momento. Veja a programação do dia.";
    c.hidden = false;
  }

  // ---------- Minha agenda
  function renderAgenda() {
    const ul = $("lista-agenda"); ul.replaceChildren();
    const agoraD = agoraData();
    const itens = [...favoritos].map((id) => porId[id])
      .sort((x, y) => (x.dia + x.h[0][0]).localeCompare(y.dia + y.h[0][0]));
    if (!itens.length) ul.append(el("li", { className: "vazio", textContent: "Você ainda não salvou nenhuma atividade." }));
    itens.forEach((a) => ul.append(cartao(a, agoraD)));
    const n = $("contador"); n.textContent = favoritos.size; n.hidden = !favoritos.size;
  }

  // ---------- Locais e mapa
  let mapa = null, camada = null, marcadores = {};
  const MARCAR = new URLSearchParams(location.search).get("marcar") === "1";
  const CHAVE_MARCAS = "guia-marcacoes-locais";
  let marcas = {};
  if (MARCAR) {
    try { marcas = JSON.parse(localStorage.getItem(CHAVE_MARCAS) || "{}"); } catch (e) {}
    Object.entries(marcas).forEach(([id, p]) => { if (G.locais[id]) G.locais[id].pos = p; });
  }
  const ROTULO_LADO = { blocob: "left", blococ: "top", biblioteca: "right", complexo: "bottom", auditorio: "right", escola: "top" };
  const rota = (p) => "https://www.google.com/maps/dir/?api=1&destination=" + (+p.lat).toFixed(6) + "," + (+p.lon).toFixed(6);

  function renderLocais() {
    const ul = $("lista-locais"); ul.replaceChildren();
    Object.entries(G.locais).forEach(([id, l]) => {
      const qtd = G.atividades.filter((a) => a.local === id).length;
      const li = el("li", { className: "local-item", id: "local-" + id });
      li.append(el("h3", { textContent: l.nome }));
      li.append(el("p", { textContent: l.desc }));
      (l.detalhes || []).forEach(([rotulo, texto]) => li.append(el("p", {}, el("strong", { textContent: rotulo + " " }), texto)));
      if (!l.pos) li.append(el("p", { className: "aviso", textContent: l.aviso }));
      const acoes = el("div", { className: "acoes" });
      const ver = el("button", { type: "button", textContent: "Ver as " + qtd + " atividades aqui" });
      ver.addEventListener("click", () => { estado.local = id; estado.evento = "Todos"; estado.busca = ""; $("busca").value = ""; trocarAba("programacao"); renderTudo(); });
      acoes.append(ver);
      if (l.pos) {
        const noMapa = el("button", { type: "button", textContent: "Ver no mapa" });
        noMapa.addEventListener("click", () => focarNoMapa(id));
        acoes.append(noMapa);
        acoes.append(el("a", { href: rota(l.pos), target: "_blank", rel: "noopener", className: "botao-link", textContent: "Como chegar" }));
      }
      li.append(acoes);
      ul.append(li);
    });
  }

  function popup(id) {
    const l = G.locais[id];
    const d = el("div", {}, el("strong", { textContent: l.nome }));
    if (l.pos) { d.append(document.createElement("br")); d.append(el("a", { href: rota(l.pos), target: "_blank", rel: "noopener", textContent: "Como chegar" })); }
    return d;
  }
  function desenharMarcadores() {
    if (!mapa) return;
    camada.clearLayers(); marcadores = {};
    const pontos = [[G.campus.lat, G.campus.lon]];
    Object.entries(G.locais).forEach(([id, l]) => {
      if (!l.pos) return;
      const m = L.marker([l.pos.lat, l.pos.lon]).addTo(camada).bindPopup(popup(id));
      const dir = ROTULO_LADO[id] || "top";
      m.bindTooltip(l.curto, { permanent: true, direction: dir, offset: dir === "top" ? [-15, -10] : dir === "bottom" ? [-15, 4] : [0, -14] });
      marcadores[id] = m;
      if (!l.foraDoCampus) pontos.push([l.pos.lat, l.pos.lon]);
    });
    if (!Object.keys(marcadores).length) {
      L.circleMarker([G.campus.lat, G.campus.lon], { radius: 9 }).addTo(camada).bindPopup("IFTO Campus Araguatins (ponto aproximado)");
    }
    if (pontos.length > 1) mapa.fitBounds(pontos, { padding: [60, 60], maxZoom: 18 });
  }
  function focarNoMapa(id) {
    trocarAba("locais");
    iniciarMapa();
    const l = G.locais[id];
    if (!mapa || !l.pos) return;
    mapa.setView([l.pos.lat, l.pos.lon], 18);
    if (marcadores[id]) marcadores[id].openPopup();
    $("mapa").scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function iniciarMapa() {
    if (!window.L) { $("mapa").textContent = "O mapa não carregou. Use o link abaixo para abrir no aplicativo de mapas."; return; }
    if (mapa) { mapa.invalidateSize(); return; }
    mapa = L.map("mapa").setView([G.campus.lat, G.campus.lon], 16);
    const ruas = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" });
    const sat = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, maxNativeZoom: 17, attribution: "Imagens © Esri, Maxar, Earthstar Geographics" }).addTo(mapa);
    L.control.layers({ "Satélite": sat, "Mapa": ruas }).addTo(mapa);
    camada = L.layerGroup().addTo(mapa);
    desenharMarcadores();
    if (MARCAR) iniciarMarcacao();
  }
  function abrirLocal(id) {
    trocarAba("locais");
    const alvo = $("local-" + id);
    if (alvo) alvo.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // ---------- Modo de marcação (?marcar=1): posiciona cada local e gera o trecho para o dados.js
  function iniciarMarcacao() {
    const painel = $("marcador");
    painel.hidden = false;
    const sel = $("marc-local");
    if (!sel.options.length) Object.entries(G.locais).forEach(([id, l]) => sel.append(el("option", { value: id, textContent: l.nome })));
    const saida = $("marc-json");
    function atualizar(msg) {
      const so = {};
      Object.entries(G.locais).forEach(([id, l]) => { if (l.pos) so[id] = { lat: +l.pos.lat.toFixed(6), lon: +l.pos.lon.toFixed(6) }; });
      saida.value = JSON.stringify(so, null, 2);
      const falta = Object.keys(G.locais).filter((id) => !G.locais[id].pos).map((id) => G.locais[id].curto);
      $("marc-status").textContent = (msg ? msg + " " : "") + (falta.length ? "Faltam: " + falta.join(", ") + "." : "Todos os locais foram marcados!");
      try { localStorage.setItem(CHAVE_MARCAS, JSON.stringify(so)); } catch (e) {}
      renderLocais(); desenharMarcadores();
    }
    function definir(lat, lon, origem) {
      const id = sel.value;
      G.locais[id].pos = { lat, lon };
      atualizar(G.locais[id].curto + " marcado" + (origem ? " (" + origem + ")" : "") + ".");
    }
    mapa.on("click", (e) => definir(e.latlng.lat, e.latlng.lng, "pelo mapa"));
    $("marc-gps").addEventListener("click", () => {
      if (!navigator.geolocation) { $("marc-status").textContent = "Este aparelho não oferece localização."; return; }
      $("marc-status").textContent = "Buscando sua localização…";
      navigator.geolocation.getCurrentPosition(
        (p) => { definir(p.coords.latitude, p.coords.longitude, "GPS, precisão de " + Math.round(p.coords.accuracy) + " m"); mapa.setView([p.coords.latitude, p.coords.longitude], 18); },
        () => { $("marc-status").textContent = "Não consegui obter a localização. Permita o acesso ou toque no mapa."; },
        { enableHighAccuracy: true, timeout: 20000 }
      );
    });
    $("marc-copiar").addEventListener("click", () => {
      saida.select();
      const ok = () => { $("marc-status").textContent = "Copiado! Cole na conversa com o Claude."; };
      if (navigator.clipboard) navigator.clipboard.writeText(saida.value).then(ok, () => { document.execCommand("copy"); ok(); });
      else { document.execCommand("copy"); ok(); }
    });
    $("marc-limpar").addEventListener("click", () => {
      Object.values(G.locais).forEach((l) => { delete l.pos; });
      atualizar("Marcações apagadas.");
    });
    atualizar("");
  }

  // ---------- Informações úteis
  const digitos = (t) => t.replace(/\D/g, "");
  function itemContato(c) {
    const d = digitos(c.tel);
    const li = el("li", { className: "contato" });
    li.dataset.busca = slug(c.nome);
    li.append(el("div", { className: "nome", textContent: c.nome }));
    li.append(el("div", { className: "tel", textContent: c.tel }));
    if (c.verificar) li.append(el("div", { className: "verificar", textContent: "Confirme este número: " + c.verificar + "." }));
    const acoes = el("div", { className: "acoes" });
    if (d.length === 11) acoes.append(el("a", { href: "https://wa.me/55" + d, target: "_blank", rel: "noopener", className: "botao-link", textContent: "WhatsApp" }));
    acoes.append(el("a", { href: "tel:+55" + d, className: "botao-link", textContent: "Ligar" }));
    li.append(acoes);
    return li;
  }
  const MOSTRAR_COMO_CHEGAR = false;
  const SOL_SVG = '<svg viewBox="0 0 400 180" role="img" aria-label="Ilustração de um pôr do sol sobre o rio"><defs><linearGradient id="solg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd9a0"/><stop offset=".6" stop-color="#ff9f6b"/><stop offset="1" stop-color="#e8605a"/></linearGradient></defs><rect width="400" height="180" fill="url(#solg)"/><circle cx="200" cy="108" r="34" fill="#fff6dc"/><rect y="112" width="400" height="68" fill="#2a4d6e" opacity=".55"/><g stroke="#fff6dc" stroke-linecap="round" opacity=".75"><path d="M172 124h56" stroke-width="3"/><path d="M180 134h40" stroke-width="3"/><path d="M188 144h24" stroke-width="3"/></g></svg>';
  function renderInfo() {
    const I = G.info;
    $("info-aviso").textContent = "Os números e horários podem sofrer mudanças: confirme antes de ir.";
    const raiz = $("info-conteudo"); raiz.replaceChildren();

    // Como chegar ao campus (desligado por pedido; para voltar a mostrar, mude MOSTRAR_COMO_CHEGAR para true)
    if (MOSTRAR_COMO_CHEGAR) {
      const camp = el("details", { open: true });
      camp.append(el("summary", { textContent: "Como chegar ao campus" }));
      const corpoC = el("div", { className: "corpo" });
      corpoC.append(el("p", {}, el("strong", { textContent: "Endereço: " }), I.campus.endereco));
      corpoC.append(el("p", { textContent: "O campus fica fora do centro. Táxi e mototáxi estão na seção Transportes." }));
      corpoC.append(el("div", { className: "acoes" },
        el("a", { href: rota(G.campus), target: "_blank", rel: "noopener", className: "botao-link", textContent: "Como chegar" })));
      camp.append(corpoC); raiz.append(camp);
    }

    // Listas de contatos
    I.secoes.forEach((s) => {
      const d = el("details", { id: "info-" + s.id });
      d.append(el("summary", { textContent: s.titulo + " (" + s.itens.length + ")" }));
      const corpo = el("div", { className: "corpo" });
      if (s.nota) corpo.append(el("p", { textContent: s.nota }));
      const ul = el("ul", { className: "contatos" });
      s.itens.forEach((c) => ul.append(itemContato(c)));
      corpo.append(ul); d.append(corpo); raiz.append(d);
    });

    // Pôr do sol
    const sol = el("details", { id: "info-sol" });
    sol.append(el("summary", { textContent: "Pôr do sol em Araguatins" }));
    const corpoS = el("div", { className: "corpo" });
    corpoS.append(el("p", { textContent: "Não deixe de apreciar o pôr do sol de Araguatins, às margens do rio Araguaia." }));
    if (I.fotos.length) {
      I.fotos.forEach((f) => {
        const fig = el("figure", { className: "foto-sol" });
        fig.append(el("img", { src: "fotos/" + f.arquivo, alt: f.legenda || "Pôr do sol em Araguatins", loading: "lazy" }));
        fig.append(el("figcaption", { textContent: (f.legenda || "") + (f.credito ? " · Foto: " + f.credito : "") }));
        corpoS.append(fig);
      });
    } else {
      const fig = el("figure", { className: "foto-sol" });
      fig.innerHTML = SOL_SVG;
      fig.append(el("figcaption", { textContent: "Ilustração" }));
      corpoS.append(fig);
    }
    sol.append(corpoS); raiz.append(sol);

    // Contato oficial
    const ct = el("details", { id: "info-contato" });
    ct.append(el("summary", { textContent: "Contato do IFTO" }));
    const corpoT = el("div", { className: "corpo" });
    corpoT.append(el("p", {}, "Instagram oficial: ", el("a", { href: "https://www.instagram.com/" + I.campus.instagram + "/", target: "_blank", rel: "noopener", textContent: "@" + I.campus.instagram })));
    corpoT.append(el("p", {}, "Programação oficial: ", el("a", { href: G.fonteUrl, target: "_blank", rel: "noopener", textContent: "Even3 do evento" })));
    ct.append(corpoT); raiz.append(ct);
  }
  $("busca-info").addEventListener("input", (e) => {
    const q = slug(e.target.value);
    document.querySelectorAll("#info-conteudo details").forEach((d) => {
      const itens = d.querySelectorAll(".contato");
      if (!itens.length) { d.hidden = !!q; return; }
      let alguns = 0;
      itens.forEach((li) => { const ok = !q || li.dataset.busca.includes(q) || slug(d.querySelector("summary").textContent).includes(q); li.hidden = !ok; if (ok) alguns++; });
      d.hidden = q && !alguns;
      if (q && alguns) d.open = true;
    });
  });

  // ---------- Capa: abre sempre primeiro; o guia só aparece depois de "Abrir o guia".
  // ?capa=0 pula a capa (útil para testes) e o modo de marcação também a dispensa.
  function iniciarCapa() {
    const capa = $("capa");
    const pular = new URLSearchParams(location.search).get("capa") === "0";
    if (pular || MARCAR || location.hash === "#avaliar") { capa.hidden = true; return; }
    // Enquanto a capa está aberta, o resto do guia fica inacessível (toque, teclado e leitor de tela).
    const resto = ["agora", "abas", "conteudo", "rodape"].map((id) => $(id)).filter(Boolean);
    const topo = document.querySelector(".topo");
    const bloqueados = [topo, ...resto].filter(Boolean);
    bloqueados.forEach((e) => { e.inert = true; });
    document.body.classList.add("com-capa");
    const entrar = $("capa-entrar");
    function fechar() {
      document.removeEventListener("keydown", tecla);
      bloqueados.forEach((e) => { e.inert = false; });
      document.body.classList.remove("com-capa");
      capa.classList.add("saindo");
      window.scrollTo({ top: 0 });
      setTimeout(() => { capa.hidden = true; }, 350);
    }
    function tecla(e) { if (e.key === "Escape") fechar(); }
    document.addEventListener("keydown", tecla);
    entrar.addEventListener("click", fechar);
    entrar.focus();
  }

  // ---------- Avaliação dentro do guia (mesmo desenho do PDF), enviada ao mesmo Google Forms
  let avaliacaoAbriuPorHash = false;
  function iniciarAvaliacao() {
    const A = G.avaliacao;
    const painel = $("avaliar");
    const btn = $("btn-avaliar");
    const envioOk = /^https:\/\/docs\.google\.com\/forms\/d\/e\/[\w-]+\/formResponse$/.test((A && A.envio) || "");
    if (!A || !painel || !envioOk) return; // sem configuração: o botão continua levando ao Google Forms
    const OUTRO = "__outro__";
    const corpo = $("avaliar-corpo");
    let naoUsou = false;

    function perguntaEscolha(p) {
      const caixas = p.tipo === "caixas";
      const fs = el("fieldset", { className: "av-q" });
      fs.append(el("legend", { textContent: p.titulo }));
      if (p.ajuda) fs.append(el("p", { className: "av-ajuda", textContent: p.ajuda }));
      const ops = el("div", { className: "av-ops" });
      (p.outro ? p.opcoes.concat([OUTRO]) : p.opcoes).forEach((op) => {
        const lab = el("label", { className: "av-op" });
        const inp = el("input", { type: caixas ? "checkbox" : "radio", name: p.id, value: op });
        lab.append(inp, el("span", { textContent: op === OUTRO ? "Outro:" : op }));
        if (op === OUTRO) {
          const t = el("input", { type: "text", className: "av-outro-txt", maxLength: 120 });
          t.setAttribute("aria-label", "Escreva qual é o outro");
          t.addEventListener("input", () => { if (t.value.trim()) inp.checked = true; });
          lab.append(t);
        }
        ops.append(lab);
      });
      fs.append(ops);
      return fs;
    }
    function perguntaEscala(p) {
      const fs = el("fieldset", { className: "av-q" });
      fs.append(el("legend", { textContent: p.titulo }));
      const linha = el("div", { className: "av-escala" });
      for (let n = 1; n <= 5; n++) {
        const lab = el("label", { className: "av-n" });
        lab.append(el("input", { type: "radio", name: p.id, value: String(n) }), el("span", { textContent: String(n) }));
        linha.append(lab);
      }
      fs.append(linha, el("div", { className: "av-rotulos" }, el("span", { textContent: "1 · " + p.de }), el("span", { textContent: "5 · " + p.ate })));
      return fs;
    }
    function perguntaGrade(p) {
      const fs = el("fieldset", { className: "av-q" });
      fs.append(el("legend", { textContent: p.titulo }));
      if (p.ajuda) fs.append(el("p", { className: "av-ajuda", textContent: p.ajuda }));
      const tab = el("table", { className: "av-grade" });
      const cg = el("colgroup", {}, el("col"));
      for (let n = 1; n <= 5; n++) cg.append(el("col", { className: "av-col-n" }));
      const cab = el("tr", {}, el("th", { scope: "col" }));
      cab.firstChild.className = "av-vazio";
      for (let n = 1; n <= 5; n++) cab.append(el("th", { scope: "col", textContent: String(n) }));
      tab.append(cg, el("thead", {}, cab));
      const tb = el("tbody");
      p.linhas.forEach((l) => {
        const tr = el("tr", {}, el("th", { scope: "row", textContent: l.texto }));
        for (let n = 1; n <= 5; n++) {
          const lab = el("label", {});
          const inp = el("input", { type: "radio", name: l.id, value: String(n) });
          inp.setAttribute("aria-label", l.texto + " — nota " + n);
          lab.append(inp, el("span", {}));
          tr.append(el("td", {}, lab));
        }
        tb.append(tr);
      });
      tab.append(tb);
      fs.append(tab);
      return fs;
    }
    function perguntaTexto(p) {
      const fs = el("fieldset", { className: "av-q" });
      fs.append(el("legend", { textContent: p.titulo }));
      const t = el("textarea", { name: p.id, rows: 2, maxLength: 600 });
      t.setAttribute("aria-label", p.titulo);
      fs.append(t);
      return fs;
    }
    function montarTela() {
      corpo.replaceChildren();
      corpo.append(
        el("h2", { id: "av-titulo", textContent: "Pesquisa rápida · Identidade IFTO 2026 e Guia Digital" }),
        el("p", { className: "av-sub", textContent: "Campus Araguatins · 3 a 6 de novembro de 2026 · Leva cerca de 3 minutos" }),
        el("p", { className: "av-aviso" }, el("strong", { textContent: "Anônima: " }),
          "não pedimos nome, telefone nem e-mail. Suas respostas serão usadas só para melhorar o guia e para o relatório de um Projeto de Extensão, sem identificar ninguém. Toque nas opções e, se preferir, deixe em branco o que não quiser responder. Obrigado por participar!")
      );
      const form = el("form", { id: "avaliar-form", noValidate: true });
      form.addEventListener("submit", (e) => { e.preventDefault(); enviar(); });
      form.addEventListener("change", () => {
        const q4 = form.querySelector('input[name="q4"]:checked');
        naoUsou = !!q4 && q4.value === A.naoUsou;
        form.querySelectorAll("[data-so-se-usou]").forEach((e) => { e.hidden = naoUsou; });
      });
      A.secoes.forEach((sec) => {
        const s = el("section", { className: "av-secao" }, el("h3", { textContent: sec.titulo }));
        sec.perguntas.forEach((p) => {
          const f = p.tipo === "grade" ? perguntaGrade(p) : p.tipo === "escala" ? perguntaEscala(p)
            : p.tipo === "texto" ? perguntaTexto(p) : perguntaEscolha(p);
          if (p.soSeUsou) f.dataset.soSeUsou = "1";
          s.append(f);
        });
        form.append(s);
      });
      const msg = el("p", { id: "av-msg", className: "av-msg", hidden: true });
      msg.setAttribute("role", "alert");
      const enviarBt = el("button", { type: "submit", id: "av-enviar", className: "av-enviar", textContent: "Enviar respostas" });
      form.append(el("div", { className: "av-barra" }, msg, enviarBt));
      corpo.append(form);
      corpo.append(
        el("p", { className: "av-alt" }, "Prefere responder no Google Forms? ",
          el("a", { href: A.formulario, target: "_blank", rel: "noopener", textContent: "Abrir o formulário" })),
        el("p", { className: "av-credito" }, "© 2026 Valdeci Lopes da Silva Filho.", el("br"), "Todos os direitos reservados.")
      );
    }
    function montarEnvio() {
      const form = $("avaliar-form");
      const params = new URLSearchParams();
      let total = 0;
      A.secoes.forEach((sec) => sec.perguntas.forEach((p) => {
        if (p.soSeUsou && naoUsou) return;
        if (p.tipo === "grade") {
          p.linhas.forEach((l) => {
            const m = form.querySelector('input[name="' + l.id + '"]:checked');
            if (m) { params.append("entry." + l.entry, m.value); total++; }
          });
        } else if (p.tipo === "texto") {
          const t = form.querySelector('textarea[name="' + p.id + '"]').value.trim();
          if (t) { params.append("entry." + p.entry, t); total++; }
        } else {
          const marcados = Array.from(form.querySelectorAll('input[name="' + p.id + '"]:checked'));
          marcados.forEach((m) => {
            if (m.value === OUTRO) {
              const txt = m.closest("label").querySelector(".av-outro-txt").value.trim() || "Outro";
              params.append("entry." + p.entry, "__other_option__");
              params.append("entry." + p.entry + ".other_option_response", txt);
            } else {
              params.append("entry." + p.entry, m.value);
            }
          });
          if (marcados.length) total++;
        }
      }));
      params.append("pageHistory", naoUsou ? "0,1,3" : "0,1,2,3");
      params.append("fvv", "1");
      return { params, total };
    }
    function obrigado() {
      corpo.replaceChildren(
        el("div", { className: "av-obrigado" },
          el("p", { className: "av-ok", textContent: "✔" }),
          el("h2", { textContent: "Obrigado!" }),
          el("p", { textContent: "Sua resposta ajuda a melhorar o guia e os próximos eventos." }),
          (() => { const b = el("button", { type: "button", className: "av-enviar", textContent: "Voltar ao guia" }); b.addEventListener("click", fechar); return b; })()
        ),
        el("p", { className: "av-credito" }, "© 2026 Valdeci Lopes da Silva Filho.", el("br"), "Todos os direitos reservados.")
      );
      painel.scrollTop = 0;
    }
    async function enviar() {
      const msg = $("av-msg");
      const bt = $("av-enviar");
      const { params, total } = montarEnvio();
      if (!total) { msg.textContent = "Responda pelo menos uma pergunta para enviar."; msg.hidden = false; return; }
      msg.hidden = true;
      bt.disabled = true; bt.textContent = "Enviando…";
      try {
        await fetch(A.envio, { method: "POST", mode: "no-cors", body: params, keepalive: true });
        obrigado();
      } catch (e) {
        bt.disabled = false; bt.textContent = "Enviar respostas";
        msg.replaceChildren("Não consegui enviar. Verifique a internet e tente de novo, ou ",
          el("a", { href: A.formulario, target: "_blank", rel: "noopener", textContent: "responda pelo formulário do Google" }), ".");
        msg.hidden = false;
      }
    }

    // abrir / fechar (o botão Voltar do celular também fecha)
    const bloqueados = () => [document.querySelector(".topo"), $("agora"), $("abas"), $("conteudo"), $("rodape")].filter(Boolean);
    function esconder() {
      painel.hidden = true;
      bloqueados().forEach((e) => { e.inert = false; });
      document.body.classList.remove("com-avaliar");
      document.removeEventListener("keydown", tecla);
    }
    function fechar() {
      if (painel.hidden) return;
      esconder();
      if (location.hash === "#avaliar") {
        if (avaliacaoAbriuPorHash) { history.replaceState(null, "", location.pathname + location.search); avaliacaoAbriuPorHash = false; }
        else history.back();
      }
      btn.focus();
    }
    function tecla(e) { if (e.key === "Escape") fechar(); }
    function abrir(porHash) {
      montarTela();
      naoUsou = false;
      bloqueados().forEach((e) => { e.inert = true; });
      document.body.classList.add("com-avaliar");
      painel.hidden = false;
      painel.scrollTop = 0;
      document.addEventListener("keydown", tecla);
      if (porHash) avaliacaoAbriuPorHash = true;
      else if (location.hash !== "#avaliar") history.pushState({ av: 1 }, "", "#avaliar");
      $("av-voltar").focus();
    }
    $("av-voltar").addEventListener("click", fechar);
    window.addEventListener("popstate", () => { if (location.hash !== "#avaliar" && !painel.hidden) esconder(); });
    btn.hidden = false;
    btn.href = A.formulario;
    btn.addEventListener("click", (e) => { e.preventDefault(); abrir(false); });
    if (location.hash === "#avaliar") abrir(true);
  }

  // ---------- Abas
  function trocarAba(nome) {
    ["programacao", "locais", "info", "agenda"].forEach((n) => {
      $("painel-" + n).hidden = n !== nome;
      $("aba-" + n).setAttribute("aria-selected", String(n === nome));
    });
    if (nome === "locais") iniciarMapa();
    window.scrollTo({ top: 0 });
  }
  document.querySelectorAll(".abas button").forEach((b) => b.addEventListener("click", () => trocarAba(b.dataset.aba)));
  $("busca").addEventListener("input", (e) => { estado.busca = e.target.value; renderLista(); });

  function renderTudo() { renderDias(); renderChips(); renderSeletorLocal(); renderLista(); renderAgenda(); }
  renderAgora();
  renderLocais();
  renderTudo();
  if (MARCAR) trocarAba("locais");
  renderInfo();
  iniciarAvaliacao();
  iniciarCapa();
})();
