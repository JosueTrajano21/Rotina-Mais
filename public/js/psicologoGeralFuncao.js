// Funções da página psicologo_geral

//Função para abrir e fechar Adicionar Paciente 
function btnAbrirModal() {
    document.getElementById("modal").style.display = "block"
}

function btnFecharModal() {
    document.getElementById("modal").style.display = "none"
}

// Função para fechar Popup
function fecharPopup() {
    const popup = document.getElementById('popupError')
    if(popup) popup.style.display = 'none'
}

// Filtrar os cards em tempo real
const searchInput = document.getElementById("searchInput");
const patientsList = document.getElementById("patientsList");
const cards = Array.from(patientsList.getElementsByClassName("card"));

searchInput.addEventListener("input", () => {
  const termo = searchInput.value.toLowerCase();

  cards.forEach(card => {
    const nome = card.querySelector(".patient-name").textContent.toLowerCase();
    const email = card.querySelector(".patient-email").textContent.toLowerCase();

    if(nome.includes(termo) || email.includes(termo)) {
      card.style.display = "flex"; 
    } else {
      card.style.display = "none";
    }
  });
});

// Função que redireciona a rota para mostra os dados somente do paciente
function acompanhar(idPaciente) {
    const id = Number(idPaciente);
    console.log(id);
    window.location.href = `/psicologo_geral/paciente/${id}`;
}



