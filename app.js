// Lista de agendamentos (salva no localStorage)
var agendamentos = [];

// Tenta carregar do localStorage
try {
  var salvo = localStorage.getItem("agendamentos");
  if (salvo) {
    agendamentos = JSON.parse(salvo);
  }
} catch (e) {
  agendamentos = [];
}

// Mostra os agendamentos ao carregar a página
renderizarLista();

// Envio do formulário
document.getElementById("form-agendamento").addEventListener("submit", function(e) {
  e.preventDefault();

  var nome     = document.getElementById("nome").value.trim();
  var servico  = document.getElementById("servico").value;
  var data     = document.getElementById("data").value;
  var hora     = document.getElementById("hora").value;
  var telefone = document.getElementById("telefone").value.trim();

  if (!nome || !servico || !data || !hora) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  var novoAgendamento = {
    id: Date.now(),
    nome: nome,
    servico: servico,
    data: data,
    hora: hora,
    telefone: telefone
  };

  agendamentos.push(novoAgendamento);

  try {
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
  } catch (e) {
    console.log("Erro ao salvar:", e);
  }

  var msg = document.getElementById("mensagem");
  msg.textContent = "✅ Agendamento confirmado!";
  setTimeout(function() { msg.textContent = ""; }, 3000);

  document.getElementById("form-agendamento").reset();

  renderizarLista();
  irPara("lista");
});

// Renderiza a lista de agendamentos
function renderizarLista() {
  var container = document.getElementById("lista-agendamentos");
  container.innerHTML = "";

  if (agendamentos.length === 0) {
    container.innerHTML = '<p class="vazio">Nenhum agendamento ainda.</p>';
    return;
  }

  agendamentos.sort(function(a, b) {
    return (a.data + a.hora).localeCompare(b.data + b.hora);
  });

  agendamentos.forEach(function(ag) {
    var div = document.createElement("div");
    div.className = "item-agendamento";
    div.innerHTML =
      '<div class="info">' +
        '<strong>' + ag.nome + '</strong>' +
        '<span>' + ag.servico + ' — ' + formatarData(ag.data) + ' às ' + ag.hora + '</span>' +
        (ag.telefone ? '<br><span>' + ag.telefone + '</span>' : '') +
      '</div>' +
      '<button onclick="cancelar(' + ag.id + ')">Cancelar</button>';

    container.appendChild(div);
  });
}

// Cancela um agendamento
function cancelar(id) {
  if (confirm("Deseja cancelar este agendamento?")) {
    agendamentos = agendamentos.filter(function(ag) {
      return ag.id !== id;
    });
    try {
      localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
    } catch (e) {}
    renderizarLista();
  }
}

// Navega suavemente até uma seção pelo id
function irPara(id) {
  var elemento = document.getElementById(id);
  if (elemento) {
    elemento.scrollIntoView({ behavior: "smooth" });
  }
}

// Formata data de AAAA-MM-DD para DD/MM/AAAA
function formatarData(data) {
  var partes = data.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}