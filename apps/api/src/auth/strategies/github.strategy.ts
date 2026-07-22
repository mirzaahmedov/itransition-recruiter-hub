import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy } from 'passport-github2';

export interface IGithubUser {
  githubId: string;
  email: string;
  name: string;
  avatar: string;
}

export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CLIENT_CALLBACK,
      scope: ['user:email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): IGithubUser {
    return {
      githubId: profile.id,
      email: profile.emails?.[0].value ?? '',
      name: profile.displayName,
      avatar: profile.photos?.[0].value ?? '',
    };
  }
}
