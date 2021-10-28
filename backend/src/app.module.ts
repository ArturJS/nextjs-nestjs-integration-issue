import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersResolver } from './users/users.resolver';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      path: '/api/graphql',
      useGlobalPrefix: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      bodyParserConfig: false,
      cors: false,
      introspection: true,
      playground: {
        settings: {
          // https://github.com/prisma-labs/graphql-playground/issues/748#issuecomment-412524510
          'request.credentials': 'same-origin',
        },
      },
    }),
    AuthModule,
    UsersModule,
  ],
  providers: [UsersResolver],
})
export class AppModule {}
