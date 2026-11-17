// Cria um elemento: el("p", { class: "x" }, "texto ou nós")
function el(tag, attrs = {}, ...filhos) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  filhos.flat().forEach(f => e.append(f));
  return e;
}

function secao(titulo, ...conteudo) {
  return [el("h2", {}, titulo), ...conteudo];
}

function montarLateral(d) {
  const contatos = el("dl", {}, d.contato.flatMap(c => [
    el("dt", {}, c.rotulo),
    el("dd", {}, c.link ? el("a", { href: c.link }, c.valor) : c.valor)
  ]));

  const habilidades = d.habilidades.flatMap(g => [
    el("p", { class: "grupo" }, g.grupo),
    el("ul", { class: "tags" }, g.itens.map(i => el("li", {}, i)))
  ]);

  const idiomas = d.idiomas.map(i =>
    el("p", { class: "idioma" }, el("span", {}, i.nome), el("span", {}, i.nivel))
  );

  return el("aside", {},
    el("img", { class: "foto", src: d.foto, alt: `Foto de ${d.nome}` }),
    ...secao("Contato", contatos),
    ...secao("Habilidades", ...habilidades),
    ...secao("Idiomas", ...idiomas)
  );
}

function montarPrincipal(d) {
  const experiencia = d.experiencia.map(x =>
    el("div", { class: "item" },
      el("h3", {}, `${x.cargo} — ${x.empresa}`),
      el("p", { class: "meta" }, x.periodo),
      el("ul", {}, x.descricao.map(t => el("li", {}, t)))
    )
  );

  const formacao = d.formacao.map(f =>
    el("div", { class: "item" },
      el("h3", {}, f.curso),
      el("p", { class: "meta" }, `${f.instituicao} · ${f.periodo}`)
    )
  );

  return el("main", {},
    el("h1", {}, d.nome),
    el("p", { class: "cargo" }, d.cargo),
    el("p", { class: "resumo" }, d.resumo),
    ...secao("Experiência", ...experiencia),
    ...secao("Formação", ...formacao)
  );
}

function iniciar() {
  const raiz = document.getElementById("cv");
  try {
    const dados = CV_DADOS;
    if (dados.tema?.cor) document.documentElement.style.setProperty("--cor", dados.tema.cor);
    document.title = `Currículo — ${dados.nome}`;
    raiz.replaceChildren(montarLateral(dados), montarPrincipal(dados));
  } catch (erro) {
    raiz.className = "";
    raiz.replaceChildren(el("div", { class: "erro" },
      el("strong", {}, "Não foi possível montar o currículo. "),
      "Confira o arquivo dados.js: pode haver vírgula ou aspas faltando. Veja o erro exato no console (F12)."
    ));
    console.error(erro);
  }
}

iniciar();
