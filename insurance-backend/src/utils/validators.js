/**
 * Validation utilities for insurance claims
 */

exports.validateClaimAmount = (amount, policy) => {
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Claim amount must be a positive number');
  }

  // Optional: Validate against policy coverage limits
  if (policy.coverageLimit && amount > policy.coverageLimit) {
    throw new Error(`Claim amount exceeds policy coverage limit of ${policy.coverageLimit}`);
  }

  return true;
};
