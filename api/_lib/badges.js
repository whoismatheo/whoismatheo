"use strict";
const FLAGS = [
  [1 << 0, "staff"], [1 << 1, "partner"], [1 << 2, "hypesquadEvents"], [1 << 3, "bugHunter1"],
  [1 << 6, "hypesquadBravery"], [1 << 7, "hypesquadBrilliance"], [1 << 8, "hypesquadBalance"], [1 << 9, "earlySupporter"],
  [1 << 14, "bugHunter2"], [1 << 17, "verifiedDeveloper"], [1 << 18, "certifiedModerator"], [1 << 22, "activeDeveloper"]
];
function badgesFrom(publicFlags) {
  const f = Number(publicFlags);
  if (!Number.isFinite(f) || f <= 0) return [];
  return FLAGS.filter(([bit]) => (f & bit) === bit).map(([, key]) => key);
}
module.exports = { badgesFrom, FLAGS };
