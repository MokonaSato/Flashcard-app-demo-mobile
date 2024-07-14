import SubjectListPage from './pages/SubjectListPage'
import FlashcardPage from './pages/FlashcardsPage/main';
import AllQuestionsPage from './pages/AllQuestionsPage/main';
import TestListPage from './pages/TestListPage';
import TestRankingPage from './pages/TestRankingPage';
import TagListPage from './pages/TagListPage';
import WordEditForm from './pages/FlashcardsPage/WordEditForm'
import './App.css'
import { Routes, Route } from "react-router-dom";

function App() {
  const fetchSubjects = localStorage.getItem('subjects')
  if (!fetchSubjects){
    const initialSubjects = [
      {
        "id": 1,
        "name": "英語"
      },
      {
        "id": 2,
        "name": "数学"
      },
      {
        "id": 3,
        "name": "理科"
      }
    ]
    localStorage.setItem('subjects', JSON.stringify(initialSubjects))
  }
  const fetchWords = localStorage.getItem('words')
  if (!fetchWords){
    const initialWords = [
      {
        "id": 1,
        "subjectId": 1,
        "word": "Apple",
        "meaning": "<p>りんご</p><p><strong>果物の一種</strong></p>",
        "tagIds": [
          1,
          2
        ],
        "isMarked": false,
        "createdAt": "2023-05-01T10:00:00Z"
      },
      {
        "id": 2,
        "subjectId": 1,
        "word": "Book",
        "meaning": "<p>本</p><p><em>情報を記録するための媒体</em></p>",
        "tagIds": [
          1
        ],
        "isMarked": true,
        "createdAt": "2023-05-02T11:30:00Z"
      },
      {
        "id": 3,
        "subjectId": 1,
        "word": "Cat",
        "meaning": "<p>猫</p><p><u>ネコ科の動物</u></p>",
        "tagIds": [
          3
        ],
        "isMarked": false,
        "createdAt": "2023-05-03T09:15:00Z"
      }
    ]
    localStorage.setItem('words', JSON.stringify(initialWords))
  }

  const fetchTags = localStorage.getItem('tags')
  if (!fetchTags){
    const initialTags = [
      {
        "id": 1,
        "name": "名詞"
      },
      {
        "id": 2,
        "name": "食べ物"
      },
      {
        "id": 3,
        "name": "動物"
      }
    ]
    localStorage.setItem('tags', JSON.stringify(initialTags))
  }
  
  const fetchTestSets = localStorage.getItem('testSets')
  if (!fetchTestSets){
    const initialTestSets = [
      {
        "id": 1,
        "name": "基礎英単語テスト",
        "subjectId": 1,
        "questions": [
          {
            "id": 1,
            "question": "「りんご」の英語は？",
            "choices": [
              "Apple",
              "Banana",
              "Orange",
              "Grape"
            ],
            "correctAnswer": "Apple"
          },
          {
            "id": 2,
            "question": "「犬」の英語は？",
            "choices": [
              "Cat",
              "Dog",
              "Bird",
              "Fish"
            ],
            "correctAnswer": "Dog"
          },
          {
            "id": 3,
            "question": "「本」の英語は？",
            "choices": [
              "Pen",
              "Pencil",
              "Book",
              "Notebook"
            ],
            "correctAnswer": "Book"
          }
        ]
      },
      {
        "id": 2,
        "name": "中級英単語テスト",
        "subjectId": 1,
        "questions": [
          {
            "id": 1,
            "question": "「勤勉な」の英語は？",
            "choices": [
              "Diligent",
              "Lazy",
              "Careless",
              "Reckless"
            ],
            "correctAnswer": "Diligent"
          },
          {
            "id": 2,
            "question": "「曖昧な」の英語は？",
            "choices": [
              "Clear",
              "Ambiguous",
              "Precise",
              "Exact"
            ],
            "correctAnswer": "Ambiguous"
          },
          {
            "id": 3,
            "question": "「遺産」の英語は？",
            "choices": [
              "Legacy",
              "Inheritance",
              "Heritage",
              "All of the above"
            ],
            "correctAnswer": "All of the above"
          }
        ]
      },
      {
        "id": 3,
        "name": "基礎数学テスト",
        "subjectId": 2,
        "questions": [
          {
            "id": 1,
            "question": "2 + 3 × 4 = ?",
            "choices": [
              "14",
              "20",
              "24",
              "None of the above"
            ],
            "correctAnswer": "14"
          },
          {
            "id": 2,
            "question": "√16 = ?",
            "choices": [
              "2",
              "4",
              "8",
              "16"
            ],
            "correctAnswer": "4"
          },
          {
            "id": 3,
            "question": "3の2乗は？",
            "choices": [
              "6",
              "8",
              "9",
              "12"
            ],
            "correctAnswer": "9"
          }
        ]
      }
    ]
    localStorage.setItem('testSets', JSON.stringify(initialTestSets))
  }

  const fetchTestResults = localStorage.getItem('testResults')
  if (!fetchTestResults) {
    const initialTestResults = [
      {
        "id": 1,
        "testSetId": 1,
        "subjectId": 1,
        "correctAnswers": 2,
        "totalQuestions": 3,
        "date": "2024-07-08T12:50:05.004Z",
        "answerHistory": [
          {
            "questionId": 1,
            "userAnswer": "Apple",
            "isCorrect": true
          },
          {
            "questionId": 2,
            "userAnswer": "Fish",
            "isCorrect": false
          },
          {
            "questionId": 3,
            "userAnswer": "Book",
            "isCorrect": true
          }
        ]
      },
      {
        "id": 2,
        "testSetId": 1,
        "subjectId": 1,
        "correctAnswers": 1,
        "totalQuestions": 3,
        "date": "2024-07-08T13:10:28.715Z",
        "answerHistory": [
          {
            "questionId": 1,
            "userAnswer": "Apple",
            "isCorrect": true
          },
          {
            "questionId": 2,
            "userAnswer": "Bird",
            "isCorrect": false
          },
          {
            "questionId": 3,
            "userAnswer": "Notebook",
            "isCorrect": false
          }
        ]
      },
      {
        "id": 3,
        "testSetId": 1,
        "subjectId": 1,
        "correctAnswers": 1,
        "totalQuestions": 3,
        "date": "2024-07-08T13:21:41.239Z",
        "answerHistory": [
          {
            "questionId": 1,
            "userAnswer": "Apple",
            "isCorrect": true
          },
          {
            "questionId": 2,
            "userAnswer": "Bird",
            "isCorrect": false
          },
          {
            "questionId": 3,
            "userAnswer": "NoteBook",
            "isCorrect": false
          }
        ]
      },
      {
        "id": 4,
        "testSetId": 1,
        "subjectId": 1,
        "correctAnswers": 2,
        "totalQuestions": 3,
        "date": "2024-07-08T14:06:48.881Z",
        "answerHistory": [
          {
            "questionId": 1,
            "userAnswer": "Apple",
            "isCorrect": true
          },
          {
            "questionId": 2,
            "userAnswer": "Dog",
            "isCorrect": true
          },
          {
            "questionId": 3,
            "userAnswer": "Notebook",
            "isCorrect": false
          }
        ]
      },
      {
        "id": 5,
        "testSetId": 1,
        "subjectId": 1,
        "correctAnswers": 2,
        "totalQuestions": 3,
        "date": "2024-07-10T15:06:38.054Z",
        "answerHistory": [
          {
            "questionId": 1,
            "userAnswer": "Apple",
            "isCorrect": true
          },
          {
            "questionId": 2,
            "userAnswer": "Dog",
            "isCorrect": true
          },
          {
            "questionId": 3,
            "userAnswer": "Notebook",
            "isCorrect": false
          }
        ]
      }
    ]
    localStorage.setItem('testResults', JSON.stringify(initialTestResults))
  }
  

  return (
    <div className='bg-gray-100'>
      <Routes>
        <Route path="/" element={<SubjectListPage/>}/>
        <Route path="/flashcard/:subjectId" element={<FlashcardPage/>}/>
        <Route path="/flashcard/:subjectId/edit/:wordId" element={<WordEditForm/>}/>
        <Route path="/flashcard/:subjectId/new" element={<WordEditForm/>}/>
        <Route path="/tag" element={<TagListPage/>}/>
        <Route path="/testlist/:subjectId" element={<TestListPage/>}/>
        <Route path="/testlist/:subjectId/all-questions/:testId" element={<AllQuestionsPage/>}/>
        <Route path="/testlist/:subjectId/ranking/:testId" element={<TestRankingPage/>}/>
      </Routes>
    </div>
  )
}

export default App
