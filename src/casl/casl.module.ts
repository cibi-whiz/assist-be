import { Global, Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { PoliciesGuard } from './casl-ability.guard';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
    imports: [PrismaModule],
    providers: [CaslAbilityFactory, PoliciesGuard],
    exports: [CaslAbilityFactory, PoliciesGuard],
})
export class CaslModule { }
