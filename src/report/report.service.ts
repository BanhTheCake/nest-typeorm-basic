import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { User } from 'src/user/user.entity';
import { Report } from './report.entity';
import { FilterReportDto } from './dto/filter-report.dto';
import { ApproveDto } from './dto/approve.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async create(data: CreateReportDto, user: User) {
    const report = this.reportRepository.create(data);
    report.user = user;
    return this.reportRepository.save(report);
  }

  async getWithFilter(query: FilterReportDto) {
    const queryBuilder = this.reportRepository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.user', 'user');
    // .select(['report', 'user.id', 'user.email']);
    if (query.make) {
      queryBuilder.andWhere('report.make = :make', { make: query.make });
    }
    if (query.model) {
      queryBuilder.andWhere('report.model = :model', { model: query.model });
    }
    if (query.lat === 0 || query.lat) {
      queryBuilder.andWhere('report.lat - :lat BETWEEN -5 AND 5', {
        lat: query.lat,
      });
    }
    if (query.lng === 0 || query.lng) {
      queryBuilder.andWhere('report.lng - :lng BETWEEN -5 AND 5', {
        lng: query.lng,
      });
    }
    if (query.year === 0 || query.year) {
      queryBuilder.andWhere('report.year - :year BETWEEN -3 AND 3', {
        year: query.year,
      });
    }
    if (query.price) {
      queryBuilder.orderBy('price - :price', 'DESC').setParameters({
        price: query.price,
      });
    }
    return queryBuilder.getMany();
  }

  async approve(id: number, data: ApproveDto) {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException('Report not found.');
    }
    Object.assign(report, data);
    return this.reportRepository.save(report);
  }
}
