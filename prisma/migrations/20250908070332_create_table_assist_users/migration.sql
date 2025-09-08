-- CreateTable
CREATE TABLE "assist_users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,
    "deleted_by" INTEGER,

    CONSTRAINT "assist_users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "assist_user_roles" ADD CONSTRAINT "assist_user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "assist_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
