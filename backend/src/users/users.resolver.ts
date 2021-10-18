import {
  Query,
  Resolver,
  Mutation,
  Args,
  Context,
  Field,
  ObjectType,
  InputType,
  Int
} from '@nestjs/graphql';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './user.dto';
import { UsersService } from './users.service';

export interface ResolverContext {
  req: Request;
  res: Response;
}

@ObjectType()
export class LoginResponse {
  @Field({ nullable: true })
  user: User;

  @Field({ nullable: true })
  message: string;

  constructor({ user }: { user?: User }) {
    this.user = user;
  }
}

@InputType({ description: 'Login Input' })
export class LoginInput implements Partial<User> {
  @Field()
  email: string;

  @Field()
  password: string;
}

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(returns => [User])
  async users(): Promise<Array<Record<string, any>>> {
    return [
      {
        id: 1,
        email: 'user1@mail.com',
      },
      {
        id: 2,
        email: 'user2@mail.com',
      },
    ];
  }

  @Query(returns => User)
  @UseGuards(GqlAuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return this.usersService.findById(user.id);
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() ctx: ResolverContext,
  ): Promise<LoginResponse> {
    const user = await this.usersService.findOne({ email: loginInput.email });

    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }

    (ctx.req as any).login(user, () => null);

    return new LoginResponse({
      user,
    });
  }

  @Mutation(() => Int)
  async logout(@Context() ctx: ResolverContext): Promise<number> {
    (ctx.req as any).logout();
    return 0;
  }
}

// Examples:

// mutation {
//   login(loginInput: { email: "user1@mail.com", password: "123" }) {
//     message
//     user {
//       email
//     }
//   }
// }
