import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { User } from '../user/user.entity';
import { Authenticate } from '../user/guards/Authenticate.guard';
import { CreateReportDto } from './dto/create-report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dto/report.dto';
import { FilterReportDto } from './dto/filter-report.dto';
import { Authorize } from '../user/guards/Authorization.guard';
import { ApproveDto } from './dto/approve.dto';

@Controller('reports')
@Serialize(ReportDto)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @Authenticate()
  createNew(@Body() data: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(data, user);
  }

  @Get()
  getWithFilter(@Query() query: FilterReportDto) {
    return this.reportService.getWithFilter(query);
  }

  @Post('/:id')
  @Authenticate()
  @Authorize()
  approve(@Param('id') id: string, @Body() data: ApproveDto) {
    return this.reportService.approve(parseInt(id), data);
  }
}
