export interface SeedCreateAdmin {
  name: string;
  email: string;
  password: string;
}

export const getAdminData = (): SeedCreateAdmin => ({
  name: process.env.ADMIN_NAME || 'SkillSwap Administrator',
  email: process.env.ADMIN_EMAIL || 'admin@skillswap.local',
  password: process.env.ADMIN_PASSWORD || 'Admin12345',
});
