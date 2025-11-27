document.addEventListener("DOMContentLoaded", () => {

    const favBtns = document.querySelectorAll(".favoriteBtn");

    favBtns.forEach(butao => {
        butao.addEventListener("click", async () => {
            const id = butao.dataset.id;
            const atual = Number(butao.dataset.fav); // 0 ou 1
            const novo = atual === 1 ? 0 : 1;

            const resposta = await fetch("/atividades/favoritar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },    
                body: JSON.stringify({ id, favorito: novo })
            });

            const json = await resposta.json();

            if (json.sucesso) {
                butao.dataset.fav = novo;
                butao.textContent = novo ? "★" : "☆";
            }
        });
    });

    const checkboxes = document.querySelectorAll(".checkbox-tarefa");

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            const id = Number(checkbox.dataset.id);
            const completada = checkbox.checked ? 1 : 0;

            const taskItem = checkbox.closest(".taskItem");

            if (completada === 1) {
                taskItem.classList.add("completed");
            } else {
                taskItem.classList.remove("completed");
            }
            
            fetch("/atividades/marcar-completa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, completada })
            });
            
        });
    });
});

