// Demo authentication service
import { generateUserJWT } from './auth';

// Demo user data
export const DEMO_USER = {
  id: 'demo-user-id',
  email: 'demo@supermail.app',
  name: 'Demo User',
  picture: 'https://ui-avatars.com/api/?name=Demo+User&background=random',
};

// Demo email data
export const DEMO_EMAILS = [
  {
    id: 'demo-email-1',
    threadId: 'demo-thread-1',
    labelIds: ['INBOX'],
    snippet: 'Welcome to SuperMail! This is your demo inbox.',
    payload: {
      headers: [
        { name: 'Subject', value: 'Welcome to SuperMail' },
        { name: 'From', value: 'SuperMail Team <team@supermail.app>' },
        { name: 'To', value: 'Demo User <demo@supermail.app>' },
        { name: 'Date', value: new Date().toISOString() }
      ],
      body: {
        data: `
          <h2>Welcome to SuperMail!</h2>
          <p>This is your demo inbox. Feel free to explore the features of SuperMail.</p>
          <p>Here are some things you can do:</p>
          <ul>
            <li>View and organize emails</li>
            <li>Compose new messages</li>
            <li>Try out keyboard shortcuts</li>
            <li>Explore the command palette (Cmd/Ctrl+K)</li>
          </ul>
          <p>Enjoy your SuperMail experience!</p>
          <p>Best regards,<br>The SuperMail Team</p>
        `
      }
    }
  },
  {
    id: 'demo-email-2',
    threadId: 'demo-thread-2',
    labelIds: ['INBOX', 'IMPORTANT'],
    snippet: 'Your meeting is scheduled for tomorrow at 10:00 AM.',
    payload: {
      headers: [
        { name: 'Subject', value: 'Meeting Reminder' },
        { name: 'From', value: 'Calendar <calendar@example.com>' },
        { name: 'To', value: 'Demo User <demo@supermail.app>' },
        { name: 'Date', value: new Date(Date.now() - 86400000).toISOString() }
      ],
      body: {
        data: `
          <h3>Meeting Reminder</h3>
          <p>Your meeting with the Product Team is scheduled for tomorrow at 10:00 AM.</p>
          <p>Location: Conference Room A</p>
          <p>Agenda:</p>
          <ul>
            <li>Project updates</li>
            <li>Q3 planning</li>
            <li>Resource allocation</li>
          </ul>
          <p>Please bring your laptop and any relevant materials.</p>
        `
      }
    }
  },
  {
    id: 'demo-email-3',
    threadId: 'demo-thread-3',
    labelIds: ['INBOX', 'STARRED'],
    snippet: 'Your invoice #INV-2023-001 is due in 7 days.',
    payload: {
      headers: [
        { name: 'Subject', value: 'Invoice #INV-2023-001' },
        { name: 'From', value: 'Billing <billing@example.com>' },
        { name: 'To', value: 'Demo User <demo@supermail.app>' },
        { name: 'Date', value: new Date(Date.now() - 172800000).toISOString() }
      ],
      body: {
        data: `
          <h3>Invoice #INV-2023-001</h3>
          <p>Your invoice #INV-2023-001 for $199.99 is due in 7 days.</p>
          <p>Service: Premium Subscription</p>
          <p>Period: Jan 1, 2023 - Dec 31, 2023</p>
          <p>Please make payment by the due date to avoid service interruption.</p>
          <p>Thank you for your business!</p>
        `
      }
    }
  },
  {
    id: 'demo-email-4',
    threadId: 'demo-thread-4',
    labelIds: ['INBOX'],
    snippet: 'Check out our latest product updates and new features.',
    payload: {
      headers: [
        { name: 'Subject', value: 'Product Newsletter - July 2023' },
        { name: 'From', value: 'Product Updates <updates@example.com>' },
        { name: 'To', value: 'Demo User <demo@supermail.app>' },
        { name: 'Date', value: new Date(Date.now() - 259200000).toISOString() }
      ],
      body: {
        data: `
          <h2>July 2023 Product Updates</h2>
          <p>We're excited to share our latest product updates with you!</p>
          <h4>New Features:</h4>
          <ul>
            <li>Enhanced search capabilities</li>
            <li>Dark mode support</li>
            <li>Improved mobile experience</li>
            <li>New integrations with popular tools</li>
          </ul>
          <p>Log in to your account to explore these new features.</p>
          <p>As always, we appreciate your feedback!</p>
        `
      }
    }
  },
  {
    id: 'demo-email-5',
    threadId: 'demo-thread-5',
    labelIds: ['SENT'],
    snippet: 'Thank you for your prompt response. I will review the proposal.',
    payload: {
      headers: [
        { name: 'Subject', value: 'Re: Project Proposal' },
        { name: 'From', value: 'Demo User <demo@supermail.app>' },
        { name: 'To', value: 'Business Partner <partner@example.com>' },
        { name: 'Date', value: new Date(Date.now() - 345600000).toISOString() }
      ],
      body: {
        data: `
          <p>Thank you for your prompt response. I will review the proposal and get back to you by the end of the week.</p>
          <p>Best regards,<br>Demo User</p>
          <p>-------- Original Message --------</p>
          <p>From: Business Partner &lt;partner@example.com&gt;<br>
          To: Demo User &lt;demo@supermail.app&gt;<br>
          Subject: Project Proposal</p>
          <p>Dear Demo User,</p>
          <p>Please find attached our proposal for the upcoming project. We're looking forward to your feedback.</p>
          <p>Regards,<br>Business Partner</p>
        `
      }
    }
  }
];

// Demo auth function
export async function loginWithDemo(): Promise<{ token: string; user: typeof DEMO_USER }> {
  // Generate a JWT for the demo user
  const token = await generateUserJWT(DEMO_USER.id);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    token,
    user: DEMO_USER
  };
}

// Demo mail functions
export async function getDemoEmails(label = 'INBOX') {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter emails by label
  const emails = DEMO_EMAILS.filter(email => 
    email.labelIds.includes(label) || label === 'ALL'
  );
  
  return {
    messages: emails,
    nextPageToken: null,
    resultSizeEstimate: emails.length
  };
}

export async function getDemoThread(threadId: string) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find emails in the thread
  const emails = DEMO_EMAILS.filter(email => email.threadId === threadId);
  
  return {
    messages: emails,
    id: threadId
  };
}
