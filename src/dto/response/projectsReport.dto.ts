import { ApiProperty } from '@nestjs/swagger';

export class ProjectsReportDto {
  @ApiProperty({
    description: 'The unique identifier of the project',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the project in English',
    example: 'Smart Home Automation System',
  })
  projectName: string;

  @ApiProperty({
    description: 'The full name of the person who submitted the project',
    example: 'John Doe',
  })
  submitter: string;

  @ApiProperty({
    description: 'The current status of the project',
    enum: [
      'กำลังรอการตรวจสอบ',
      'ผ่านการตรวจสอบรอบที่ 1',
      'ผ่านการตรวจสอบรอบที่ 2',
      'ตรวจสอบสำเร็จ',
      'ถูกปฏิเสธ',
    ],
    example: 'กำลังรอการตรวจสอบ',
  })
  status:
    | 'กำลังรอการตรวจสอบ'
    | 'ผ่านการตรวจสอบรอบที่ 1'
    | 'ผ่านการตรวจสอบรอบที่ 2'
    | 'ตรวจสอบสำเร็จ'
    | 'ถูกปฏิเสธ';
}
