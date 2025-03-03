-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialMediaLog" (
    "id" SERIAL NOT NULL,
    "taskTitle" TEXT NOT NULL,
    "taskDescription" TEXT,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "timeLeft" INTEGER,
    "memoryUsed" TEXT,

    CONSTRAINT "SocialMediaLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),
    "profile_picture" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "image" TEXT,
    "emailVerified" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "accountAssociation" (
    "account_id" INTEGER NOT NULL,
    "devices_id" INTEGER NOT NULL,

    CONSTRAINT "accountAssociation_pkey" PRIMARY KEY ("account_id","devices_id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "platforms_id" INTEGER NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "warmup_time" INTEGER NOT NULL DEFAULT 4320,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent" (
    "id" SERIAL NOT NULL,
    "platforms_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "account_id" INTEGER NOT NULL,
    "num_account_purchased" INTEGER NOT NULL,

    CONSTRAINT "agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" SERIAL NOT NULL,
    "availability_status" BOOLEAN NOT NULL,
    "serial_number" TEXT,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fb_comment" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "comment" VARCHAR(255) NOT NULL,

    CONSTRAINT "fb_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fb_like" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "liked" BOOLEAN NOT NULL,

    CONSTRAINT "fb_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fb_message" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "usernames" VARCHAR(255) NOT NULL,

    CONSTRAINT "fb_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fb_post" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "fb_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fb_share" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "usernames" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,

    CONSTRAINT "fb_share_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ig_comment" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "comment" VARCHAR(255) NOT NULL,

    CONSTRAINT "ig_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ig_like" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "liked" BOOLEAN NOT NULL,

    CONSTRAINT "ig_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ig_message" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "usernames" VARCHAR(255) NOT NULL,

    CONSTRAINT "ig_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ig_post" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "ig_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ig_share" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "usernames" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,

    CONSTRAINT "ig_share_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "li_comment" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "comment" VARCHAR(255) NOT NULL,

    CONSTRAINT "li_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "li_like" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "liked" BOOLEAN NOT NULL,

    CONSTRAINT "li_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "li_message" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "usernames" VARCHAR(255) NOT NULL,

    CONSTRAINT "li_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "li_post" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "li_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "li_share" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "usernames" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,

    CONSTRAINT "li_share_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paymentRecord" (
    "payment_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "platforms_id" INTEGER NOT NULL,
    "no_of_accounts" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "transaction_id" TEXT NOT NULL,

    CONSTRAINT "paymentRecord_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "platforms" (
    "id" SERIAL NOT NULL,
    "platform_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "platforms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quota" (
    "user_id" TEXT NOT NULL,
    "quota_data" JSON NOT NULL,
    "ig_message_id" INTEGER,
    "fb_message_id" INTEGER,
    "tt_message_id" INTEGER,
    "li_message_id" INTEGER,
    "ri_message_id" INTEGER,
    "ig_like_id" INTEGER,
    "fb_like_id" INTEGER,
    "tt_like_id" INTEGER,
    "li_like_id" INTEGER,
    "ri_like_id" INTEGER,
    "ig_share_id" INTEGER,
    "fb_share_id" INTEGER,
    "tt_share_id" INTEGER,
    "li_share_id" INTEGER,
    "ri_share_id" INTEGER,
    "ig_comment_id" INTEGER,
    "fb_comment_id" INTEGER,
    "tt_comment_id" INTEGER,
    "li_comment_id" INTEGER,
    "ri_comment_id" INTEGER,
    "ig_post_id" INTEGER,
    "fb_post_id" INTEGER,
    "tt_post_id" INTEGER,
    "li_post_id" INTEGER,
    "ri_post_id" INTEGER,

    CONSTRAINT "quota_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "ri_comment" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "comment" VARCHAR(255) NOT NULL,

    CONSTRAINT "ri_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ri_like" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "liked" BOOLEAN NOT NULL,

    CONSTRAINT "ri_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ri_message" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "usernames" VARCHAR(255) NOT NULL,

    CONSTRAINT "ri_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ri_post" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "ri_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ri_share" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "usernames" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,

    CONSTRAINT "ri_share_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_media_logs" (
    "id" SERIAL NOT NULL,
    "task_title" TEXT,
    "task_description" TEXT,
    "last_modified" TIMESTAMP(6),
    "status" VARCHAR(20),
    "time_left" interval,
    "memory_used" TEXT,
    "metadata" JSONB,

    CONSTRAINT "social_media_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" SERIAL NOT NULL,
    "platforms_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "ig_message_id" INTEGER,
    "ig_like_id" INTEGER,
    "ig_comment_id" INTEGER,
    "ig_share_id" INTEGER,
    "ig_post_id" INTEGER,
    "fb_message_id" INTEGER,
    "fb_like_id" INTEGER,
    "fb_comment_id" INTEGER,
    "fb_share_id" INTEGER,
    "fb_post_id" INTEGER,
    "tt_message_id" INTEGER,
    "tt_like_id" INTEGER,
    "tt_comment_id" INTEGER,
    "tt_share_id" INTEGER,
    "tt_post_id" INTEGER,
    "li_message_id" INTEGER,
    "li_like_id" INTEGER,
    "li_comment_id" INTEGER,
    "li_share_id" INTEGER,
    "li_post_id" INTEGER,
    "ri_message_id" INTEGER,
    "ri_like_id" INTEGER,
    "ri_comment_id" INTEGER,
    "ri_share_id" INTEGER,
    "ri_post_id" INTEGER,
    "status" VARCHAR(50) NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tt_comment" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "comment" VARCHAR(255) NOT NULL,

    CONSTRAINT "tt_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tt_like" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "liked" BOOLEAN NOT NULL,

    CONSTRAINT "tt_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tt_message" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "usernames" VARCHAR(255) NOT NULL,

    CONSTRAINT "tt_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tt_post" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "tt_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tt_share" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "usernames" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,

    CONSTRAINT "tt_share_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_username_key" ON "accounts"("username");

-- CreateIndex
CREATE UNIQUE INDEX "paymentRecord_transaction_id_key" ON "paymentRecord"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "platforms_platform_name_key" ON "platforms"("platform_name");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_platforms_id_fkey" FOREIGN KEY ("platforms_id") REFERENCES "platforms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "agent" ADD CONSTRAINT "agent_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "agent" ADD CONSTRAINT "agent_platforms_id_fkey" FOREIGN KEY ("platforms_id") REFERENCES "platforms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "agent" ADD CONSTRAINT "agent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fb_comment" ADD CONSTRAINT "fb_comment_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fb_like" ADD CONSTRAINT "fb_like_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fb_message" ADD CONSTRAINT "fb_message_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fb_post" ADD CONSTRAINT "fb_post_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fb_share" ADD CONSTRAINT "fb_share_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ig_comment" ADD CONSTRAINT "ig_comment_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ig_like" ADD CONSTRAINT "ig_like_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ig_message" ADD CONSTRAINT "ig_message_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ig_post" ADD CONSTRAINT "ig_post_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ig_share" ADD CONSTRAINT "ig_share_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "li_comment" ADD CONSTRAINT "li_comment_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "li_like" ADD CONSTRAINT "li_like_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "li_message" ADD CONSTRAINT "li_message_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "li_post" ADD CONSTRAINT "li_post_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "li_share" ADD CONSTRAINT "li_share_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_fb_comment_id_fkey" FOREIGN KEY ("fb_comment_id") REFERENCES "fb_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_fb_like_id_fkey" FOREIGN KEY ("fb_like_id") REFERENCES "fb_like"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_fb_message_id_fkey" FOREIGN KEY ("fb_message_id") REFERENCES "fb_message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_fb_post_id_fkey" FOREIGN KEY ("fb_post_id") REFERENCES "fb_post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_fb_share_id_fkey" FOREIGN KEY ("fb_share_id") REFERENCES "fb_share"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_ig_comment_id_fkey" FOREIGN KEY ("ig_comment_id") REFERENCES "ig_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_ig_like_id_fkey" FOREIGN KEY ("ig_like_id") REFERENCES "ig_like"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_ig_message_id_fkey" FOREIGN KEY ("ig_message_id") REFERENCES "ig_message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_ig_post_id_fkey" FOREIGN KEY ("ig_post_id") REFERENCES "ig_post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_ig_share_id_fkey" FOREIGN KEY ("ig_share_id") REFERENCES "ig_share"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_li_comment_id_fkey" FOREIGN KEY ("li_comment_id") REFERENCES "li_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_li_like_id_fkey" FOREIGN KEY ("li_like_id") REFERENCES "li_like"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_li_message_id_fkey" FOREIGN KEY ("li_message_id") REFERENCES "li_message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_li_post_id_fkey" FOREIGN KEY ("li_post_id") REFERENCES "li_post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_li_share_id_fkey" FOREIGN KEY ("li_share_id") REFERENCES "li_share"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_ri_comment_id_fkey" FOREIGN KEY ("ri_comment_id") REFERENCES "ri_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_ri_like_id_fkey" FOREIGN KEY ("ri_like_id") REFERENCES "ri_like"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_ri_message_id_fkey" FOREIGN KEY ("ri_message_id") REFERENCES "ri_message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_ri_post_id_fkey" FOREIGN KEY ("ri_post_id") REFERENCES "ri_post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_ri_share_id_fkey" FOREIGN KEY ("ri_share_id") REFERENCES "ri_share"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_tt_comment_id_fkey" FOREIGN KEY ("tt_comment_id") REFERENCES "tt_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_tt_like_id_fkey" FOREIGN KEY ("tt_like_id") REFERENCES "tt_like"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_tt_message_id_fkey" FOREIGN KEY ("tt_message_id") REFERENCES "tt_message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_tt_post_id_fkey" FOREIGN KEY ("tt_post_id") REFERENCES "tt_post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_tt_share_id_fkey" FOREIGN KEY ("tt_share_id") REFERENCES "tt_share"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ri_comment" ADD CONSTRAINT "ri_comment_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ri_like" ADD CONSTRAINT "ri_like_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ri_message" ADD CONSTRAINT "ri_message_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ri_post" ADD CONSTRAINT "ri_post_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ri_share" ADD CONSTRAINT "ri_share_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_fb_comment_id_fkey" FOREIGN KEY ("fb_comment_id") REFERENCES "fb_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_fb_like_id_fkey" FOREIGN KEY ("fb_like_id") REFERENCES "fb_like"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_fb_message_id_fkey" FOREIGN KEY ("fb_message_id") REFERENCES "fb_message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_fb_post_id_fkey" FOREIGN KEY ("fb_post_id") REFERENCES "fb_post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_fb_share_id_fkey" FOREIGN KEY ("fb_share_id") REFERENCES "fb_share"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_ig_comment_id_fkey" FOREIGN KEY ("ig_comment_id") REFERENCES "ig_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_ig_like_id_fkey" FOREIGN KEY ("ig_like_id") REFERENCES "ig_like"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_ig_message_id_fkey" FOREIGN KEY ("ig_message_id") REFERENCES "ig_message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_ig_post_id_fkey" FOREIGN KEY ("ig_post_id") REFERENCES "ig_post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_ig_share_id_fkey" FOREIGN KEY ("ig_share_id") REFERENCES "ig_share"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_li_comment_id_fkey" FOREIGN KEY ("li_comment_id") REFERENCES "li_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_li_like_id_fkey" FOREIGN KEY ("li_like_id") REFERENCES "li_like"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_li_message_id_fkey" FOREIGN KEY ("li_message_id") REFERENCES "li_message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_li_post_id_fkey" FOREIGN KEY ("li_post_id") REFERENCES "li_post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_li_share_id_fkey" FOREIGN KEY ("li_share_id") REFERENCES "li_share"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_platforms_id_fkey" FOREIGN KEY ("platforms_id") REFERENCES "platforms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_ri_comment_id_fkey" FOREIGN KEY ("ri_comment_id") REFERENCES "ri_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_ri_like_id_fkey" FOREIGN KEY ("ri_like_id") REFERENCES "ri_like"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_ri_message_id_fkey" FOREIGN KEY ("ri_message_id") REFERENCES "ri_message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_ri_post_id_fkey" FOREIGN KEY ("ri_post_id") REFERENCES "ri_post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_ri_share_id_fkey" FOREIGN KEY ("ri_share_id") REFERENCES "ri_share"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_tt_comment_id_fkey" FOREIGN KEY ("tt_comment_id") REFERENCES "tt_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_tt_like_id_fkey" FOREIGN KEY ("tt_like_id") REFERENCES "tt_like"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_tt_message_id_fkey" FOREIGN KEY ("tt_message_id") REFERENCES "tt_message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_tt_post_id_fkey" FOREIGN KEY ("tt_post_id") REFERENCES "tt_post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_tt_share_id_fkey" FOREIGN KEY ("tt_share_id") REFERENCES "tt_share"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tt_comment" ADD CONSTRAINT "tt_comment_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tt_like" ADD CONSTRAINT "tt_like_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tt_message" ADD CONSTRAINT "tt_message_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tt_post" ADD CONSTRAINT "tt_post_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tt_share" ADD CONSTRAINT "tt_share_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;
