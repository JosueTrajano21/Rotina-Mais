//  quando o DOM estiver carregado ele executa
document.addEventListener("DOMContentLoaded", () => {

    // Botões de favorito
    const favBtns = document.querySelectorAll(".favoriteBtn")

    // Para cada botão de favorito
    favBtns.forEach(butao => {
        butao.addEventListener("click", async () => {
            const id = butao.dataset.id
            const atual = Number(butao.dataset.fav) // 0 ou 1
            const novo = atual === 1 ? 0 : 1

                    // endpoint para onde o fetch está enviando a requisição.
            const resposta = await fetch("/atividades/favoritar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },    
                body: JSON.stringify({ id, favorito: novo })
            })

            const json = await resposta.json()

            if (json.sucesso) {
                butao.dataset.fav = novo
                butao.textContent = novo ? "★" : "☆"
            }
        })
    })

    // Botões de completar Tarefa
    const checkboxes = document.querySelectorAll(".checkbox-tarefa")

    // Para cada botão completar Tarefa
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            const id = Number(checkbox.dataset.id)
            const completada = checkbox.checked ? 1 : 0

            const taskItem = checkbox.closest(".taskItem")

            if (completada === 1) {
                taskItem.classList.add("completed")
            } else {
                taskItem.classList.remove("completed")
            }
            
            fetch("/atividades/marcar-completa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, completada })
            })
            
        })
    })
})

function formatarData(data){
    if (!data) return "";

    const partes = data.split("/") // [xx, xx, xxxx]
    const dia = partes[0]
    const mes = partes[1]
    const ano = partes[2]

    return `${ano}-${mes}-${dia}`
}

function abrirModal(id, titulo, data, descricao){

    document.getElementById("edit-id").value = id
    document.getElementById("edit-titulo").value = titulo

    document.getElementById("edit-data").value = formatarData(data)

    document.getElementById("edit-descricao").value = descricao || ""

    document.getElementById("modal").style.display = "block"
}

function fecharModal() {
    document.getElementById("modal").style.display = "none"
}
