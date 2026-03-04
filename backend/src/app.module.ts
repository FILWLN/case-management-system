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
      type: 'sqlite',
      database: './data/case-management.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 寮€鍙戠幆澧冧娇鐢紝鐢熶骇鐜璇峰叧闂?    }),
    SharedModule,
    CasesModule,
    AuthModule,
    AssetPackagesModule,
    NotificationsModule,
  ],
})
export class AppModule {}
