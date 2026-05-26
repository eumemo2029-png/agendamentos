// Carrega agendamentos do localStorage
var agendamentos = [];
try {
  var salvo = localStorage.getItem("agendamentos");
  if (salvo) agendamentos = JSON.parse(salvo);
} catch(e) { agendamentos = []; }

// ── PÁGINA DE AGENDAMENTO (index.html) ──
var form = document.getElementById("form-agendamento");
if (form) {
  form.addEventListener("submit", function(e) {
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

    // Verifica horário duplicado
    var duplicado = agendamentos.some(function(ag) {
      return ag.data === data && ag.hora === hora;
    });

    if (duplicado) {
      alert("❌ Este horário já está ocupado! Escolha outro horário ou data.");
      return;
    }

    agendamentos.push({
      id: Date.now(),
      nome: nome,
      servico: servico,
      data: data,
      hora: hora,
      telefone: telefone
    });

    try {
      localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
    } catch(e) {}

    var msg = document.getElementById("mensagem");
    msg.textContent = "✅ Agendamento confirmado!";
    setTimeout(function() { msg.textContent = ""; }, 3000);

    form.reset();
  });
}

// ── PÁGINA DE LISTA (lista.html) ──
var container = document.getElementById("lista-agendamentos");
if (container) {
  renderizarLista();
}

function renderizarLista() {
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
      '<button onclick="cancelar(' + ag.id + ')">Excluir</button>';
    container.appendChild(div);
  });
}

function cancelar(id) {
  if (confirm("Deseja excluir este agendamento?")) {
    agendamentos = agendamentos.filter(function(ag) { return ag.id !== id; });
    try { localStorage.setItem("agendamentos", JSON.stringify(agendamentos)); } catch(e) {}
    renderizarLista();
  }
}

function formatarData(data) {
  var p = data.split("-");
  return p[2] + "/" + p[1] + "/" + p[0];
}
