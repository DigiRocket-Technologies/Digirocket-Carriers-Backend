import Stripe from "stripe";
import dotenv from "dotenv";
import { transporter } from "../config/nodemailer.js";
import { prisma } from "../config/db.js";
import crypto from "crypto";
dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Your Stripe secret key3
const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;

// For stripe
// export const workshopWebhook = async (req, res) => {
//   try {
//     const sig = req.headers["stripe-signature"];
//     let event;

//     try {
//       event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//     } catch (err) {
//       console.error("❌ Webhook signature verification failed.", err.message);
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     // ✅ Check event type
//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;
//       // Example: fulfill the order
//       console.log("Payment was successful!");

//       // Access metadata
//       const email = session.metadata?.email;
//       const name = session.metadata?.name;
//       const phone = session.metadata?.phone;

//       const subject = "New Workshop candidate";

//       const user = await prisma.workshopUser.create({
//         data: {
//           name,
//           email,
//           phone,
//         },
//       });

//       const receiver1 = {
//         from: process.env.GMAIL_ACCOUNT,
//         to: email,
//         subject: subject,
//         html: `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Contact Information</title>
//     <style>
//         body {
//             font-family: Arial, sans-serif;
//             line-height: 1.6;
//             color: #333;
//             max-width: 600px;
//             margin: 0 auto;
//             padding: 20px;
//             background-color: #f4f4f4;
//         }
//         .container {
//             background-color: white;
//             padding: 30px;
//             border-radius: 8px;
//             box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//         }
//         .header {
//             text-align: center;
//             margin-bottom: 30px;
//             border-bottom: 2px solid #c9f21d;
//             padding-bottom: 20px;
//         }
//         .header h1 {
//             color: #c9f21d;
//             margin: 0;
//         }
//         .info-row {
//             display: flex;
//             align-items: center;
//             margin-bottom: 20px;
//             padding: 15px;
//             background-color: #f8f9fa;
//             border-radius: 5px;
//             border-left: 4px solid #c9f21d;
//         }
//         .info-label {
//             font-weight: bold;
//             color: #c9f21d;
//             width: 80px;
//             margin-right: 15px;
//         }
//         .info-value {
//             color: #333;
//             flex: 1;
//         }
//         .footer {
//             text-align: center;
//             margin-top: 30px;
//             padding-top: 20px;
//             border-top: 1px solid #ddd;
//             color: #666;
//             font-size: 14px;
//         }
//         @media (max-width: 480px) {
//             .info-row {
//                 flex-direction: column;
//                 align-items: flex-start;
//             }
//             .info-label {
//                 width: auto;
//                 margin-bottom: 5px;
//             }
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <div class="header">
//             <h1>Contact Information</h1>
//         </div>

//         <div class="info-row">
//             <div class="info-label">Name:</div>
//             <div class="info-value">${name}</div>
//         </div>

//         <div class="info-row">
//             <div class="info-label">Email:</div>
//             <div class="info-value">${email}</div>
//         </div>

//         <div class="info-row">
//             <div class="info-label">Phone:</div>
//             <div class="info-value">${phone}</div>
//         </div>

//         <div class="footer">
//             <p>This email was sent automatically. Please do not reply to this email.</p>
//         </div>
//     </div>
// </body>
// </html>`,
//       };

//       const receiver2 = {
//         from: process.env.GMAIL_ACCOUNT,
//         to: email,
//         subject: "Registration Successful",
//         html: `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//   <title>Registration Confirmation</title>
//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       line-height: 1.6;
//       color: #333;
//       max-width: 600px;
//       margin: 0 auto;
//       padding: 20px;
//       background-color: #f4f4f4;
//     }
//     .container {
//       background-color: white;
//       padding: 30px;
//       border-radius: 8px;
//       box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//     }
//     .header {
//       text-align: center;
//       margin-bottom: 30px;
//       border-bottom: 2px solid #c9f21d;
//       padding-bottom: 20px;
//     }
//     .header h1 {
//       color: #c9f21d;
//       margin: 0;
//     }
//     .message {
//       background-color: #f8f9fa;
//       padding: 20px;
//       border-radius: 5px;
//       border-left: 4px solid #c9f21d;
//       color: #333;
//     }
//     .footer {
//       text-align: center;
//       margin-top: 30px;
//       padding-top: 20px;
//       border-top: 1px solid #ddd;
//       color: #666;
//       font-size: 14px;
//     }
//   </style>
// </head>
// <body>
//   <div class="container">
//     <div class="header">
//       <h1>Thank You for Registering!</h1>
//     </div>

//     <div class="message">
//       <p>Hello ${name},</p>
//       <p>Thank you for registering. We have received your details and will soon send you the meeting link.</p>
//       <p>If you have any questions, feel free to reach out.</p>
//     </div>

//     <div class="footer">
//       <p>This email was sent automatically. Please do not reply to this email.</p>
//     </div>
//   </div>
// </body>
// </html>`,
//       };

//       const emailResponse1 = await transporter.sendMail(receiver1);
//       const emailResponse2 = await transporter.sendMail(receiver2);
//       // TODO: mark order as paid, send email, etc.
//       return res.status(200).json({success:true,message:"Payment Done successfully"});
//     }
//   } catch (error) {
//     console.error("Error in Workshop webhook", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

// For razorpay

export const workshopWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const receivedSignature = req.headers["x-razorpay-signature"];
    const generatedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body) // 👈 raw body used here
      .digest("hex");

    if (generatedSignature === receivedSignature) {
      const payload = JSON.parse(req.body.toString());

      if (payload.event === "payment.captured") {
        const payment = payload.payload.payment.entity;
        const { email, name, phone } = payment?.notes;

        const subject = "New Workshop candidate";

        const user = await prisma.workshopUser.create({
          data: {
            name,
            email,
            phone,
          },
        });

        const receiver1 = {
          from: process.env.GMAIL_ACCOUNT,
          to: process.env.TO,
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

        const receiver2 = {
          from: process.env.GMAIL_ACCOUNT,
          to: email,
          subject: "Registration Successful",
          html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Registration Confirmation</title>
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
    .message {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 5px;
      border-left: 4px solid #c9f21d;
      color: #333;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You for Registering!</h1>
    </div>

    <div class="message">
      <p>Hello ${name},</p>
      <p>Thank you for registering— we're excited to have you on board! The workshop link will be shared with you a day before the event (on Monday). Keep an eye on your inbox!
      In the meantime, stay connected and get quick updates by joining our official WhatsApp group:
      <a href="https://chat.whatsapp.com/DwX8JhuLKZq7bwd7oADKG1">Whatsapp Link</a></p>
      <p>We can’t wait to learn and grow together!</p>
      <p>See you soon</p>
      <p>Team SSProdigy</p>
    </div>
    <div class="footer">
      <p>This email was sent automatically. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`,
        };

        const emailResponse1 = await transporter.sendMail(receiver1);
        const emailResponse2 = await transporter.sendMail(receiver2);
        // TODO: mark order as paid, send email, etc.
        return res
          .status(200)
          .json({ success: true, message: "Payment Done successfully" });
      }

      console.log("Unhandled event");
    } else {
      return res.status(400).send("Invalid signature");
    }
  } catch (error) {
    console.error("Error in Workshop webhook", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
