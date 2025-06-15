import React, {useEffect, useRef, useState} from "react";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {Dialog} from "primereact/dialog";
import {FloatLabel} from "primereact/floatlabel";
import {InputNumber} from "primereact/inputnumber";
import {Dropdown} from "primereact/dropdown";
import CalendarBR from "../../../layout/customComponents/CalendarBR/CalendarBR";
import {showToastError} from "../../../../utils/InterfaceUtils";
import usePrecoService from "../../../../services/PrecoService";
import useProdutoService from "../../../../services/ProdutoService";

function CadastroPrecoModal({idPreco, visible, onHideSucess, onHideCancel}) {
    const toast = useRef(null);
    const formRef = useRef(null);
    const [produtos, setProdutos] = useState([]);
    const {findById, newPreco} = usePrecoService();
    const {findAllProdutos} = useProdutoService();

    const [preco, setPreco] = useState({
        idPreco: '',
        precoB2B: null,
        precoB2C: null,
        dataInicio: null,
        dataFim: null,
        ativo: true,
        produto: []
    });

    useEffect(() => {
        cleanPrecoObject();

        if (idPreco) {
            const fetchData = async () => {
                try {
                    const result = await findById(idPreco);
                    setPreco(result);
                } catch (error) {
                    showToastError(toast, "Não foi possível carregar o preço selecionado. Por favor, tente novamente mais tarde.");
                }
            };
            fetchData();
        }

        const fetchProdutos = async () => {
            try {
                const resultProdutos = await findAllProdutos("nome");
                setProdutos(resultProdutos.content);
            } catch (error) {
                showToastError(toast, "Não foi possível buscar produtos. Por favor, tente novamente mais tarde.")
            }
        }
        fetchProdutos();

    }, [findAllProdutos, findById, idPreco]);

    async function handleNewPreco() {
        try {
            await newPreco(preco);
            cleanPrecoObject();
            onHideSucess();
        } catch (error) {
            showToastError(toast, "Não foi possível salvar a precificação.");
        }
    }

    const handleChangeInput = (e, inputName) => {
        setPreco(prevPreco => ({
            ...prevPreco,
            [inputName]: e.value,
        }));
    };

    function cleanPrecoObject() {
        setPreco({
            idPreco: '',
            precoB2B: null,
            precoB2C: null,
            dataInicio: new Date(),
            dataFim: null,
            ativo: true,
            produto: [],
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (formRef.current.checkValidity()) {
            handleNewPreco();
        } else {
            formRef.current.reportValidity();
        }
    }

    const footerContent = (
        <div>
            <Button className="p-button-text" onClick={onHideCancel} label="Cancelar" icon="pi pi-times"/>
            <Button type="submit" label="Salvar" onClick={handleSubmit} icon="pi pi-check" autoFocus/>
        </div>
    );

    return (
        <Dialog visible={visible} onHide={onHideCancel} header="Cadastro de preço" footer={footerContent}>
            <Toast ref={toast}/>
            <form onSubmit={handleSubmit} ref={formRef}>
                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-6">
                            <FloatLabel>
                                <InputNumber
                                    className="widthFull"
                                    value={preco.precoB2B !== null ? preco.precoB2B.toFixed(2) : null}
                                    onChange={(e) => handleChangeInput(e, "precoB2B")}
                                    locale="pt-BR"
                                    mode="currency"
                                    currency="BRL"
                                    placeholder="R$ 0,00"
                                />
                                <label htmlFor="precoB2B">Preço para vendedor</label>
                            </FloatLabel>
                        </div>
                        <div className="col-md-6">
                            <FloatLabel>
                                <InputNumber
                                    className="widthFull"
                                    value={preco.precoB2C !== null ? preco.precoB2C.toFixed(2) : null}
                                    onChange={(e) => handleChangeInput(e, "precoB2C")}
                                    locale="pt-BR"
                                    mode="currency"
                                    currency="BRL"
                                    placeholder="R$ 0,00"
                                />
                                <label htmlFor="precoB2C">Preço para clientes</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-12">
                            <FloatLabel>
                                <Dropdown
                                    id="idProduto"
                                    value={preco.produto}
                                    onChange={(e) => handleChangeInput(e, "produto")}
                                    options={produtos.map(produto => ({
                                        label: produto.nome,
                                        value: produto,
                                    }))}
                                    filter
                                    placeholder="Selecione o produto"
                                    className="widthFull"
                                />
                                <label htmlFor="idProduto">Produto</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-4">
                            <FloatLabel>
                                <CalendarBR
                                    id="dataInicio"
                                    value={preco.dataInicio ? new Date(preco.dataInicio) : null}
                                    onChange={(value) => setPreco({...preco, dataInicio: value})}
                                    className="widthFull"
                                />
                                <label htmlFor="dataInicio">Data de início</label>
                            </FloatLabel>
                        </div>
                        <div className="col-md-4">
                            <FloatLabel>
                                <CalendarBR
                                    id="dataFim"
                                    value={preco.dataFim ? new Date(preco.dataFim) : null}
                                    onChange={(value) => setPreco({...preco, dataFim: value})}
                                    className="widthFull"
                                    showButtonBar
                                />
                                <label htmlFor="dataFim">Data final</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
            </form>
        </Dialog>
    );
}

export default CadastroPrecoModal;
