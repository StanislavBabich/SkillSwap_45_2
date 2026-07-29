import { User } from '../users/entities/user.entity';
import { Skill } from '../skills/entities/skill.entity';
import { Category } from '../categories/entities/category.entity';
import { UserGender, UserRole } from '../users/user.enums';
import { RequestStatus } from '../requests/request-status.enums';
import { TAppConfig } from '../config/app.config';
import { TJwtConfig } from '../config/jwt.config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateSkillDto } from '../skills/dto/create-skill.dto';
import { GetSkillsDto } from '../skills/dto/get-skills.dto';
import { UpdateSkillDto } from '../skills/dto/update-skill.dto';
import { CreateCategoryDto } from '../categories/dto/create-category.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { CreateRequestDto } from '../requests/dto/create-request.dto';

export const mockAppConfig: TAppConfig = { port: 3000, hashSalt: 10 };
export const mockJwtConfig: TJwtConfig = {
  accessSecret: 'test_access_secret',
  refreshSecret: 'test_refresh_secret',
  accessExpiresIn: '1h',
  refreshExpiresIn: '7d',
};

export const mockUser: User = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashed_password',
  about: 'About me',
  birthdate: '1990-01-01',
  city: 'Moscow',
  gender: UserGender.MALE,
  avatar: 'avatar.png',
  skills: [],
  sentRequests: [],
  receivedRequests: [],
  favoriteSkills: [],
  role: UserRole.USER,
  refreshToken: null,
};

export const mockOtherUser: User = {
  ...mockUser,
  id: 'other-user-456',
  name: 'Other User',
  email: 'other@example.com',
};

export const mockAdmin: User = {
  ...mockUser,
  id: 'admin-789',
  email: 'admin@example.com',
  role: UserRole.ADMIN,
};

export const mockCreateUserDto: CreateUserDto = {
  name: 'New User',
  email: 'new@example.com',
  password: 'new_password',
};
export const mockRegisterDto: RegisterDto = {
  name: 'New User',
  email: 'new@example.com',
  password: 'new_password',
};
export const mockLoginDto: LoginDto = {
  email: 'test@example.com',
  password: 'test_password',
};

export const mockCategory: Category = {
  id: 'cat-123',
  name: 'Programming',
  parent: null,
  children: [],
  skills: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockSubCategory: Category = {
  ...mockCategory,
  id: 'cat-456',
  name: 'Backend',
  parent: mockCategory,
};

export const mockCreateCategoryDto: CreateCategoryDto = {
  name: 'New Category',
  parentId: mockCategory.id,
};

export const mockSkill: Skill = {
  id: 'skill-123',
  title: 'NestJS',
  description: 'Framework',
  images: ['/uploads/image1.png'],
  category: mockCategory,
  owner: mockUser,
  offeredInRequests: [],
  requestedInRequests: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockOtherSkill: Skill = {
  ...mockSkill,
  id: 'skill-456',
  title: 'React',
  description: 'Frontend Framework',
  owner: mockOtherUser,
};

export const mockCreateSkillDto: CreateSkillDto = {
  title: 'New Skill',
  description: 'New Description',
  categoryId: mockCategory.id,
};
export const mockUpdateSkillDto: UpdateSkillDto = {
  title: 'Updated Skill',
  categoryId: mockCategory.id,
};
export const mockGetSkillsDto: GetSkillsDto = {
  page: 1,
  limit: 20,
  search: 'nest',
  category: mockCategory.id,
};

export const mockRequest = {
  id: 'request-123',
  sender: mockUser,
  receiver: mockOtherUser,
  offeredSkill: mockSkill,
  requestedSkill: mockOtherSkill,
  status: RequestStatus.PENDING,
  isRead: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCreateRequestDto: CreateRequestDto = {
  receiverId: mockOtherUser.id,
  offeredSkillId: mockSkill.id,
  requestedSkillId: mockOtherSkill.id,
};

export const mockTokens = {
  accessToken: 'mock_access_token_123',
  refreshToken: 'mock_refresh_token_123',
};
