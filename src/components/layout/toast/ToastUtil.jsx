import React, {useRef} from "react";
import {Toast} from "primereact/toast";

function ToastUtil() {
    const toast = useRef(null);
    this.accept = () => {
        toast.current.show({severity: 'info', summary: 'Sucesso', detail: 'Ação realizada com sucesso', life: 2000});
    }

    this.reject = () => {
        toast.current.show({severity: 'warn', summary: 'Cancelada', detail: 'Ação cancelada', life: 2000});
    }

    return (
        <Toast ref={toast}/>
    );


};
export default ToastUtil;