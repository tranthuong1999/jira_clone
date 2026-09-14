export type Project = {
    $id: string;
    name: string;
    imageUrl: string;
    workspaceId: string;
    $createdAt?: string;
};

export type ProjectList = {
    total: number;
    documents: Project[];
};

export type ProjectAnalytics = {
    taskCount: number;
    taskDifference: number;
    assignedTaskCount: number;
    assignedTaskDifference: number;
    completedTaskCount: number;
    completedTaskDifference: number;
    incompleteTaskCount: number;
    incompleteTaskDifference: number;
    overdueTaskCount: number;
    overdueTaskDifference: number;
};
