import { useState } from 'react';

export default function Flashcard({ front, back, index }) {
  const [flipped, setFlipped] = useState(false);
  
  const handleFlip = () => {
    setFlipped(!flipped);
  };
  
  // Color variations based on card index
  const getCardColorClass = () => {
    const colors = [
      'bg-blue-500 text-white',
      'bg-purple-500 text-white',
      'bg-green-500 text-white',
      'bg-yellow-500 text-white',
      'bg-red-500 text-white',
    ];
    
    return colors[index % colors.length];
  };
  
  return (
    <div 
      className={`relative w-full h-64 rounded-lg shadow-md cursor-pointer transition-transform duration-500 transform ${
        flipped ? 'rotate-y-180' : ''
      }`}
      onClick={handleFlip}
    >
      {/* Front of card */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center p-6 rounded-lg ${
          flipped ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-300 ease-in-out ${getCardColorClass()}`}
      >
        <div className="text-xs uppercase tracking-wide mb-2">Card {index + 1}</div>
        <div className="text-2xl font-bold text-center">{front}</div>
        <div className="absolute bottom-3 right-3 text-xs opacity-50">Tap to flip</div>
      </div>
      
      {/* Back of card */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center p-6 rounded-lg ${
          flipped ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300 ease-in-out bg-white border border-gray-200`}
      >
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Answer</div>
        <div className="text-lg text-center">{back}</div>
        <div className="absolute bottom-3 right-3 text-xs text-gray-400">Tap to flip back</div>
      </div>
    </div>
  );
}

// Flashcard deck component
export function FlashcardDeck({ cards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  if (!cards || cards.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No flashcards available.</p>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-4">
        <p className="text-center">
          Card {currentIndex + 1} of {cards.length}
        </p>
      </div>
      
      <Flashcard 
        front={cards[currentIndex].front} 
        back={cards[currentIndex].back} 
        index={currentIndex}
      />
      
      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="px-4 py-2 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}