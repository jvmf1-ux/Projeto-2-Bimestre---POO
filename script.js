// 1. Enumeração no topo (para que o Participante possa enxergá-la)
const StatusInscricao = Object.freeze({
    CONFIRMADO: 'CONFIRMADO',
    EM_ESPERA: 'EM_ESPERA',
    CANCELADO: 'CANCELADO'
});


class Participante {
    constructor(identificador, nome) {
        this.identificador = identificador;
        this.nome = nome;
        this.status = StatusInscricao.CONFIRMADO; 
    }

    alterarStatus(novoStatus) {
        this.status = novoStatus;
    }

    getIdentificador() { return this.identificador; }
    getNome() { return this.nome; }
    getStatus() { return this.status; }
}


class Usuario {
    constructor(identificador, nome) {
        this.identificador = identificador;
        this.nome = nome;
        this.ativo = true; 
    }

    desativarPerfil() {
        if (!this.ativo) {
            console.log(`Atenção: O usuário ${this.nome} já está inativo.`);
            return;
        }
        this.ativo = false;
        console.log(`Perfil de ${this.nome} desativado com sucesso.`);
    }

    ativarPerfil() {
        this.ativo = true;
    }

    getIdentificador() { return this.identificador; }
    getNome() { return this.nome; }
    isAtivo() { return this.ativo; }
}



const usuario1 = new Usuario(1, "Davi");
console.log(`Usuário: ${usuario1.getNome()} | Ativo: ${usuario1.isAtivo()}`);
usuario1.desativarPerfil();
usuario1.desativarPerfil(); // Testando a mensagem de aviso

const participante1 = new Participante(101, "Pablo");
console.log(`Participante: ${participante1.getNome()} | Status: ${participante1.getStatus()}`);
participante1.alterarStatus(StatusInscricao.CANCELADO);
console.log(`Novo Status do Participante: ${participante1.getStatus()}`);
class Evento {
    #participantesConfirmados = [];
    #listaDeEspera = [];
 
    constructor(identificador, nome, local, data, limiteParticipantes) {
        this.identificador = identificador;
        this.nome = nome;
        this.local = local;
        this.data = data;
        this.limiteParticipantes = limiteParticipantes;
    }
 
    #temVagaDisponivel() {
        return this.#participantesConfirmados.length < this.limiteParticipantes;
    }
 
    getVagasRestantes() {
        return this.limiteParticipantes - this.#participantesConfirmados.length;
    }
 
    inscreverParticipante(participante) {
        const jaInscrito = this.#participantesConfirmados.some(
            p => p.getIdentificador() === participante.getIdentificador()
        );
        const naEspera = this.#listaDeEspera.some(
            p => p.getIdentificador() === participante.getIdentificador()
        );
 
        if (jaInscrito || naEspera) {
            console.log(`"${participante.getNome()}" já está inscrito neste evento.`);
            return false;
        }
 
        if (this.#temVagaDisponivel()) {
            participante.alterarStatus(StatusInscricao.CONFIRMADO);
            this.#participantesConfirmados.push(participante);
            console.log(`"${participante.getNome()}" inscrito com sucesso em "${this.nome}".`);
            return true;
        } else {
            participante.alterarStatus(StatusInscricao.EM_ESPERA);
            this.#listaDeEspera.push(participante);
            const posicao = this.#listaDeEspera.length;
            console.log(`Vagas esgotadas. "${participante.getNome()}" entrou na lista de espera (posição ${posicao}).`);
            return false;
        }
    }
 
    #promoverProximoDaEspera() {
        if (this.#listaDeEspera.length === 0) return;
        const proximo = this.#listaDeEspera.shift();
        proximo.alterarStatus(StatusInscricao.CONFIRMADO);
        this.#participantesConfirmados.push(proximo);
        console.log(`"${proximo.getNome()}" foi promovido da lista de espera e está CONFIRMADO em "${this.nome}".`);
    }
 
    cancelarInscricao(participante) {
        const indice = this.#participantesConfirmados.findIndex(
            p => p.getIdentificador() === participante.getIdentificador()
        );
        if (indice === -1) {
            console.log(`"${participante.getNome()}" não está confirmado neste evento.`);
            return false;
        }
        this.#participantesConfirmados.splice(indice, 1);
        participante.alterarStatus(StatusInscricao.CANCELADO);
        console.log(`Inscrição de "${participante.getNome()}" cancelada.`);
        if (this.#temVagaDisponivel()) this.#promoverProximoDaEspera();
        return true;
    }
 
    getParticipantesConfirmados() { return [...this.#participantesConfirmados]; }
    getListaDeEspera()            { return [...this.#listaDeEspera]; }
    getIdentificador()            { return this.identificador; }
    getNome()                     { return this.nome; }
    getLocal()                    { return this.local; }
    getData()                     { return this.data; }
    getLimite()                   { return this.limiteParticipantes; }
}
 
class ConsultaEventos {
    consultarParticipantes(evento) {
        const confirmados = evento.getParticipantesConfirmados();
        console.log(`\n── Participantes confirmados: "${evento.getNome()}" ──`);
        if (confirmados.length === 0) { console.log('  Nenhum participante confirmado.'); return confirmados; }
        confirmados.forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.getNome()} (ID: ${p.getIdentificador()}) — ${p.getStatus()}`);
        });
        console.log(`  Total: ${confirmados.length} / ${evento.getLimite()} vagas`);
        return confirmados;
    }
 
    consultarListaDeEspera(evento) {
        const espera = evento.getListaDeEspera();
        console.log(`\n── Lista de espera: "${evento.getNome()}" ──`);
        if (espera.length === 0) { console.log('  Nenhum participante aguardando.'); return espera; }
        espera.forEach((p, i) => {
            console.log(`  ${i + 1}º na fila: ${p.getNome()} (ID: ${p.getIdentificador()})`);
        });
        return espera;
    }
 
    resumoEvento(evento) {
        console.log(`\n══ Resumo: "${evento.getNome()}" ══`);
        console.log(`  Local : ${evento.getLocal()}`);
        console.log(`  Data  : ${evento.getData()}`);
        console.log(`  Vagas : ${evento.getLimite() - evento.getVagasRestantes()} ocupadas / ${evento.getLimite()} totais`);
        console.log(`  Espera: ${evento.getListaDeEspera().length} pessoa(s) aguardando`);
    }
}
