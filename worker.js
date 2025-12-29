export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Configurações de Segurança (CORS)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
      // --- Rota: Configuração do Site ---
      if (url.pathname === "/api/config") {
        if (request.method === "GET") {
          const res = await env.DB.prepare("SELECT * FROM site_config WHERE id = 1").first();
          return Response.json(res || {}, { headers: corsHeaders });
        }
        if (request.method === "POST") {
          const body = await request.json();
          
          // --- CORREÇÃO FEITA AQUI ---
          // Agora usamos INSERT OR REPLACE para garantir que salva mesmo com banco vazio
          await env.DB.prepare(
            `INSERT OR REPLACE INTO site_config (id, ownerName, professionTitle, heroBio, whatsapp, primaryColor) 
             VALUES (1, ?, ?, ?, ?, ?)`
          ).bind(body.ownerName, body.professionTitle, body.heroBio, body.whatsapp, body.primaryColor).run();
          
          return Response.json(body, { headers: corsHeaders });
        }
      }
      
      // --- Rota: Serviços ---
      if (url.pathname === "/api/services") {
        if (request.method === "GET") {
          const { results } = await env.DB.prepare("SELECT * FROM services ORDER BY title ASC").all();
          return Response.json(results, { headers: corsHeaders });
        }
        if (request.method === "POST") {
          const svc = await request.json();
          await env.DB.prepare(
            "INSERT OR REPLACE INTO services (id, title, desc, icon, img, category) VALUES (?, ?, ?, ?, ?, ?)"
          ).bind(svc.id, svc.title, svc.desc, svc.icon, svc.img, svc.category).run();
          return Response.json(svc, { headers: corsHeaders });
        }
        if (request.method === "DELETE") {
           const id = url.searchParams.get("id");
           await env.DB.prepare("DELETE FROM services WHERE id = ?").bind(id).run();
           return new Response("Ok", { headers: corsHeaders });
        }
      }
      
      return new Response("Not Found", { status: 404, headers: corsHeaders });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  },
};