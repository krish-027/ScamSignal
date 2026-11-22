import type { Choice, MissionDefinition, Outcome, Scene } from '../../../types/mission';
import { MISSION_1_META } from '../missionCatalog';

function options(checkpointId: Choice['checkpointId'], entries: Array<
  [string, string, string, 0 | 10 | 20, Outcome, string, string]
>): Choice[] {
  return entries.map(([id, label, nextSceneId, points, outcomeType, consequenceText, safetyRationale]) => ({
    id, checkpointId, label, nextSceneId, points, outcomeType, consequenceText, safetyRationale,
  }));
}

const senderOptions = options('checkpoint-1', [
  ['inspect-sender', 'Check the sender details', 'sender-safe', 20, 'safe',
    'You notice that a familiar courier name is not independent verification.',
    'Sender display names can be imitated.'],
  ['ask-someone', 'Ask a friend whether it looks real', 'sender-caution', 10, 'caution',
    'You pause for a second opinion, but the sender remains unverified.',
    'A guess is not verification.'],
  ['trust-alert', 'Trust the delivery notification', 'sender-risk', 0, 'risky',
    'You treat a convincing-looking alert as proof of identity.',
    'Scammers can spoof delivery notices.'],
]);

const domainOptions = options('checkpoint-2', [
  ['verify-official', 'Use the courier’s official app or bookmarked site', 'domain-safe', 20, 'safe',
    'You reach the courier using a channel you already trust.',
    'An official app or saved address is independent of the SMS.'],
  ['web-search', 'Search online for the unfamiliar link', 'domain-caution', 10, 'caution',
    'You search, but sponsored results could look convincing too.',
    'Search results can contain impersonation sites.'],
  ['open-fake-link', 'Open the simulated verification link', 'domain-risk', 0, 'risky',
    'A convincing, fictional confirmation page appears.',
    'Unexpected message links can imitate genuine websites.'],
]);

const detailsOptions = options('checkpoint-3', [
  ['refuse-details', 'Decline and verify the parcel independently', 'details-safe', 20, 'safe',
    'You avoid sharing details through a link you did not independently verify.',
    'Declining an unsolicited request protects sensitive information.'],
  ['postpone', 'Wait and check again later', 'details-caution', 10, 'caution',
    'You avoid entering anything, but the delivery claim is still unresolved.',
    'A pause helps; independent verification is stronger.'],
  ['provide-fictional-data', 'Enter simulated details on the fake form', 'details-risk', 0, 'risky',
    'The simulation demonstrates how an imitation form gathers private data.',
    'Never submit real personal or payment details to an unsolicited form.'],
]);

const supportOptions = options('checkpoint-4', [
  ['verify-support', 'Find a published support number independently', 'support-safe', 20, 'safe',
    'You compare the claim using a contact listed outside the suspicious conversation.',
    'An independent channel prevents the sender from choosing all your evidence.'],
  ['request-reference', 'Ask the sender for a ticket or tracking reference', 'support-caution', 10, 'caution',
    'The sender provides an impressive ticket number, but that alone proves nothing.',
    'An attacker can invent reference numbers as easily as names.'],
  ['follow-support', 'Continue in the support chat they supplied', 'support-risk', 0, 'risky',
    'The same unverified source now controls both the alert and its supposed support.',
    'A linked support chat is not an independent verification channel.'],
]);

const resolutionOptions = options('checkpoint-5', [
  ['save-report', 'Save the evidence and report through the official channel', 'resolution-safe', 20, 'safe',
    'You preserve the suspicious message and report it without interacting further.',
    'Reporting through official channels can protect others too.'],
  ['archive-only', 'Archive the conversation and leave it unanswered', 'resolution-caution', 10, 'caution',
    'You disengage safely, but the impersonation attempt is not reported.',
    'Not responding reduces risk; reporting adds value.'],
  ['reopen-ticket', 'Reopen the ticket through the sender’s final link', 'resolution-risk', 0, 'risky',
    'The fake ticket flow draws you back to the same unverified source.',
    'A new link does not make an untrusted conversation safe.'],
]);

function consequence(id: string, body: string, outcome: Outcome, nextSceneId: string): Scene {
  return { id, kind: 'consequence', body, outcome, nextSceneId };
}

