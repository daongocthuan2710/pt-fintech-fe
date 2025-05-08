'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function QuestionsPage() {
  const { data: session, status } = useSession();
  const [questions, setQuestions] = useState([]);
  console.log({ questions });
  useEffect(() => {
    if (status === 'authenticated') {
      void fetch('/api/questions')
        .then((res) => res.json())
        .then(setQuestions);
    }
  }, [status]);

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <div>
      <h1>Your Questions</h1>
      {questions.map((q: any) => (
        <div key={q.id}>
          <p>
            {q.content} ({q.type})
          </p>
          {q.options?.map((opt: any) => (
            <li key={opt.id}>{opt.value}</li>
          ))}
        </div>
      ))}
    </div>
  );
}
