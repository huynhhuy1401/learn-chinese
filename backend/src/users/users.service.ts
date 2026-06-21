import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async upsertFromSupabase(supabaseUser: { id: string; email: string }) {
    return this.prisma.user.upsert({
      where: { id: supabaseUser.id },
      create: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.email.split('@')[0],
      },
      update: { email: supabaseUser.email },
    });
  }
}
