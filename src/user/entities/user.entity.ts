import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  state: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  ethereumAddress: string;  // New field for Ethereum address

  @Column({ nullable: true })
  tin: string; // TIN field in the format XXXX-XXXX

  @Column({ nullable: true })
  nin: string;  // NIN field

  @Column({ nullable: true })
  bvn: string;  // BVN field

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  addr1: string;

  @Column({ nullable: true })
  lga: string;
}
