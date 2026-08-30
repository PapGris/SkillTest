import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy.js';

/**
 * Regroupe tout ce qui est necessaire pour utiliser JwtAuthGuard / RolesGuard
 * dans N'IMPORTE QUEL module (pas seulement AuthModule). @Global() evite
 * d'avoir a importer PassportModule dans chaque feature module.
 */
@Global()
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class CommonModule {}
