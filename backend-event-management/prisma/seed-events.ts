import { PrismaClient, UserRole, UserStatus, EventType, EventStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import pg from 'pg';

// Load environment variables FIRST
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Validate DATABASE_URL is set
if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL is not set in .env file');
    process.exit(1);
}

// Use the same Prisma setup as the main app (with adapter)
const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Events data from the provided JSON
const eventsData = [
    {
        name: "AI & Machine Learning Workshop",
        type: "TECH_MEETUP" as EventType,
        description: "Learn the latest in AI and machine learning from industry experts. Hands-on sessions, networking opportunities, and insights into cutting-edge technologies. Perfect for developers, data scientists, and tech enthusiasts.",
        date: new Date("2027-05-05T10:00:00.000Z"),
        location: "Tech Hub, San Francisco",
        minParticipants: 5,
        maxParticipants: 8,
        joiningFee: 50,
        status: "OPEN" as EventStatus,
        image: "https://res.cloudinary.com/djsi3od2u/image/upload/v1765511731/file-1765511730056-372869569.jpg.jpg",
    },
    {
        name: "Contemporary Art Gallery Opening",
        type: "ART" as EventType,
        description: "Be among the first to view our exclusive contemporary art collection. Meet the artists, enjoy wine and hors d'oeuvres, and explore stunning works from emerging and established artists. A perfect evening for art lovers.",
        date: new Date("2027-07-18T17:00:00.000Z"),
        location: "Modern Art Gallery, Seattle",
        minParticipants: 1,
        maxParticipants: 10,
        joiningFee: 35,
        status: "OPEN" as EventStatus,
        image: "https://res.cloudinary.com/djsi3od2u/image/upload/v1765511699/file-1765511698629-869279827.webp.webp",
    },
    {
        name: "Community Soccer League Championship",
        type: "SPORTS" as EventType,
        description: "Watch the final match of our community soccer league! Cheer on your favorite team and enjoy refreshments. Great for families and sports enthusiasts. Free entry for kids under 12.",
        date: new Date("2026-06-12T15:00:00.000Z"),
        location: "City Sports Complex, Chicago",
        minParticipants: 20,
        maxParticipants: 200,
        joiningFee: 10,
        status: "OPEN" as EventStatus,
        image: "https://res.cloudinary.com/djsi3od2u/image/upload/v1765511564/file-1765511564447-693925055.webp.webp",
    },
    {
        name: "Epic Gaming Tournament",
        type: "GAMING" as EventType,
        description: "Compete in our multi-game tournament featuring the latest titles. Prizes for top performers! Whether you're a casual gamer or a pro, this event is for you. Snacks and drinks provided.",
        date: new Date("2026-05-10T14:00:00.000Z"),
        location: "GameZone Arcade, Los Angeles",
        minParticipants: 10,
        maxParticipants: 50,
        joiningFee: 20,
        status: "OPEN" as EventStatus,
        image: "https://res.cloudinary.com/djsi3od2u/image/upload/v1765511493/file-1765511492833-423537334.webp.webp",
    },
    {
        name: "Gourmet Wine & Dine Experience",
        type: "DINNER" as EventType,
        description: "Indulge in a curated 5-course meal paired with exquisite wines. Our expert sommelier will guide you through each pairing. Perfect for food enthusiasts and wine lovers looking for a sophisticated dining experience.",
        date: new Date("2026-08-20T18:30:00.000Z"),
        location: "The Grand Restaurant, San Francisco",
        minParticipants: 8,
        maxParticipants: 30,
        joiningFee: 120,
        status: "OPEN" as EventStatus,
        image: "https://res.cloudinary.com/djsi3od2u/image/upload/v1765511410/file-1765511410202-598065469.webp.webp",
    },
    {
        name: "Summer Music Festival 2025",
        type: "CONCERT" as EventType,
        description: "Join us for an unforgettable evening of live music featuring top artists from around the world. Experience amazing performances, great food, and an electric atmosphere. Don't miss out on this spectacular event!",
        date: new Date("2026-07-15T19:00:00.000Z"),
        location: "Central Park, New York",
        minParticipants: 10,
        maxParticipants: 500,
        joiningFee: 75,
        status: "OPEN" as EventStatus,
        image: "https://res.cloudinary.com/djsi3od2u/image/upload/v1765511302/file-1765511301204-4321399.jpg.jpg",
    },
    {
        name: "Mountain Trail Adventure",
        type: "HIKE" as EventType,
        description: "Explore breathtaking mountain trails with experienced guides. This moderate-to-difficult hike offers stunning views, wildlife spotting opportunities, and a chance to connect with nature. All skill levels welcome!",
        date: new Date("2026-12-08T07:00:00.000Z"),
        location: "Rocky Mountain National Park, Colorado",
        minParticipants: 5,
        maxParticipants: 25,
        joiningFee: 15,
        status: "OPEN" as EventStatus,
        image: "https://res.cloudinary.com/djsi3od2u/image/upload/v1765511020/file-1765511019496-830133947.webp.webp",
    },
];

