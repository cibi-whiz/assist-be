import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    UseGuards
} from '@nestjs/common';
import { RolesService } from './roles.service';
import {
    CreateRoleDTO,
    UpdateRoleDTO,
    AssignPermissionsToRoleDTO,
    AssignRoleToUserDTO,
    RemoveRoleFromUserDTO
} from './roles.validate';
import { PoliciesGuard } from '../../casl/casl-ability.guard';
import { CheckPolicies } from '../../casl/casl-policy.decorator';
import { AppAbility, Action } from '../../casl/casl-ability.factory';

@Controller('roles')
@UseGuards(PoliciesGuard)
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Post()
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'AssistRole'))
    createRole(@Body() payload: CreateRoleDTO) {
        return this.rolesService.createRole(payload);
    }

    @Get()
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'AssistRole'))
    getAllRoles() {
        return this.rolesService.getAllRoles();
    }

    @Get(':id')
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'AssistRole'))
    getRoleById(@Param('id', ParseIntPipe) id: number) {
        return this.rolesService.getRoleById(id);
    }

    @Put(':id')
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'AssistRole'))
    updateRole(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateRoleDTO
    ) {
        return this.rolesService.updateRole(id, payload);
    }

    @Delete(':id')
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, 'AssistRole'))
    deleteRole(@Param('id', ParseIntPipe) id: number) {
        return this.rolesService.deleteRole(id);
    }

    @Post(':id/permissions')
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'AssistRole'))
    assignPermissionsToRole(
        @Param('id', ParseIntPipe) roleId: number,
        @Body() payload: AssignPermissionsToRoleDTO
    ) {
        return this.rolesService.assignPermissionsToRole(roleId, payload);
    }

    @Get(':id/permissions')
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'AssistRole'))
    getRolePermissions(@Param('id', ParseIntPipe) roleId: number) {
        return this.rolesService.getRolePermissions(roleId);
    }

    @Post('assign')
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'AssistUser'))
    assignRoleToUser(@Body() payload: AssignRoleToUserDTO) {
        return this.rolesService.assignRoleToUser(payload);
    }

    @Delete('unassign')
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'AssistUser'))
    removeRoleFromUser(@Body() payload: RemoveRoleFromUserDTO) {
        return this.rolesService.removeRoleFromUser(payload);
    }

    @Get('user/:userId')
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'AssistUser'))
    getUserRoles(@Param('userId', ParseIntPipe) userId: number) {
        return this.rolesService.getUserRoles(userId);
    }
}