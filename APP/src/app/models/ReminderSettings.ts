export interface ReminderSettings {
  enabled: boolean;
  remindWith: 'email'; // Only email option now
  reminderType: '24hours' | '12hours' | '2days' | '3days' | '1week'; // Keep this for single selection scenarios
 // selectedReminderTypes?: string[]; // Add this for multiple selection
}
