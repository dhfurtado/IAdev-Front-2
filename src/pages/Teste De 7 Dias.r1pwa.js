import wixLocation from 'wix-location'; // Importação do Wix Location para redirecionamento

$w.onReady(function () {
    console.log("Página carregada!");

    if ($w("#button7")) {
        $w("#button7").onClick(async () => {
            console.log("Botão clicado!");

            // Verifica se os inputs existem antes de acessá-los
            let nome = $w("#input5") ? $w("#input5").value : "";
            let sobrenome = $w("#input4") ? $w("#input4").value : "";
            let empresa = $w("#input6") ? $w("#input6").value : "";
            let cargo = $w("#input7") ? $w("#input7").value : "";
            let email = $w("#input10") ? $w("#input10").value : "";
            let telefone = $w("#complexPhoneController1") ? $w("#complexPhoneController1").value : "";
            let logoEmpresa = $w("#uploadButton1") ? $w("#uploadButton1").value : "";

            // Captura os valores dos campos de senha
            let senha = "";
            let confirmarSenha = "";
            //@ts-ignore
            if ($w("#input11")) {
            //@ts-ignore
                senha = $w("#input11").value;
            } else {
                console.error("Campo de senha não encontrado!");
            }
            //@ts-ignore
            if ($w("#input12")) {
            //@ts-ignore
                confirmarSenha = $w("#input12").value;
            } else {
                console.error("Campo de confirmação de senha não encontrado!");
            }

            // Normaliza o telefone para remover caracteres não numéricos
            let telefoneFormatado = telefone.replace(/\D/g, "");

            // 🔴 VALIDAÇÃO: Verifica se a senha e a confirmação de senha são iguais
            if (senha !== confirmarSenha) {
                console.error("As senhas não coincidem!");
                //@ts-ignore
                if ($w("#input12")) {
                    //@ts-ignore
                    $w("#input12").style.color = "red"; // Deixa a caixa da confirmação em vermelho (se aplicável)
                }
                return; // Interrompe a execução para evitar envio de dados inválidos
            }

            // Monta o objeto de dados
            let dadosLead = {
                nome,
                sobrenome,
                empresa,
                cargo,
                email,
                telefone: telefoneFormatado,
                senha, // 🔴 Senha enviada apenas se for igual à confirmação
                logoEmpresa
            };

            console.log("Enviando dados para o servidor...", dadosLead);

            try {
                // Envia os dados para o PostgreSQL
                await fetch("https://seu-servidor-postgres.com/api/inserir-lead", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dadosLead)
                });

                // Envia os dados para o N8N (para iniciar a automação)
                await fetch("https://iaddev-n8n-webhook.easypanel.host/webhook/ac5fb9cb-fba8-418c-8fae-c7723df6238", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dadosLead)
                });

                console.log("Dados enviados com sucesso!");
                wixLocation.to("/pagina-principal");
            } catch (error) {
                console.error("Erro ao enviar dados:", error);
            }
        });
    } else {
        console.error("Botão não encontrado!");
    }
});
