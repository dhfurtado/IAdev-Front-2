// @ts-ignore
import { ok, badRequest } from "wix-http-functions";
// @ts-ignore
import { fetch } from "wix-fetch";

/**
 * Recebe os dados do formulário e envia ao N8N.
 * @param {any} request - Requisição HTTP recebida do formulário
 * @returns {Promise<any>} Retorna uma Promise com o objeto de resposta HTTP
 */
export async function post_webhook(request) {
    try {
        // 1. Verifica se há conteúdo no corpo da requisição
        if (!request.body) {
            return badRequest({ body: { error: "Request body vazio." } });
        }

        // 2. Converte o corpo da requisição para JSON
        const item = await request.body.json();
        console.log("📩 Dados recebidos:", item);

        // 3. Normaliza o telefone (remove caracteres não numéricos)
        const telefoneFormatado = (item.telefone || "").replace(/\D/g, "");

        // 4. Monta o objeto de dados que será enviado
        const dadosLead = {
            nome: item.nome,
            sobrenome: item.sobrenome,
            empresa: item.empresa,
            cargo: item.cargo,
            email: item.email || "",
            telefone: telefoneFormatado
        };

        console.log("🚀 Enviando dados ao N8N:", dadosLead);

        // 5. Envia os dados para o N8N
        const n8nWebhookUrl = "https://srdiadev-n8n-webhook.8qlb9b.easypanel.host/webhook/ac5fb9cb-fba8-418c-8fae-c77723df6230";
        const response = await fetch(n8nWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosLead)
        });

        // 6. Verifica se o envio ao N8N foi bem-sucedido
        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Erro ao acionar o N8N:", errorText);
            return badRequest({
                body: {
                    error: "Falha ao enviar dados ao N8N.",
                    details: errorText
                }
            });
        }

        console.log("✅ Dados enviados com sucesso ao N8N!");

        // 7. Retorna sucesso e indica para o frontend redirecionar o usuário
        return ok({
            body: {
                message: "Dados enviados ao N8N com sucesso!",
                redirectUrl: "/pagina-principal"
            }
        });

    } catch (error) {
        // 8. Tratamento de erros gerais
        console.error("❌ Erro na requisição:", error);
        return badRequest({
            body: {
                error: "Erro na requisição ao webhook.",
                details: error.message
            }
        });
    }
}
