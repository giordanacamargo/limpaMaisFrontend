import React, {useEffect, useRef, useState} from "react";
import {Button} from "primereact/button";
import {FloatLabel} from "primereact/floatlabel";
import {Toast} from "primereact/toast";
import {showDialogElementSaved, showToastError, showToastWarn} from "../../utils/InterfaceUtils";
import CalendarBR from "../layout/customComponents/CalendarBR/CalendarBR";
import {Dropdown} from "primereact/dropdown";
import {InputNumber} from "primereact/inputnumber";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {formatCurrency, formatNumber} from "../../utils/FormatUtils";
import PageTitle from "../layout/pageTitle/PageTitle";
import {useNavigate, useParams} from "react-router-dom";
import SavedDialog from "../layout/customComponents/confirmDialogs/SavedDialog";
import useVendaService from "../../services/VendaService";
import usePrecoService from "../../services/PrecoService";
import useClienteService from "../../services/ClienteService";

function CadastroVenda() {
    const {idVenda} = useParams();  // Obter o idVenda da URL
    const toast = useRef(null);
    const SavedDialogRef = useRef(null);
    const navigate = useNavigate();
    const [editableInfos, setEditableInfos] = useState(true);
    const formRef = useRef(null);
    const [precos, setPrecos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const {newVenda, findById} = useVendaService();
    const {findAllAtivos} = usePrecoService();
    const {findAllClientes} = useClienteService();
    const [venda, setVenda] = useState({
        idVenda: "",
        cliente: null,
        vendaProdutos: [],
        valorTotal: 0,
        dataVenda: new Date(),
        dataPagamento: "",
    });

    const fetchData = async () => {
        try {
            const result = await findById(idVenda);
            setVenda(result);
        } catch (error) {
            showToastError(toast, "Não foi possível carregar a venda selecionada. Por favor, tente novamente mais tarde.");
        }
    };

    const fetchDataPrecos = async () => {
        try {
            const result = await findAllAtivos();
            setPrecos(result);
        } catch (error) {
            showToastError(toast, "Não foi possível carregar os preços ativos. Por favor, tente novamente mais tarde.");
        }
    };

    const fetchDataClientes = async () => {
        try {
            const result = await findAllClientes();
            setClientes(result);
        } catch (error) {
            showToastError(toast, "Não foi possível carregar os clientes cadastrados. Por favor, tente novamente mais tarde.");
        }
    };

    useEffect(() => {
        setVenda((prevVenda) => ({
            ...prevVenda,
            valorTotal: calcularValorTotalVenda(),
        }));
    }, [venda.vendaProdutos]);

    useEffect(() => {
        cleanVendaObject();
        if (idVenda) {
            setEditableInfos(false);
            fetchData();
        }
        fetchDataClientes();
        fetchDataPrecos();
    }, [idVenda]);

    useEffect(() => {
        if (venda.cliente) {
            const updatedVendaProdutos = venda.vendaProdutos.map((produto) => {
                const selectedPreco = precos.find(
                    (preco) => preco.produto.idProduto === produto.produto.idProduto
                );
                if (selectedPreco) {
                    const precoUnitario = venda.cliente.vendedor
                        ? selectedPreco.precoB2B
                        : selectedPreco.precoB2C;
                    return {
                        ...produto,
                        preco: precoUnitario,
                        valorTotalPorProduto: produto.quantidade * precoUnitario,
                    };
                }
                return produto;
            });

            setVenda({...venda, vendaProdutos: updatedVendaProdutos});
        }
    }, [venda.cliente]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isVendaValida()) {
            handleNewVenda();
        }
    };

    async function handleNewVenda() {
        try {
            await newVenda(venda);
            cleanVendaObject();
            showDialogElementSaved(SavedDialogRef);
        } catch (error) {
            showToastError(toast, "Não foi possível salvar a venda. Por favor, tente novamente mais tarde.");
        }
    }

    function cleanVendaObject() {
        setVenda({
            idVenda: "",
            cliente: null,
            vendaProdutos: [],
            valorTotal: 0,
            dataVenda: new Date(),
            dataPagamento: "",
        });
        setEditableInfos(true);
    }

    const addVendaProduto = () => {
        if (venda.cliente) {
            if (precos.length > 0) {
                const firstPreco = precos[0];
                const precoUnitario = venda.cliente.vendedor ? firstPreco.precoB2B : firstPreco.precoB2C;
                setVenda({
                    ...venda,
                    vendaProdutos: [
                        ...venda.vendaProdutos,
                        {
                            produto: firstPreco.produto,
                            quantidade: 1,
                            preco: precoUnitario,
                            valorTotalPorProduto: precoUnitario
                        },
                    ],
                });
            } else {
                showToastWarn(toast, "Não há preços disponíveis. Não é possível adicionar produtos à venda.");
            }
        } else {
            showToastWarn(toast, "Por favor, selecione um cliente para definir os preços unitários.");
        }
    };

    const updateVendaProduto = (index, field, value) => {
        const updatedVendaProdutos = [...venda.vendaProdutos];
        updatedVendaProdutos[index][field] = value;

        if (field === "produto") {
            const selectedPreco = precos.find(
                (preco) => preco.produto.idProduto === value.idProduto
            );
            if (selectedPreco) {
                updatedVendaProdutos[index].preco = selectedPreco.precoB2C;
            }
        }

        if (field === "quantidade" || field === "produto") {
            updatedVendaProdutos[index].valorTotalPorProduto =
                updatedVendaProdutos[index].quantidade *
                updatedVendaProdutos[index].preco;
        }

        setVenda({...venda, valorTotal: calcularValorTotalVenda(), vendaProdutos: updatedVendaProdutos});
    };

    function renderPreco(rowData) {
        if (rowData.produto && rowData.produto.idProduto) {
            const selectedPreco = precos.find(preco => preco.produto.idProduto === rowData.produto.idProduto);
            if (venda.cliente) {
                if (venda.cliente.vendedor) {
                    return selectedPreco ? formatCurrency(selectedPreco.precoB2B) : '';
                } else {
                    return selectedPreco ? formatCurrency(selectedPreco.precoB2C) : '';
                }
            }
        }
        return '';
    }

    function isVendaValida() {
        const form = formRef.current;
        if (!form.checkValidity()) {
            return form.reportValidity();
        }
        if (!venda.cliente) {
            showToastError(toast, "Por favor, selecione um cliente para continuar.");
            return false;
        }
        if (!venda.vendaProdutos || venda.vendaProdutos.length <= 0) {
            showToastError(toast, "Por favor, adicione pelo menos um produto para continuar.");
            return false;
        }
        if (venda.valorTotal === 0) {
            showToastError(toast, "O valor total da venda não pode ser zero.");
            return false;
        }
        return true;
    }

    const calcularValorTotalVenda = () => {
        let total = 0;
        venda.vendaProdutos.forEach((produto) => {
            total += produto.valorTotalPorProduto;
        });
        return total;
    };

    function pageTitle() {
        if (idVenda) {
            return "Venda"
        } else {
            return "Nova Venda"
        }
    }

    const headerProdutosVenda = (
        <div className="displayFlex align-items-center">
            <div className="col-md-6 textAlignStart">
                <h5><b>Produtos da venda</b></h5>
            </div>
            <div className="col-md-6 textAlignEnd">
                <Button className="p-button-text"
                        label="Adicionar"
                        type="button"
                        icon="pi pi-plus"
                        disabled={!editableInfos}
                        onClick={addVendaProduto}
                />
            </div>
        </div>
    );

    return (
        <div className="container">
            <Toast ref={toast}/>
            <PageTitle pageTitle={pageTitle()} icon={"fa fa-money center icon"}/>
            <form ref={formRef} onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-6">
                            <FloatLabel>
                                <CalendarBR id="dataVenda" required showButtonBar disabled={!editableInfos}
                                            value={venda.dataVenda ? new Date(venda.dataVenda) : null}
                                            onChange={(value) => setVenda({...venda, dataVenda: value,})}
                                            className="widthFull"
                                />
                                <label htmlFor="dataVenda">Data da Venda</label>
                            </FloatLabel>
                        </div>
                        <div className="col-md-6">
                            <FloatLabel>
                                <CalendarBR id="dataPagamento" showButtonBar disabled={!editableInfos}
                                            value={venda.dataPagamento ? new Date(venda.dataPagamento) : null}
                                            onChange={(value) => setVenda({...venda, dataPagamento: value,})}
                                            className="widthFull"
                                />
                                <label htmlFor="dataPagamento">Data do Pagamento</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12 displayContents">
                        <div className="col-md-6">
                            <FloatLabel>
                                <Dropdown id="cliente" disabled={!editableInfos} filter
                                          emptyFilterMessage="Nenhum cliente encontrado"
                                          value={venda.cliente} className="widthFull" placeholder="Selecione o cliente"
                                          onChange={(e) => setVenda({...venda, cliente: e.value})}
                                          options={clientes.map((cliente) => ({
                                              label: cliente.nome,
                                              value: cliente,
                                          }))}
                                />
                                <label htmlFor="cliente">Cliente</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12">
                        <div className="col-md-12">
                            <DataTable value={venda.vendaProdutos} editMode="row" stripedRows showGridlines
                                       emptyMessage="Nenhum produto"
                                       footer={<h6 className="textAlignEnd"><b>Total da
                                           Venda: {formatCurrency(venda.valorTotal)}</b></h6>}
                                       header={headerProdutosVenda}>
                                <Column field="produto" header="Produto"
                                        editor={(options) => (
                                            <Dropdown
                                                filter emptyFilterMessage="Nenhum produto encontrado"
                                                value={options.value}
                                                options={precos.map((preco) => ({
                                                    label: preco.produto.nome,
                                                    value: preco.produto,
                                                }))}
                                                onChange={(e) => {
                                                    options.editorCallback(e.value);
                                                    updateVendaProduto(options.rowIndex, "produto", e.value);
                                                }}
                                            />
                                        )}
                                        body={(rowData) => rowData.produto ? rowData.produto.nome : ""}
                                />
                                <Column field="quantidade" header="Quantidade" align="center"
                                        headerStyle={{width: "10%", minWidth: "8rem"}}
                                        editor={(options) => (
                                            <InputNumber value={options.value} locale="pt-BR"
                                                         onValueChange={(e) => {
                                                             options.editorCallback(e.value);
                                                             updateVendaProduto(
                                                                 options.rowIndex,
                                                                 "quantidade",
                                                                 e.value
                                                             );
                                                         }}
                                            />
                                        )}
                                        body={(rowData) => rowData.quantidade ? formatNumber(rowData.quantidade) : ""}/>
                                <Column field="preco" align="center" headerStyle={{width: "10%", minWidth: "10rem"}}
                                        header="Preço unitário" body={renderPreco}/>
                                <Column field="valorTotalPorProduto" headerStyle={{width: "10%", minWidth: "14rem"}}
                                        header="Valor final por produto" align="center"
                                        body={(rowData) => rowData.valorTotalPorProduto ? formatCurrency(rowData.valorTotalPorProduto) : ""}/>
                                {editableInfos &&
                                    <Column header="Ações" rowEditor
                                            headerStyle={{width: "10%", minWidth: "8rem"}} align="center"/>}
                            </DataTable>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12">
                        <div className="col-md-12 textAlignCenter">
                            <Button className="p-button-text" type="button" label="Cancelar"
                                    onClick={() => navigate('/vendas')}
                                    icon="pi pi-times"/>
                            <Button type="submit" disabled={!editableInfos} label="Salvar" onClick={handleSubmit}
                                    icon="pi pi-check"/>
                        </div>
                    </div>
                </div>

                <SavedDialog ref={SavedDialogRef} headerMessage="Sucesso" message="A venda foi efetuada com sucesso."
                             icon="pi pi-check" onListAll={() => navigate('/vendas')} labelListAll="Listar todas"
                             onNew={() => navigate('/nova_venda')} labelNew="Nova venda"/>
            </form>
        </div>
    );
}

export default CadastroVenda;
