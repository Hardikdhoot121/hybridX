import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://hybridxUser:AD9vOytvvTEucKma@hybridonline.9j4osxl.mongodb.net/?appName=hybridOnline';

console.log('🔄 Starting data migration...');

const migrateData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check existing users
    const existingUsers = await User.find({});
    console.log(`📊 Found ${existingUsers.length} existing users in database`);

    // Sample students to migrate (from your existing data)
    const studentsToMigrate = [
      {
        name: "Rajesh Kumar",
        email: "rajesh@gmail.com",
        phone: "9876543210",
        class: "12th",
        stream: "JEE",
        fatherName: "Suresh Kumar",
        motherName: "Siya Kumar",
        parentPhone1: "9123456789",
        parentPhone2: "9012345678",
        batch: "Batch 1",
        targetYear: "2025",
        role: "student"
      },
      {
        name: "Anita Sharma",
        email: "anita@gmail.com", 
        phone: "9123456780",
        class: "12th",
        stream: "NEET",
        fatherName: "Ramesh Kumar",
        motherName: "Sita Kumar",
        parentPhone1: "9988776655",
        parentPhone2: "",
        batch: "Batch 2", 
        targetYear: "2025",
        role: "student"
      },
      {
        name: "Priya Singh",
        email: "priya@gmail.com",
        phone: "9876543211",
        class: "11th",
        stream: "JEE",
        fatherName: "Rajendra Singh",
        motherName: "Meera Singh",
        parentPhone1: "9123456788",
        parentPhone2: "9012345679",
        batch: "Batch 1",
        targetYear: "2025",
        role: "student"
      },
      {
        name: "Amit Kumar",
        email: "amit@gmail.com",
        phone: "9123456781",
        class: "11th", 
        stream: "NEET",
        fatherName: "Suresh Kumar",
        motherName: "Geeta Kumar",
        parentPhone1: "9988776654",
        parentPhone2: "",
        batch: "Batch 2",
        targetYear: "2025",
        role: "student"
      }
    ];

    // Migrate students
    let migratedCount = 0;
    let skippedCount = 0;

    for (const student of studentsToMigrate) {
      try {
        // Check if student already exists
        const existingStudent = await User.findOne({ 
          email: student.email 
        });

        if (existingStudent) {
          console.log(`⚠️  Student ${student.name} (${student.email}) already exists - SKIPPING`);
          skippedCount++;
          continue;
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(student.password || "default123", saltRounds);

        // Create new student
        const newStudent = new User({
          ...student,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        await newStudent.save();
        console.log(`✅ Migrated: ${student.name} (${student.email})`);
        migratedCount++;

      } catch (error) {
        console.error(`❌ Failed to migrate ${student.name}:`, error.message);
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`✅ Successfully migrated: ${migratedCount} students`);
    console.log(`⚠️  Skipped (already exists): ${skippedCount} students`);
    console.log(`📊 Total students processed: ${migratedCount + skippedCount}`);

    // Create admin user if not exists
    const adminEmail = 'admin@hybridx.com';
    const adminPassword = 'admin123';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const adminSaltRounds = 10;
      const hashedAdminPassword = await bcrypt.hash(adminPassword, adminSaltRounds);
      
      const adminUser = new User({
        name: 'Admin User',
        email: adminEmail,
        password: hashedAdminPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await adminUser.save();
      console.log('✅ Created admin user');
    } else {
      console.log('⚠️  Admin user already exists');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run migration
migrateData().then(() => {
  console.log('🎉 Migration completed!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
