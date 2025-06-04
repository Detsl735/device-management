import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Type } from 'src/type/entities/type.entity';
import { Profile } from 'src/profile/entities/profile.entity';

@Entity('model')
export class Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => Type, { nullable: false })
  type: Type;

  @ManyToMany(() => Profile, (profile) => profile.models)
  @JoinTable({
    name: 'modelprofiles',
    joinColumn: {
      name: 'modelId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'profileId',
      referencedColumnName: 'id',
    },
  })
  profiles: Profile[];

  @Column({ default: false })
  isDeleted: boolean;
}
