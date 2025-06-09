import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Your Stripe secret key

export const create_checkout_session = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!email || !name || !phone) {
      res.status(200);
      return res.json({
        success: false,
        message: "Please provide all details",
      });
    }

    console.log(req.body);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    if (!isValid) {
      return res
        .status(200)
        .json({ success: false, message: "Enter a proper email" });
    }

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr", // Currency in INR
            product_data: {
              name: "Data Science Workshop",
              description: "Exclusive workshop ",
            },
            unit_amount: 399 * 100, // ₹999.00 (unit amount in smallest currency unit, e.g., paise)
          },
          quantity: 1, // Number of items
        },
      ],
      metadata: {
        email, // Custom metadata (for example, user ID)
        name, // Event name
        phone, // User's email (from request body)
      },
      customer_email: req.body.email, // Automatically sends a receipt to this email
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    return res
      .status(200)
      .json({ success: true, url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Error creating session:", error.message);
    res.status(500).json({ error: error.message });
  }
};
