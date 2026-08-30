import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Protege une route : necessite un JWT valide dans le header Authorization: Bearer <token> */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
