export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
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
          
          if (res) {
            // Se tiver o campo extra_json, misturamos ele de volta no objeto principal
            let finalConfig = { ...res };
            if (res.extra_json) {
              try {
                const extras = JSON.parse(res.extra_json);
                finalConfig = { ...finalConfig, ...extras };
              } catch (e) { console.error("Erro parse json", e) }
            }
            delete finalConfig.extra_json; // Remove o campo técnico antes de enviar
            return Response.json(finalConfig, { headers: corsHeaders });
          }
          return Response.json({}, { headers: corsHeaders });
        }

        if (request.method === "POST") {
          const body = await request.json();
          
          // Separa os campos que têm coluna própria dos que vão para o JSON
          const { 
            ownerName, professionTitle, heroBio, whatsapp, primaryColor, heroTitle, email, 
            ...rest // O resto (locations, audience, features) vai aqui
          } = body;

          const extraJson = JSON.stringify(rest);

          await env.DB.prepare(
            `INSERT OR REPLACE INTO site_config (id, ownerName, professionTitle, heroBio, whatsapp, primaryColor, heroTitle, email, extra_json) 
             VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(ownerName, professionTitle, heroBio, whatsapp, primaryColor, heroTitle, email, extraJson).run();
          
          return Response.json({ success: true }, { headers: corsHeaders });
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
            "INSERT OR REPLACE INTO services (id, title, desc, icon, img, category, pageRoute) VALUES (?, ?, ?, ?, ?, ?, ?)"
          ).bind(svc.id, svc.title, svc.desc, svc.icon, svc.img, svc.category, svc.pageRoute).run();
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
