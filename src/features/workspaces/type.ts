export interface Workspace {
    _id: string;
    name: string;
    image: {
        url: string;
        publicId: string;
    };
    userId: string;
    createdAt: string;
    updatedAt: string;
}