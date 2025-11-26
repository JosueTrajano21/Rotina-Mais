const Atividade = require('../models/atividadesModel')
    

module.exports = {
    index: async (req, res) => {
        const id_paciente = req.session.user.id
        const filtro = req.query.filter || "Hoje"
        
        // Busca as atividades do paciente
        const tasks = await Atividade.listarPorPaciente(id_paciente)

        // Filtrar tarefas
        const tarefasFiltradas = 'Hoje'

        const menuItems = [
            "Sem data", "Hoje", "Semana", "Mês",
            "Importantes", "Recorrentes", "Vencidas", "Todas"
        ]

        res.render("pages/atividades", {
            titulo: "Atividades",
            css: "atividades.css",
            tasks,
            menuItems,
            filtro,
            tarefasFiltradas,
            selecionado: filtro,
        })
    },

    criar: async (req, res) =>{

        const { titulo } = req.body
        const id_paciente = req.session.user.id // id do paciente
        console.log(id_paciente)
        const data = Atividade.formatarDataParaMySQL(new Date()) // teste
        console.log(data)

        

        if (!titulo || titulo.trim() === '') {
            const tasks = await Atividade.listarPorPaciente(id_paciente)
            const menuItems = [
                "Sem data", "Hoje", "Semana", "Mês",
                "Importantes", "Recorrentes", "Vencidas", "Todas"
            ]
            const selecionado = 'Hoje'
            const tarefasFiltradas = tasks

            return res.render('pages/atividades', {
                titulo: "Atividades",
                css: "atividades.css",
                tasks: tasks,
                menuItems: menuItems,
                selecionado: selecionado,
                tarefasFiltradas: tarefasFiltradas,
                error: 'Título é obrigatório!'
            })
        }

        await Atividade.criar({
            id_paciente,
            titulo,
            data
        })

        res.redirect('/atividades')
    }
}
