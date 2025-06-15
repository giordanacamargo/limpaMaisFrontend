import React, {useEffect, useRef, useState} from "react";
import './CadastroProdutoModal.css';
import 'react-toastify/dist/ReactToastify.css';
import {InputText} from "primereact/inputtext";
import {FloatLabel} from "primereact/floatlabel";
import {InputNumber} from "primereact/inputnumber";
import {InputTextarea} from "primereact/inputtextarea";
import useProdutoService from "../../../../services/ProdutoService";
import useCategoriaService from "../../../../services/CategoriaService";
import {Dialog} from "primereact/dialog";
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import {MultiSelect} from "primereact/multiselect";
import {showToastError} from "../../../../utils/InterfaceUtils";

function CadastroProdutoModal({idProduto, visible, onHideSucess, onHideCancel}) {
    const toast = useRef(null);
    const formRef = useRef(null);
    const {findAllCategorias} = useCategoriaService();
    const {findById, newProduto} = useProdutoService();


    const [produto, setProduto] = useState({
        idProduto: '',
        nome: '',
        volume: null,
        peso: null,
        descricao: '',
        categorias: []
    });

    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        cleanProdutoObject();

        if (idProduto) {
            const fetchData = async () => {
                try {
                    const result = await findById(idProduto);
                    setProduto(result);
                } catch (error) {
                    showToastError(toast, "Não foi possível carregar o produto selecionado. Por favor, tente novamente mais tarde.");
                }
            };
            fetchData();
        }

        const fetchCategorias = async () => {
            try {
                const resultCategorias = await findAllCategorias();
                setCategorias(resultCategorias);
            } catch (error) {
                showToastError(toast, "Erro ao buscar categorias. Por favor, tente novamente mais tarde.");
            }
        }
        fetchCategorias();

    }, [idProduto]);

    function handleChange(event) {
        setProduto({...produto, [event.target.id]: event.target.value});
    }

    const handleChangeInput = (e, inputName) => {
        const value = e.value;
        setProduto(prevProduto => ({
            ...prevProduto,
            [inputName]: value
        }));
    };

    async function handleNewProduto() {
        try {
            await newProduto(produto);
            cleanProdutoObject();
            onHideSucess();
        } catch (error) {
            showToastError(toast, "Não foi possível salvar o produto. Por favor, tente novamente mais tarde.");
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const form = formRef.current;
        if (form.checkValidity()) {
            handleNewProduto();
        } else {
            form.reportValidity();
        }
    }

    function cleanProdutoObject() {
        setProduto({
            idProduto: '',
            nome: '',
            volume: null,
            peso: null,
            descricao: '',
            categorias: []
        });
    }

    function handleCategoriaSelectionChange(event) {
        const selectedCategoria = event.value;
        const updatedCategorias = categorias.filter(categoria => selectedCategoria.includes(categoria.idCategoria));
        setProduto({...produto, categorias: updatedCategorias});
    }

    const footerContent = (
        <div>
            <Button className="p-button-text" onClick={onHideCancel} label="Cancelar" icon="pi pi-times"/>
            <Button type="submit" label="Salvar" onClick={handleSubmit} icon="pi pi-check" autoFocus/>
        </div>
    );

    return (
        <Dialog visible={visible} onHide={onHideCancel} header="Cadastro de produto" footer={footerContent}
                draggable={false}>
            <Toast ref={toast}/>
            <form onSubmit={handleSubmit} ref={formRef}>
                <div className="form-row">
                    <div className="form-group col-md-6 displayContents">
                        <div className="col-md-6">
                            <FloatLabel>
                                <InputText required id="nome" value={produto.nome}
                                           onChange={handleChange} className="widthFull"/>
                                <label htmlFor="nome">Nome</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div className="form-group col-md-6 displayContents">
                        <div className="col-md-3">
                            <FloatLabel>
                                <InputNumber suffix="l" size="5" value={produto.volume || null}
                                             onChange={(e) => handleChangeInput(e, "volume")}/>
                                <label htmlFor="volume">Volume</label>
                            </FloatLabel>
                        </div>
                        <div className="col-md-3">
                            <FloatLabel>
                                <InputNumber suffix="kg" size="5" value={produto.peso || null}
                                             onChange={(e) => handleChangeInput(e, "peso")}/>
                                <label htmlFor="peso">Peso</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-12">
                            <FloatLabel>
                                <MultiSelect id="categorias"
                                             value={produto.categorias.map(categoria => categoria.idCategoria)}
                                             onChange={handleCategoriaSelectionChange}
                                             options={categorias.map(categoria => ({
                                                 label: categoria.nome,
                                                 value: categoria.idCategoria
                                             }))}
                                             display="chip"
                                             placeholder="Selecione as categorias"
                                             className="widthFull"/>
                                <label htmlFor="categorias">Categorias</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-12">
                            <FloatLabel>
                                <InputTextarea id="descricao" value={produto.descricao || ''} onChange={handleChange}
                                               rows={5} cols={30} className="widthFull"/>
                                <label htmlFor="descricao">Descrição</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
            </form>
        </Dialog>
    );
}

export default CadastroProdutoModal;
