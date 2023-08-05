import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1691249302912 implements MigrationInterface {
    name = 'InitialMigration1691249302912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "hashPassword" varchar NOT NULL, "isAdmin" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "model" varchar NOT NULL, "make" varchar NOT NULL, "lat" integer NOT NULL, "lng" integer NOT NULL, "price" integer NOT NULL, "year" integer NOT NULL, "approve" boolean NOT NULL DEFAULT (0), "userId" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "model" varchar NOT NULL, "make" varchar NOT NULL, "lat" integer NOT NULL, "lng" integer NOT NULL, "price" integer NOT NULL, "year" integer NOT NULL, "approve" boolean NOT NULL DEFAULT (0), "userId" integer NOT NULL, CONSTRAINT "FK_e347c56b008c2057c9887e230aa" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_report"("id", "model", "make", "lat", "lng", "price", "year", "approve", "userId") SELECT "id", "model", "make", "lat", "lng", "price", "year", "approve", "userId" FROM "report"`);
        await queryRunner.query(`DROP TABLE "report"`);
        await queryRunner.query(`ALTER TABLE "temporary_report" RENAME TO "report"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report" RENAME TO "temporary_report"`);
        await queryRunner.query(`CREATE TABLE "report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "model" varchar NOT NULL, "make" varchar NOT NULL, "lat" integer NOT NULL, "lng" integer NOT NULL, "price" integer NOT NULL, "year" integer NOT NULL, "approve" boolean NOT NULL DEFAULT (0), "userId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "report"("id", "model", "make", "lat", "lng", "price", "year", "approve", "userId") SELECT "id", "model", "make", "lat", "lng", "price", "year", "approve", "userId" FROM "temporary_report"`);
        await queryRunner.query(`DROP TABLE "temporary_report"`);
        await queryRunner.query(`DROP TABLE "report"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
