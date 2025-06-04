import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeeRepository.create(dto);
    return this.employeeRepository.save(employee);
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({
      where: { isDeleted: false },
    });
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOneBy({
      id,
      isDeleted: false,
    });
    if (!employee) {
      throw new Error(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    const updated = Object.assign(employee, dto);
    return this.employeeRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);
    employee.isDeleted = true;
    await this.employeeRepository.save(employee);
  }
}
