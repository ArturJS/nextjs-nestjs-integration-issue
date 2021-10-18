import { Controller, Get } from '@nestjs/common';

@Controller()
export class AuthController {
  // The endpoint called from google after sign-in
  @Get('google/callback')
  async googleCallback() {}

  @Get('google')
  async googleSignIn() {}
}
