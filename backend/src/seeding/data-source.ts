import 'dotenv/config';
import { DataSource } from 'typeorm';
import { createDbOptions } from '../config/db.config';

export const SeedingDataSource = new DataSource(createDbOptions());
