import React, {useEffect, useState} from "react";
import {Chart} from "primereact/chart";
import Papa from 'papaparse';
import PageTitle from "../layout/pageTitle/PageTitle";

const DashboardMetricas = () => {
    const [chartsDataMixtral, setChartsDataMixtral] = useState({});
    const [chartsDataDeepseek, setChartsDataDeepseek] = useState({});

    useEffect(() => {
        // Função para carregar e processar um CSV
        const loadCSVData = (url) => {
            return fetch(url)
                .then(response => response.text())
                .then(csvString => {
                    const resultado = Papa.parse(csvString, {
                        header: true,
                        delimiter: ';',
                        skipEmptyLines: true,
                    });

                    return resultado.data.map(item => ({
                        ...item,
                        precisao: parseFloat(item.avgPrecisao.replace(",", ".")),
                        cobertura: parseFloat(item.avgCobertura.replace(",", ".")),
                        f1Score: parseFloat(item.avgF1Score.replace(",", ".")),
                        tempoMs: parseInt(item.avgTempoMs),
                        metricaType: item.metricaType.trim(),
                        fornecedor: item.fornecedor.trim(),
                    }));
                });
        };

        // Carregar ambos os CSVs em paralelo
        Promise.all([
            loadCSVData("/mixtral-final.csv"),
            loadCSVData("/deepseek-final.csv")
        ])
            .then(([dadosMixtral, dadosDeepseek]) => {
                prepararGraficos(dadosMixtral, dadosDeepseek);
            })
            .catch(error => {
                console.error("Erro ao carregar dados:", error);
            });
    }, []);

    const prepararGraficos = (dadosMixtral, dadosDeepseek) => {
        const fornecedoresMixtral = [...new Set(dadosMixtral.map(item => item.fornecedor))];
        const fornecedoresDeepSeek = [...new Set(dadosDeepseek.map(item => item.fornecedor))];

        // 1. Gráfico de Header (precisão e cobertura)
        const headerDataMixtral = {
            labels: fornecedoresMixtral,
            datasets: [
                // Precisão com contexto
                {
                    label: 'Precisão (Com Contexto)',
                    backgroundColor: '#631199',
                    data: fornecedoresMixtral.map(fornecedor => {
                        const item = dadosMixtral.find(d =>
                            d.fornecedor === fornecedor &&
                            d.metricaType === 'HEADER_WITH_CONTEXT'
                        );
                        return item ? item.precisao : 0;
                    }),
                },
                // Precisão sem contexto
                {
                    label: 'Precisão (Sem Contexto)',
                    backgroundColor: '#9942f5',
                    data: fornecedoresMixtral.map(fornecedor => {
                        const item = dadosMixtral.find(d =>
                            d.fornecedor === fornecedor &&
                            d.metricaType === 'HEADER_WITHOUT_CONTEXT'
                        );
                        return item ? item.precisao : 0;
                    }),
                },
                // Cobertura com contexto
                {
                    label: 'Cobertura (Com Contexto)',
                    backgroundColor: '#ffd400',
                    data: fornecedoresMixtral.map(fornecedor => {
                        const item = dadosMixtral.find(d =>
                            d.fornecedor === fornecedor &&
                            d.metricaType === 'HEADER_WITH_CONTEXT'
                        );
                        return item ? item.cobertura : 0;
                    }),
                },
                // Cobertura sem contexto
                {
                    label: 'Cobertura (Sem Contexto)',
                    backgroundColor: '#fff272',
                    data: fornecedoresMixtral.map(fornecedor => {
                        const item = dadosMixtral.find(d =>
                            d.fornecedor === fornecedor &&
                            d.metricaType === 'HEADER_WITHOUT_CONTEXT'
                        );
                        return item ? item.cobertura : 0;
                    }),
                }
            ]
        };

        const headerDataDeepseek = {
            labels: fornecedoresDeepSeek,
            datasets: [
                // Precisão com contexto
                {
                    label: 'Precisão (Com Contexto)',
                    backgroundColor: '#631199',
                    data: fornecedoresDeepSeek.map(fornecedor => {
                        const item = dadosDeepseek.find(d =>
                            d.fornecedor === fornecedor &&
                            d.metricaType === 'HEADER_WITH_CONTEXT'
                        );
                        return item ? item.precisao : 0;
                    }),
                },
                // Precisão sem contexto
                {
                    label: 'Precisão (Sem Contexto)',
                    backgroundColor: '#9942f5',
                    data: fornecedoresDeepSeek.map(fornecedor => {
                        const item = dadosDeepseek.find(d =>
                            d.fornecedor === fornecedor &&
                            d.metricaType === 'HEADER_WITHOUT_CONTEXT'
                        );
                        return item ? item.precisao : 0;
                    }),
                },
                // Cobertura com contexto
                {
                    label: 'Cobertura (Com Contexto)',
                    backgroundColor: '#ffd400',
                    data: fornecedoresDeepSeek.map(fornecedor => {
                        const item = dadosDeepseek.find(d =>
                            d.fornecedor === fornecedor &&
                            d.metricaType === 'HEADER_WITH_CONTEXT'
                        );
                        return item ? item.cobertura : 0;
                    }),
                },
                // Cobertura sem contexto
                {
                    label: 'Cobertura (Sem Contexto)',
                    backgroundColor: '#fff272',
                    data: fornecedoresMixtral.map(fornecedor => {
                        const item = dadosDeepseek.find(d =>
                            d.fornecedor === fornecedor &&
                            d.metricaType === 'HEADER_WITHOUT_CONTEXT'
                        );
                        return item ? item.cobertura : 0;
                    }),
                }
            ]
        };

        // 2. Gráfico de Itens (Body)
        const bodyDataMixtral = {
            labels: fornecedoresMixtral,
            datasets: [
                // Precisão com contexto
                {
                    label: 'Precisão (Com Contexto)',
                    backgroundColor: '#ff9800',
                    data: fornecedoresMixtral.map(fornecedor => {
                        const item = dadosMixtral.find(d =>
                            d.fornecedor === fornecedor &&
                            d.metricaType === 'BODY_WITH_CONTEXT'
                        );
                        return item ? item.precisao : 0;
                    }),
                },
                // Precisão sem contexto
                {
                    label: 'Precisão (Sem Contexto)',
                    backgroundColor: '#ffd198',
                    data: fornecedoresMixtral.map(fornecedor => {
                        const item = dadosMixtral.find(d =>
                            d.fornecedor === fornecedor &&
                            d.metricaType === 'BODY_WITHOUT_CONTEXT'
                        );
                        return item ? item.precisao : 0;
                    }),
                },
                // Cobertura com contexto
                {
                    label: 'Cobertura (Com Contexto)',
                    backgroundColor: '#26C6DA',
                    data: fornecedoresMixtral.map(fornecedor => {
                        const item = dadosMixtral.find(d =>
                            d.fornecedor === fornecedor &&
                            d.metricaType === 'BODY_WITH_CONTEXT'
                        );
                        return item ? item.cobertura : 0;
                    }),
                },
                // Cobertura sem contexto
                {
                    label: 'Cobertura (Sem Contexto)',
                    backgroundColor: '#a7eef6',
                    data: fornecedoresMixtral.map(fornecedor => {
                        const item = dadosMixtral.find(d =>
                            d.fornecedor === fornecedor &&
                            d.metricaType === 'BODY_WITHOUT_CONTEXT'
                        );
                        return item ? item.cobertura : 0;
                    }),
                }
            ]
        };

        const bodyDataDeepseek = {
            labels: fornecedoresDeepSeek,
            datasets: [
                // Precisão com contexto
                {
                    label: 'Precisão (Com Contexto)',
                    backgroundColor: '#ff9800',
                    data: fornecedoresDeepSeek.map(fornecedor => {
                        const item = dadosDeepseek.find(d =>
                            d.fornecedor === fornecedor &&
                            d.metricaType === 'BODY_WITH_CONTEXT'
                        );
                        return item ? item.precisao : 0;
                    }),
                },
                // Precisão sem contexto
                {
                    label: 'Precisão (Sem Contexto)',
                    backgroundColor: '#ffd198',
                    data: fornecedoresDeepSeek.map(fornecedor => {
                        const item = dadosDeepseek.find(d =>
                            d.fornecedor === fornecedor &&
                            d.metricaType === 'BODY_WITHOUT_CONTEXT'
                        );
                        return item ? item.precisao : 0;
                    }),
                },
                // Cobertura com contexto
                {
                    label: 'Cobertura (Com Contexto)',
                    backgroundColor: '#26C6DA',
                    data: fornecedoresDeepSeek.map(fornecedor => {
                        const item = dadosDeepseek.find(d =>
                            d.fornecedor === fornecedor &&
                            d.metricaType === 'BODY_WITH_CONTEXT'
                        );
                        return item ? item.cobertura : 0;
                    }),
                },
                // Cobertura sem contexto
                {
                    label: 'Cobertura (Sem Contexto)',
                    backgroundColor: '#a7eef6',
                    data: fornecedoresDeepSeek.map(fornecedor => {
                        const item = dadosDeepseek.find(d =>
                            d.fornecedor === fornecedor &&
                            d.metricaType === 'BODY_WITHOUT_CONTEXT'
                        );
                        return item ? item.cobertura : 0;
                    }),
                }
            ]
        };

        // 3. Gráfico de Tempo de Execução
        const tempoDataMixtral = {
            labels: fornecedoresMixtral,
            datasets: [
                // Tempo com contexto
                {
                    label: 'Com Contexto',
                    backgroundColor: '#8f70cd',
                    data: fornecedoresMixtral.map(fornecedor => {
                        const item = dadosMixtral.find(d =>
                            d.fornecedor === fornecedor &&
                            d.metricaType.includes('WITH_CONTEXT')
                        );
                        return item ? item.tempoMs : 0;
                    }),
                },
                // Tempo sem contexto
                {
                    label: 'Sem Contexto',
                    backgroundColor: '#49c554',
                    data: fornecedoresMixtral.map(fornecedor => {
                        const item = dadosMixtral.find(d =>
                            d.fornecedor === fornecedor &&
                            d.metricaType.includes('WITHOUT_CONTEXT')
                        );
                        return item ? item.tempoMs : 0;
                    }),
                }
            ]
        };

        const tempoDataDeepseek = {
            labels: fornecedoresDeepSeek,
            datasets: [
                // Tempo com contexto
                {
                    label: 'Com Contexto',
                    backgroundColor: '#8f70cd',
                    data: fornecedoresDeepSeek.map(fornecedor => {
                        const item = dadosDeepseek.find(d =>
                            d.fornecedor === fornecedor &&
                            d.metricaType.includes('WITH_CONTEXT')
                        );
                        return item ? item.tempoMs : 0;
                    }),
                },
                // Tempo sem contexto
                {
                    label: 'Sem Contexto',
                    backgroundColor: '#49c554',
                    data: fornecedoresDeepSeek.map(fornecedor => {
                        const item = dadosDeepseek.find(d =>
                            d.fornecedor === fornecedor &&
                            d.metricaType.includes('WITHOUT_CONTEXT')
                        );
                        return item ? item.tempoMs : 0;
                    }),
                }
            ]
        };

        setChartsDataMixtral({
            header: headerDataMixtral,
            body: bodyDataMixtral,
            tempo: tempoDataMixtral,
        });

        setChartsDataDeepseek({
            header: headerDataDeepseek,
            body: bodyDataDeepseek,
            tempo: tempoDataDeepseek,
        });
    };

    return (
        <div className="container">
            <PageTitle pageTitle={"Análise de resultados"} icon={"fa fa-dashboard"} />
            <div className="flex col-md-12">
                <div className="col-md-6">
                    <h2 className="text-2xl mb-4">mixtral:8x7b</h2>
                    {chartsDataMixtral.header && (
                        <>
                            <div className="card">
                                <h3 className="text-xl mb-4">Header - Precisão e Cobertura</h3>
                                <Chart
                                    type="bar"
                                    data={chartsDataMixtral.header}
                                    options={{
                                        scales: {
                                            x: { title: { display: true, text: 'Fornecedores' } },
                                            y: { title: { display: true, text: 'Valores' }, max: 1.0 }
                                        }
                                    }}
                                />
                            </div>

                            <div className="card">
                                <h3 className="text-xl mb-4">Itens (Body) - Precisão e Cobertura</h3>
                                <Chart
                                    type="bar"
                                    data={chartsDataMixtral.body}
                                    options={{
                                        scales: {
                                            x: { title: { display: true, text: 'Fornecedores' } },
                                            y: { title: { display: true, text: 'Valores' }, max: 1.0 }
                                        }
                                    }}
                                />
                            </div>
                            <h2 className="text-2xl mb-4">mixtral:8x7b</h2>
                            <div className="card">
                                <h3 className="text-xl mb-4">Tempo de Execução (ms)</h3>
                                <Chart
                                    type="bar"
                                    data={chartsDataMixtral.tempo}
                                    options={{
                                        scales: {
                                            x: { title: { display: true, text: 'Fornecedores' } },
                                            y: { title: { display: true, text: 'Milissegundos' } }
                                        }
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="col-md-6">
                    <h2 className="text-2xl mb-4">deepseek-r1:32b</h2>
                    {chartsDataDeepseek.header && (
                        <>
                            <div className="card">
                                <h3 className="text-xl mb-4">Header - Precisão e Cobertura</h3>
                                <Chart
                                    type="bar"
                                    data={chartsDataDeepseek.header}
                                    options={{
                                        scales: {
                                            x: { title: { display: true, text: 'Fornecedores' } },
                                            y: { title: { display: true, text: 'Valores' }, max: 1.0 }
                                        }
                                    }}
                                />
                            </div>

                            <div className="card">
                                <h3 className="text-xl mb-4">Itens (Body) - Precisão e Cobertura</h3>
                                <Chart
                                    type="bar"
                                    data={chartsDataDeepseek.body}
                                    options={{
                                        scales: {
                                            x: { title: { display: true, text: 'Fornecedores' } },
                                            y: { title: { display: true, text: 'Valores' }, max: 1.0 }
                                        }
                                    }}
                                />
                            </div>
                            <h2 className="text-2xl mb-4">deepseek-r1:32b</h2>
                            <div className="card">
                                <h3 className="text-xl mb-4">Tempo de Execução (ms)</h3>
                                <Chart
                                    type="bar"
                                    data={chartsDataDeepseek.tempo}
                                    options={{
                                        scales: {
                                            x: { title: { display: true, text: 'Fornecedores' } },
                                            y: { title: { display: true, text: 'Milissegundos' } }
                                        }
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardMetricas;