import React, { useState } from "react";
import axios from "axios";

const AnamneseForm = () => {
    const [formData, setFormData] = useState({
        crianca_id: "",
        sociabilidade_atividades: "",
        sociabilidade_amigos: "",
        sociabilidade_interacao: false,
        sociabilidade_fala_sozinho: false,
        sociabilidade_brinca_faz_de_conta: false,
        sociabilidade_imita_animais: false,
        sociabilidade_imita_pessoas: false,
        vestuario_veste_sozinho: false,
        vestuario_se_penteia: false,
        vestuario_toma_banho: false,
        vestuario_escova_dentes: false,
        vestuario_faz_nos: false,
        vestuario_arruma_materiais: "",
        antecedentes_deficiencias: "",
        antecedentes_mentais: "",
        antecedentes_alcoolismo: "",
        antecedentes_suicidio: false,
        antecedentes_alergia: "",
        antecedentes_luto: false,
        relacionamento_conflitos: "",
        relacionamento_dinamica: "",
        relacionamento_crises: "",
        relacionamento_fica_maior_tempo: "",
        relacionamento_comportamento: "",
        relacionamento_ajuda_tarefas: "",
        escolaridade_serie: "",
        escolaridade_reprovacao: false,
        escolaridade_dificuldade: "",
        escolaridade_professor_apoio: false,
        escolaridade_assistencia: "",
        escolaridade_suporte: "",
        escolaridade_comportamento: "",
        historico_social_habitos: "",
        historico_social_apoio: "",
        desenvolvimento_localiza_corpo: false,
        desenvolvimento_localiza_corpo_grafico: false,
        desenvolvimento_canta_musica: false,
        desenvolvimento_canta_parte_musica: false,
        desenvolvimento_danca_batida: false,
        desenvolvimento_danca_acompanhado: false,
        desenvolvimento_percebe_corpo: false,
        desenvolvimento_percebe_outros: false,
        desenvolvimento_identifica_roteiros: false,
        data_preenchimento: "",
        terapeuta_responsavel: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/anamnese", formData);
            alert("Anamnese cadastrada com sucesso!");
        } catch (error) {
            console.error("Erro ao cadastrar anamnese", error);
        }
    };

    return (
        <div>
            <h2>Cadastrar Anamnese</h2>
            <form onSubmit={handleSubmit}>
                {Object.keys(formData).map((key) => (
                    <label key={key}>
                        {key.replace(/_/g, ' ').toUpperCase()}:
                        <input
                            type={typeof formData[key] === "boolean" ? "checkbox" : "text"}
                            name={key}
                            value={typeof formData[key] === "boolean" ? undefined : formData[key]}
                            checked={typeof formData[key] === "boolean" ? formData[key] : undefined}
                            onChange={handleChange}
                        />
                    </label>
                ))}
                <button type="submit">Salvar</button>
            </form>
        </div>
    );
};

export default AnamneseForm;
