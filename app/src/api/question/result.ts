// src/api/question/result.ts

type Data = {
  question_id: number;
  answer_id: number;
};

type Result = {
  is_correct: boolean;
};

export async function SubmitQuestion(data: Data): Promise<Result | null> {
  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_BASE_API_URL

  try {
    const response = await fetch(`${API}/api/quiz/question/answer`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data)
    });

    if (response.status !== 201 && response.status !== 200) {
      console.error("Server error: quiz submission failed");
      return null;
    }

    const result: Result = await response.json();
    return result;

  } catch (error) {
    console.error("Network or server error:", error);
    return null;
  }
}
