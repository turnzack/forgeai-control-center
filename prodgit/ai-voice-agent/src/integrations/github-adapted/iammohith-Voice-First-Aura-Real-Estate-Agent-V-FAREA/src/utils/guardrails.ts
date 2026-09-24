/**
 * @provenance
 * Source Repository: https://github.com/iammohith/Voice-First-Aura-Real-Estate-Agent-V-FAREA
 * Original File: Voice-First-Aura-Real-Estate-Agent-V-FAREA-main/src/utils/guardrails.ts
 * License: MIT
 * Adapted by: ForgeAI Studio Builder for ai-voice-agent
 * Generated: 2026-09-23T13:12:23.864Z
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SAMPLE_PROJECTS } from "../data";

/**
 * Scans output text for currency formatting and verifies that any pricing quoted 
 * is within the RERA-registered pricing ranges for that property project.
 */
export function enforcePriceGuardrail(text: string, projectId?: string): string {
  // If we have a specific target project, fetch its unit configs
  const projectsToCheck = projectId 
    ? SAMPLE_PROJECTS.filter(p => p.id === projectId)
    : SAMPLE_PROJECTS;

  let verifiedText = text;

  // Regular expression to scan for Indian Rupees formats like "1.45 Crores", "₹1.45 Cr", "85 Lakhs", "2.10 Cr"
  // Let's capture numbers followed by Lakh/Crore/Cr
  const priceRegex = /(\d+(?:\.\d+)?)\s*(Crores?|Cr|Lakhs?|L)/gi;

  let match;
  while ((match = priceRegex.exec(text)) !== null) {
    const fullMatchStr = match[0];
    const numericValue = parseFloat(match[1]);
    const unit = match[2].toLowerCase();

    // Calculate approximate numerical value in Rupees
    let absoluteRupees = 0;
    if (unit.startsWith("c")) {
      absoluteRupees = numericValue * 10000000;
    } else if (unit.startsWith("l")) {
      absoluteRupees = numericValue * 100000;
    }

    if (absoluteRupees > 0) {
      // Confirm if this quoted price matches ANY unit config min/max bounds in eligible projects
      let isValidPrice = false;
      
      for (const proj of projectsToCheck) {
        for (const config of proj.unitConfigs) {
          // Allow a small 5% margin for negotiation/tax discussion
          const lowerBound = config.numericPriceMin * 0.95;
          const upperBound = config.numericPriceMax * 1.05;
          
          if (absoluteRupees >= lowerBound && absoluteRupees <= upperBound) {
            isValidPrice = true;
            break;
          }
        }
        if (isValidPrice) break;
      }

      // If price quoted falls outside the official pre-approved limits, rewrite it
      if (!isValidPrice) {
        console.warn(`🚨 Guardrail Triggered: Quoted price "${fullMatchStr}" (${absoluteRupees} INR) is outside legal limits.`);
        verifiedText = verifiedText.replace(
          fullMatchStr,
          "an amount subject to final configuration. Please refer to the official, RERA-certified price list for precise quotes"
        );
      }
    }
  }

  return verifiedText;
}

/**
 * Scrubs any personal 10-digit phone number leaks to protect client privacy compliance.
 */
export function sanitizePrivacyPII(text: string): string {
  // Matches typical 10 digit numbers, with or without +91 / country tags
  const phoneRegex = /(?:\+91[\-\s]?)?[789]\d{9}\b/g;
  return text.replace(phoneRegex, "[PHONE NUMBER SCRUBBED FOR PRIVACY]");
}

/**
 * Checks if properties are mentioned and highlights/injects mandatory RERA disclaimer and numbers.
 */
export function injectReraDisclaimer(text: string, projectId?: string): { finalResponse: string; disclaimerHappened: boolean } {
  let finalResponse = text;
  let disclaimerHappened = false;

  const projectsToVerify = projectId 
    ? SAMPLE_PROJECTS.filter(p => p.id === projectId)
    : SAMPLE_PROJECTS;

  for (const proj of projectsToVerify) {
    // If response contains project name but NOT its RERA ID, append it
    const nameNorm = proj.name.toLowerCase();
    const txtNorm = text.toLowerCase();
    
    if (txtNorm.includes(nameNorm) && !txtNorm.includes(proj.reraId.toLowerCase())) {
      // Append RERA registration endorsement phrase at punctuation boundary
      finalResponse = finalResponse.trim();
      
      const reraAnnex = ` (RERA Reg: ${proj.reraId})`;
      
      // Try to inject before the final period, or simply append
      if (finalResponse.endsWith(".")) {
        finalResponse = finalResponse.slice(0, -1) + reraAnnex + ".";
      } else {
        finalResponse += reraAnnex;
      }
      
      disclaimerHappened = true;
    }
  }

  return { finalResponse, disclaimerHappened };
}

/**
 * Scrubs any spilled self-evaluation checklist lines that might accidentally bypass the system prompt guidelines.
 */
