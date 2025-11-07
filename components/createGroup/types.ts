export type GroupType = 'family' | 'friends' | 'team' | 'other';

export type CreateGroupParams = {
    visible: boolean;
    onClose: () => void;
    onAddMembers: (payload: { type: GroupType; name: string }) => void;
};