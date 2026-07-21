import 'dotenv/config';
import { DataSource } from 'typeorm';
import { dbConfig } from '../config/db.config';

export const SeedingDataSource = new DataSource(dbConfig());
