export default function calculateShares({
  wives = 0,
  husbandAlive = false,
  sons = 0,
  daughters = 0,
  motherAlive = false,
  fatherAlive = false,
  brothers = 0,
  sisters = 0,
  grandsons = 0,
  granddaughters = 0,
  grandfatherAlive = false,
  maternalGrandmotherAlive = false,
  paternalGrandmotherAlive = false,
  maternalBrothers = 0,
  maternalSisters = 0,
  paternalBrothers = 0,
  paternalSisters = 0,
  fullNephews = 0,
  paternalNephews = 0,
  fullUncles = 0,
  paternalUncles = 0,
  fullCousins = 0,
  paternalCousins = 0,
}) {
  // Debug log
  console.log("Input values:", { grandsons, granddaughters, sons, daughters, fatherAlive });
  const shares = {
    wives: 0,
    husband: 0,
    sons: 0,
    daughters: 0,
    mother: 0,
    father: 0,
    brothers: 0,
    sisters: 0,
    grandsons: 0,
    granddaughters: 0,
    grandfather: 0,
    maternalGrandmother: 0,
    paternalGrandmother: 0,
    maternalBrothers: 0,
    maternalSisters: 0,
    paternalBrothers: 0,
    paternalSisters: 0,
    fullNephews: 0,
    paternalNephews: 0,
    fullUncles: 0,
    paternalUncles: 0,
    fullCousins: 0,
    paternalCousins: 0,
  };

  function addShares(heir, amount) {
    shares[heir] = (shares[heir] || 0) + amount;
  }

  // =============================
  // BASIC PRESENCE CONDITIONS
  // =============================
  const hasChildren = sons + daughters > 0;
  const hasSons = sons > 0;
  const hasDaughters = daughters > 0;
  const hasGrandchildren = grandsons + granddaughters > 0;
  const hasFullSiblings = brothers + sisters > 0;
  const hasCloserHeirs = hasChildren || hasSons || hasDaughters || fatherAlive;


  
// =============================
// STEP 1: SPOUSE SHARES (FULL CONDITIONS FOR WIVES)
// =============================

if (husbandAlive) {
  shares.husband = hasChildren || hasGrandchildren || grandsons > 0 ? 1 / 4 : 1 / 2;
} else if (wives > 0) {
  // Determine if children/grandchildren/grandson exist (treat grandson as child)
  const hasChildOrGrandchild = hasChildren || hasGrandchildren || grandsons > 0 || granddaughters > 0;
  // Check if no other heirs alive
  const nobodyElse =
    !hasChildOrGrandchild &&
    !fatherAlive &&
    !motherAlive &&
    brothers === 0 &&
    sisters === 0;
  // Check for son's son (grandson through son)
  const hasSonsSon = grandsons > 0;
  // Base total wife share
  let totalWifeShare = 0;
  if (nobodyElse) {
    totalWifeShare = 1 / 4;
  } else if (hasChildOrGrandchild || hasSonsSon) {
    totalWifeShare = 1 / 8;
  } else {
    totalWifeShare = 1 / 4;
  }
  if (wives === 1) {
    shares.wives = totalWifeShare;
  } else if (wives === 2) {
    // Each wife gets 1/8 if no children, or 1/16 each if children
    if (hasChildOrGrandchild || hasSonsSon) {
      shares.wives = 2 * (1 / 16); // total 1/8
    } else {
      shares.wives = 2 * (1 / 8); // total 1/4
    }
  } else if (wives === 3) {
    // For 3 wives, use shares 1/12, 1/24, 1/16, 1/32 (normalize to total share)
    let share1, share2, share3, sumShares, factor;
    if (hasChildOrGrandchild || hasSonsSon) {
      // total share = 1/8
      share1 = 1 / 12;
      share2 = 1 / 24;
      share3 = 1 / 24;
      sumShares = share1 + share2 + share3;
      factor = (1 / 8) / sumShares;
      shares.wives = factor * sumShares; // assign total wives share for calculation purpose
      // You can split these fractions individually in UI if you track per wife
    } else {
      // total share = 1/4
      share1 = 1 / 6;
      share2 = 1 / 12;
      share3 = 1 / 12;
      sumShares = share1 + share2 + share3;
      factor = (1 / 4) / sumShares;
      shares.wives = factor * sumShares;
      // Again, split in UI if needed
    }
  } else {
    // For more than 3 wives, just split total share equally
    shares.wives = totalWifeShare;
  }
}

  // =============================
  // STEP 2: MOTHER
  // =============================
  if (motherAlive) {
    if (hasChildren || brothers + sisters >= 2) {
      shares.mother = 1 / 6;
    } else {
      shares.mother = 1 / 3;
    }
  }

  // =============================
  // STEP 3: FATHER
  // =============================
  if (fatherAlive) {
    if (hasChildren) {
      shares.father = 1 / 6;
    } else {
      shares.father = 1 / 3;
    }
    // Block siblings and dulalham (paternal siblings) if father is alive
    shares.brothers = 0;
    shares.sisters = 0;
    shares.paternalBrothers = 0;
    shares.paternalSisters = 0;
  }

  // =============================
  // STEP 4: CHILDREN
  // =============================
  if (daughters > 0 && sons === 0) {
    if (daughters === 1) {
      // If only one daughter and no son, no brother, no father, she gets the entire estate
      if (brothers === 0 && fatherAlive === false && sons === 0) {
        shares.daughters = 1;
      } else {
        shares.daughters = 1 / 2;
      }
    } else {
      shares.daughters = 2 / 3;
    }
    // Block uncles and dulalham (paternal siblings)
    // Note: Daughters do NOT block nephews; nephews may inherit residue if otherwise eligible
    shares.fullUncles = 0;
    shares.paternalUncles = 0;
    shares.paternalBrothers = 0;
    shares.paternalSisters = 0;
  }

  // =============================
  // ===== GRANDCHILDREN ========
  // =============================

  // FIXED SHARES: Granddaughters if no children at all
  if (sons === 0 && daughters === 0) {
    // Granddaughters get fixed shares only if no sons exist
    if (granddaughters === 1 && grandsons === 0) {
      shares.granddaughters = 1 / 2;
    } else if (granddaughters > 1 && grandsons === 0) {
      shares.granddaughters = 2 / 3;
    }

    // GRANDSONS: If only grandsons and no granddaughters
    else if (grandsons > 0 && granddaughters === 0) {
      // No fixed share; grandsons inherit entire residue as Asaba (residuary)
      // Will be handled in the residuary section
    }

    // If both grandsons and granddaughters exist
    else if (grandsons > 0 && granddaughters > 0) {
      // They share residue: each grandson gets double the share of a granddaughter
      // Handled in the Asaba section
    }
  }

  // =============================
  // GRANDDAUGHTERS BLOCKING LOGIC
  // =============================
  // Granddaughters block the same relatives as grandsons
  if (sons === 0 && daughters === 0 && (grandsons > 0 || granddaughters > 0)) {
    // Block uncles, nephews, cousins, grandfather when grandchildren inherit
    shares.fullUncles = 0;
    shares.paternalUncles = 0;
    shares.fullNephews = 0;
    shares.paternalNephews = 0;
    shares.fullCousins = 0;
    shares.paternalCousins = 0;
    shares.grandfather = 0;
    // Block siblings when grandchildren exist
    shares.brothers = 0;
    shares.sisters = 0;
    shares.paternalBrothers = 0;
    shares.paternalSisters = 0;
  }

  // =============================
  // GRANDSONS (SON'S SONS) LOGIC - BLOCKING
  // =============================
  // Block grandsons/granddaughters if sons exist
  if (sons > 0) {
    shares.grandsons = 0;
    shares.granddaughters = 0;
  }
  // If grandsons (and no sons), block uncles, nephews, cousins, grandfather
  else if (grandsons > 0) {
    // Block uncles, nephews, cousins, grandfather
    shares.fullUncles = 0;
    shares.paternalUncles = 0;
    shares.fullNephews = 0;
    shares.paternalNephews = 0;
    shares.fullCousins = 0;
    shares.paternalCousins = 0;
    shares.grandfather = 0;
  }

  // =============================
  // STEP 5: SUM FIXED SHARES
  // =============================
  let fixedTotal = 0;
  for (const heir in shares) {
    fixedTotal += shares[heir];
  }

  // Adjust if total fixed shares > 1 (Radd)
  if (fixedTotal > 1) {
    for (const heir in shares) {
      shares[heir] /= fixedTotal;
    }
    fixedTotal = 1;
  }

  // =============================
  // STEP 6: RESIDUE
  // =============================
  let residue = 1 - fixedTotal;

  // ASABA: Sons + Daughters (2:1 ratio)
  if (hasSons) {
    const units = sons * 2 + daughters;
    const unitShare = residue / units;
    shares.sons += 2 * unitShare * sons;
    shares.daughters += unitShare * daughters;
    residue = 0;
    // Block grandparents, uncles, nephews if sons exist
    shares.grandfather = 0;
    shares.maternalGrandmother = 0;
    shares.paternalGrandmother = 0;
    shares.fullUncles = 0;
    shares.paternalUncles = 0;
    shares.fullNephews = 0;
    shares.paternalNephews = 0;
  }

  // ASABA: Grandsons + Granddaughters if no sons
  else if (!hasSons && (grandsons > 0 || granddaughters > 0)) {
    console.log("Grandchildren ASABA calculation:", { grandsons, granddaughters, residue, hasSons });
    const units = grandsons * 2 + granddaughters;
    const unitShare = residue / units;
    shares.grandsons += 2 * unitShare * grandsons;
    shares.granddaughters += unitShare * granddaughters;
    residue = 0;
    console.log("Grandchildren shares calculated:", { grandsonsShare: shares.grandsons, granddaughtersShare: shares.granddaughters });
    // Block uncles, nephews, cousins, grandfather when grandchildren inherit
    shares.fullUncles = 0;
    shares.paternalUncles = 0;
    shares.fullNephews = 0;
    shares.paternalNephews = 0;
    shares.fullCousins = 0;
    shares.paternalCousins = 0;
    shares.grandfather = 0;
  }

  // Father gets residue if no children
  if (fatherAlive && !hasChildren && residue > 0) {
    shares.father += residue;
    residue = 0;
  }



  
  // ASABA: Brothers + Sisters if no father and no children (sons/grandsons)
  if (!fatherAlive && sons === 0 && grandsons === 0 && (brothers + sisters > 0) && residue > 0) {
    const units = brothers * 2 + sisters;
    const unitShare = residue / units;
    shares.brothers += 2 * unitShare * brothers;
    shares.sisters += unitShare * sisters;
    residue = 0;
    // Block uncles, nephews, and cousins if brothers/sisters inherit as asaba
    shares.fullUncles = 0;
    shares.paternalUncles = 0;
    shares.fullNephews = 0;
    shares.paternalNephews = 0;
    shares.fullCousins = 0;
    shares.paternalCousins = 0;
  }
// =============================
// STEP X: MATERNAL SIBLINGS FIXED SHARE
// =============================

let maternalSiblingsShare = 0;

if (
  (maternalBrothers + maternalSisters) > 0 &&
  !motherAlive &&
  !fatherAlive &&
  sons === 0 &&
  daughters === 0 &&
  grandsons === 0 &&
  granddaughters === 0
  // NOTE: Maternal siblings can inherit their fixed share even when full siblings exist
  // The blocking logic is handled separately in the nephews section
) {
  const totalMaternalSiblings = maternalBrothers + maternalSisters;
  maternalSiblingsShare = 1 / 6; // fixed share for all maternal siblings combined

  shares.maternalBrothers = (maternalBrothers / totalMaternalSiblings) * maternalSiblingsShare;
  shares.maternalSisters = (maternalSisters / totalMaternalSiblings) * maternalSiblingsShare;

  residue -= maternalSiblingsShare;
  if (residue < 0) residue = 0;
} else {
  // Maternal siblings get nothing if conditions not met
  shares.maternalBrothers = 0;
  shares.maternalSisters = 0;
}

// =============================
// STEP X: NEPHEWS (FULL & PATERNAL) - COMPREHENSIVE ISLAMIC RULES
// =============================

// =============================
// FULL NEPHEWS LOGIC
// =============================

// Full nephews are blocked by:
// - Sons, grandsons, father, grandfather
// - Full brothers, paternal brothers
// Note: Sisters and grandmothers do NOT block nephews
if (sons > 0 || grandsons > 0 || fatherAlive || grandfatherAlive || brothers > 0 || paternalBrothers > 0) {
  shares.fullNephews = 0;
}

// Full nephews block:
// - Maternal uncles (full uncles if they are maternal)
// - Maternal nephews (paternal nephews if they are maternal)
// - Maternal cousins (full cousins if they are maternal)
// Note: Full nephews do NOT block maternal siblings according to Islamic law
// Maternal siblings get their fixed share, nephews get the residue

// =============================
// PATERNAL NEPHEWS LOGIC
// =============================

// Paternal nephews are blocked by:
// - Sons, grandsons, father, grandfather
// - Full brothers, paternal brothers, full nephews
// Note: Sisters (full or paternal) do NOT block paternal nephews
if (sons > 0 || grandsons > 0 || fatherAlive || grandfatherAlive || brothers > 0 || fullNephews > 0 || paternalBrothers > 0) {
  shares.paternalNephews = 0;
}

// Paternal nephews block:
// - Cousins (full and paternal cousins)
// - Maternal uncles (full uncles if they are maternal)
// - Maternal nephews (paternal nephews if they are maternal)
// Note: Paternal nephews do NOT block maternal siblings according to Islamic law
// Maternal siblings get their fixed share, nephews get the residue

// =============================
// NEPHEWS INHERITANCE CALCULATION
// =============================

// Full nephews inherit if:
// - No sons or grandsons exist
// - No father alive
// - No grandmothers alive
// - No full brothers or sisters alive
// - No paternal siblings alive (paternal siblings block full nephews)
// - Residue remains (can inherit even if maternal siblings are present)
if (
  fullNephews > 0 &&
  sons === 0 &&
  grandsons === 0 &&
  !fatherAlive &&
  !grandfatherAlive &&
  brothers === 0 &&
  paternalBrothers === 0 &&
  residue > 0
) {
  // Full nephews get the entire residue as residuary heirs (Asaba)
  shares.fullNephews = residue;
  residue = 0;
  
  // Block paternal nephews when full nephews inherit
  shares.paternalNephews = 0;
} else {
  shares.fullNephews = 0;
}

// Paternal nephews inherit if:
// - No sons or grandsons exist
// - No father alive
// - No grandfather alive
// - No full brothers alive
// - No full nephews alive
// - No paternal siblings alive (paternal siblings block paternal nephews)
// - Residue remains (can inherit even if maternal siblings are present)
if (
  paternalNephews > 0 &&
  sons === 0 &&
  grandsons === 0 &&
  !fatherAlive &&
  !grandfatherAlive &&
  brothers === 0 &&
  fullNephews === 0 &&
  paternalBrothers === 0 &&
  residue > 0
) {
  // Paternal nephews get the entire residue as residuary heirs (Asaba)
  shares.paternalNephews = residue;
  residue = 0;
} else {
  shares.paternalNephews = 0;
}


  // =============================
  // STEP 7: GRANDPARENTS - COMPREHENSIVE ISLAMIC RULES
  // =============================

  const siblingsExist = brothers > 0 || sisters > 0;
  const grandchildrenExist = grandsons > 0 || granddaughters > 0;
  const halfSiblingsExist = paternalBrothers > 0 || paternalSisters > 0;

  // =============================
  // GRANDFATHER RULES
  // =============================
  
  // Grandfather is blocked by:
  // - Father (father blocks grandfather)
  // - Sons (sons block grandfather)
  // - Grandsons (grandsons block grandfather)
  // - Daughters (daughters block grandfather)
  if (fatherAlive || sons > 0 || grandsons > 0 || daughters > 0) {
    shares.grandfather = 0;
  }
  
  // Grandfather blocks:
  // - Half siblings (paternal brothers/sisters)
  // - Uncles (full and paternal)
  // - Nephews (full and paternal)
  // - Cousins (full and paternal)
  if (grandfatherAlive) {
    shares.paternalBrothers = 0;
    shares.paternalSisters = 0;
    shares.fullUncles = 0;
    shares.paternalUncles = 0;
    shares.fullNephews = 0;
    shares.paternalNephews = 0;
    shares.fullCousins = 0;
    shares.paternalCousins = 0;
  }

  // =============================
  // MATERNAL GRANDMOTHER RULES
  // =============================
  
  // Maternal grandmother is blocked by:
  // - Mother (mother blocks maternal grandmother)
  // - Father (father blocks maternal grandmother)
  // - Children (sons/daughters block maternal grandmother)
  // - Grandchildren (grandsons/granddaughters block maternal grandmother)
  // - Siblings (brothers/sisters block maternal grandmother)
  if (motherAlive || fatherAlive || sons > 0 || daughters > 0 || grandsons > 0 || granddaughters > 0 || siblingsExist) {
    shares.maternalGrandmother = 0;
  }
  
  // Maternal grandmother blocks:
  // - Uncles (full and paternal)
  // - Nephews (full and paternal)
  // - Cousins (full and paternal)
  if (maternalGrandmotherAlive) {
    shares.fullUncles = 0;
    shares.paternalUncles = 0;
    shares.fullNephews = 0;
    shares.paternalNephews = 0;
    shares.fullCousins = 0;
    shares.paternalCousins = 0;
  }

  // =============================
  // PATERNAL GRANDMOTHER RULES
  // =============================
  
  // Paternal grandmother is blocked by:
  // - Mother (mother blocks paternal grandmother)
  // - Father (father blocks paternal grandmother)
  // - Children (sons/daughters block paternal grandmother)
  // - Grandchildren (grandsons/granddaughters block paternal grandmother)
  // - Siblings (brothers/sisters block paternal grandmother)
  if (motherAlive || fatherAlive || sons > 0 || daughters > 0 || grandsons > 0 || granddaughters > 0 || siblingsExist) {
    shares.paternalGrandmother = 0;
  }
  
  // Paternal grandmother blocks:
  // - Uncles (full and paternal)
  // - Nephews (full and paternal)
  // - Cousins (full and paternal)
  if (paternalGrandmotherAlive) {
    shares.fullUncles = 0;
    shares.paternalUncles = 0;
    shares.fullNephews = 0;
    shares.paternalNephews = 0;
    shares.fullCousins = 0;
    shares.paternalCousins = 0;
  }

  // =============================
  // GRANDMOTHERS FIXED SHARES (1/6 EACH)
  // =============================
  
  // Maternal grandmother gets 1/6 if eligible
  if (
    maternalGrandmotherAlive &&
    !motherAlive &&
    !fatherAlive &&
    sons === 0 &&
    daughters === 0 &&
    grandsons === 0 &&
    granddaughters === 0 &&
    !siblingsExist &&
    !halfSiblingsExist
  ) {
    shares.maternalGrandmother = 1 / 6;
  }
  
  // Paternal grandmother gets 1/6 if eligible
  if (
    paternalGrandmotherAlive &&
    !motherAlive &&
    !fatherAlive &&
    sons === 0 &&
    daughters === 0 &&
    grandsons === 0 &&
    granddaughters === 0 &&
    !siblingsExist &&
    !halfSiblingsExist
  ) {
    shares.paternalGrandmother = 1 / 6;
  }

  // =============================
  // GRANDFATHER RESIDUARY SHARE
  // =============================
  
  // Recalculate fixedTotal after assigning grandmothers shares
  fixedTotal = 0;
  for (const heir in shares) {
    fixedTotal += shares[heir];
  }
  residue = 1 - fixedTotal;

  // Grandfather inherits residue if:
  // - Father is NOT alive (already checked above)
  // - No children or grandchildren exist (already checked above)
  // - No siblings exist
  // - Residue remains after fixed shares
  if (
    grandfatherAlive &&
    !fatherAlive &&
    !motherAlive &&
    sons === 0 &&
    daughters === 0 &&
    grandsons === 0 &&
    granddaughters === 0 &&
    !siblingsExist &&
    !halfSiblingsExist &&
    residue > 0
  ) {
    shares.grandfather = residue;
    residue = 0;
  }

  // =============================
  // STEP 7b: GRANDPARENT LOGIC BY CONDITIONS
  // =============================

  const onlySpouse = husbandAlive || wives > 0;
  const noParents = !motherAlive && !fatherAlive;
  const noChildrenOrGrandchildren =
    sons === 0 && daughters === 0 && grandsons === 0 && granddaughters === 0;
  const noSiblings = brothers === 0 && sisters === 0;

  // Grandmothers' eligibility: no mother/father, and either no children or no blockage
  if (noParents && noChildrenOrGrandchildren && !siblingsExist && !grandchildrenExist) {
    if (maternalGrandmotherAlive && paternalGrandmotherAlive) {
      // Share 1/6 equally
      shares.maternalGrandmother = 1 / 12;
      shares.paternalGrandmother = 1 / 12;
    } else if (maternalGrandmotherAlive) {
      shares.maternalGrandmother = 1 / 6;
    } else if (paternalGrandmotherAlive) {
      shares.paternalGrandmother = 1 / 6;
    }
  }

  // ===== SPECIAL CASE: Husband + Grandfather + Both Grandmothers (no parents, no children, no siblings) =====
  if (
    husbandAlive &&
    wives === 0 &&
    !fatherAlive &&
    !motherAlive &&
    sons === 0 &&
    daughters === 0 &&
    brothers === 0 &&
    sisters === 0 &&
    grandsons === 0 &&
    granddaughters === 0 &&
    maternalGrandmotherAlive &&
    paternalGrandmotherAlive &&
    grandfatherAlive
  ) {
    shares.husband = 1 / 2;
    shares.maternalGrandmother = 1 / 12;
    shares.paternalGrandmother = 1 / 12;
    shares.grandfather = 1 - (1 / 2 + 1 / 12 + 1 / 12);
    residue = 0;
  }

  // ===== SPECIAL CASE: Only wife and grandparents (no parents, children, siblings, grandchildren) =====
  if (
    wives > 0 &&
    husbandAlive === false &&
    sons === 0 &&
    daughters === 0 &&
    brothers === 0 &&
    sisters === 0 &&
    grandsons === 0 &&
    granddaughters === 0 &&
    fatherAlive === false &&
    motherAlive === false &&
    maternalGrandmotherAlive &&
    paternalGrandmotherAlive &&
    grandfatherAlive
  ) {
    shares.wives = 1 / 4;
    shares.maternalGrandmother = 1 / 12;
    shares.paternalGrandmother = 1 / 12;
    shares.grandfather = 1 - (1 / 4 + 1 / 12 + 1 / 12);
    residue = 0;
  }

  // Recalculate fixedTotal again after updated grandparent shares
  fixedTotal = Object.values(shares).reduce((sum, share) => sum + share, 0);
  residue = 1 - fixedTotal;

  // Grandfather final check
  if (
    grandfatherAlive &&
    !fatherAlive &&
    sons === 0 &&
    daughters === 0 &&
    grandsons === 0 &&
    residue > 0 &&
    !siblingsExist &&
    !grandchildrenExist
  ) {
    shares.grandfather = residue;
    residue = 0;
  }

  // If grandparents are only heirs (no parents, no children, no siblings, no spouse)
  const onlyGrandparents =
    grandfatherAlive &&
    !fatherAlive &&
    !motherAlive &&
    sons === 0 &&
    daughters === 0 &&
    grandsons === 0 &&
    granddaughters === 0 &&
    brothers === 0 &&
    sisters === 0 &&
    !husbandAlive &&
    wives === 0;

  if (onlyGrandparents) {
    if (maternalGrandmotherAlive && paternalGrandmotherAlive) {
      shares.maternalGrandmother = 1 / 12;
      shares.paternalGrandmother = 1 / 12;
      shares.grandfather = 5 / 6;
    } else if (maternalGrandmotherAlive) {
      shares.maternalGrandmother = 1 / 6;
      shares.grandfather = 5 / 6;
    } else if (paternalGrandmotherAlive) {
      shares.paternalGrandmother = 1 / 6;
      shares.grandfather = 5 / 6;
    } else {
      shares.grandfather = 1;
    }
  }

// =============================
// STEP 7c: COMPREHENSIVE MATERNAL & PATERNAL SIBLINGS LOGIC
// =============================

// =============================
// PATERNAL BROTHERS LOGIC
// =============================

// Paternal brothers are blocked by:
// - Sons (sons block paternal brothers)
// - Grandsons (grandsons block paternal brothers)
// - Father (father blocks paternal brothers)
// - Full brothers (full brothers block paternal brothers)
if (sons > 0 || grandsons > 0 || fatherAlive || brothers > 0) {
  shares.paternalBrothers = 0;
}

// Paternal brothers block:
// - Maternal siblings (maternal brothers and sisters)
// - Uncles (full and paternal)
// - Cousins (full and paternal)
// NOTE: Paternal brothers do NOT block full nephews according to Islamic law
if (paternalBrothers > 0) {
  shares.maternalBrothers = 0;
  shares.maternalSisters = 0;
  shares.fullUncles = 0;
  shares.paternalUncles = 0;
  shares.fullCousins = 0;
  shares.paternalCousins = 0;
}

// =============================
// PATERNAL SISTERS LOGIC
// =============================

// Paternal sisters are blocked by:
// - Sons (sons block paternal sisters)
// - Grandsons (grandsons block paternal sisters)
// - Father (father blocks paternal sisters)
// - Full brothers (full brothers block paternal sisters)
// - Full sisters (full sisters block paternal sisters)
// - Grandfather (grandfather blocks paternal sisters)
if (sons > 0 || grandsons > 0 || fatherAlive || brothers > 0 || sisters > 0 || grandfatherAlive) {
  shares.paternalSisters = 0;
}

// Paternal sisters block:
// - Maternal siblings (maternal brothers and sisters)
// - Uncles (full and paternal)
// - Cousins (full and paternal)
// NOTE: Paternal sisters do NOT block full nephews according to Islamic law
if (paternalSisters > 0) {
  shares.maternalBrothers = 0;
  shares.maternalSisters = 0;
  shares.fullUncles = 0;
  shares.paternalUncles = 0;
  shares.fullCousins = 0;
  shares.paternalCousins = 0;
}

// =============================
// MATERNAL BROTHERS LOGIC
// =============================

// Maternal brothers are blocked by:
// - Sons (sons block maternal brothers)
// - Daughters (daughters block maternal brothers)
// - Father (father blocks maternal brothers)
// - Full brothers (full brothers block maternal brothers)
// - Full sisters (full sisters block maternal brothers)
// - Grandfather (grandfather blocks maternal brothers)
// - Grandsons (grandsons block maternal brothers)
// - Paternal brothers (paternal brothers block maternal brothers)
// - Paternal sisters (paternal sisters block maternal brothers)
if (sons > 0 || daughters > 0 || fatherAlive || brothers > 0 || sisters > 0 || grandfatherAlive || grandsons > 0 || paternalBrothers > 0 || paternalSisters > 0) {
  shares.maternalBrothers = 0;
}

// Maternal brothers block:
// - Cousins (full and paternal)
// NOTE: Maternal siblings do NOT block full nephews according to Islamic law
// Maternal siblings get their fixed share, nephews get the residue
if (maternalBrothers > 0) {
  shares.fullCousins = 0;
  shares.paternalCousins = 0;
}

// =============================
// MATERNAL SISTERS LOGIC
// =============================

// Maternal sisters are blocked by:
// - Sons (sons block maternal sisters)
// - Daughters (daughters block maternal sisters)
// - Father (father blocks maternal sisters)
// - Grandfather (grandfather blocks maternal sisters)
// - Full brothers (full brothers block maternal sisters)
// - Paternal uncles (paternal uncles block maternal sisters)
// - Paternal brothers (paternal brothers block maternal sisters)
// - Paternal sisters (paternal sisters block maternal sisters)
if (sons > 0 || daughters > 0 || fatherAlive || grandfatherAlive || brothers > 0 || paternalUncles > 0 || paternalBrothers > 0 || paternalSisters > 0) {
  shares.maternalSisters = 0;
}

// Maternal sisters block:
// - Cousins (full and paternal)
// NOTE: Maternal siblings do NOT block full nephews according to Islamic law
// Maternal siblings get their fixed share, nephews get the residue
if (maternalSisters > 0) {
  shares.fullCousins = 0;
  shares.paternalCousins = 0;
}

// =============================
// SHARE CALCULATION FOR MATERNAL & PATERNAL SIBLINGS
// =============================

// Check if paternal siblings exist - they have priority over maternal siblings
const paternalSiblingsExist = paternalBrothers > 0 || paternalSisters > 0;
const maternalSiblingsExist = maternalBrothers > 0 || maternalSisters > 0;

// MATERNAL SIBLINGS - Fixed share of 1/6 collectively (only if no paternal siblings, but can inherit alongside full siblings)
if (
  maternalSiblingsExist &&
  !paternalSiblingsExist && // Only if no paternal siblings exist
  !motherAlive &&
  !fatherAlive &&
  sons === 0 &&
  daughters === 0 &&
  grandsons === 0 &&
  granddaughters === 0 &&
  !grandfatherAlive
  // NOTE: Maternal siblings can inherit their fixed share even when full siblings exist
  // The blocking logic is handled separately in the nephews section
) {
  const totalMaternalSiblings = maternalBrothers + maternalSisters;
  const maternalShare = 1 / 6;

  // Distribute 1/6 equally among maternal siblings
  shares.maternalBrothers = (maternalBrothers / totalMaternalSiblings) * maternalShare;
  shares.maternalSisters = (maternalSisters / totalMaternalSiblings) * maternalShare;

  // The remaining 5/6 goes to Baytulmal (public treasury)
  // This will be handled in the final baytulmal calculation
  residue = 1 - maternalShare; // 5/6 remains for baytulmal
}

// PATERNAL SIBLINGS - Residuary heirs (Asaba) with 2:1 ratio (they block maternal siblings)
if (
  paternalSiblingsExist &&
  !fatherAlive &&
  sons === 0 &&
  daughters === 0 &&
  grandsons === 0 &&
  brothers === 0 &&
  sisters === 0 &&
  !grandfatherAlive
) {
  // Calculate total available estate (100% minus any fixed shares already allocated)
  const totalAvailableEstate = 1 - Object.values(shares).reduce((sum, val) => sum + val, 0);
  
  // If paternal siblings are the only heirs, they get the entire estate
  const estateToDistribute = totalAvailableEstate > 0 ? totalAvailableEstate : 1;
  
  const totalPaternalUnits = paternalBrothers * 2 + paternalSisters;
  const unitShare = estateToDistribute / totalPaternalUnits;

  // Paternal brothers get 2 units each, paternal sisters get 1 unit each
  shares.paternalBrothers = 2 * unitShare * paternalBrothers;
  shares.paternalSisters = unitShare * paternalSisters;

  // Ensure maternal siblings are blocked when paternal siblings inherit
  shares.maternalBrothers = 0;
  shares.maternalSisters = 0;

  residue = 0;
}

// GRANDFATHER as asaba only if no father, no son, no grandson, no full/paternal brothers, nephews, uncles
if (
  grandfatherAlive &&
  !fatherAlive &&
  sons === 0 &&
  grandsons === 0 &&
  brothers === 0 &&
  paternalBrothers === 0 &&
  fullNephews === 0 &&
  paternalNephews === 0 &&
  fullUncles === 0 &&
  paternalUncles === 0 &&
  residue > 0
) {
  shares.grandfather += residue;
  residue = 0;
}

// Recalculate fixedTotal and residue one last time after maternal & paternal siblings
fixedTotal = Object.values(shares).reduce((sum, val) => sum + val, 0);
residue = 1 - fixedTotal;
if (residue < 0) residue = 0;




// =============================
// STEP X: UNCLES INHERITANCE (FULL UNCLES & PATERNAL UNCLES)
// =============================

// Variables assumed:
// fullUncles, paternalUncles: number of uncles alive
// fatherAlive: boolean (true if father alive)
// sons, daughters: number of children alive
// grandfatherAlive: boolean
// residue: current residue fraction left for distribution
// shares: object holding shares for each heir (e.g., shares.fullUncles, shares.paternalUncles)

// Initialize shares if undefined
shares.fullUncles = shares.fullUncles || 0;
shares.paternalUncles = shares.paternalUncles || 0;

// BLOCKING CONDITIONS AND INHERITANCE ORDER (ASABA) FOR UNCLES
// Maternal uncles are non-heirs in Sunni fiqh and are always excluded

// Uncles are blocked by any closer agnatic heirs:
const closerAgnatesBlockUncles =
  fatherAlive ||
  grandfatherAlive ||
  sons > 0 ||
  grandsons > 0 ||
  brothers > 0 ||
  paternalBrothers > 0 ||
  fullNephews > 0 ||
  paternalNephews > 0 ||
  sisters > 0 || // sisters treated as closer here per app's earlier rules
  paternalSisters > 0;

if (closerAgnatesBlockUncles) {
  shares.fullUncles = 0;
  shares.paternalUncles = 0;
} else {
  // Full uncles are preferred over paternal uncles
  if (fullUncles > 0 && residue > 0) {
    // Full uncles take the entire residue as residuary heirs
    shares.fullUncles = residue;
    shares.paternalUncles = 0; // blocked by full uncles
    residue = 0;
  } else if (paternalUncles > 0 && residue > 0) {
    // If no full uncles, paternal uncles take the residue
    shares.fullUncles = 0;
    shares.paternalUncles = residue;
    residue = 0;
  } else {
    shares.fullUncles = 0;
    shares.paternalUncles = 0;
  }
}

// OPTIONAL: If you want to finalize shares and residue here, you can add:
// fixedTotal = Object.values(shares).reduce((sum, share) => sum + share, 0);
// residue = 1 - fixedTotal;



// =============================
// STEP 9: COUSINS INHERITANCE (FULL & PATERNAL COUSINS)
// =============================

// Initialize shares if undefined
shares.fullCousins = shares.fullCousins || 0;
shares.paternalCousins = shares.paternalCousins || 0;

// Blocking conditions for cousins inheritance:
// Cousins are blocked if any closer heirs exist:
// - father or grandfather alive
// - sons or daughters or grandsons or granddaughters alive
// - brothers or sisters alive (including paternal siblings handled separately)
// - nephews alive (full or paternal)
// - full uncles or paternal uncles alive
const closerHeirsForCousins =
  fatherAlive ||
  grandfatherAlive ||
  sons > 0 ||
  daughters > 0 ||
  grandsons > 0 ||
  granddaughters > 0 ||
  brothers > 0 ||
  sisters > 0 ||
  fullNephews > 0 ||
  paternalNephews > 0 ||
  fullUncles > 0 ||
  paternalUncles > 0;

// Full cousins inherit if:
// - No closer heirs (above)
// - Residue remains
// - Number of full cousins > 0
if (fullCousins > 0 && !closerHeirsForCousins && residue > 0) {
  shares.fullCousins += residue; // They take the whole residue as residuary heirs
  residue = 0;

  // Block paternal cousins if full cousins inherit
  shares.paternalCousins = 0;
} else {
  shares.fullCousins = 0;
}

// Paternal cousins inherit if:
// - No closer heirs (above)
// - No full cousins alive (full cousins block paternal cousins)
// - Residue remains
// - Number of paternal cousins > 0
if (paternalCousins > 0 && !closerHeirsForCousins && fullCousins === 0 && residue > 0) {
  shares.paternalCousins += residue; // Take whole residue
  residue = 0;
} else {
  shares.paternalCousins = 0;
}


  // =============================
  // STEP 8: FINAL ROUNDING
  // =============================
  const roundedShares = {};
  for (const heir in shares) {
    roundedShares[heir] = Math.round(shares[heir] * 1e6) / 1e6;
  }

  // Add single wife share if wives exist
  if (wives > 0) {
    roundedShares.wivesEach = Math.round((roundedShares.wives / wives) * 1e6) / 1e6;
  }
  // Add single son share if sons exist
  if (sons > 0) {
    roundedShares.sonsEach = Math.round((roundedShares.sons / sons) * 1e6) / 1e6;
  }
  // Add single daughter share if daughters exist
  if (daughters > 0) {
    roundedShares.daughtersEach = Math.round((roundedShares.daughters / daughters) * 1e6) / 1e6;
  }
  // Add single brother share if brothers exist
  if (brothers > 0) {
    roundedShares.brothersEach = Math.round((roundedShares.brothers / brothers) * 1e6) / 1e6;
  }
  // Add single sister share if sisters exist
  if (sisters > 0) {
    roundedShares.sistersEach = Math.round((roundedShares.sisters / sisters) * 1e6) / 1e6;
  }

  // Add per-person shares for nephews
  if (fullNephews > 0 && roundedShares.fullNephews > 0) {
    roundedShares.fullNephewsEach = Math.round((roundedShares.fullNephews / fullNephews) * 1e6) / 1e6;
  }
  if (paternalNephews > 0 && roundedShares.paternalNephews > 0) {
    roundedShares.paternalNephewsEach = Math.round((roundedShares.paternalNephews / paternalNephews) * 1e6) / 1e6;
  }

  // Add per-person shares for uncles
  if (fullUncles > 0 && roundedShares.fullUncles > 0) {
    roundedShares.fullUnclesEach = Math.round((roundedShares.fullUncles / fullUncles) * 1e6) / 1e6;
  }
  if (paternalUncles > 0 && roundedShares.paternalUncles > 0) {
    roundedShares.paternalUnclesEach = Math.round((roundedShares.paternalUncles / paternalUncles) * 1e6) / 1e6;
  }

  // Add per-person shares for cousins
  if (fullCousins > 0 && roundedShares.fullCousins > 0) {
    roundedShares.fullCousinsEach = Math.round((roundedShares.fullCousins / fullCousins) * 1e6) / 1e6;
  }
  if (paternalCousins > 0 && roundedShares.paternalCousins > 0) {
    roundedShares.paternalCousinsEach = Math.round((roundedShares.paternalCousins / paternalCousins) * 1e6) / 1e6;
  }
  // Add single paternal brother share if paternal brothers exist
  if (paternalBrothers > 0) {
    roundedShares.paternalBrothersEach = Math.round((roundedShares.paternalBrothers / paternalBrothers) * 1e6) / 1e6;
  }
  // Add single paternal sister share if paternal sisters exist
  if (paternalSisters > 0) {
    roundedShares.paternalSistersEach = Math.round((roundedShares.paternalSisters / paternalSisters) * 1e6) / 1e6;
  }
  // Add single maternal brother share if maternal brothers exist
  if (maternalBrothers > 0) {
    roundedShares.maternalBrothersEach = Math.round((roundedShares.maternalBrothers / maternalBrothers) * 1e6) / 1e6;
  }
  // Add single maternal sister share if maternal sisters exist
  if (maternalSisters > 0) {
    roundedShares.maternalSistersEach = Math.round((roundedShares.maternalSisters / maternalSisters) * 1e6) / 1e6;
  }
  // Add single grandson share if grandsons exist
  if (grandsons > 0) {
    roundedShares.grandsonsEach = Math.round((roundedShares.grandsons / grandsons) * 1e6) / 1e6;
  }
  // Add single granddaughter share if granddaughters exist
  if (granddaughters > 0) {
    roundedShares.granddaughtersEach = Math.round((roundedShares.granddaughters / granddaughters) * 1e6) / 1e6;
  }
  // Add single grandson share if grandsons exist
  if (grandsons > 0) {
    roundedShares.grandsonsEach = Math.round((roundedShares.grandsons / grandsons) * 1e6) / 1e6;
  }

  // If only spouse is present, rest goes to baytulmal
  const onlyHusband = husbandAlive && wives === 0 && sons === 0 && daughters === 0 && !motherAlive && !fatherAlive && brothers === 0 && sisters === 0 && grandsons === 0 && granddaughters === 0 && !grandfatherAlive && !maternalGrandmotherAlive && !paternalGrandmotherAlive && maternalBrothers === 0 && maternalSisters === 0 && paternalBrothers === 0 && paternalSisters === 0 && fullNephews === 0 && paternalNephews === 0 && fullUncles === 0 && paternalUncles === 0 && fullCousins === 0 && paternalCousins === 0;
  const onlyWife = wives > 0 && !husbandAlive && sons === 0 && daughters === 0 && !motherAlive && !fatherAlive && brothers === 0 && sisters === 0 && grandsons === 0 && granddaughters === 0 && !grandfatherAlive && !maternalGrandmotherAlive && !paternalGrandmotherAlive && maternalBrothers === 0 && maternalSisters === 0 && paternalBrothers === 0 && paternalSisters === 0 && fullNephews === 0 && paternalNephews === 0 && fullUncles === 0 && paternalUncles === 0 && fullCousins === 0 && paternalCousins === 0;
  if (onlyHusband) {
    roundedShares.baytulmal = Math.round((1 - roundedShares.husband) * 1e6) / 1e6;
  }
  if (onlyWife) {
    roundedShares.baytulmal = Math.round((1 - roundedShares.wives) * 1e6) / 1e6;
  }

  // If only mother is present, rest goes to baytulmal
  const onlyMother = motherAlive && !husbandAlive && wives === 0 && sons === 0 && daughters === 0 && brothers === 0 && sisters === 0 && !fatherAlive && grandsons === 0 && granddaughters === 0 && !grandfatherAlive && !maternalGrandmotherAlive && !paternalGrandmotherAlive && maternalBrothers === 0 && maternalSisters === 0 && paternalBrothers === 0 && paternalSisters === 0 && fullNephews === 0 && paternalNephews === 0 && fullUncles === 0 && paternalUncles === 0 && fullCousins === 0 && paternalCousins === 0;
  if (onlyMother) {
    roundedShares.baytulmal = Math.round((1 - roundedShares.mother) * 1e6) / 1e6;
  }

  // If only maternal siblings are present (no other heirs), rest goes to baytulmal
  const onlyMaternalSiblings = !husbandAlive && wives === 0 && sons === 0 && daughters === 0 && !motherAlive && !fatherAlive && brothers === 0 && sisters === 0 && grandsons === 0 && granddaughters === 0 && !grandfatherAlive && !maternalGrandmotherAlive && !paternalGrandmotherAlive && (maternalBrothers > 0 || maternalSisters > 0) && paternalBrothers === 0 && paternalSisters === 0 && paternalNephews === 0 && fullUncles === 0 && paternalUncles === 0 && fullCousins === 0 && paternalCousins === 0;
  if (onlyMaternalSiblings) {
    const maternalSiblingsTotal = (roundedShares.maternalBrothers || 0) + (roundedShares.maternalSisters || 0);
    roundedShares.baytulmal = Math.round((1 - maternalSiblingsTotal) * 1e6) / 1e6;
  }

  // Final safeguard: send any remaining undistributed share to baytulmal
  const distributedTotal = Object.entries(roundedShares)
    .filter(([key]) => key !== 'baytulmal' && !key.endsWith('Each'))
    .reduce((sum, [, val]) => sum + (typeof val === 'number' ? val : 0), 0);
  const remainder = Math.max(0, 1 - distributedTotal);
  if (remainder > 1e-6) {
    roundedShares.baytulmal = Math.round(remainder * 1e6) / 1e6;
  }

  // =============================
  // FULL SISTERS FIXED SHARES
  // =============================
  if (
    sisters > 0 &&
    sons === 0 &&
    daughters === 0 &&
    fatherAlive === false &&
    grandfatherAlive === false &&
    grandsons === 0 &&
    brothers === 0 // no full brothers (asaba case handled elsewhere)
  ) {
    if (sisters === 1) {
      shares.sisters = 1 / 2;
    } else {
      shares.sisters = 2 / 3;
    }
    // Block paternal sisters, uncles, nephews, cousins
    shares.paternalSisters = 0;
    shares.paternalBrothers = 0;
    shares.fullUncles = 0;
    shares.paternalUncles = 0;
    shares.fullNephews = 0;
    shares.paternalNephews = 0;
    shares.fullCousins = 0;
    shares.paternalCousins = 0;
  }
  // Add single sister share if sisters exist
  if (sisters > 0) {
    roundedShares.sistersEach = Math.round((roundedShares.sisters / sisters) * 1e6) / 1e6;
  }

  console.log("Final shares:", roundedShares);
  return roundedShares;

}