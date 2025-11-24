const Atividade = require('../models/atividadesModel')

module.exports = {
    index: (req, res) => {
        const tasks = Atividade.getAll();

        const menuItems = [
            "Sem data", "Hoje", "Semana", "Mês",
            "Importantes", "Recorrentes", "Vencidas", "Todas"
        ];
        
        const selecionado = req.query.filter || 'Hoje';

        // Simplesmente filtrando tudo no começo
        const tarefasFiltradas = tasks; 

        res.render("pages/atividades", {
            titulo: "Atividades",
            css: "atividades.css",
            tasks,
            menuItems,
            selecionado,
            tarefasFiltradas,
            
        });
    },

    create: (req, res) =>{

        const { titulo } = req.body;
    
    if (!titulo || titulo.trim() === '') {
        const tasks = Atividade.getAll();
        const menuItems = [
            "Sem data", "Hoje", "Semana", "Mês",
            "Importantes", "Recorrentes", "Vencidas", "Todas"
        ];
        const selecionado = 'Hoje';
        const tarefasFiltradas = tasks;

        return res.render('pages/atividades', {
            titulo: "Atividades",
            css: "atividades.css",
            tasks: tasks,
            menuItems: menuItems,
            selecionado: selecionado,
            tarefasFiltradas: tarefasFiltradas,
            error: 'Título é obrigatório!'
        });
    }

    Atividade.create(titulo);
    res.redirect('/atividades');  // ← Corrigir o redirect também!

    }
};
