// src/api/problems/code_submit.ts

const API_URL = import.meta.env.VITE_BASE_API_URL;

interface SubmitResponse {
  success: boolean;
  message?: string;
  result?: any; // backenddan keladigan natija turi
}

export async function submit(
  problem_slug: string,
  language_name: string,
  code: string,
  user_input: string
): Promise<SubmitResponse | null> {
  try {
    const response = await fetch(`${API_URL}/api/problems/${problem_slug}/submit`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        language_name,
        code,
        user_input,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data as SubmitResponse;

  } catch (error) {
    console.error("Submit error:", error);
    return null;
  }
}
