export type AssessmentQuestion =
  | {
      id: string;
      type: "mcq";
      prompt: string;
      options: string[];
      answer: string; // correct option
    }
  | {
      id: string;
      type: "text";
      prompt: string;
      placeholder?: string;
      minWords?: number;
    }
  | {
      id: string;
      type: "code";
      prompt: string;
      language?: string;
      starter?: string;
    };

export const getAssessmentForJob = (_slug: string): AssessmentQuestion[] => {
  // Example dynamic set; replace with API-driven fetch when backend is ready
  return [
    {
      id: "q-m-1",
      type: "mcq",
      prompt: "Which hook manages local component state in React?",
      options: ["useRef", "useEffect", "useState", "useLayoutEffect"],
      answer: "useState",
    },
    {
      id: "q-t-1",
      type: "text",
      prompt: "Briefly describe a challenging UI/UX problem you solved.",
      placeholder: "Describe the problem, your approach, and the outcome.",
      minWords: 20,
    },
    {
      id: "q-c-1",
      type: "code",
      prompt:
        "Implement a function that deduplicates an array of numbers while preserving order.",
      language: "ts",
      starter: "function uniq(nums: number[]): number[] {\n  // write your solution\n}\n",
    },
  ];
};
