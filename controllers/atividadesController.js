module.exports = {
    index: (req, res) => {
        const tasks = [
            { id: 1, text: "Estudar React", completed: false },
            { id: 2, text: "Academia", completed: true },
            { id: 3, text: "Fazer atividade", completed: false }
        ];

        const menuItems = [
            "Sem data", "Hoje", "Semana", "Mês",
            "Importantes", "Recorrentes", "Vencidas", "Todas"
        ];

        const selecionado = "Todas";  

        // Simplesmente filtrando tudo no começo
        const tarefasFiltradas = tasks; 

        res.render("pages/atividades", {
            titulo: "Atividades",
            css: "atividades.css",
            tasks,
            menuItems,
            selecionado,
            tarefasFiltradas
        });
    }
};
