"""
Grammar Error Correction (GEC) Service — Rule-Based Stub
=========================================================
Provides basic Filipino grammar checking using hand-crafted rules.

This is a **placeholder** that will be replaced by GECToR + RoBERTa Tagalog
Large in Milestone 3. The rule-based approach covers common patterns:

1. Repeated/duplicated adjacent words ("ang ang")
2. ng vs nang confusion
3. din/rin allophonic rule (din after vowels → rin)
4. daw/raw allophonic rule (daw after vowels → raw)
5. Missing "ng" linker after adjective + noun patterns

These rules are intentionally conservative to minimize false positives.
"""

import re
import logging
from typing import Optional

from app.schemas.schemas import GrammarCorrectionItem

logger = logging.getLogger(__name__)


class GECService:
    """
    Rule-based Filipino grammar error correction.

    Usage:
        gec = GECService()
        corrections = gec.check("ang ang bata ay kumain")
    """

    def check(self, text: str) -> list[GrammarCorrectionItem]:
        """
        Analyze text for grammar errors.

        Args:
            text: The input text to check.

        Returns:
            List of GrammarCorrectionItem with error positions and suggestions.
        """
        if not text or not text.strip():
            return []

        corrections: list[GrammarCorrectionItem] = []

        # Run each rule checker
        corrections.extend(self._check_repeated_words(text))
        corrections.extend(self._check_din_rin_rule(text))
        corrections.extend(self._check_daw_raw_rule(text))
        corrections.extend(self._check_ng_nang(text))

        # Sort by position and remove overlapping corrections
        corrections.sort(key=lambda c: c.start)
        corrections = self._remove_overlaps(corrections)

        return corrections

    def _check_repeated_words(self, text: str) -> list[GrammarCorrectionItem]:
        """
        Detect consecutively repeated words (e.g., "ang ang" → "ang").
        Excludes intentional reduplications common in Filipino (e.g., "araw-araw").
        """
        items: list[GrammarCorrectionItem] = []
        # Match two identical adjacent words (case-insensitive)
        pattern = re.compile(r'\b(\w+)\s+\1\b', re.IGNORECASE)

        for match in pattern.finditer(text):
            word = match.group(1)
            # Skip intentional reduplications (hyphenated forms are fine)
            if len(word) < 2:
                continue

            items.append(GrammarCorrectionItem(
                original=match.group(),
                correction=word,
                start=match.start(),
                end=match.end(),
                type="grammar",
                rule="repeated_word",
                message=f'Salitang paulit-ulit: "{match.group()}" → "{word}"',
            ))

        return items

    def _check_din_rin_rule(self, text: str) -> list[GrammarCorrectionItem]:
        """
        Filipino allophonic rule: After a word ending in a vowel,
        "din" should become "rin".

        Example: "siya din" → "siya rin"
        """
        items: list[GrammarCorrectionItem] = []
        # Pattern: vowel-ending word + space + "din"
        pattern = re.compile(
            r'([aeiouAEIOU])\s+(din)\b',
            re.IGNORECASE,
        )

        for match in pattern.finditer(text):
            din_word = match.group(2)
            # Preserve original casing
            replacement = "Rin" if din_word[0].isupper() else "rin"
            # The correction covers only the "din" part
            din_start = match.start(2)
            din_end = match.end(2)

            items.append(GrammarCorrectionItem(
                original=din_word,
                correction=replacement,
                start=din_start,
                end=din_end,
                type="grammar",
                rule="din_rin",
                message=f'Pagkatapos ng patinig, gamitin ang "rin" sa halip na "din".',
            ))

        return items

    def _check_daw_raw_rule(self, text: str) -> list[GrammarCorrectionItem]:
        """
        Filipino allophonic rule: After a word ending in a vowel,
        "daw" should become "raw".

        Example: "sabi mo daw" (correct: after consonant)
                 "totoo daw" → "totoo raw"
        """
        items: list[GrammarCorrectionItem] = []
        pattern = re.compile(
            r'([aeiouAEIOU])\s+(daw)\b',
            re.IGNORECASE,
        )

        for match in pattern.finditer(text):
            daw_word = match.group(2)
            replacement = "Raw" if daw_word[0].isupper() else "raw"
            daw_start = match.start(2)
            daw_end = match.end(2)

            items.append(GrammarCorrectionItem(
                original=daw_word,
                correction=replacement,
                start=daw_start,
                end=daw_end,
                type="grammar",
                rule="daw_raw",
                message=f'Pagkatapos ng patinig, gamitin ang "raw" sa halip na "daw".',
            ))

        return items

    def _check_ng_nang(self, text: str) -> list[GrammarCorrectionItem]:
        """
        Check for common ng/nang confusion.

        Basic rule:
        - "nang" is used before verbs/adverbs (nang mabilis, nang dumating)
        - "ng" is a case marker for nouns (ng bata, ng aklat)

        This is a simplified heuristic — the full rule requires POS tagging
        which will come with the RoBERTa model in Milestone 3.
        """
        items: list[GrammarCorrectionItem] = []

        # Detect "nang" before common nouns (likely should be "ng")
        # Common noun indicators after nang that suggest it should be "ng"
        noun_indicators = [
            "bata", "tao", "bahay", "aklat", "pera", "pagkain",
            "tubig", "mesa", "silya", "kotse", "telepono",
        ]

        for noun in noun_indicators:
            pattern = re.compile(
                rf'\bnang\s+({re.escape(noun)})\b',
                re.IGNORECASE,
            )
            for match in pattern.finditer(text):
                items.append(GrammarCorrectionItem(
                    original=f"nang {match.group(1)}",
                    correction=f"ng {match.group(1)}",
                    start=match.start(),
                    end=match.end(),
                    type="grammar",
                    rule="ng_nang",
                    message='Gamitin ang "ng" bilang case marker bago ang pangngalan, hindi "nang".',
                ))

        return items

    @staticmethod
    def _remove_overlaps(
        corrections: list[GrammarCorrectionItem],
    ) -> list[GrammarCorrectionItem]:
        """Remove overlapping corrections, keeping the first one found."""
        if not corrections:
            return corrections

        result: list[GrammarCorrectionItem] = [corrections[0]]
        for c in corrections[1:]:
            last = result[-1]
            if c.start >= last.end:
                result.append(c)
        return result


# ─── Module-level singleton ─────────────────────────────────────────

_gec_service: Optional[GECService] = None


def get_gec_service() -> GECService:
    """Get or create the singleton GEC service instance."""
    global _gec_service
    if _gec_service is None:
        _gec_service = GECService()
        logger.info("GEC service initialized (rule-based stub)")
    return _gec_service
