import Stripe from "stripe";
import transactionModel from "../models/transictionModel.js";
import userModel from "../models/userModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripeHooks = async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_KEY
    );
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;

        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const session = sessionList.data[0];
        if (!session) {
          console.log("No session found!");
          break;
        }

        const { transactionId, appId } = session.metadata;

        if (appId !== "prescripto") {
          return response.json({
            received: true,
            message: "Ignore event: Invalid App",
          });
        }

        const transaction = await transactionModel.findOne({
          _id: transactionId,
          isPaid: false,
        });

        if (!transaction) {
          console.log("Transaction not found or already paid.");
          break;
        }

        // Add credits to user
        await userModel.updateOne(
          { _id: transaction.userId },
          { $inc: { credits: transaction.credits } }
        );

        // Mark transaction as paid
        transaction.isPaid = true;
        await transaction.save();

        break;

      default:
        console.log("Unhandled event type:", event.type);
        break;
    }

    response.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error", err);
    response.status(500).send("Internal server error");
  }
};

export { stripeHooks };
