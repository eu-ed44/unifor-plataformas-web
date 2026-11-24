import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const headerProps = {
    icon: 'cutlery',
    title: 'Cardápio Digital',
    subtitle: 'Gestão de Marmitas: Incluir, Listar, Alterar e Excluir pratos!'
}

const baseUrl = 'http://localhost:3001/pratos'

const initialState = {
    prato: { nome: '', descricao: '', preco: '' },
    list: [],
    error: null
}

export default class UserCrud extends Component {

    state = { ...initialState }

    // 1. CARREGAR DADOS: Assim que a página abre, vai buscar os pratos à base de dados
    componentDidMount() {
        axios(baseUrl)
            .then(resp => {
                this.setState({ list: resp.data, error: null })
            })
            .catch(err => {
                console.error('Erro ao carregar pratos da API:', err)
                this.setState({
                    error: 'Não foi possível conectar ao servidor (porta 3001). Verifique se a API está em execução.'
                })
            })
    }

    clear() {
        this.setState({ prato: { ...initialState.prato }, error: null })
    }

    save() {
        const prato = this.state.prato
        const method = prato.id ? 'put' : 'post'
        const url = prato.id ? `${baseUrl}/${prato.id}` : baseUrl

        axios[method](url, prato)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ prato: { ...initialState.prato }, list, error: null })
            })
            .catch(err => {
                console.error('Erro ao salvar prato:', err)
                this.setState({
                    error: 'Não foi possível salvar o prato. Verifique a conexão com a API.'
                })
            })
    }

    getUpdatedList(prato) {
        return [prato, ...this.state.list.filter(p => p.id !== prato.id)]
    }

    updateField = (event) => {
        const { name, value } = event.target
        this.setState(prevState => ({
            prato: {
                ...prevState.prato,
                [name]: value
            }
        }))
    }

    // 2. CARREGAR PARA EDIÇÃO: Põe os dados da linha clicada de volta no formulário
    load(prato) {
        this.setState({ prato: { ...prato }, error: null })
    }

    // 3. APAGAR: Remove o prato da base de dados e do ecrã
    remove(prato) {
        axios.delete(`${baseUrl}/${prato.id}`)
            .then(() => {
                const list = this.state.list.filter(p => p.id !== prato.id)
                this.setState({ list, error: null })
            })
            .catch(err => {
                console.error('Erro ao remover prato:', err)
                this.setState({
                    error: 'Não foi possível remover o prato. Verifique a conexão com a API.'
                })
            })
    }

    renderForm() {
        const { nome, preco, descricao } = this.state.prato

        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-8 form-group">
                        <label>Nome da Marmita</label>
                        <input type="text" className="form-control" name="nome"
                            value={nome} onChange={this.updateField}
                            placeholder="Ex: Frango Grelhado Fit..." />
                    </div>

                    <div className="col-12 col-md-4 form-group">
                        <label>Preço (R$)</label>
                        <input type="number" className="form-control" name="preco"
                            value={preco} onChange={this.updateField}
                            placeholder="Ex: 18.50" />
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 form-group">
                        <label>Descrição / Acompanhamentos</label>
                        <input type="text" className="form-control" name="descricao"
                            value={descricao} onChange={this.updateField}
                            placeholder="Ex: Arroz integral, feijão, salada e farofa..." />
                    </div>
                </div>

                <hr />
                
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary" onClick={() => this.save()}>
                            Salvar Prato
                        </button>
                        <button className="btn btn-secondary ml-2" onClick={() => this.clear()}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // 4. DESENHAR LINHAS DINÂMICAS: Percorre a memória (state.list) e cria uma linha para cada prato
    renderRows() {
        return this.state.list.map(prato => {
            return (
                <tr key={prato.id}>
                    <td>{prato.id}</td>
                    <td>{prato.nome}</td>
                    <td>{prato.descricao}</td>
                    <td>R$ {prato.preco}</td>
                    <td>
                        <button className="btn btn-warning" onClick={() => this.load(prato)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2" onClick={() => this.remove(prato)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Preço</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Agora a tabela chama a função que desenha os pratos reais! */}
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.state.error && (
                    <div className="alert alert-danger" role="alert">
                        {this.state.error}
                    </div>
                )}
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}