function formatData(data) {
    const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
    return new Date(data).toLocaleDateString('pt-BR', options);
}

function formatTelefone(telefone) {
    if (!telefone) return '';

    const cleaned = ('' + telefone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);

    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }

    return telefone;
}

function formatNumber(number) {
    if (number) {
        return number.toLocaleString("pt-BR");
    }
    return number;
}


function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
}


export {formatData, formatTelefone, formatNumber, formatCurrency};
