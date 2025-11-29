export type Gender = "male" | "female";

export interface ScoreEvent {
    id: string;
    date: string;
    reason: string;
    points: number;
}

export interface Athlete {
    id: string;
    name: string;
    gender: Gender;
    totalPoints: number;
    photoURL?: string;
    scoreHistory: any[];
}
