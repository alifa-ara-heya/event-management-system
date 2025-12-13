import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Use Prisma Client directly without adapter for seed script
// This ensures it uses the DATABASE_URL from environment variables
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting admin seed...');

    // Validate required environment variables
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@test.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.SEED_ADMIN_NAME || 'Admin User';
    const adminContact = process.env.SEED_ADMIN_CONTACT || undefined;

    if (!adminEmail || !adminPassword || !adminName) {
        console.error('❌ Error: Missing required environment variables.');
        console.error('   Required: SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_ADMIN_NAME');
        console.error('   Optional: SEED_ADMIN_CONTACT');
        process.exit(1);
    }

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

    // Check if any admin already exists
    const existingAdmin = await prisma.admin.findFirst();
    if (existingAdmin) {
        console.log('⚠️  Admin already exists. Skipping seed.');
        console.log(`   Existing admin email: ${existingAdmin.email}`);
        return;
    }

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    if (existingUser) {
        console.log(`⚠️  User with email ${adminEmail} already exists.`);
        if (existingUser.role === UserRole.ADMIN) {
            console.log('   User is already an admin. Skipping seed.');
            return;
        } else {
            console.log('   User exists but is not an admin. Converting to admin...');
            // Convert existing user to admin
            await prisma.$transaction(async (tnx) => {
                await tnx.user.update({
                    where: { email: adminEmail },
                    data: { role: UserRole.ADMIN }
                });
                await tnx.admin.create({
                    data: {
                        email: adminEmail,
                        name: adminName,
                        contactNumber: adminContact
                    }
                });
            });
            console.log('✅ Admin created successfully!');
            return;
        }
    }

    // Hash password
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUND) || 12;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // Create admin in transaction
    await prisma.$transaction(async (tnx) => {
        // Create user
        await tnx.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                role: UserRole.ADMIN,
                name: adminName,
                needPasswordChange: false, // Set to true if you want admin to change password on first login
                status: UserStatus.ACTIVE
            }
        });

        // Create admin record
        await tnx.admin.create({
            data: {
                email: adminEmail,
                name: adminName,
                contactNumber: adminContact
            }
        });
    });

    console.log('✅ Admin created successfully!');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Name: ${adminName}`);
    console.log('\n⚠️  IMPORTANT: Change the default password after first login!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding admin:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