async function main() {
    console.log('🌱 Starting host and events seed...');

    const hostEmail = 'host@test.com';
    const hostPassword = 'Abc@123';
    const hostName = 'Host User';

    // Check database connection
    try {
        await prisma.$connect();
        console.log('✅ Database connection established');
    } catch (error) {
        console.error('❌ Error: Could not connect to database.');
        console.error('   Please check your DATABASE_URL in .env file');
        console.error('   Make sure you are using the EXTERNAL database URL (not internal)');
        throw error;
    }

    // Check if host already exists
    const existingHost = await prisma.host.findUnique({
        where: { email: hostEmail },
        include: { user: true }
    });

    let hostUserId: string;
    let hostId: string;

    if (existingHost) {
        console.log(`⚠️  Host with email ${hostEmail} already exists.`);
        hostUserId = existingHost.user.id;
        hostId = existingHost.id;
        console.log(`   Using existing host: ${hostId}`);
    } else {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: hostEmail }
        });

        // Hash password
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUND) || 12;
        const hashedPassword = await bcrypt.hash(hostPassword, saltRounds);

        if (existingUser) {
            console.log(`⚠️  User with email ${hostEmail} already exists. Converting to host...`);
            // Update user to HOST role and create host record
            const result = await prisma.$transaction(async (tnx) => {
                await tnx.user.update({
                    where: { email: hostEmail },
                    data: {
                        role: UserRole.HOST,
                        password: hashedPassword,
                        status: UserStatus.ACTIVE
                    }
                });

                const host = await tnx.host.create({
                    data: {
                        email: hostEmail,
                        name: hostName,
                    }
                });

                return { userId: existingUser.id, hostId: host.id };
            });
            hostUserId = result.userId;
            hostId = result.hostId;
        } else {
            // Create new host user
            console.log('📝 Creating new host user...');
            const result = await prisma.$transaction(async (tnx) => {
                const user = await tnx.user.create({
                    data: {
                        email: hostEmail,
                        password: hashedPassword,
                        role: UserRole.HOST,
                        name: hostName,
                        needPasswordChange: false,
                        status: UserStatus.ACTIVE
                    }
                });

                const host = await tnx.host.create({
                    data: {
                        email: hostEmail,
                        name: hostName,
                    }
                });

                return { userId: user.id, hostId: host.id };
            });
            hostUserId = result.userId;
            hostId = result.hostId;
            console.log('✅ Host created successfully!');
        }
    }

    // Check existing events for this host
    const existingEvents = await prisma.event.findMany({
        where: {
            hostId: hostId,
            isDeleted: false
        }
    });

    if (existingEvents.length > 0) {
        console.log(`⚠️  Host already has ${existingEvents.length} events.`);
        console.log('   Do you want to add more events? (This will create duplicates)');
    }

    // Create events
    console.log(`\n📅 Creating ${eventsData.length} events...`);
    let createdCount = 0;
    let skippedCount = 0;

    for (const eventData of eventsData) {
        // Check if event with same name and date already exists
        const existingEvent = await prisma.event.findFirst({
            where: {
                hostId: hostId,
                name: eventData.name,
                date: eventData.date,
                isDeleted: false
            }
        });

        if (existingEvent) {
            console.log(`   ⏭️  Skipping "${eventData.name}" - already exists`);
            skippedCount++;
            continue;
        }

        try {
            await prisma.event.create({
                data: {
                    ...eventData,
                    hostId: hostId,
                }
            });
            console.log(`   ✅ Created: "${eventData.name}"`);
            createdCount++;
        } catch (error) {
            console.error(`   ❌ Error creating "${eventData.name}":`, error);
        }
    }

    console.log(`\n✅ Seed completed!`);
    console.log(`   Host: ${hostEmail}`);
    console.log(`   Password: ${hostPassword}`);
    console.log(`   Events created: ${createdCount}`);
    console.log(`   Events skipped: ${skippedCount}`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding host and events:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });

