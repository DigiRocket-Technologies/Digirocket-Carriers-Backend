import { Request, Response } from "express";
import { transporter } from "../config/nodemailer";

interface ContactUsRequestBody {
  name: string;
  email: string;
  phone: string;
  course?: string;
}

export async function contactUs(req: Request, res: Response):Promise<void> {
  try {
    const { name, email, phone } = req.body;

    if (!email || !name || !phone) {
     res.status(200).json({ success: false, message: "Please provide all details" });
     return ;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    if (!isValid) {
      res.status(200).json({ success: false, message: "Enter a proper email" });
      return 
    }

    const subject = "New Lead from SS Prodigy Website";

    const receiver = {
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
  } catch (error: any) {
    console.error("Email sending error:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
}

export async function bookDemo(req: Request, res: Response):Promise<void> {
  try {
    const { name, email, phone, course } = req.body;

    if (!email || !name || !phone || !course) {
       res.status(200).json({ success: false, message: "Please provide all details" });
       return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    if (!isValid) {
      res.status(200).json({ success: false, message: "Enter a proper email" });
      return ;
    }

    const subject = "New Lead from SS Prodigy Website";

    const receiver = {
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
        
        <div class="info-row">
            <div class="info-label">Course:</div>
            <div class="info-value">${course}</div>
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
  } catch (error: any) {
    console.error("Email in bookdemo controller:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
}