import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(type => ID)
  id: number;

  @Field()
  email: string;
}
