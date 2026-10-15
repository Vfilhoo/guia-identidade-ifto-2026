// Dados do guia. Fonte: programação oficial no Even3 (https://www.even3.com.br/identidade-ifto-2026-731602/),
// conferida em 15/10/2026. Antes do evento, validar com a organização se houve mudanças.
// h = lista de intervalos [início, fim]; sala é opcional.

window.GUIA = {
  titulo: "Guia do Identidade IFTO 2026",
  subtitulo: "Campus Araguatins · 3 a 6 de novembro",
  fonteUrl: "https://www.even3.com.br/identidade-ifto-2026-731602/",
  campus: { lat: -5.6449061, lon: -48.0721384 }, // coordenadas informadas na página oficial (aproximadas)
  dias: [
    { id: "2026-11-03", rotulo: "Ter 3", data: "03/11", semana: "Terça-feira", nome: "Terça, 3 de novembro" },
    { id: "2026-11-04", rotulo: "Qua 4", data: "04/11", semana: "Quarta-feira", nome: "Quarta, 4 de novembro" },
    { id: "2026-11-05", rotulo: "Qui 5", data: "05/11", semana: "Quinta-feira", nome: "Quinta, 5 de novembro" },
    { id: "2026-11-06", rotulo: "Sex 6", data: "06/11", semana: "Sexta-feira", nome: "Sexta, 6 de novembro" }
  ],
  eventos: ["JICE", "IFestival", "AfroIdentidade", "Integra"], // botões de filtro; atividades "Geral" aparecem em "Todos"
  eventosInfo: {
    "Geral": "Abertura, encerramento e atividades de todo o evento.",
    "JICE": "Jornada de Iniciação Científica e Extensão: pôsteres, robótica, desafio de ideias e exposição de produtos.",
    "IFestival": "Mostra artística dos estudantes: artes visuais, teatro, poesia, artes digitais, dança e música.",
    "AfroIdentidade": "Valorização da cultura negra e combate ao racismo: palestras, oficinas e rodas de conversa.",
    "Integra": "Produção educacional de docentes e equipes pedagógicas."
  },
  locais: {
    escola: {
      nome: "Escola de Tempo Integral Professora Oneide da Cruz Mousinho",
      curto: "Escola Oneide Mousinho",
      pos: { lat: -5.64821, lon: -48.107898 },
      desc: "Sede da abertura oficial, na noite de 3/11 (terça), das 18h às 21h.",
      foraDoCampus: true,
      detalhes: [
        ["Entrada principal:", "R. 2, nº 795, Araguatins, TO."],
        ["Lateral:", "R. Guimarães, QD. 192-B, Lote 02 - Araguatins, TO."],
        ["Dica para ônibus:", "a lateral da escola é indicada para estacionar."],
        ["Como chegar:", "fica na cidade, a cerca de 4 km em linha reta do campus."]
      ],
      aviso: "Endereço e transporte até este local: [A CONFIRMAR com a organização]"
    },
    auditorio: {
      nome: "Auditório Pioneiros",
      curto: "Auditório Pioneiros",
      pos: { lat: -5.64594, lon: -48.072047 },
      desc: "Palestras, mesas-redondas, apresentações de teatro e dança, lançamento de livro e encerramento com premiações.",
      aviso: "Posição dentro do campus: [A CONFIRMAR no local]"
    },
    blocob: {
      nome: "Bloco B",
      curto: "Bloco B",
      pos: { lat: -5.645012, lon: -48.07195 },
      desc: "Salas de oficinas, desafio de ideias, reuniões técnicas e apresentações orais.",
      aviso: "Posição dentro do campus: [A CONFIRMAR no local]"
    },
    blococ: {
      nome: "Bloco C · Espaço de Vivência",
      curto: "Bloco C",
      pos: { lat: -5.644894, lon: -48.071564 },
      desc: "Exposição de artes visuais e show de música do IFestival.",
      aviso: "Posição dentro do campus: [A CONFIRMAR no local]"
    },
    biblioteca: {
      nome: "Biblioteca",
      curto: "Biblioteca",
      pos: { lat: -5.645332, lon: -48.071521 },
      desc: "Desafio de robótica e apresentações de poesia e artes digitais.",
      aviso: "Posição dentro do campus: [A CONFIRMAR no local]"
    },
    complexo: {
      nome: "Complexo Esportivo",
      curto: "Complexo Esportivo",
      pos: { lat: -5.645738, lon: -48.072444 },
      desc: "Pôsteres e exposição de produtos da JICE e pôsteres do Integra e do AfroIdentidade.",
      aviso: "Posição dentro do campus: [A CONFIRMAR no local]"
    }
  },
  atividades: [
    // ---- Terça, 3/11
    { dia: "2026-11-03", h: [["18:00", "21:00"]], evento: "Geral", titulo: "Abertura oficial do Identidade IFTO 2026 (palestra)", local: "escola" },

    // ---- Quarta, 4/11
    { dia: "2026-11-04", h: [["08:00", "12:00"], ["14:00", "18:00"]], evento: "IFestival", titulo: "Exposição de Artes Visuais", local: "blococ" },
    { dia: "2026-11-04", h: [["08:00", "12:00"]], evento: "Integra", titulo: "Reunião técnica com pedagogos e técnicos em assuntos educacionais", local: "blocob", sala: "Sala 10" },
    { dia: "2026-11-04", h: [["08:00", "10:00"]], evento: "JICE", titulo: "Apresentação de pôsteres · Rodada 1", local: "complexo" },
    { dia: "2026-11-04", h: [["08:00", "12:00"], ["14:00", "18:00"]], evento: "JICE", titulo: "Desafio de Ideias", local: "blocob", sala: "Sala 9" },
    { dia: "2026-11-04", h: [["08:00", "12:00"], ["14:00", "18:00"]], evento: "JICE", titulo: "Desafio de Robótica", local: "biblioteca" },
    { dia: "2026-11-04", h: [["08:00", "18:00"]], evento: "JICE", titulo: "Exposição de Produtos", local: "complexo" },
    { dia: "2026-11-04", h: [["10:00", "12:00"]], evento: "JICE", titulo: "Apresentação de pôsteres · Rodada 2", local: "complexo" },
    { dia: "2026-11-04", h: [["14:00", "18:00"]], evento: "IFestival", titulo: "Apresentações artísticas · Teatro", local: "auditorio" },
    { dia: "2026-11-04", h: [["14:00", "18:00"]], evento: "Integra", titulo: "Oficina · Avaliação dos Cursos Superiores", local: "blocob", sala: "Sala 10" },
    { dia: "2026-11-04", h: [["14:00", "16:00"]], evento: "JICE", titulo: "Apresentação de pôsteres · Rodada 3", local: "complexo" },
    { dia: "2026-11-04", h: [["16:00", "18:00"]], evento: "JICE", titulo: "Apresentação de pôsteres · Rodada 4", local: "complexo" },
    { dia: "2026-11-04", h: [["19:00", "20:00"]], evento: "Geral", titulo: "Lançamento de livro de grupo de pesquisa", local: "auditorio" },
    { dia: "2026-11-04", h: [["20:00", "21:00"]], evento: "JICE", titulo: "Mesa-redonda", detalhe: "Com Andressa Tabaczinski e servidoras do IFTO.", local: "auditorio" },

    // ---- Quinta, 5/11
    { dia: "2026-11-05", h: [["08:00", "12:00"]], evento: "AfroIdentidade", titulo: "Abertura e Vozes Ancestrais (palestra)", local: "auditorio" },
    { dia: "2026-11-05", h: [["08:00", "12:00"]], evento: "AfroIdentidade", titulo: "Oficina", local: "blocob", sala: "Sala 2" },
    { dia: "2026-11-05", h: [["08:00", "12:00"]], evento: "IFestival", titulo: "Apresentações artísticas · Poesia e Artes Digitais", local: "biblioteca" },
    { dia: "2026-11-05", h: [["08:00", "12:00"], ["14:00", "18:00"]], evento: "IFestival", titulo: "Exposição de Artes Visuais", local: "blococ" },
    { dia: "2026-11-05", h: [["08:00", "12:00"]], evento: "IFestival", titulo: "Oficina", local: "blocob", sala: "Sala 13" },
    { dia: "2026-11-05", h: [["08:00", "12:00"]], evento: "Integra", titulo: "Oficina", local: "blocob", sala: "Sala 14" },
    { dia: "2026-11-05", h: [["08:00", "12:00"]], evento: "Integra", titulo: "Oficina de Ensino", local: "blocob", sala: "Sala 4" },
    { dia: "2026-11-05", h: [["08:00", "12:00"]], evento: "Integra", titulo: "Reunião técnica com pedagogos e técnicos em assuntos educacionais", local: "blocob", sala: "Sala 10" },
    { dia: "2026-11-05", h: [["08:00", "10:00"]], evento: "JICE", titulo: "Apresentação de pôsteres · Rodada 5", local: "complexo" },
    { dia: "2026-11-05", h: [["08:00", "12:00"], ["14:00", "18:00"]], evento: "JICE", titulo: "Desafio de Ideias", local: "blocob", sala: "Sala 9" },
    { dia: "2026-11-05", h: [["08:00", "12:00"]], evento: "JICE", titulo: "Estande Mulheres na Ciência · Caracterização de maquiagem", local: "blocob", sala: "Sala 5" },
    { dia: "2026-11-05", h: [["08:00", "12:00"]], evento: "JICE", titulo: "Estande Mulheres na Ciência · Escrita Criativa", local: "blocob", sala: "Sala 11" },
    { dia: "2026-11-05", h: [["08:00", "18:00"]], evento: "JICE", titulo: "Exposição de Produtos", local: "complexo" },
    { dia: "2026-11-05", h: [["08:00", "12:00"]], evento: "JICE", titulo: "Oficina", local: "blocob", sala: "Sala 3" },
    { dia: "2026-11-05", h: [["10:00", "12:00"]], evento: "JICE", titulo: "Apresentação de pôsteres · Rodada 6", local: "complexo" },
    { dia: "2026-11-05", h: [["14:00", "16:00"]], evento: "AfroIdentidade", titulo: "Apresentação de pôsteres", local: "complexo" },
    { dia: "2026-11-05", h: [["14:00", "18:00"]], evento: "AfroIdentidade", titulo: "Roda de conversa intercampi", local: "blocob", sala: "Sala a definir" },
    { dia: "2026-11-05", h: [["14:00", "18:00"]], evento: "IFestival", titulo: "Apresentações artísticas · Dança e Performance", local: "auditorio" },
    { dia: "2026-11-05", h: [["14:00", "18:00"]], evento: "Integra", titulo: "Oficina SinaEPT", local: "blocob", sala: "Sala 10" },
    { dia: "2026-11-05", h: [["14:00", "18:00"]], evento: "JICE", titulo: "Apresentações orais", local: "blocob", sala: "Salas 3, 4, 5, 11, 13, 14, 15, 16, 20 e 22" },
    { dia: "2026-11-05", h: [["14:00", "18:00"]], evento: "JICE", titulo: "Desafio de Robótica", local: "biblioteca" },
    { dia: "2026-11-05", h: [["16:00", "18:00"]], evento: "Integra", titulo: "Apresentação de pôsteres · Projetos de Ensino", local: "complexo" },
    { dia: "2026-11-05", h: [["19:00", "22:00"]], evento: "IFestival", titulo: "Apresentações artísticas · Música", local: "blococ" },

    // ---- Sexta, 6/11
    { dia: "2026-11-06", h: [["08:00", "12:00"]], evento: "Geral", titulo: "Encerramento e premiações", local: "auditorio" }
  ]
};

