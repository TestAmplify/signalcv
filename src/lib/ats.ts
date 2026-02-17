export interface AtsResult {
  score: number;
  passed: boolean;
  issues: string[];
}

export function computeAtsScore(resumeText: string): AtsResult {
  const issues: string[] = [];
  let score = 100;

  // Basic checks (simulated logic based on BUILD.md requirements)
  // Sections: 40%
  // Contact info: 10%
  // Bullet formatting: 20%
  // Quantified achievements: 30%

  // 1. Check for standard sections (simplified check)
  const sections = ['experience', 'education', 'skills', 'summary', 'projects'];
  const missingSections = sections.filter(s => !resumeText.toLowerCase().includes(s));
  if (missingSections.length > 0) {
    score -= (missingSections.length / sections.length) * 40;
    issues.push(`Missing likely sections: ${missingSections.join(', ')}`);
  }

  // 2. Contact info (simplified check for email/phone)
  const emailRegex = /\S+@\S+\.\S+/;
  const phoneRegex = /(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/; // Very basic phone regex
  if (!emailRegex.test(resumeText)) {
    score -= 5;
    issues.push('Missing email address');
  }
  if (!phoneRegex.test(resumeText)) {
    score -= 5;
    issues.push('Missing phone number');
  }

  // 3. Bullet formatting (check for bullet points or list structures)
  const bulletPointCount = (resumeText.match(/•|\*|-/g) || []).length;
  if (bulletPointCount < 5) {
    score -= 20;
    issues.push('Resume lacks bullet points (•, *, -)');
  }

  // 4. Quantified achievements (check for numbers/percentages)
  const numberCount = (resumeText.match(/\d+%|\$\d+|\d+ [a-zA-Z]+/g) || []).length;
  if (numberCount < 3) {
    score -= 30;
    issues.push('Resume lacks quantified achievements (%, $, numbers)');
  }

  // Cap score at 0
  score = Math.max(0, Math.round(score));

  return {
    score,
    passed: score >= 90,
    issues,
  };
}