export function scrubSelfEvaluationArtifacts(text: string): string {
  let cleaned = text;
  
  // Replace inline occurrences where checklist items are concatenated side-by-side or written continuously
  cleaned = cleaned.replace(/(?:3-6 sentences\?|no long numbers\?)\s*(?:yes|no)[^*]*\*\s*no long numbers\?\s*(?:yes|no)[^\n]*/gi, "");
  cleaned = cleaned.replace(/(?:3-6 sentences\?|no long numbers\?)\s*(?:yes|no)\s*(?:\([^)]*\))?,?/gi, "");
  cleaned = cleaned.replace(/\s*\*?\s*(?:yes|no)\s*\([^)]*Crores[^)]*\)/gi, "");
  cleaned = cleaned.replace(/(?:3-6 sentences\?|no long numbers\?)/gi, "");

  // Strip lines that match common rule verification pattern leaks
  const lines = cleaned.split("\n");
  const filteredLines = lines.filter(line => {
    const lower = line.toLowerCase().trim();
    // check typical leakage questions/answers
    if (lower.includes("sentences?") && (lower.includes("yes") || lower.includes("no"))) return false;
    if (lower.includes("numbers?") && (lower.includes("yes") || lower.includes("no"))) return false;
    if (lower.startsWith("*") && (lower.includes("yes") || lower.includes("no")) && (lower.includes("sentences") || lower.includes("numbers"))) return false;
    if (lower.includes("rule check:") || lower.includes("compliance check:")) return false;
    return true;
  });

  cleaned = filteredLines.join("\n").trim();
  
  // Clean up any double empty line gaps created
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  
  return cleaned;
}

/**
 * Scans output text for any HTTP/HTTPS links and validates them against pre-approved RERA assets.
 * Rewrites or removes hallucinated links to prevent misinformation.
 */
export function enforceLinkGuardrail(text: string, projectId?: string): string {
  const APPROVED_LINKS = new Set([
    "https://signature-estates.ai/docs/prestige-solitaire-brochure.pdf",
    "https://signature-estates.ai/docs/dlf-horizon-brochure.pdf",
    "https://signature-estates.ai/docs/lodha-splendora-marina-brochure.pdf",
    "https://signature-estates.ai/docs/my-home-legend-brochure.pdf",
    "https://signature-estates.ai/docs/rera-official-brochure.pdf",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000"
  ]);

  let verifiedText = text;

  // Regex to extract any HTTP/HTTPS links
  const urlRegex = /https?:\/\/[^\s)\"']+/gi;
  
  // We can track matches and replace them with correct mappings if they are not approved
  const matches = [...verifiedText.matchAll(urlRegex)];
  
  for (const match of matches) {
    const rawUrl = match[0];
    
    // Clean trailing punctuation that might be captured by regex
    let cleanUrl = rawUrl;
    while (cleanUrl.endsWith(".") || cleanUrl.endsWith(",") || cleanUrl.endsWith(")") || cleanUrl.endsWith("?")) {
      cleanUrl = cleanUrl.slice(0, -1);
    }

    if (!APPROVED_LINKS.has(cleanUrl)) {
      // It's a hallucinated/incorrect link! Let's align or rewrite it.
      const lower = cleanUrl.toLowerCase();
      
      let correctedUrl = "https://signature-estates.ai/docs/rera-official-brochure.pdf"; // safe fallback
      
      if (lower.includes("solitaire") || lower.includes("prestige")) {
        correctedUrl = "https://signature-estates.ai/docs/prestige-solitaire-brochure.pdf";
      } else if (lower.includes("horizon") || lower.includes("dlf")) {
        correctedUrl = "https://signature-estates.ai/docs/dlf-horizon-brochure.pdf";
      } else if (lower.includes("marina") || lower.includes("splendora") || lower.includes("lodha")) {
        correctedUrl = "https://signature-estates.ai/docs/lodha-splendora-marina-brochure.pdf";
      } else if (lower.includes("legend") || lower.includes("myhome") || lower.includes("my-home") || lower.includes("my home")) {
        correctedUrl = "https://signature-estates.ai/docs/my-home-legend-brochure.pdf";
      } else if (projectId) {
        // Correct based on current active workspace context
        if (projectId === "prestige-solitaire") correctedUrl = "https://signature-estates.ai/docs/prestige-solitaire-brochure.pdf";
        else if (projectId === "dlf-horizon") correctedUrl = "https://signature-estates.ai/docs/dlf-horizon-brochure.pdf";
        else if (projectId === "lodha-marina") correctedUrl = "https://signature-estates.ai/docs/lodha-splendora-marina-brochure.pdf";
        else if (projectId === "myhome-legend") correctedUrl = "https://signature-estates.ai/docs/my-home-legend-brochure.pdf";
      }

      console.warn(`🚨 Guardrail Injected: Rewriting hallucinated URL "${cleanUrl}" to "${correctedUrl}"`);
      verifiedText = verifiedText.replace(rawUrl, correctedUrl);
    }
  }

  return verifiedText;
}

/**
 * Standard client-side composite guardrail executor.
 */
export function auditPreSalesOutput(text: string, projectId?: string): string {
  let result = text;
  result = scrubSelfEvaluationArtifacts(result);
  result = enforcePriceGuardrail(result, projectId);
  result = enforceLinkGuardrail(result, projectId);
  result = sanitizePrivacyPII(result);
  const reraResult = injectReraDisclaimer(result, projectId);
  return reraResult.finalResponse;
}
