import { MissionMeta } from '../../types/mission';

export const MISSION_CATALOG: Record<string, MissionMeta> = {
  parcel: {
    id: 'parcel',
    order: 1,
    title: 'The Missing Package',
    subtitle: 'Delivery Phishing Simulation',
    setup: 'A high-priority text message claims an urgent package is on hold due to missing address information.',
    learningObjective: "Verify delivery claims using the service's official app or portal rather than an unsolicited link.",
    estimatedDuration: '3–5 minutes',
    simulatedSender: {
      displayName: 'SpeedPost Courier',
      address: 'alert@speedpost-verify.example',
      verifiedBadge: false,
    },
    keyCluesCount: 5,
  },
  internship: {
    id: 'internship',
    order: 2,
    title: 'The Dream Internship',
    subtitle: 'Advance-Fee Recruitment Fraud',
    setup: 'A high-paying remote internship offer arrives via direct message with no prior application.',
    learningObjective: 'Assess unsolicited offers, verify employers via independent channels, and reject pay-to-apply demands.',
    estimatedDuration: '60 seconds',
    simulatedSender: {
      displayName: 'Global HR Talent',
      address: 'careers@instant-hire-portal.example',
      verifiedBadge: false,
    },
    keyCluesCount: 3,
  },
  refund: {
    id: 'refund',
    order: 3,
    title: 'The Refund Trap',
    subtitle: 'UPI Collect-Request Fraud',
    setup: 'An urgent contact claims you are owed an immediate refund and prompts for authorization.',
    learningObjective: 'Understand that approving a UPI collect request sends money; receiving money never requires entering a UPI PIN.',
    estimatedDuration: '60 seconds',
    simulatedSender: {
      displayName: 'PayDesk Helpdesk',
      address: 'support@quick-refund-desk.example',
      verifiedBadge: false,
    },
    keyCluesCount: 3,
  },
};

export const MISSION_1_META = MISSION_CATALOG.parcel;
