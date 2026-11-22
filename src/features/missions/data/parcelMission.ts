import type { Choice, MissionDefinition, Outcome, Scene } from '../../../types/mission';
import { MISSION_1_META } from '../missionCatalog';

const checkpoint1 = 'checkpoint-1';
const checkpoint2 = 'checkpoint-2';
const checkpoint3 = 'checkpoint-3';

// Creating choices from explicit literals preserves the strict checkpoint point types.
const d1: Choice[] = [
  {
    id: 'inspect-sender', checkpointId: checkpoint1, label: 'Check the sender details',
    nextSceneId: 'sender-safe', points: 30, outcomeType: 'safe',
    consequenceText: 'You notice the sender is not independently verified.',
    safetyRationale: 'A familiar display name is not proof of identity.',
  },
  {
    id: 'ask-someone', checkpointId: checkpoint1, label: 'Ask a friend whether it looks real',
    nextSceneId: 'sender-caution', points: 15, outcomeType: 'caution',
    consequenceText: 'You slow down, but a friend cannot verify the sender.',
    safetyRationale: 'Independent official channels are more reliable than guesses.',
  },
  {
    id: 'trust-alert', checkpointId: checkpoint1, label: 'Trust the delivery notification',
    nextSceneId: 'sender-risk', points: 0, outcomeType: 'risky',
    consequenceText: 'You accept an unverified delivery claim as legitimate.',
    safetyRationale: 'Scammers can imitate delivery notifications and sender names.',
  },
];

const d2: Choice[] = [
  {
    id: 'verify-official', checkpointId: checkpoint2, label: 'Use the courier’s official app or bookmarked site',
    nextSceneId: 'domain-safe', points: 30, outcomeType: 'safe',
    consequenceText: 'You check independently instead of opening the message link.',
    safetyRationale: 'Navigate to an official channel yourself to verify a claim.',
  },
  {
    id: 'web-search', checkpointId: checkpoint2, label: 'Search online for the unfamiliar link',
    nextSceneId: 'domain-caution', points: 15, outcomeType: 'caution',
    consequenceText: 'You pause, but search results may contain misleading lookalikes.',
    safetyRationale: 'A bookmarked official app or website is safer than a search ad.',
  },
  {
    id: 'open-fake-link', checkpointId: checkpoint2, label: 'Open the simulated verification link',
    nextSceneId: 'domain-risk', points: 0, outcomeType: 'risky',
    consequenceText: 'A convincing but fictional verification screen appears.',
    safetyRationale: 'Unexpected links can lead to imitation sites.',
  },
];

const d3: Choice[] = [
  {
    id: 'refuse-details', checkpointId: checkpoint3, label: 'Decline and verify the parcel independently',
    nextSceneId: 'details-safe', points: 40, outcomeType: 'safe',
    consequenceText: 'You keep sensitive information private and avoid the trap.',
    safetyRationale: 'Never provide payment or personal information through an unsolicited link.',
  },
  {
    id: 'postpone', checkpointId: checkpoint3, label: 'Wait and check again later',
    nextSceneId: 'details-caution', points: 20, outcomeType: 'caution',
    consequenceText: 'You avoid acting under pressure but have not verified the claim.',
    safetyRationale: 'Pausing is good; independent verification is better.',
  },
  {
    id: 'provide-fictional-data', checkpointId: checkpoint3, label: 'Enter simulated details on the fake form',
    nextSceneId: 'details-risk', points: 0, outcomeType: 'risky',
    consequenceText: 'The simulation shows how a fake form could steal details.',
    safetyRationale: 'This is a fictional exercise; never enter real information.',
  },
];

function consequence(
  id: string,
  body: string,
  outcome: Outcome,
  nextSceneId: string,
): Scene {
  return { id, kind: 'consequence', body, outcome, nextSceneId };
}

/** All URLs are inert, fictional example domains. No network requests or credential inputs. */
export const PARCEL_MISSION: MissionDefinition = {
  id: 'parcel',
  meta: MISSION_1_META,
  startSceneId: 'incoming-alert',
  clues: {
    'sender-identity': {
      id: 'sender-identity', sourceLabel: 'Sender identity', emphasis: 'sender',
      explanation: 'A courier-like display name does not establish authenticity.',
    },
    'forced-urgency': {
      id: 'forced-urgency', sourceLabel: 'Urgency claim', emphasis: 'urgency',
      explanation: 'A short deadline pushes you to act before verifying.',
    },
    'unfamiliar-domain': {
      id: 'unfamiliar-domain', sourceLabel: 'Message link', emphasis: 'url',
      explanation: 'speedpost-parcel-status.example is a fictional training domain, not an official service.',
    },
  },
  scenes: {
    'incoming-alert': {
      id: 'incoming-alert', kind: 'message', title: 'Incoming delivery alert',
      body: 'URGENT: Package #IN-88942 is held. Confirm your address within 2 hours at https://speedpost-parcel-status.example/verify. This is a fictional message.',
      clueIds: ['sender-identity', 'forced-urgency'], nextSceneId: 'decision-sender',
    },
    'decision-sender': {
      id: 'decision-sender', kind: 'decision', checkpointId: checkpoint1,
      title: 'Would you trust the sender?', body: 'A display name can look official. What is your first move?',
      clueIds: ['sender-identity', 'forced-urgency'], choices: d1,
    },
    'sender-safe': consequence('sender-safe', 'You inspect the sender and find no proof this is an official courier message.', 'safe', 'decision-domain'),
    'sender-caution': consequence('sender-caution', 'A second opinion slows you down, but the sender is still unverified.', 'caution', 'decision-domain'),
    'sender-risk': consequence('sender-risk', 'You initially trust the alert because it resembles a real delivery notice.', 'risky', 'decision-domain'),
    'decision-domain': {
      id: 'decision-domain', kind: 'decision', checkpointId: checkpoint2,
      title: 'The message contains a link', body: 'A verification URL appears under an urgent delivery warning. How do you check it?',
      clueIds: ['unfamiliar-domain', 'forced-urgency'], choices: d2,
    },
    'domain-safe': consequence('domain-safe', 'You independently open the genuine courier channel instead of the message link.', 'safe', 'decision-details'),
    'domain-caution': consequence('domain-caution', 'You search for the link but are still exposed to misleading results.', 'caution', 'decision-details'),
    'domain-risk': consequence('domain-risk', 'The fictional link leads to a realistic-looking imitation page.', 'risky', 'decision-details'),
    'decision-details': {
      id: 'decision-details', kind: 'decision', checkpointId: checkpoint3,
      title: 'The final request', body: 'The fake page asks you to confirm your address and a small redelivery payment. What now?',
      clueIds: ['unfamiliar-domain'], choices: d3,
    },
    'details-safe': consequence('details-safe', 'You stop the process and verify without sharing sensitive details.', 'safe', 'signal-reveal'),
    'details-caution': consequence('details-caution', 'You pause without sharing data, but still need official verification.', 'caution', 'signal-reveal'),
    'details-risk': consequence('details-risk', 'The simulation reveals how an imitation form could collect private data.', 'risky', 'signal-reveal'),
    'signal-reveal': {
      id: 'signal-reveal', kind: 'reveal', title: 'Signal Reveal',
      body: 'Three red flags: an unverified sender, artificial time pressure, and an unfamiliar link. The safest response is independent verification.',
      nextSceneId: 'mission-debrief',
    },
    'mission-debrief': {
      id: 'mission-debrief', kind: 'debrief', title: 'Case closed',
      body: 'Review your three decisions. For real messages, use an official courier channel and never enter sensitive details from unsolicited links.',
    },
  },
};
