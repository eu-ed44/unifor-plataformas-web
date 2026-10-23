import React, { Component } from 'react'
import Main from '../template/Main'

const headerProps = {
    icon: 'cutlery',
    title: 'Cardápio Digital',
    subtitle: 'Gestão de Marmitas: Incluir, Listar, Alterar e Excluir pratos!'
}

const initialState = {
    prato: { nome: '', descricao: '', preco: '' },
    list: []
}

export default class UserCrud extends Component {

    state = { ...initialState }

    // Transformamos em Arrow Function para deixar a chamada no HTML mais limpa
    updateField = (event) => {
        const prato = { ...this.state.prato }
        prato[event.target.name] = event.target.value
        this.setState({ prato })
    }

    renderForm() {
        // DESESTRUTURAÇÃO: Extraímos as variáveis para não ter que repetir "this.state.prato"
        const { nome, preco, descricao } = this.state.prato

        return (
            <div className="form">
                <div className="row">
                    {/* Campos unificados em menos Divs */}
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
                        <button className="btn btn-primary">Salvar Prato</button>
                        <button className="btn btn-secondary ml-2">Cancelar</button>
                    </div>
                </div>
            </div>
        )
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
                    <tr>
                        <td>1</td>
                        <td>Frango Grelhado Fit</td>
                        <td>Arroz integral, feijão, salada e farofa</td>
                        <td>R$ 18.50</td>
                        <td>
                            <button className="btn btn-warning"><i className="fa fa-pencil"></i></button>
                            <button className="btn btn-danger ml-2"><i className="fa fa-trash"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}