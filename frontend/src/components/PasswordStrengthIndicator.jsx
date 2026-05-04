import React, { useMemo } from 'react';

const RULES = [
  { key: 'length',    label: '8+ characters',    test: (p) => p.length >= 8 },
  { key: 'uppercase', label: 'Uppercase letter',  test: (p) => /[A-Z]/.test(p) },
  { key: 'lowercase', label: 'Lowercase letter',  test: (p) => /[a-z]/.test(p) },
  { key: 'digit',     label: 'Number (0-9)',       test: (p) => /[0-9]/.test(p) },
  { key: 'special',   label: 'Special character',  test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function PasswordStrengthIndicator({ password }) {
  const results = useMemo(() => RULES.map((r) => ({ ...r, passed: r.test(password) })), [password]);
  const passedCount = results.filter((r) => r.passed).length;

  let strength = 'weak';
  if (passedCount === 5) strength = 'strong';
  else if (passedCount >= 3) strength = 'medium';

  const labels = { weak: 'Weak', medium: 'Medium', strong: 'Strong' };

  return (
    <div className="strength-wrapper">
      <div className="strength-bar">
        <div className={`strength-bar-fill ${strength}`} />
      </div>
      <span className={`strength-label ${strength}`}>
        Password strength: {labels[strength]}
      </span>
      <ul className="strength-rules">
        {results.map((r) => (
          <li key={r.key} className={r.passed ? 'passed' : ''}>
            {r.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
