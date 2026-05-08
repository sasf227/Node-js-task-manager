export const getRoom = (email1: string, email2: string) => {
        return [email1, email2].sort().join("_");
    }