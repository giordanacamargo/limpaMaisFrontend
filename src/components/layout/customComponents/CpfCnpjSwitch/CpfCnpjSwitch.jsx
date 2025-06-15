import React from "react";
import {RadioButton} from "primereact/radiobutton";
import {InputMask} from "primereact/inputmask";
import {masks} from "../../../../utils/InterfaceUtils";
import "./CpfCnpjSwitch.css"

const CpfCnpjSwitch = ({isPessoaJuridica, cpf, cnpj, onSwitchChange, onInputChange}) => {
    return (
        <div className="col-md-12 inputCpfCnpj">
            <div className="row align-items-center mb-3 inputCpfCnpjRadios">
                <div className="col-md-5 displayFlex">
                    <RadioButton className="label-cpf-cnpj"
                                 inputId="pessoaFisica"
                                 name="tipoPessoa"
                                 value={false}
                                 checked={!isPessoaJuridica}
                                 onChange={onSwitchChange}
                    />
                    <label htmlFor="pessoaFisica" className="ml-2 label-cpf-cnpj">Pessoa Física</label>
                </div>
                <div className="col-md-7 displayFlex">
                    <RadioButton className="label-cpf-cnpj"
                                 inputId="pessoaJuridica"
                                 name="tipoPessoa"
                                 value={true}
                                 checked={isPessoaJuridica}
                                 onChange={onSwitchChange}
                    />
                    <label htmlFor="pessoaJuridica" className="ml-2 label-cpf-cnpj">Pessoa Jurídica</label>
                </div>
            </div>
            <div className="row align-items-center mb-3">
                {isPessoaJuridica ? (
                    <InputMask
                        placeholder="CNPJ"
                        mask={masks.cnpj}
                        id="cnpj"
                        name="cnpj"
                        className="inputTextCpfCnpj widthFull"
                        value={cnpj || null}
                        onChange={onInputChange}
                    />
                ) : (
                    <InputMask
                        placeholder="CPF"
                        mask={masks.cpf}
                        id="cpf"
                        name="cpf"
                        className="inputTextCpfCnpj widthFull"
                        value={cpf || null}
                        onChange={onInputChange}
                    />
                )}
            </div>
        </div>
    );
};

export default CpfCnpjSwitch;
