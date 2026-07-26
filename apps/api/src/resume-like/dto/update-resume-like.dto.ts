import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeLikeDto } from './create-resume-like.dto';

export class UpdateResumeLikeDto extends PartialType(CreateResumeLikeDto) {}
