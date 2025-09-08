/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ResourceTypes" AS ENUM ('MENU');

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "org_list" (
    "id" SERIAL NOT NULL,
    "org_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "site_name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "org_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assist_portals" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "portal_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assist_portals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assist_modules" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parent_id" INTEGER,
    "portal_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "assist_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assist_resources" (
    "id" SERIAL NOT NULL,
    "module_id" INTEGER NOT NULL,
    "resource_code" TEXT NOT NULL,
    "type" "ResourceTypes" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assist_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assist_menus" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assist_menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assist_permissions" (
    "id" SERIAL NOT NULL,
    "resource_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assist_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assist_resource_permissions" (
    "id" SERIAL NOT NULL,
    "resource_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assist_resource_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assist_roles" (
    "id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "assist_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assist_role_accesses" (
    "id" SERIAL NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assist_role_accesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assist_user_roles" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "assigned_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assist_user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "org_list_org_code_key" ON "org_list"("org_code");

-- AddForeignKey
ALTER TABLE "assist_portals" ADD CONSTRAINT "assist_portals_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "org_list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assist_modules" ADD CONSTRAINT "assist_modules_portal_id_fkey" FOREIGN KEY ("portal_id") REFERENCES "assist_portals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assist_modules" ADD CONSTRAINT "assist_modules_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "assist_modules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assist_resources" ADD CONSTRAINT "assist_resources_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "assist_modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assist_resource_permissions" ADD CONSTRAINT "assist_resource_permissions_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "assist_resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assist_resource_permissions" ADD CONSTRAINT "assist_resource_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "assist_permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assist_role_accesses" ADD CONSTRAINT "assist_role_accesses_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "assist_permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assist_role_accesses" ADD CONSTRAINT "assist_role_accesses_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "assist_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assist_user_roles" ADD CONSTRAINT "assist_user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "assist_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
