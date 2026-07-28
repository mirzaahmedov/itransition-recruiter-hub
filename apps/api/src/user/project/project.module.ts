import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { StorageService } from '@/storage/storage.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, StorageService],
  exports: [ProjectService],
})
export class ProjectModule {}
