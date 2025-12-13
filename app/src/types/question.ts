export type Answer = { 
    id: number;
    description: string
};

export type Question = {
    id: number;
    description: string;
    answers: Answer[]
};

