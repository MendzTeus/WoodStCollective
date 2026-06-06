export type DirectBookingRoom = {
  id: string;
  name: string;
  label: string;
};

export const directBookingRooms: DirectBookingRoom[] = [
  { id: 'classic-en-suite', name: 'The Collective 1', label: 'Room 1' },
  { id: 'city-view-studio', name: 'The Collective 2', label: 'Room 2' },
  { id: 'penthouse-suite', name: 'The Collective 3', label: 'Room 3' },
  { id: 'loft-residency', name: 'The Collective 4', label: 'Room 4' },
  { id: 'master-suite', name: 'The Collective 5', label: 'Room 5' },
  { id: 'executive-studio', name: 'The Collective 6', label: 'Room 6' },
];

export const getDirectBookingRoom = (roomId: string) => (
  directBookingRooms.find((room) => room.id === roomId)
);
