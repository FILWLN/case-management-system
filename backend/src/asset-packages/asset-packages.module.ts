import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetPackagesController } from './asset-packages.controller';
import { AssetPackagesService } from './asset-packages.service';
import { AssetPackage } from './asset-package.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssetPackage])],
  controllers: [AssetPackagesController],
  providers: [AssetPackagesService],
  exports: [AssetPackagesService],
})
export class AssetPackagesModule {}
