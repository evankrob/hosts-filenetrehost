// NewsletterTemplate uses only inline styles for email client compatibility.
// This component is shared between archive pages and the email HTML sent to Buttondown.

interface NewsletterTemplateProps {
  subject: string;
  contentHtml: string;
  isEmailMode?: boolean; // true when rendering for email (adds email-specific wrappers)
}

export default function NewsletterTemplate({
  subject,
  contentHtml,
  isEmailMode = false,
}: NewsletterTemplateProps) {
  const wrapper: React.CSSProperties = {
    backgroundColor: "#FFFDF7",
    padding: isEmailMode ? "0" : "40px 24px",
    fontFamily: "'Lora', Georgia, 'Times New Roman', serif",
  };

  const container: React.CSSProperties = {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    border: isEmailMode ? "none" : "1px solid #e8e0d0",
    borderRadius: isEmailMode ? "0" : "12px",
    overflow: "hidden",
  };

  const header: React.CSSProperties = {
    backgroundColor: "#FFFDF7",
    borderBottom: "3px solid #D97706",
    padding: "32px 40px 24px",
    textAlign: "center" as const,
  };

  const headerTitle: React.CSSProperties = {
    fontFamily: "'Lora', Georgia, 'Times New Roman', serif",
    fontSize: "14px",
    fontWeight: 400,
    color: "#888",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    margin: "0 0 8px 0",
  };

  const headerBrand: React.CSSProperties = {
    fontFamily: "'Lora', Georgia, 'Times New Roman', serif",
    fontSize: "28px",
    fontWeight: 700,
    color: "#1a1a1a",
    margin: "0 0 8px 0",
  };

  const headerTagline: React.CSSProperties = {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "15px",
    color: "#888",
    margin: 0,
  };

  const subjectBar: React.CSSProperties = {
    backgroundColor: "#D97706",
    padding: "20px 40px",
    textAlign: "center" as const,
  };

  const subjectText: React.CSSProperties = {
    fontFamily: "'Lora', Georgia, 'Times New Roman', serif",
    fontSize: "22px",
    fontWeight: 700,
    color: "#ffffff",
    margin: 0,
    lineHeight: 1.3,
  };

  const body: React.CSSProperties = {
    padding: "40px",
    backgroundColor: "#ffffff",
  };

  const footer: React.CSSProperties = {
    backgroundColor: "#FFFDF7",
    borderTop: "1px solid #e8e0d0",
    padding: "28px 40px",
    textAlign: "center" as const,
  };

  const footerText: React.CSSProperties = {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "13px",
    color: "#aaa",
    margin: "4px 0",
    lineHeight: 1.5,
  };

  const contentStyles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&display=swap');
      .newsletter-body { font-family: 'Lora', Georgia, 'Times New Roman', serif; }
      .newsletter-body p {
        font-size: 17px;
        line-height: 1.8;
        color: #333333;
        margin: 0 0 18px 0;
      }
      .newsletter-body h2 {
        font-family: 'Lora', Georgia, 'Times New Roman', serif;
        font-size: 22px;
        font-weight: 700;
        color: #1a1a1a;
        margin: 32px 0 12px 0;
        padding-bottom: 8px;
        border-bottom: 2px solid #f0e8d8;
      }
      .newsletter-body h3 {
        font-family: 'Lora', Georgia, 'Times New Roman', serif;
        font-size: 19px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 24px 0 10px 0;
      }
      .newsletter-body ul, .newsletter-body ol {
        padding-left: 24px;
        margin: 0 0 18px 0;
      }
      .newsletter-body li {
        font-size: 17px;
        line-height: 1.8;
        color: #333333;
        margin-bottom: 6px;
      }
      .newsletter-body a {
        color: #D97706;
        text-decoration: underline;
      }
      .newsletter-body strong {
        color: #1a1a1a;
        font-weight: 700;
      }
      .newsletter-body em {
        font-style: italic;
      }
      .newsletter-body blockquote {
        border-left: 3px solid #D97706;
        padding-left: 20px;
        margin: 24px 0;
        font-style: italic;
        color: #555;
      }
      .newsletter-body hr {
        border: none;
        border-top: 1px solid #e8e0d0;
        margin: 32px 0;
      }
      .topic-section {
        margin-bottom: 40px;
        padding-bottom: 40px;
        border-bottom: 1px solid #f0e8d8;
      }
      .topic-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
    </style>
  `;

  if (isEmailMode) {
    // Full HTML document for email sending
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{subject}</title>
          <div dangerouslySetInnerHTML={{ __html: contentStyles }} />
        </head>
        <body style={{ margin: 0, padding: "20px 0", backgroundColor: "#FFFDF7" }}>
          <div style={wrapper}>
            <div style={container}>
              <div style={header}>
                <p style={headerTitle}>Your weekly briefing</p>
                <h1 style={headerBrand}>What You Missed</h1>
                <p style={headerTagline}>Plain English. Real Stories. Every Monday.</p>
              </div>
              <div style={subjectBar}>
                <h2 style={subjectText}>{subject}</h2>
              </div>
              <div style={body}>
                <div
                  className="newsletter-body"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              </div>
              <div style={footer}>
                <p style={footerText}>You are receiving this because you subscribed at whatyoumissed.online</p>
                <p style={footerText}>To unsubscribe, click the link below.</p>
                <p style={{ ...footerText, marginTop: "12px" }}>
                  <strong style={{ color: "#888" }}>What You Missed</strong> · whatyoumissed.online
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }

  // Web rendering (archive pages)
  return (
    <div style={wrapper}>
      <style dangerouslySetInnerHTML={{ __html: contentStyles.replace(/<\/?style>/g, "") }} />
      <div style={container}>
        <div style={header}>
          <p style={headerTitle}>Your weekly briefing</p>
          <h1 style={headerBrand}>What You Missed</h1>
          <p style={headerTagline}>Plain English. Real Stories. Every Monday.</p>
        </div>
        <div style={subjectBar}>
          <h2 style={subjectText}>{subject}</h2>
        </div>
        <div style={body}>
          <div
            className="newsletter-body"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
        <div style={footer}>
          <p style={footerText}>
            <strong style={{ color: "#888" }}>What You Missed</strong> · whatyoumissed.online
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper: render the newsletter to an HTML string for email sending
// Call this on the server side only
export function renderNewsletterToHtml(subject: string, contentHtml: string): string {
  const fontImport = "@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&display=swap');";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(subject)}</title>
  <style>
    ${fontImport}
    body { margin: 0; padding: 20px 0; background-color: #FFFDF7; }
    .newsletter-body p { font-family: 'Lora', Georgia, 'Times New Roman', serif; font-size: 17px; line-height: 1.8; color: #333333; margin: 0 0 18px 0; }
    .newsletter-body h2 { font-family: 'Lora', Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 700; color: #1a1a1a; margin: 32px 0 12px 0; padding-bottom: 8px; border-bottom: 2px solid #f0e8d8; }
    .newsletter-body h3 { font-family: 'Lora', Georgia, 'Times New Roman', serif; font-size: 19px; font-weight: 600; color: #1a1a1a; margin: 24px 0 10px 0; }
    .newsletter-body ul, .newsletter-body ol { padding-left: 24px; margin: 0 0 18px 0; }
    .newsletter-body li { font-family: 'Lora', Georgia, 'Times New Roman', serif; font-size: 17px; line-height: 1.8; color: #333333; margin-bottom: 6px; }
    .newsletter-body a { color: #D97706; text-decoration: underline; }
    .newsletter-body strong { color: #1a1a1a; font-weight: 700; }
    .newsletter-body blockquote { border-left: 3px solid #D97706; padding-left: 20px; margin: 24px 0; font-style: italic; color: #555; }
    .newsletter-body hr { border: none; border-top: 1px solid #e8e0d0; margin: 32px 0; }
  </style>
</head>
<body>
  <div style="background-color:#FFFDF7; padding:0; font-family:'Lora',Georgia,'Times New Roman',serif;">
    <div style="max-width:600px; margin:0 auto; background-color:#ffffff;">
      <div style="background-color:#FFFDF7; border-bottom:3px solid #D97706; padding:32px 40px 24px; text-align:center;">
        <p style="font-family:'Lora',Georgia,serif; font-size:14px; font-weight:400; color:#888; letter-spacing:2px; text-transform:uppercase; margin:0 0 8px 0;">Your weekly briefing</p>
        <h1 style="font-family:'Lora',Georgia,serif; font-size:28px; font-weight:700; color:#1a1a1a; margin:0 0 8px 0;">What You Missed</h1>
        <p style="font-family:Arial,Helvetica,sans-serif; font-size:15px; color:#888; margin:0;">Plain English. Real Stories. Every Monday.</p>
      </div>
      <div style="background-color:#D97706; padding:20px 40px; text-align:center;">
        <h2 style="font-family:'Lora',Georgia,serif; font-size:22px; font-weight:700; color:#ffffff; margin:0; line-height:1.3;">${escapeHtml(subject)}</h2>
      </div>
      <div style="padding:40px; background-color:#ffffff;">
        <div class="newsletter-body">
          ${contentHtml}
        </div>
      </div>
      <div style="background-color:#FFFDF7; border-top:1px solid #e8e0d0; padding:28px 40px; text-align:center;">
        <p style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#aaa; margin:4px 0;">You are receiving this because you subscribed at whatyoumissed.online</p>
        <p style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#aaa; margin:4px 0;">To unsubscribe, <a href="{{unsubscribe_url}}" style="color:#D97706;">click here</a>.</p>
        <p style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#aaa; margin:12px 0 4px 0;"><strong style="color:#888;">What You Missed</strong> &middot; whatyoumissed.online</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
