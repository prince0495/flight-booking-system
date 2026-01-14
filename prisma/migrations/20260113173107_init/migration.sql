-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'NORMAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserType" NOT NULL DEFAULT 'NORMAL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Airport" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Airline" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Airline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aircraft" (
    "id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "airlineId" TEXT NOT NULL,
    "total_seats" INTEGER NOT NULL DEFAULT 0,
    "economy_seats" INTEGER NOT NULL DEFAULT 0,
    "business_seats" INTEGER NOT NULL DEFAULT 0,
    "firstclass_seats" INTEGER NOT NULL DEFAULT 0,
    "economy_seat_price" INTEGER NOT NULL DEFAULT 0,
    "business_seat_price" INTEGER NOT NULL DEFAULT 0,
    "firstclass_seat_price" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Aircraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flight" (
    "id" TEXT NOT NULL,
    "flight_number" SERIAL NOT NULL,
    "aircraftId" TEXT NOT NULL,
    "departure_airport_id" TEXT NOT NULL,
    "arrival_airport_id" TEXT NOT NULL,
    "departure_time" TIMESTAMP(3) NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_id_key" ON "Airport"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_code_key" ON "Airport"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Airline_id_key" ON "Airline"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Airline_code_key" ON "Airline"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Aircraft_id_key" ON "Aircraft"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Flight_id_key" ON "Flight"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Flight_flight_number_key" ON "Flight"("flight_number");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_id_key" ON "Schedule"("id");

-- AddForeignKey
ALTER TABLE "Aircraft" ADD CONSTRAINT "Aircraft_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "Airline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_departure_airport_id_fkey" FOREIGN KEY ("departure_airport_id") REFERENCES "Airport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_arrival_airport_id_fkey" FOREIGN KEY ("arrival_airport_id") REFERENCES "Airport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
