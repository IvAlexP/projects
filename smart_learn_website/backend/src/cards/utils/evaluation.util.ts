import { distance } from 'fastest-levenshtein';
import { removeStopwords, eng, ron } from 'stopword';
import * as _ from 'lodash';

// FSRS ratings:
// 1: Incorrect answer (no credit)
// 2: Correct answer but too slow (partial credit)
// 3: Correct answer with minor typos or acceptable time (full credit)
// 4: Perfect answer with fast response (full credit + bonus)
export type FSRSRating = 1 | 2 | 3 | 4;

interface EvaluationResult {
  rating: FSRSRating;
  feedback: string;
}

function cleanText(str: string): string {
  return _.deburr(str) // remove accents and diacritics
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'"””]/g, '') // remove punctuation
    .trim();
}

function tokenize(cleanedStr: string): string[] {
  if (!cleanedStr) {
    return [];
  }
  const rawTokens = cleanedStr.split(/\s+/);
  return removeStopwords(rawTokens, [...eng, ...ron]);
}

export function evaluateUserAnswer(
  correctAnswer: string,
  userAnswer: string,
  timeTaken: number,
): EvaluationResult {
  const cleanExpected = cleanText(correctAnswer);
  const cleanActual = cleanText(userAnswer);

  const isPerfectMatch = cleanExpected === cleanActual;
  let isAcceptableTypo = false;

  if (!isPerfectMatch) {
    const expectedTokens = tokenize(cleanExpected);
    let actualTokens = tokenize(cleanActual);

    const originalActualLength = actualTokens.length;

    // fuzzy jaccuard-like matching
    if (expectedTokens.length > 0 && actualTokens.length > 0) {
      let matchCount = 0;

      for (const expWord of expectedTokens) {
        let bestDistance = Infinity;
        let bestMatchIndex = -1;
        
        // find the closest match for the word (fuzzy match)
        for (let i = 0; i < actualTokens.length; i++) {
          const actWord = actualTokens[i];
          const dist = distance(expWord, actWord);
          
          if (dist < bestDistance) {
            bestDistance = dist;
            bestMatchIndex = i;
          }
        }
        
        const allowedWordTypos = Math.floor(expWord.length / 5);
        
        // match found -> count it and remove it so it cannot be matched again
        if (bestDistance <= allowedWordTypos && bestMatchIndex !== -1) {
          matchCount++;
          actualTokens.splice(bestMatchIndex, 1); 
        }
      }

      // jaccard score = matched words (union) / total unique words (reunion)
      const score = matchCount / Math.max(expectedTokens.length, originalActualLength);
      isAcceptableTypo = score >= 0.75;
    }

    // spacebar fallback (handles missing spaces)
    if (!isAcceptableTypo) {
      const spacelessExpected = cleanExpected.replace(/\s+/g, '');
      const spacelessActual = cleanActual.replace(/\s+/g, '');
      
      const spacelessDistance = distance(spacelessExpected, spacelessActual);
      const spacelessAllowedTypos = Math.floor(spacelessExpected.length / 5);
      
      if (spacelessDistance <= spacelessAllowedTypos) {
        isAcceptableTypo = true;
      }
    }
  }

  if (!isPerfectMatch && !isAcceptableTypo) {
    return { rating: 1, feedback: 'Incorrect answer. :(' };
  }

  const typingSpeedPerChar = 0.4;
  const thinkingTime = 2.5;

  const expectedFastTime = thinkingTime + correctAnswer.trim().length * typingSpeedPerChar;
  const expectedNormalTime = expectedFastTime * 2;

  if (isAcceptableTypo) {
    return {
      rating: timeTaken <= expectedNormalTime ? 3 : 2,
      feedback: 'Correct answer with minor typos or missing/swapped words.',
    };
  }

  if (timeTaken <= expectedFastTime) {
    return {
      rating: 4,
      feedback: 'Congrats! Perfect answer with fast response!',
    };
  } else if (timeTaken <= expectedNormalTime) {
    return {
      rating: 3,
      feedback: 'Well-done! Correct answer with acceptable time.',
    };
  } else {
    return { rating: 2, feedback: 'Correct answer but too slow. :(' };
  }
}