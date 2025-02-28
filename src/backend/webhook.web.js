import { ok, badRequest } from "wix-http-functions";
import { fetch } from "wix-fetch";

/**
 * Envia os dados do lead para o PostgreSQL e para o N8N
 * @param {object} request - Requisição HTTP recebida do formulário.
 * @returns {object} - Resposta HTTP.
 */
export async function post_webhook(request) {
    try {
        if (!request.body) {
            return badRequest({ body: { error: "Request body vazio." } });
        }

        const item = await request.body.json();
        console.log("📩 Dados recebidos:", item);

        // Normaliza o telefone
        let telefoneFormatado = item.telefone.replace(/\D/g, "");

        // Monta o objeto de dados
        const dadosLead = {
            nome: item.nome,
            sobrenome: item.sobrenome,
            empresa: item.empresa,
            telefone: telefoneFormatado,
            email: item.email || ""
        };

        console.log("🚀 Enviando dados para PostgreSQL e N8N:", dadosLead);

        // 1️⃣ Envia os dados para o PostgreSQL
        await fetch("https://seu-servidor-postgres.com/api/inserir-lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosLead)
        });

        // 2️⃣ Envia os dados para o N8N (para iniciar a automação)
        await fetch("https://srdiadev-n8n-webhook.8qlb9b.easypanel.host/webhook/ac5fb9cb-fba8-418c-8fae-c77723df6230", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosLead)
        });

        console.log("✅ Dados enviados com sucesso!");

        // 3️⃣ Retorna sucesso e indica para o frontend redirecionar o usuário
        return ok({ body: { message: "Dados cadastrados!", redirectUrl: "/pagina-principal" } });

    } catch (error) {
        console.error("❌ Erro ao enviar dados:", error);
        return badRequest({ body: { error: "Erro na requisição.", details: error.message } });
    }
}
