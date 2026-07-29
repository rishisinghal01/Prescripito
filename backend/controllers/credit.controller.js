import transactionModel from "../models/transictionModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const plans = [
  {
    _id: "basic",
    name: "Basic",
    price: 10,
    credits: 100,
    features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
  },
  {
    _id: "pro",
    name: "Pro",
    price: 20,
    credits: 500,
    features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
  },
  {
    _id: "premium",
    name: "Premium",
    price: 30,
    credits: 1000,
    features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
  }
];

export const getPlans = async (req, res) => {
  try {
    res.json({ success: true, plans });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const purchasePlans = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.userId;

    const plan = plans.find((p) => p._id === planId);

    if (!plan) {
      return res.json({ success: false, message: "Invalid Plan" });
    }

    const transaction = await transactionModel.create({
      userId,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      isPaid: false
    });

    const origin =
      req.headers.origin ||
      req.get("origin") ||
      req.headers.referer ||
      process.env.FRONTEND_URL;

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/ai?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/ai`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: plan.price * 100,
            product_data: { name: plan.name }
          },
          quantity: 1
        }
      ],
      mode: "payment",
      metadata: {
        transactionId: transaction._id.toString(),
        userId,
        credits: plan.credits,
        appId: "prescripto"
      }
    });

    res.json({ success: true, url: session.url });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const verifyStripe = async (req, res) => {
  try {
    const { session_id } = req.body;
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === "paid") {
       const transactionId = session.metadata.transactionId;
       const transaction = await transactionModel.findById(transactionId);
       if (transaction && !transaction.isPaid) {
          // Add credits to user
          await userModel.updateOne(
            { _id: transaction.userId },
            { $inc: { credits: Number(transaction.credits) } }
          );
          // Mark transaction as paid
          transaction.isPaid = true;
          await transaction.save();
          return res.json({ success: true, message: "Payment Successful! Credits Added." });
       }
       return res.json({ success: true, message: "Already Verified" });
    }
    return res.json({ success: false, message: "Payment Not Completed" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
