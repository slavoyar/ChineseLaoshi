export const getUuid = (id: number) => `00000000-0000-0000-0000-${id.toString().padStart(12, '0')}`;
