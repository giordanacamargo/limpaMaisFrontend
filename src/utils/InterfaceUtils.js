const showToastSuccess = (toast, message) => {
    if (toast.current) {
        toast.current.show({
            severity: "success",
            summary: "Sucesso",
            detail: message,
            life: 2000,
        });
    }
};

const showToastError = (toast, message) => {
    if (toast.current) {
        toast.current.show({
            severity: "error",
            summary: "Erro",
            detail: message,
            life: 5000,
        });
    }
};

const showToastWarn = (toast, message) => {
    if (toast.current) {
        toast.current.show({
            severity: "warn",
            summary: "Atenção!",
            detail: message,
            life: 5000,
        });
    }
};

const showDialogElementSaved = (SavedDialogRef) => {
    SavedDialogRef.current.confirm1();
};

const masks = {
    cpf: "999.999.999-99",
    cnpj: "99.999.999/9999-99",
    telefone: "(99) 99999-9999",
};

export {showToastSuccess, showToastError, showToastWarn, showDialogElementSaved, masks};