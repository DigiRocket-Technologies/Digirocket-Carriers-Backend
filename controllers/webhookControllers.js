import Stripe from "stripe";
import dotenv from "dotenv";
import { transporter } from "../config/nodemailer.js";
import { prisma } from "../config/db.js";

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Your Stripe secret key3
const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;

export const workshopWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Check event type
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    // Example: fulfill the order
    console.log("Payment was successful!");

    // Access metadata
    const email = session.metadata?.email;
    const name = session.metadata?.name;
    const phone = session.metadata?.phone;

    const subject = "New Workshop candidate";

    const user = await prisma.workshopUser.create({
      data: {
        name,
        email,
        phone, 
      },
    });


    const receiver = {
      from: process.env.GMAIL_ACCOUNT,
      to: email,
      subject: subject,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Information</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #c9f21d;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #c9f21d;
            margin: 0;
        }
        .info-row {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 5px;
            border-left: 4px solid #c9f21d;
        }
        .info-label {
            font-weight: bold;
            color: #c9f21d;
            width: 80px;
            margin-right: 15px;
        }
        .info-value {
            color: #333;
            flex: 1;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
        }
        @media (max-width: 480px) {
            .info-row {
                flex-direction: column;
                align-items: flex-start;
            }
            .info-label {
                width: auto;
                margin-bottom: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Contact Information</h1>
        </div>
        
        <div class="info-row">
            <div class="info-label">Name:</div>
            <div class="info-value">${name}</div>
        </div>
        
        <div class="info-row">
            <div class="info-label">Email:</div>
            <div class="info-value">${email}</div>
        </div>
        
        <div class="info-row">
            <div class="info-label">Phone:</div>
            <div class="info-value">${phone}</div>
        </div>
        
        <div class="footer">
            <p>This email was sent automatically. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`,
    };

    transporter.sendMail(receiver, (err, emailResponse) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          message: "There was an error while saving the data",
        });
      } else {
        return res.json({
          success: true,
          message: "Form saved successfully",
        });
      }
    });
    // TODO: mark order as paid, send email, etc.
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
};
