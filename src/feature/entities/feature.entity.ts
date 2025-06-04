import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Profile } from 'src/profile/entities/profile.entity';

@Entity('feature')
export class Feature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true })
  variableName: string;

  @ManyToMany(() => Profile, (profile) => profile.features)
  profiles: Profile[];
}
