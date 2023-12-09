import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAdminAccountDTO } from 'src/auth/DTO/CreateAdminAccoountDTO';
import { DatabaseService } from 'src/database/database.service';
import { compare, genSalt, hash } from 'bcryptjs';
import { LoginDTO } from 'src/auth/DTO/LoginDTO';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  public async createAdminAccount(payload: CreateAdminAccountDTO) {
    const admin = await this.databaseService.admin.findFirst({
      where: {
        OR: [{ email: payload.email }, { phone: payload.phone }],
      },
    });

    if (admin !== null) {
      throw new BadRequestException('Admin already exists');
    }

    // check password
    const salt = await genSalt();
    const hashPassword = await hash(payload.password, salt);

    delete payload.password;

    const newAdmin = await this.databaseService.admin.create({
      data: {
        ...payload,
        password: hashPassword,
      },
    });

    return {
      message: 'Admin Accoount created successfully',
      statusCode: 200,
      data: newAdmin,
    };
  }

  public async login(payload: LoginDTO) {
    const admin = await this.databaseService.admin.findFirst({
      where: {
        email: payload.email,
      },
    });

    if (admin === null) {
      throw new BadRequestException('Account not found');
    }

    const match = await compare(payload.password, admin.password);
    if (match === false) {
      throw new BadRequestException('Incorrect details');
    }

    const accessToken = this.jwtService.sign({
      email: payload.email,
      password: payload.password,
      createdAt: admin.createdAt,
      fullName: admin.fullName,
      phone: admin.phone,
    });

    return {
      message: 'Login Successful',
      data: {
        user: admin,
        token: accessToken,
      },
    };
  }
}
