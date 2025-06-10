import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'solkim1985@gmail.com',
    pass: 'pgfycebzghsafufe',
  },
});

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const mailOptions = {
      from: 'solkim1985@gmail.com',
      to: 'solkim1985@gmail.com',
      subject: 'New Request Submission',
      html: `
        <h2>New Request Details</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong> ${data.message}</p>
        <p><strong>Grade:</strong> ${data.grade}</p>
        <p><strong>Subjects:</strong> ${data.subjects}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 