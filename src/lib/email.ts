import { ServerClient } from "postmark";

/**
 * Transactional email via Postmark. Reuses the IMXP Postmark server (the same
 * one that sends Iceland Eclipse payment/portal mail), so the sender is already
 * verified and the account is approved to mail real customers — no SES-style
 * sandbox. The login link is rendered by a Postmark template so the email stays
 * on-brand and editable without a redeploy.
 *
 *   POSTMARK_SERVER_TOKEN   — server API token (required)
 *   POSTMARK_FROM_EMAIL     — verified sender (default notifications@im-xp.com)
 *   POSTMARK_TEMPLATE_ALIAS — template alias (default auth-citizen-portal)
 *   POSTMARK_MESSAGE_STREAM — message stream (default "outbound")
 */
let client: ServerClient | null = null;
function postmark(): ServerClient {
  const token = process.env.POSTMARK_SERVER_TOKEN;
  if (!token) {
    throw new Error("POSTMARK_SERVER_TOKEN must be set to send login links");
  }
  if (!client) client = new ServerClient(token);
  return client;
}

/** Email a participant their one-shot magic sign-in link. */
export async function sendMagicLink(email: string, link: string): Promise<void> {
  const from =
    process.env.POSTMARK_FROM_EMAIL ??
    "Iceland Eclipse <noreply@icelandeclipse.com>";
  const alias = process.env.POSTMARK_TEMPLATE_ALIAS ?? "iceland-eclipse-signin";
  const stream = process.env.POSTMARK_MESSAGE_STREAM ?? "outbound";

  await postmark().sendEmailWithTemplate({
    From: from,
    To: email,
    TemplateAlias: alias,
    // `the_url` is the template's single call-to-action link; `popup_name`
    // labels the event/context. Both are present in the auth-citizen-portal
    // template (and any sign-in clone should keep the same model).
    TemplateModel: {
      the_url: link,
      popup_name: "Iceland Eclipse",
    },
    MessageStream: stream,
  });
}
