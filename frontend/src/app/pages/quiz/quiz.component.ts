import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../../services/quiz.service';
import { Quiz } from '../../models/quiz.model';

@Component({
    selector: 'app-quiz',
    imports: [CommonModule, FormsModule],
    templateUrl: './quiz.component.html',
    styleUrl: './quiz.component.scss'
})
export class QuizComponent implements OnInit {
  private quizService = inject(QuizService);

  // Setup
  topics = signal<string[]>([]);
  selectedDifficulty = signal<string>('');
  selectedTopic = signal<string>('');
  questionCount = signal(10);

  // Quiz state
  questions = signal<Quiz[]>([]);
  currentIndex = signal(0);
  score = signal(0);
  answers = signal<(number | null)[]>([]);
  selectedAnswer = signal<number | null>(null);
  showExplanation = signal(false);
  quizStarted = signal(false);
  quizComplete = signal(false);
  loading = signal(false);

  difficulties = ['Easy', 'Medium', 'Hard'];

  ngOnInit(): void {
    this.quizService.getTopics().subscribe((topics) => this.topics.set(topics));
  }

  startQuiz(): void {
    this.loading.set(true);
    const diff = this.selectedDifficulty() || undefined;
    const topic = this.selectedTopic() || undefined;

    this.quizService.getQuizzes(diff, topic, this.questionCount()).subscribe({
      next: (quizzes) => {
        this.questions.set(quizzes);
        this.answers.set(new Array(quizzes.length).fill(null));
        this.currentIndex.set(0);
        this.score.set(0);
        this.quizStarted.set(true);
        this.quizComplete.set(false);
        this.selectedAnswer.set(null);
        this.showExplanation.set(false);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  selectOption(index: number): void {
    if (this.showExplanation()) return;

    this.selectedAnswer.set(index);
    this.showExplanation.set(true);

    const currentQ = this.questions()[this.currentIndex()];
    const answersArr = this.answers();
    answersArr[this.currentIndex()] = index;
    this.answers.set([...answersArr]);

    if (index === currentQ.correctAnswer) {
      this.score.update((s) => s + 1);
    }
  }

  nextQuestion(): void {
    if (this.currentIndex() < this.questions().length - 1) {
      this.currentIndex.update((i) => i + 1);
      this.selectedAnswer.set(null);
      this.showExplanation.set(false);
    } else {
      this.quizComplete.set(true);
    }
  }

  getProgress(): number {
    return ((this.currentIndex() + 1) / this.questions().length) * 100;
  }

  getScorePercentage(): number {
    return Math.round((this.score() / this.questions().length) * 100);
  }

  getScoreMessage(): string {
    const pct = this.getScorePercentage();
    if (pct === 100) return 'Perfect Score! 🎉';
    if (pct >= 80) return 'Excellent! 🌟';
    if (pct >= 60) return 'Good job! 👍';
    if (pct >= 40) return 'Keep practicing! 📚';
    return 'Time to study! 💪';
  }

  isCorrect(optionIndex: number): boolean {
    return optionIndex === this.questions()[this.currentIndex()].correctAnswer;
  }

  restartQuiz(): void {
    this.quizStarted.set(false);
    this.quizComplete.set(false);
    this.questions.set([]);
  }
}
