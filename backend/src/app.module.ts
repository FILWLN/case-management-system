import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasesModule } from './cases/cases.module';
import { AuthModule } from './auth/auth.module';
import { AssetPackagesModule } from './asset-packages/asset-packages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: './data/case-management.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 开发环境使用，生产环境请关闭
    }),
    SharedModule,
    CasesModule,
    AuthModule,
    AssetPackagesModule,
    NotificationsModule,
  ],
})
export class AppModule {}
