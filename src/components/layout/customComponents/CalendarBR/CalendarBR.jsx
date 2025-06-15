import React from "react";
import {Calendar} from 'primereact/calendar';
import {addLocale} from 'primereact/api';

addLocale('br', {
    firstDayOfWeek: 0,
    dateFormat: "dd/mm/yy",
    showMonthAfterYear: true,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
    dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
    today: 'Hoje',
    clear: 'Limpar'
});

export default function CalendarBR({value, id, className, onChange, required, showButtonBar, disabled}) {
    const handleClear = () => {
        onChange(null);
    };

    const handleTodayButtonClick = () => {
        onChange(new Date());
    };

    return (
        <Calendar id={id}
                  value={value}
                  className={className}
                  required={required}
                  hourFormat={""}
                  disabled={disabled}
                  onClearButtonClick={handleClear}
                  onTodayButtonClick={handleTodayButtonClick}
                  showIcon
                  showButtonBar={showButtonBar}
                  onChange={(e) => onChange(e.value)} locale="br"/>
    )
}