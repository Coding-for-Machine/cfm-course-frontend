import React, { useState } from 'react';
import { Check, X, Loader } from 'lucide-react';
import { type Question } from '../../types/question';
import { SubmitQuestion } from '../../api/question/result';

export type QuestionAppProps = {
  questions?: Question[];
};

export default function QuestionApp({ questions = [] }: QuestionAppProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [checked, setChecked] = useState<{ [key: number]: boolean }>({});
  const [results, setResults] = useState<{ [key: number]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const question = questions[currentIndex];
  const total = questions.length;

  // tanlangan answer
  const selected = selectedAnswers[question.id];
  const isAnswered = checked[question.id];
  const isCorrect = results[question.id] ?? null;

  // Answer tanlash
  const handleSelect = (ansId: number) => {
    if (isAnswered) return;
    setSelectedAnswers({ ...selectedAnswers, [question.id]: ansId });
  };

  // Javobni tekshirish (API ga jonatish)
  const checkAnswer = async () => {
    if (!selected) return;

    setIsSubmitting(true);

    const res = await SubmitQuestion({
      question_id: question.id,
      answer_id: selected,
    });

    setIsSubmitting(false);

    if (!res) {
      console.error("API error");
      return;
    }

    setResults(prev => ({ ...prev, [question.id]: res.is_correct }));
    setChecked(prev => ({ ...prev, [question.id]: true }));
  };

  return (
    <div className="min-h-screen bg-blue-50 p-3 text-sm">
      <div className="max-w-xl mx-auto">

        {/* Savol */}
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="bg-blue-500 text-white p-2 text-xs">
            Savol {currentIndex + 1} / {total}
          </div>

          <div className="p-3 space-y-2">
            <div className="font-semibold">{question.description}</div>

            {/* Variantlar */}
            {question.answers.map((a) => {
              const isSelected = selected === a.id;
              const show = isAnswered && isSelected;

              let color = "border-gray-200";

              if (show) {
                if (isCorrect === true) color = "border-green-500 bg-green-50";
                if (isCorrect === false) color = "border-red-500 bg-red-50";
              } else if (isSelected) {
                color = "border-blue-500 bg-blue-50";
              }

              return (
                <button
                  key={a.id}
                  disabled={isAnswered}
                  onClick={() => handleSelect(a.id)}
                  className={`w-full p-2 rounded border text-left text-xs transition ${color}`}
                >
                  <div className="flex justify-between items-center">
                    {a.description}

                    {show && isCorrect !== null && (
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                        isCorrect ? "bg-green-500" : "bg-red-500"
                      }`}>
                        {isCorrect ? <Check size={12}/> : <X size={12}/>}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Tugmalar */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCurrentIndex(i => i - 1)}
                disabled={currentIndex === 0}
                className="flex-1 border p-1 rounded text-xs"
              >
                Orqaga
              </button>

              {!isAnswered ? (
                <button
                  onClick={checkAnswer}
                  disabled={!selected || isSubmitting}
                  className="flex-1 bg-blue-500 text-white p-1 rounded text-xs flex items-center justify-center gap-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={12} className="animate-spin"/> Tekshirilmoqda...
                    </>
                  ) : "Tekshirish"}
                </button>
              ) : currentIndex < total - 1 ? (
                <button
                  onClick={() => setCurrentIndex(i => i + 1)}
                  className="flex-1 bg-green-500 text-white p-1 rounded text-xs"
                >
                  Keyingisi →
                </button>
              ) : null}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
