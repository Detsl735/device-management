import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Type } from 'src/type/entities/type.entity';
import { Model } from 'src/model/entities/model.entity';
import { Feature } from 'src/feature/entities/feature.entity';

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  isCustom: boolean;

  @ManyToOne(() => Type, { nullable: false })
  type: Type;

  @ManyToMany(() => Model, (model) => model.profiles)
  models: Model[];

  @ManyToMany(() => Feature, (feature) => feature.profiles)
  @JoinTable({
    name: 'profilefeatures',
    joinColumn: {
      name: 'profileId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'featureId',
      referencedColumnName: 'id',
    },
  })
  features: Feature[];

  @Column({ default: false })
  isDeleted: boolean;
}
