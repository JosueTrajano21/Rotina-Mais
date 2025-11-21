// criação/listagem de atividades.

class Atividade {
    constructor() {
        this.atividades = [];
        this.nextId = 1;
    }

    // Buscar todas as atividades
    getAll() {
        return this.atividades;
    }

    // Criar nova atividade
    create(titulo) {
        const novaAtividade = {
            id: this.nextId++,
            titulo,
            criadoEm: new Date().toLocaleString('pt-BR')
        };
        
        this.atividades.push(novaAtividade);
        return novaAtividade;
    }
}

// Exportar uma instância única (Singleton)
module.exports = new Atividade();