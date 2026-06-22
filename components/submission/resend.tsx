import { Resend } from "resend"

const resend = new Resend(
  process.env.RESEND_API_KEY
)
const email = "shekhargrace14@gmail.com"
await resend.emails.send({
  from:
    "Shalom Worship <connect@shalomworship.com>",

  to: email,

  subject:
    "Submission Received",

  html: `
    <h2>Thank you!</h2>

    <p>
      We have received your submission.
    </p>
  `,
})