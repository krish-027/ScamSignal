import type { CheckpointId, MissionDefinition, Scene } from '../../../types/mission';

const ORDER: readonly CheckpointId[] = [
  'checkpoint-1',
  'checkpoint-2',
  'checkpoint-3',
];

/** Throws with a useful error if a mission contains broken links or unsafe scoring. */
export function validateMission(definition: MissionDefinition): void {
  if (definition.id !== definition.meta.id) {
    throw new Error(`Mission metadata ID mismatch: ${definition.id}`);
  }
  if (!definition.scenes[definition.startSceneId]) {
    throw new Error(`Missing start scene: ${definition.startSceneId}`);
  }
  if (Object.keys(definition.clues).length !== definition.meta.keyCluesCount) {
    throw new Error('Clue catalog count does not match mission metadata');
  }

  const scenes = definition.scenes;
  for (const [key, scene] of Object.entries(scenes)) {
    if (scene.id !== key) throw new Error(`Scene key/ID mismatch: ${key}`);
    for (const clueId of scene.clueIds ?? []) {
      if (!definition.clues[clueId]) {
        throw new Error(`Scene ${key} references unknown clue ${clueId}`);
      }
    }
    if (scene.kind === 'decision') {
      if (!scene.checkpointId || !scene.choices?.length) {
        throw new Error(`Decision ${key} needs a checkpoint and choices`);
      }
      if (scene.nextSceneId) throw new Error(`Decision ${key} must branch through choices`);
      const used = new Set<string>();
      for (const choice of scene.choices) {
        if (used.has(choice.id)) throw new Error(`Duplicate choice ID: ${choice.id}`);
        used.add(choice.id);
        if (choice.checkpointId !== scene.checkpointId) {
          throw new Error(`Choice ${choice.id} has wrong checkpoint`);
        }
        const allowed = choice.checkpointId === 'checkpoint-3'
          ? [0, 20, 40]
          : [0, 15, 30];
        if (!allowed.includes(choice.points)) {
          throw new Error(`Choice ${choice.id} has invalid points`);
        }
        if (!scenes[choice.nextSceneId]) {
          throw new Error(`Choice ${choice.id} points to missing scene`);
        }
      }
    } else {
      if (scene.choices?.length || scene.checkpointId) {
        throw new Error(`Non-decision scene ${key} cannot contain choices/checkpoints`);
      }
      if (scene.kind === 'debrief') {
        if (scene.nextSceneId) throw new Error('Debrief must be terminal');
      } else if (!scene.nextSceneId || !scenes[scene.nextSceneId]) {
        throw new Error(`Scene ${key} has no valid next scene`);
      }
    }
  }

  const reachable = new Set<string>();
  function walk(sceneId: string, completed: number, ancestors: Set<string>): void {
    if (ancestors.has(sceneId)) throw new Error(`Mission contains a cycle at ${sceneId}`);
    reachable.add(sceneId);
    const scene: Scene = scenes[sceneId];
    const nextAncestors = new Set(ancestors);
    nextAncestors.add(sceneId);

    if (scene.kind === 'debrief') {
      if (completed !== 3) throw new Error('Debrief reached before all three checkpoints');
      return;
    }
    if (scene.kind === 'decision') {
      if (scene.checkpointId !== ORDER[completed]) {
        throw new Error(`Unexpected checkpoint order at ${sceneId}`);
      }
      for (const choice of scene.choices ?? []) {
        walk(choice.nextSceneId, completed + 1, nextAncestors);
      }
      return;
    }
    // Validated in the first pass; non-terminal linear scenes have a nextSceneId.
    walk(scene.nextSceneId!, completed, nextAncestors);
  }
  walk(definition.startSceneId, 0, new Set());
  for (const key of Object.keys(scenes)) {
    if (!reachable.has(key)) throw new Error(`Unreachable scene: ${key}`);
  }
}
