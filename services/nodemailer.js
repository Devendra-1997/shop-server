import nodemailer from "nodemailer";

// global email processor
const emailProcessor = async (mailBody) => {
  //transporter
  const transport = nodemailer.createTransport({
    // host: `${process.env.SMTP_HOST}`,
    // port: 587,
    // secure: false, // Use `true` for port 465, `false` for all other ports
    service: `${process.env.SMTP_HOST}`,
    auth: {
      user: `${process.env.SMTP_EMAIL}`,
      pass: `${process.env.SMTP_PASSWORD}`,
    },
  });

  // send mail
  const mail = await transport.sendMail(mailBody);
  return mail;
};

// Email Verification Mail
export const emailVerificationMail = ({ email, firstName, uniqueKey }) => {
  const url = `${process.env.FRONTEND_ROOT}/verify-account?uk=${uniqueKey}&e=${email}`;

  const mailBody = {
    from: `"${process.env.SMTP_SENDER}" <${process.env.SMTP_EMAIL}>`,
    to: email, // list of receivers
    subject: "Welcome to LuxeDrive! Verify Your Account",
    text: `Hello ${firstName},\n\nThank you for joining LuxeDrive’s community! Please follow the link to verify your account:\n\n${url}\n\nIf you did not sign up for an account, please ignore this email.\n\nBest regards,\nLuxeDrive’s Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
          <h2 style="text-align: center; color: #4CAF50;">Welcome to LuxeDrive, ${firstName}!</h2>
          <p>Thank you for joining our exclusive community of luxury car enthusiasts. Please click the button below to verify your email address and explore our collection of high-performance vehicles:</p>
          <div style="text-align: center; margin: 20px;">
            <a href="${url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Now</a>
          </div>
          <p>If the button above doesn't work, please copy and paste the following link into your web browser:</p>
          <p style="word-wrap: break-word;"><a href="${url}" style="color: #4CAF50;">${url}</a></p>
          <p>If you did not sign up for an account, please ignore this email.</p>
          <p>Best regards,<br/>The LuxeDrive Team</p>
        </div>
      </div>`,
  };

  return emailProcessor(mailBody);
};

// Email Verified Mail
export const emailVerifiedNotification = ({ email, firstName }) => {
  const mailBody = {
    from: `"${process.env.SMTP_SENDER}" <${process.env.SMTP_EMAIL}>`,
    to: email, // list of receivers
    subject:
      "Your LuxeDrive Account is Verified! Welcome to the Exclusive Club",
    text: `Hello ${firstName},\n\nCongratulations! Your LuxeDrive account has been successfully verified. You are now part of an exclusive community that values luxury and performance. Log in to discover your next high-performance vehicle.\n\nBest regards,\nThe LuxeDrive Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
          <h2 style="text-align: center; color: #4CAF50;">Welcome to LuxeDrive, ${firstName}!</h2>
          <p>Your account has been successfully verified. You are now part of an exclusive club of luxury car enthusiasts.</p>
          <p>Log in to explore our curated collection of luxury and high-performance vehicles that suit your refined taste.</p>
          <div style="text-align: center; margin: 20px;">
            <a href="${process.env.FRONTEND_ROOT}/login" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Log In Now</a>
          </div>
          <p>Best regards,<br/>The LuxeDrive Team</p>
        </div>
      </div>`,
  };

  return emailProcessor(mailBody);
};

// OTP Email
export const sendOTPMail = ({ email, firstName, token }) => {
  const obj = {
    from: `"${process.env.SMTP_SENDER}" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Your Secure One-Time Password (OTP) from LuxeDrive",
    text: `Hello ${firstName},\n\nYour LuxeDrive One-Time Password (OTP) is: ${token}\n\nPlease use this OTP to complete your request. If you did not request this, please contact our support team immediately.\n\nBest regards,\nLuxeDrive’s Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
          <h2 style="text-align: center; color: #4CAF50;">Secure Your LuxeDrive Account</h2>
          <p>Hello ${firstName}, we received a request for an OTP to secure your LuxeDrive account.</p>
          <div style="text-align: center; margin: 20px;">
            <p style="font-size: 24px; font-weight: bold; color: #333; border: 1px dashed #4CAF50; padding: 10px; display: inline-block;">${token}</p>
          </div>
          <p>If you did not request this, please contact our support team immediately.</p>
          <p>Best regards,<br/>LuxeDrive’s Team</p>
        </div>
      </div>`,
  };

  emailProcessor(obj);
};

// Password Update Notification
export const accountUpdateNotification = ({ email, firstName }) => {
  const obj = {
    from: `"${process.env.SMTP_SENDER}" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Your LuxeDrive Password Has Been Updated Securely",
    text: `Hello ${firstName},\n\nWe wanted to let you know that your password has been successfully updated. If you did not make this change, please contact our support team immediately.\n\nBest regards,\nThe LuxeDrive Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
          <h2 style="text-align: center; color: #4CAF50;">Your Password Has Been Updated, ${firstName}</h2>
          <p>We are committed to maintaining your security. If you did not authorize this change, please contact our support team.</p>
          <div style="text-align: center; margin: 20px;">
            <a href="mailto:support@luxedrive.com" style="background-color: #FF5722; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Contact Support</a>
          </div>
          <p>Best regards,<br/>The LuxeDrive Team</p>
        </div>
      </div>`,
  };

  emailProcessor(obj);
};

// Email Receipt
export const sendEmailReceipt = ({ email, firstName, orderDetails }) => {
  const {
    total,
    itemName,
    quantity,
    amount,
    estimatedArrival,
    shippingAddress,
  } = orderDetails;
  const obj = {
    from: `"${process.env.SMTP_SENDER}" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Your LuxeDrive Order Receipt",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
          <h2 style="text-align: center; color: #4CAF50;">Thank You for Your Purchase, ${firstName}!</h2>
          <p>Your luxury vehicle journey begins here. We have sent your order receipt to ${email}.</p>
          <h3>Order Summary</h3>
          <ul>
            <li><strong>Item:</strong> ${itemName}</li>
            <li><strong>Quantity:</strong> ${quantity}</li>
            <li><strong>Total Amount:</strong> $${total}</li>
          </ul>
          <h3>Delivery Information</h3>
          <p>Your order will be shipped to:</p>
          <p>${shippingAddress}</p>
          <p>Estimated Arrival: ${estimatedArrival}</p>
          <p>Best regards,<br/>The LuxeDrive Team</p>
        </div>
      </div>`,
  };

  emailProcessor(obj);
};