// ---------------------------------------------------------------------------
// Informações úteis. Fonte: "Guia do Participante" do 13º JIFTO (Araguatins, junho de 2025).
// Os contatos podem ter mudado: confirmar antes de publicar. "verificar" marca números com formato estranho.
window.GUIA.info = {
  fonte: "Guia do Participante do 13º JIFTO (junho de 2025)",
  campus: {
    endereco: "Povoado Santa Tereza, KM 05 · Zona Rural, Araguatins, TO",
    instagram: "ifto.oficial"
  },
  secoes: [
    {
      id: "almoco", titulo: "Alimentação · Almoço", itens: [
        { nome: "Almoço da Rai", tel: "(63) 99204-8091" },
        { nome: "Cozinha da Anna", tel: "(63) 99225-2881" },
        { nome: "Dujack Marmitas e Espetinhos", tel: "(63) 99202-0354" },
        { nome: "Ki Fome Restaurante", tel: "(63) 99951-0421" },
        { nome: "Marmitas da Sol", tel: "(63) 99985-2219" },
        { nome: "Mônica Marmitinhas", tel: "(63) 99935-7242" },
        { nome: "Restaurante Paladar", tel: "(63) 99916-2818" },
        { nome: "Restaurante Primar", tel: "(63) 99963-9972" },
        { nome: "Restaurante Nova Opção", tel: "(62) 99965-3535", verificar: "o código de área (62) é diferente do da região" },
        { nome: "Varanda's", tel: "(63) 99974-0845" }
      ]
    },
    {
      id: "jantar", titulo: "Alimentação · Jantar e lanches", itens: [
        { nome: "Cozinha da Anna", tel: "(63) 99225-2881" },
        { nome: "Kero Mais Salgados e Burgue's", tel: "(63) 99134-7288" },
        { nome: "Pizzaria Aliança", tel: "(63) 99995-3567" },
        { nome: "Pizzaria Saborear", tel: "(63) 99215-9676" },
        { nome: "Casa do Açaí", tel: "(63) 99998-2636" },
        { nome: "Só Caldos", tel: "(63) 99928-0361" },
        { nome: "Hamburgueria da Praça", tel: "(63) 99979-6788" },
        { nome: "Açaí da Vila", tel: "(63) 99241-5982" },
        { nome: "Manger Crepe Francês", tel: "(63) 99204-3229" },
        { nome: "Pizzaria 100limites", tel: "(63) 99968-5499" },
        { nome: "Katatal Lanche", tel: "(63) 99239-3135" },
        { nome: "Mix Lanches", tel: "(63) 99963-7541" },
        { nome: "Bengo Açaí", tel: "(63) 99300-7717" },
        { nome: "Mix Food", tel: "(63) 99132-2830" },
        { nome: "Tokyo Sushi", tel: "(63) 99134-2871" },
        { nome: "Minas Snacks", tel: "(63) 99206-1886" },
        { nome: "Rios Açaiteria", tel: "(63) 99264-6776" },
        { nome: "Taberna da Pizza", tel: "(63) 99242-2183" },
        { nome: "Pizzaria e Petiscaria Ribeiro", tel: "(63) 99913-2471" },
        { nome: "Guaraná da Amazônia da Dona Valda", tel: "(63) 99917-7893" },
        { nome: "HD Sabores", tel: "(63) 99945-3311" },
        { nome: "Cheese Cake Pizzaria", tel: "(63) 99304-6776" },
        { nome: "Lanchonete e Restaurante Coco & Bambu", tel: "(63) 99281-6811" },
        { nome: "Lanchonete Goiás", tel: "(63) 99961-8389" },
        { nome: "Espetinho da Lili", tel: "(63) 99119-1980" }
      ]
    },
    {
      id: "farmacias", titulo: "Farmácias", itens: [
        { nome: "Farma Zinco", tel: "(63) 99989-7675" },
        { nome: "Inova Farma", tel: "(63) 99986-6608" },
        { nome: "Bio Farma", tel: "(63) 9983-6608", verificar: "o número tem um dígito a menos que o padrão de celular" },
        { nome: "Farma e Farma Popular", tel: "(63) 99931-1313" },
        { nome: "Farmácias do Bico", tel: "(63) 99265-4004" },
        { nome: "Farmácias Ômega", tel: "(63) 99267-5196" },
        { nome: "Farmácia Bianca", tel: "(63) 99228-5500" },
        { nome: "Difarma", tel: "(63) 99995-8959" },
        { nome: "Vanor Farma", tel: "(63) 99997-1235" },
        { nome: "Nossa Farma", tel: "(63) 99935-5732" }
      ]
    },
    {
      id: "transportes", titulo: "Transportes · táxi e mototáxi",
      nota: "O campus fica na zona rural (Povoado Santa Tereza, KM 05). Combine o valor antes da corrida.",
      itens: [
        { nome: "Táxi Escurinho", tel: "(63) 99972-6660" },
        { nome: "Moto Táxi Irmão Valmir", tel: "(63) 99976-2130" },
        { nome: "Táxi e Mototáxi Valmir", tel: "(63) 99965-2960" },
        { nome: "Danilo Moto Táxi", tel: "(63) 99972-0308" },
        { nome: "Donilson Moto Táxi", tel: "(63) 99942-4241" },
        { nome: "Júnior Moto Táxi", tel: "(63) 9995-4776", verificar: "o número tem um dígito a menos que o padrão de celular" },
        { nome: "Mototaxistas Ponto", tel: "(63) 9999-9468", verificar: "o número tem um dígito a menos que o padrão de celular" },
        { nome: "Flávio Táxi Araguatins", tel: "(63) 9299-1422", verificar: "o número tem um dígito a menos que o padrão de celular" }
      ]
    }
  ],
  // Fotos do pôr do sol: coloque os arquivos em guia/fotos/ e liste aqui.
  // Exemplo: { arquivo: "por-do-sol-1.jpg", legenda: "Pôr do sol às margens do Araguaia", credito: "Nome de quem fez a foto" }
  fotos: []
};
