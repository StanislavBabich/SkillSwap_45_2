export enum NotificationType {
  NEW_REQUEST = 'newRequest',
  REQUEST_ACCEPTED = 'requestAccepted',
  REQUEST_REJECTED = 'requestRejected',
}

export type NotificationUser = {
  id: string;
  name: string;
};

export type NotificationPayload = {
  type: NotificationType;
  skillName: string;
  user: NotificationUser;
};
