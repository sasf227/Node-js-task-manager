export type Tasks = {
    creator: string;
    users: Array<string>;
    title: string;
    description: string;
    createdAt: Date;
    dueTo: Date;
    milestone: Array<string>;
    creatorEmail: string;
}