import { NextResponse } from 'next/server';
import { Question } from '@/types/quiz';

export async function GET() {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=15');

    if (!response.ok) {
      throw new Error('Failed to fetch quiz questions');
    }

    const data = await response.json();

    if (data.response_code !== 0) {
      throw new Error('Invalid response from quiz API');
    }

    // Shuffle choices for each question
    const questions = data.results.map((q: Question, index: number) => {
      const choices = [...q.incorrect_answers, q.correct_answer];
      // Fisher-Yates shuffle algorithm
      for (let i = choices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choices[i], choices[j]] = [choices[j], choices[i]];
      }

      return {
        ...q,
        id: index,
        choices,
      };
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz questions' },
      { status: 500 }
    );
  }
}
