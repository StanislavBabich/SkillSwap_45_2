import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { Request } from './entities/request.entity';
import { UsersModule } from '../users/users.module';
import { SkillsModule } from '../skills/skills.module';

@Module({
  imports: [TypeOrmModule.forFeature([Request]), UsersModule, SkillsModule],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
