export type Chat = {
    id: number;
    emails: [[string], [string]];
    usernames: [[string], [string]];
    status: string;
    room_uuid: string;
}