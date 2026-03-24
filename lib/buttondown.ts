const BUTTONDOWN_BASE = 'https://api.buttondown.email/v1';

function getHeaders() {
  return {
    'Authorization': `Token ${process.env.BUTTONDOWN_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

export async function addSubscriber(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${BUTTONDOWN_BASE}/subscribers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, tags: ['subscriber'] }),
    });

    if (res.ok) {
      return { success: true };
    }

    const data = await res.json().catch(() => ({}));

    // Buttondown returns 400 for already subscribed
    if (res.status === 400 && data?.email) {
      return { success: false, error: "You're already subscribed! Check your inbox." };
    }

    return { success: false, error: 'Something went wrong. Please try again.' };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

export async function sendNewsletter(
  subject: string,
  bodyHtml: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${BUTTONDOWN_BASE}/emails`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        subject,
        body: bodyHtml,
        status: 'about_to_send',
      }),
    });

    if (res.ok) {
      return { success: true };
    }

    const text = await res.text();
    return { success: false, error: `Buttondown error: ${text}` };
  } catch {
    return { success: false, error: 'Network error sending newsletter.' };
  }
}
