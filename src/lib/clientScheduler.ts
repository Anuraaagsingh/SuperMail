/**
 * Client-side scheduler for handling scheduled emails and snoozed emails
 * This is an alternative to server-side cron jobs for Vercel free tier
 */

import { createSupabaseClient } from './supabase';

// Check interval in milliseconds (5 minutes)
const CHECK_INTERVAL = 5 * 60 * 1000;

// Last check timestamps
let lastScheduledCheck = 0;
let lastSnoozedCheck = 0;

/**
 * Process scheduled emails that are due
 */
export async function processScheduledEmails() {
  try {
    const now = new Date();
    const token = localStorage.getItem('authToken');
    
    if (!token) return;
    
    // Check if using demo account
    const user = localStorage.getItem('user');
    const userData = user ? JSON.parse(user) : null;
    const isDemo = userData?.id === 'demo-user-id';
    
    if (isDemo) {
      console.log('[Demo] Checking for scheduled emails');
      return; // No real processing for demo account
    }
    
    // For real accounts, check Supabase for due scheduled emails
    const supabase = createSupabaseClient();
    
    // Get scheduled emails that are due
    const { data: scheduledEmails, error } = await supabase
      .from('scheduled_sends')
      .select('*')
      .eq('user_id', userData?.id)
      .eq('status', 'pending')
      .lt('scheduled_at', now.toISOString());
    
    if (error) {
      console.error('Error fetching scheduled emails:', error);
      return;
    }
    
    // Process each scheduled email
    for (const email of scheduledEmails || []) {
      try {
        // Send the email via API
        const response = await fetch('/api/mail/schedule/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: email.id }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send scheduled email');
        }
      } catch (err) {
        console.error(`Error sending scheduled email ${email.id}:`, err);
      }
    }
    
    console.log(`Processed ${scheduledEmails?.length || 0} scheduled emails`);
  } catch (err) {
    console.error('Error processing scheduled emails:', err);
  }
}

/**
 * Process snoozed emails that are due to return to inbox
 */
export async function processSnoozedEmails() {
  try {
    const now = new Date();
    const token = localStorage.getItem('authToken');
    
    if (!token) return;
    
    // Check if using demo account
    const user = localStorage.getItem('user');
    const userData = user ? JSON.parse(user) : null;
    const isDemo = userData?.id === 'demo-user-id';
    
    if (isDemo) {
      console.log('[Demo] Checking for snoozed emails');
      return; // No real processing for demo account
    }
    
    // For real accounts, check Supabase for due snoozed emails
    const supabase = createSupabaseClient();
    
    // Get snoozed emails that are due
    const { data: snoozedEmails, error } = await supabase
      .from('snoozes')
      .select('*')
      .eq('user_id', userData?.id)
      .lt('snoozed_until', now.toISOString());
    
    if (error) {
      console.error('Error fetching snoozed emails:', error);
      return;
    }
    
    // Process each snoozed email
    for (const email of snoozedEmails || []) {
      try {
        // Unsnooze the email via API
        const response = await fetch('/api/mail/snooze/unsnooze', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: email.id }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to unsnooze email');
        }
      } catch (err) {
        console.error(`Error unsnoozing email ${email.id}:`, err);
      }
    }
    
    console.log(`Processed ${snoozedEmails?.length || 0} snoozed emails`);
  } catch (err) {
    console.error('Error processing snoozed emails:', err);
  }
}

/**
 * Check for scheduled and snoozed emails if enough time has passed since last check
 */
export function checkScheduledItems() {
  const now = Date.now();
  
  // Check scheduled emails if it's been long enough
  if (now - lastScheduledCheck > CHECK_INTERVAL) {
    processScheduledEmails();
    lastScheduledCheck = now;
  }
  
  // Check snoozed emails if it's been long enough
  if (now - lastSnoozedCheck > CHECK_INTERVAL) {
    processSnoozedEmails();
    lastSnoozedCheck = now;
  }
}

/**
 * Initialize the client-side scheduler
 * This should be called when the app starts
 */
export function initClientScheduler() {
  // Initial check
  checkScheduledItems();
  
  // Set up periodic checks when user is active
  const events = ['mousemove', 'keydown', 'click', 'scroll', 'visibilitychange'];
  
  // Throttled event handler
  let timeout: NodeJS.Timeout | null = null;
  const handleUserActivity = () => {
    if (timeout) return;
    
    timeout = setTimeout(() => {
      checkScheduledItems();
      timeout = null;
    }, 1000); // Throttle to once per second max
  };
  
  // Add event listeners
  events.forEach(event => {
    window.addEventListener(event, handleUserActivity);
  });
  
  // Also check periodically while the app is open
  const interval = setInterval(checkScheduledItems, CHECK_INTERVAL);
  
  // Return cleanup function
  return () => {
    events.forEach(event => {
      window.removeEventListener(event, handleUserActivity);
    });
    clearInterval(interval);
  };
}
