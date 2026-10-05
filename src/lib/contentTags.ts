/**
 * Sentinel tag marking an Environment Sound/Visual as created from the Home Screen
 * Environments quick-upload (Settings), not Content Management's own Add flow.
 *
 * There's no dedicated backend field distinguishing the two pools — Env Sounds/Visuals
 * are one shared content type under the hood. This tag is a frontend-only workaround so
 * Content Management's library view doesn't show items that were only ever meant to build
 * a specific Home Screen background, not to be curated library content. It only affects
 * items created going forward; it can't retroactively classify existing records, and a
 * real fix would need a backend field instead of an ad-hoc tag.
 */
export const HOME_SCREEN_ONLY_TAG = "__home_screen_only__";
