// /.netlify/functions/calculate-shipping.js
export const handler = async (event) => {
  try {
    const { cepOrigem, cepDestino, products } = JSON.parse(event.body);

    if (!cepOrigem || !cepDestino || !products || products.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Dados insuficientes para cálculo de frete." }),
      };
    }

    const response = await fetch(
      "https://www.melhorenvio.com.br/api/v2/me/shipment/calculate",
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
          "User-Agent": "TesteFreteNetlify",
        },
        body: JSON.stringify({
          from: { postal_code: cepOrigem.replace(/\D/g, "") },
          to: { postal_code: cepDestino.replace(/\D/g, "") },
          products: products.map((p, idx) => ({
            id: p.id || `${idx + 1}`,
            width: p.width,
            height: p.height,
            length: p.length,
            weight: p.weight,
            insurance_value: p.insurance_value,
            quantity: p.quantity || 1,
          })),
        }),
      }
    );

    const data = await response.json();

    console.log("Resposta Melhor Envio:", JSON.stringify(data));

    const resultado = (data || [])
      .filter(f => !f.error)
      .map(f => ({
        name: f.name,
        company: f.company.name,
        price: f.price,
        delivery_time: f.delivery_time,
      }));

    return {
      statusCode: 200,
      body: JSON.stringify(resultado),
    };
  } catch (error) {
    console.error("Erro calculate-shipping:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
