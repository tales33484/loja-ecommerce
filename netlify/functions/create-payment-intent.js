import Stripe from "stripe";

// Chave secreta do Stripe vem do Netlify Environment (não colocar no frontend!)
const stripe = new Stripe(process.env.SECRET_STRIPE_KEY);

export async function handler(event) {
  try {
    const { amount } = JSON.parse(event.body);

    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid amount" }),
      };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "brl", // ou "usd" se quiser
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ client_secret: paymentIntent.client_secret }),
    };
  } catch (err) {
    console.error("Stripe Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
