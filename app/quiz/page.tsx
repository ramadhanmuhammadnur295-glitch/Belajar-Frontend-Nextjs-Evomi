"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// TODO: Add discount logic here
const quizData = [
    { question: "Parfum manakah yang paling cocok untuk acara formal?", options: ["Purpose Prestige", "Peaceful Calm"], answer: "Purpose Prestige" },
    { question: "Aroma manakah yang memberikan kesan tenang untuk sehari-hari?", options: ["Peaceful Calm", "Rabel Brave"], answer: "Peaceful Calm" },
    { question: "Untuk kamu yang berani tampil beda, aroma apa yang cocok?", options: ["Sweet Shy", "Rabel Brave"], answer: "Rabel Brave" },
    { question: "Parfum mana yang menonjolkan sisi manis namun tetap elegan?", options: ["Sweet Shy", "Purpose Prestige"], answer: "Sweet Shy" },
];

// TODO: Add discount logic here
export default function QuizPage() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (option: string) => {
        if (option === quizData[currentQuestion].answer) setScore(score + 25);

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < quizData.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setShowResult(true);
        }
    };

    // TODO: Add discount logic here
    return (
        <div className="min-h-screen bg-[#FBFBF9] py-20 px-6 flex items-center justify-center">
            {!showResult ? (
                <div className="max-w-xl w-full text-center">
                    <h1 className="text-2xl font-bold uppercase tracking-widest mb-10">Temukan Aroma Evomi Kamu</h1>
                    <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <p className="text-lg mb-8">{quizData[currentQuestion].question}</p>
                        <div className="grid gap-4">
                            {quizData[currentQuestion].options.map((opt) => (
                                <button key={opt} onClick={() => handleAnswer(opt)} className="p-4 border border-stone-300 hover:bg-stone-900 hover:text-white transition-all uppercase text-[12px] tracking-widest">
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            ) : (
                <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4">Quiz Selesai!</h2>
                    <p className="text-xl">Skor Anda: {score} / 100</p>
                    <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 bg-stone-900 text-white uppercase text-[12px] tracking-widest">Ulangi Kuis</button>
                </div>
            )}
        </div>
    );
}