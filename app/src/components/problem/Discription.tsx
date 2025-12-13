// ================= TYPES =================
type Example = {
  id: number;
  input_txt: string;
  output_txt: string;
  explanation?: string;
};

type Hint = {
  id: number;
  text: string;
};

type Challenge = {
  id: number;
  text: string;
};

type DescriptionProps = {
  title: string;
  description?: string;
  difficulty?: number;
  points?: number;
  constraints?: string;
  category?: string;
  tags?: string[];
  examples?: Example[];
  hints?: Hint[];
  challenges?: Challenge[];
  is_completed?: boolean;
};

// ================= COMPONENT =================
export default function Description({
  title,
  description = "",
  difficulty = 0,
  points = 0,
  constraints = "",
  category = "",
  tags = [],
  examples = [],
  hints = [],
  challenges = [],
  is_completed = false
}: DescriptionProps) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded shadow">
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && <p className="text-gray-700 whitespace-pre-line">{description}</p>}
      <p>Difficulty: {difficulty}</p>
      <p>Points: {points}</p>
      {constraints && <div dangerouslySetInnerHTML={{ __html: constraints }} />}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{tag}</span>
          ))}
        </div>
      )}
      {examples.length > 0 && (
        <div>
          <h2 className="font-semibold">Examples</h2>
          {examples.map(ex => (
            <div key={ex.id} className="bg-white p-2 rounded border my-2">
              <pre><strong>Input:</strong> {ex.input_txt}</pre>
              <pre><strong>Output:</strong> {ex.output_txt}</pre>
              {ex.explanation && <p>{ex.explanation}</p>}
            </div>
          ))}
        </div>
      )}
      {hints.length > 0 && (
        <div>
          <h2 className="font-semibold">Hints</h2>
          <ul className="list-disc list-inside">
            {hints.map(h => <li key={h.id}>{h.text}</li>)}
          </ul>
        </div>
      )}
      {challenges.length > 0 && (
        <div>
          <h2 className="font-semibold">Challenges</h2>
          <ul className="list-disc list-inside">
            {challenges.map(c => <li key={c.id}>{c.text}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

// ================= MOCK DATA =================
export const mockDescription: DescriptionProps = {
  title: "Python Sum Example",
  description: "Bu yerda Python funksiyasining oddiy misoli berilgan.",
  difficulty: 1,
  points: 100,
  constraints: "<ul><li><code>2 ≤ nums.length ≤ 10<sup>4</sup></code></li></ul>",
  category: "python",
  tags: ["py", "beginner"],
  examples: [
    {
      id: 1,
      input_txt: "20 50",
      output_txt: "70",
      explanation: "20 + 50 = 70"
    },
    {
      id: 2,
      input_txt: "5 15",
      output_txt: "20"
    }
  ],
  hints: [
    { id: 1, text: "Qiymatlarni qo‘shishni unutmang" }
  ],
  challenges: [
    { id: 1, text: "10 ta test case qo‘shing" }
  ],
  is_completed: false
};

{/* ------------------------------------------ */}
        //   <h2 className="text-2xl font-bold mb-4">{problem.title}</h2>
        //   <p className="mb-4">{problem.description}</p>
        //   <div className="bg-white p-4 rounded border mb-4">
        //     <pre className="whitespace-pre-wrap text-sm">{problem.example}</pre>
        //   </div>
        //     <HLSVideoPlayer 
        //       src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        //       poster="https://zweck.io/wp-content/uploads/2020/05/HLS-1.jpg"
              
        //     />
        //       <SimpleAudioMessage 
        //       src="https://github.com/SergLam/Audio-Sample-files/raw/master/sample.mp3"
        //       duration={120}
        // />
        //   <div className="flex justify-start">
        //     <VoiceMessagePlayer
        //       src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        //       duration={45}
        //       onPlay={() => handlePlay('Voice message')}
        //     />
        //   </div>
          

        //   {/* Musiqa */}
        //   <div className="flex justify-center">
        //     <MusicPlayer
        //       src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
        //       title="Beautiful Song"
        //       artist="Amazing Artist"
        //       duration={234}
        //       size={5242880}
        //       showDownload={true}
        //       onPlay={() => handlePlay('Music')}
        //     />
        //   </div>

        //   {/* Podcast */}
        //   <div className="flex justify-end">
        //     <PodcastPlayer
        //       src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
        //       title="Tech Podcast #123"
        //       artist="Tech Talks"
        //       duration={3600}
        //       onPlay={() => handlePlay('Podcast')}
        //     />
        //   </div>

        //     {/* Oddiy audio */}
        //     <div className="flex justify-start">
        //       <SimpleAudioMessage
        //         src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
        //         duration={120}
        //       />
        //     </div>