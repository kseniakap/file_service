import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('files')
export class FileModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  name: string;

  @Column()
  size: number;

  @Column()
  type: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt?: Date;

  @BeforeInsert()
  protected setCreatedAt(): void {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
  @BeforeUpdate()
  protected setUpdatedAt(): void {
    this.updatedAt = new Date();
  }
}