/** Fictional training scenario. URLs are inert .example domains; no user input is collected. */
export const PARCEL_MISSION: MissionDefinition = {
  id: 'parcel',
  meta: MISSION_1_META,
  startSceneId: 'incoming-alert',
  clues: {
    'sender-identity': {
      id: 'sender-identity', sourceLabel: 'Sender identity', emphasis: 'sender',
      explanation: 'A courier display name does not prove who controls the message. Compare it with an independently reached official channel.',
    },
    'forced-urgency': {
      id: 'forced-urgency', sourceLabel: 'Urgency claim', emphasis: 'urgency',
      explanation: 'Two-hour deadlines push you to act before verifying. Urgency is a claim, not evidence that a package is real.',
    },
    'unfamiliar-domain': {
      id: 'unfamiliar-domain', sourceLabel: 'Message link', emphasis: 'url',
      explanation: 'speedpost-parcel-status.example is a fictional training domain, not an official courier service. A believable URL shape proves nothing.',
    },
    'support-impersonation': {
      id: 'support-impersonation', sourceLabel: 'Support follow-up', emphasis: 'claim',
      explanation: 'A support number, ticket number, or chat supplied by the same unverified sender is not independent corroboration.',
    },
    'redelivery-request': {
      id: 'redelivery-request', sourceLabel: 'Redelivery details request', emphasis: 'payment',
      explanation: 'An unsolicited page requesting personal information or a small payment is a risk. Do not submit real information or approve a payment.',
    },
  },
  scenes: {
    'incoming-alert': {
      id: 'incoming-alert', kind: 'message', title: 'Incoming delivery alert',
      body: 'A courier-branded message claims a package is held and provides a two-hour deadline. The message and web address are fictional.',
      clueIds: ['sender-identity', 'forced-urgency'], nextSceneId: 'decision-sender',
    },
    'decision-sender': {
      id: 'decision-sender', kind: 'decision', checkpointId: 'checkpoint-1',
      title: 'The familiar sender name', body: 'The message resembles a genuine delivery update. What is the most useful first move?',
      clueIds: ['sender-identity', 'forced-urgency'], choices: senderOptions,
    },
    'sender-safe': consequence('sender-safe', 'You inspect the sender and see no independent proof the notification is genuine.', 'safe', 'decision-domain'),
    'sender-caution': consequence('sender-caution', 'The second opinion slows things down; the sender is still unverified.', 'caution', 'decision-domain'),
    'sender-risk': consequence('sender-risk', 'The courier-like name influences your trust before you verify it.', 'risky', 'decision-domain'),

    'decision-domain': {
      id: 'decision-domain', kind: 'decision', checkpointId: 'checkpoint-2',
      title: 'A plausible-looking link', body: 'The address contains delivery-related words and asks you to check a hold status. How do you verify it?',
      clueIds: ['unfamiliar-domain', 'forced-urgency'], choices: domainOptions,
    },
    'domain-safe': consequence('domain-safe', 'You independently use a trusted courier channel rather than the message link.', 'safe', 'decision-details'),
    'domain-caution': consequence('domain-caution', 'Your web search offers clues, but can also show misleading imitation pages.', 'caution', 'decision-details'),
    'domain-risk': consequence('domain-risk', 'The fictional destination looks polished enough to encourage further action.', 'risky', 'decision-details'),

    'decision-details': {
      id: 'decision-details', kind: 'decision', checkpointId: 'checkpoint-3',
      title: 'A request for delivery information', body: 'A page asks for address details and mentions a small redelivery charge. What would you do?',
      clueIds: ['unfamiliar-domain', 'redelivery-request'], choices: detailsOptions,
    },
    'details-safe': consequence('details-safe', 'You stop before sharing personal or payment details.', 'safe', 'support-message'),
    'details-caution': consequence('details-caution', 'You delay without submitting data, but the claim still needs verification.', 'caution', 'support-message'),
    'details-risk': consequence('details-risk', 'In this simulation, you see how an imitation form can collect information.', 'risky', 'support-message'),

    'support-message': {
      id: 'support-message', kind: 'message', title: 'A support agent follows up',
      body: 'A new message says a support agent is available and quotes a ticket number. All contact details are part of this simulation.',
      clueIds: ['support-impersonation', 'sender-identity'], nextSceneId: 'decision-support',
    },
    'decision-support': {
      id: 'decision-support', kind: 'decision', checkpointId: 'checkpoint-4',
      title: 'The convenient support channel', body: 'The sender offers live support and a ticket number. Which step would best establish whether the case exists?',
      clueIds: ['support-impersonation', 'sender-identity'], choices: supportOptions,
    },
    'support-safe': consequence('support-safe', 'You check using an independently found support contact.', 'safe', 'resolution-message'),
    'support-caution': consequence('support-caution', 'The new ticket number looks convincing but remains a sender-controlled claim.', 'caution', 'resolution-message'),
    'support-risk': consequence('support-risk', 'You are drawn into another channel controlled by the same unverified source.', 'risky', 'resolution-message'),

    'resolution-message': {
      id: 'resolution-message', kind: 'message', title: 'One final follow-up',
      body: 'The conversation ends with a new verification link and a reminder that the package may be returned. You can still decide how to close the case.',
      clueIds: ['forced-urgency', 'support-impersonation', 'redelivery-request'], nextSceneId: 'decision-resolution',
    },
    'decision-resolution': {
      id: 'decision-resolution', kind: 'decision', checkpointId: 'checkpoint-5',
      title: 'How will you close the case?', body: 'You are not required to respond to this message. Which action best protects you and other recipients?',
      clueIds: ['forced-urgency', 'support-impersonation', 'redelivery-request'], choices: resolutionOptions,
    },
    'resolution-safe': consequence('resolution-safe', 'You preserve evidence and report the attempt through an official route.', 'safe', 'signal-reveal'),
    'resolution-caution': consequence('resolution-caution', 'You disengage without further risk, but the impersonation remains unreported.', 'caution', 'signal-reveal'),
    'resolution-risk': consequence('resolution-risk', 'The scammer gains one more opportunity through a newly supplied link.', 'risky', 'signal-reveal'),

    'signal-reveal': {
      id: 'signal-reveal', kind: 'reveal', title: 'Signal Reveal',
      body: 'Five warning patterns surfaced: unverified sender identity, artificial urgency, an unfamiliar link, a sender-controlled support channel, and a sensitive-details request. Verify independently.',
      nextSceneId: 'mission-debrief',
    },
    'mission-debrief': {
      id: 'mission-debrief', kind: 'debrief', title: 'Case closed',
      body: 'Review your five locked decisions. In real life, contact the courier independently, avoid unsolicited links and requests for details, and report suspicious messages through official channels.',
    },
  },
};
