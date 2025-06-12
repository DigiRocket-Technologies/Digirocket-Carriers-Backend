import Stripe from "stripe";
import dotenv from "dotenv";
import { prisma } from "../config/db.js";
import {razorpay} from "../config/razorpay.js"

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Your Stripe secret key

export const create_checkout_session = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!email || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide all details",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a proper email" });
    }

    const count = await prisma.workshopUser.count();

    const price = count < 10 ? 299 : 399;

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr", // Currency in INR
            product_data: {
              name: "Data Science Workshop",
              description: "Exclusive workshop ",
            },
            unit_amount: price * 100, // ₹999.00 (unit amount in smallest currency unit, e.g., paise)
          },
          quantity: 1, // Number of items
        },
      ],
      metadata: {
        email, // Custom metadata (for example, user ID)
        name, // Event name
        phone, // User's email (from request body)
      },
      customer_email: email, // Automatically sends a receipt to this email
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    return res
      .status(200)
      .json({ success: true, url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Error creating session:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const create_razorpay_order = async (req, res) => {
  try {
    
    const { name, email, phone } = req.body;

    if (!email || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide all details",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a proper email" });
    }

    const count = await prisma.workshopUser.count();

    const price = count < 10 ? 299 : 399;

    // Create a Checkout Session

    const options = {
      amount: price * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        email,
        name,
        phone,
      },
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success:true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      email,
      name,
      phone,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/failure`,
      message:"Order created successfully"
    });

  } catch (error) {
    console.error("Error creating razor pay order", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
