import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './auth.validate';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(@Body() payload: LoginDTO) {
        return this.authService.login(payload);
    }

    @Post('register')
    register(@Body() payload: RegisterDTO) {
        return this.authService.register(payload);
    }
}