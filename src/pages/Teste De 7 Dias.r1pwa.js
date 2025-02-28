import wixLocation from 'wix-location'; // Para redirecionamento

$w.onReady(function () {
    console.log("Página carregada!");

    if ($w("#button7")) {
        $w("#button7").onClick(async () => {
            console.log("Botão clicado!");

            // Captura os valores dos campos
            // @ts-ignore
            let nome = $w("#input2") ? $w("#input2").value : "";
            // @ts-ignore
            let sobrenome = $w("#input3") ? $w("#input3").value : "";
            let telefone = $w("#input4") ? $w("#input4").value : "";
            let email = $w("#input5") ? $w("#input5").value : "";
            let senha = $w("#input6") ? $w("#input6").value : "";
            let confirmarSenha = $w("#input7") ? $w("#input7").value : "";
            //@ts-ignore
            let nomedaempresa = $w("#input8") ? $w("#input8"). value : "";

            // Remove caracteres não numéricos do telefone
            let telefoneFormatado = telefone.replace(/\D/g, "");

            // Validação: senhas devem ser iguais
            if (senha !== confirmarSenha) {
                console.error("As senhas não coincidem!");
                if ($w("#input7")) {
                    $w("#input7").style.color = "red"; // Muda a cor do campo de confirmação
                }
                return; // Interrompe o envio se a senha estiver incorreta
            }

            // Monta o objeto de dados
            let dadosLead = {
                nome,
                sobrenome,
                telefone: telefoneFormatado,
                email,
                senha,
                nomedaempresa
            };

            console.log("Enviando dados para o N8N...", dadosLead);

            try {
                // Envia os dados para o N8N
                await fetch("https://srdiadev-n8n-webhook.8qlb9b.easypanel.host/webhook/ac5fb9cb-fba8-418c-8fae-c77723df6230", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dadosLead)
                });

                console.log("Dados enviados com sucesso ao N8N!");
                wixLocation.to("/pagina-principal"); // Redireciona após sucesso
            } catch (error) {
                console.error("Erro ao enviar dados:", error);
            }
        });
    } else {
        console.error("Botão não encontrado!");
    }
});
