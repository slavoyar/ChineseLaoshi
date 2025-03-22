import { tags } from 'typia';

export type Id = string & tags.Format<'uuid'>;

export type Email = string & tags.Format<'email'>;
