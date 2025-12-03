import db from '../config/Database.js';
import {
  User,
  Faculty,
  Department,
  NewsPost,
  NewsAttachment
} from '../models/index.js';

// Simple seed script to replace key organization data with Politeknik Negeri Manado dummy data.
// NOTE: This script performs backups by creating backup tables named backup_<table>_<ts>.
// Run cautiously in development only. Always back up your production database first.

const ts = Date.now();

async function backupTable(tableName) {
  const dest = `backup_${tableName}_${ts}`;
  console.log(`Backing up ${tableName} -> ${dest}`);
  // CREATE TABLE backup AS SELECT * FROM original
  await db.query('CREATE TABLE `' + dest + '` AS SELECT * FROM `' + tableName + '`;');
}

async function disableForeignKeys() {
  await db.query('SET FOREIGN_KEY_CHECKS = 0;');
}
async function enableForeignKeys() {
  await db.query('SET FOREIGN_KEY_CHECKS = 1;');
}

async function truncateTables(tables) {
  for (const t of tables) {
    console.log('Truncating', t);
    await db.query('TRUNCATE TABLE `' + t + '`;');
  }
}

async function seed() {
  try {
    await db.authenticate();
    console.log('DB connected, starting seed...');

    const tablesToBackup = ['users','faculties','departments','news_posts','news_attachments'];
    for (const t of tablesToBackup) {
      try { await backupTable(t); } catch(e) { console.warn('Backup failed for', t, e.message); }
    }

    await disableForeignKeys();
    await truncateTables(tablesToBackup);
    await enableForeignKeys();

    // Create faculties
    const faculties = [
      { code: 'FT', name: 'Fakultas Teknik', description: 'Program studi teknik dan vokasi' },
      { code: 'FEB', name: 'Fakultas Ekonomi & Bisnis', description: 'Program studi ekonomi terapan dan manajemen' },
      { code: 'FKI', name: 'Fakultas Komputer & Informatika', description: 'Program studi teknologi informasi dan komputer' }
    ];

    const createdFaculties = [];
    for (const f of faculties) {
      const fac = await Faculty.create({ code: f.code, name: f.name, description: f.description });
      createdFaculties.push(fac);
    }

    // Create departments (lightweight)
    const departments = [
      { faculty: createdFaculties[0], name: 'Departemen Mesin' },
      { faculty: createdFaculties[0], name: 'Departemen Elektro' },
      { faculty: createdFaculties[2], name: 'Departemen Informatika' }
    ];

    for (const d of departments) {
      await Department.create({ faculty_id: d.faculty.faculty_id, name: d.name, code: d.name.toUpperCase().replace(/\s+/g,'_') });
    }



    // Create users (admin + coordinators + sample staff)
    // Passwords will be hashed by model hooks (argon2). Use distinct passwords but prompt to change them after seed.
    const users = [
      { fullname: 'Administrator Politeknik', role: 'pimpinan', email: 'admin@polman.ac.id', password: 'PrimaAdmin123!', is_active: true },
      { fullname: 'Koordinator Teknik Mesin', role: 'staff', email: 'koor_tm@polman.ac.id', password: 'KoorTm123!' },
      { fullname: 'Koordinator Teknik Elektro', role: 'staff', email: 'koor_te@polman.ac.id', password: 'KoorTe123!' },
      { fullname: 'Koordinator Teknik Informatika', role: 'staff', email: 'koor_ti@polman.ac.id', password: 'KoorTi123!' },
      { fullname: 'Koordinator Akuntansi', role: 'staff', email: 'koor_ak@polman.ac.id', password: 'KoorAk123!' }
    ];

    const createdUsers = [];
    for (const u of users) {
      const nu = await User.create(u);
      createdUsers.push(nu);
    }

    // No study program associations in SF BANK. Skipping user_program_roles linking.

    // Create sample news posts
    const newsSamples = [
      {
        title: 'Politeknik Negeri Manado Raih Penghargaan Kampus Berkelanjutan',
        slug: 'polman-berkelanjutan',
        content: 'Politeknik Negeri Manado berhasil meraih penghargaan untuk inisiatif kampus hijau dan pengelolaan lingkungan...',
        status: 'published',
        author_user_id: createdUsers[0].user_id,
        published_at: new Date()
      },
      {
        title: 'Pelatihan Industri untuk Mahasiswa Teknik Mesin',
        slug: 'pelatihan-industri-tm',
        content: 'Program pelatihan industri bekerja sama dengan mitra lokal akan meningkatkan kesiapan kerja lulusan Teknik Mesin...',
        status: 'published',
        author_user_id: createdUsers[2].user_id,
        published_at: new Date(Date.now() - 7*24*3600*1000)
      },
      {
        title: 'Workshop Pengembangan Aplikasi oleh Prodi Teknik Informatika',
        slug: 'workshop-dev-app-ti',
        content: 'Prodi Teknik Informatika menyelenggarakan workshop tentang metodologi agile dan penerapan CI/CD untuk mahasiswa...',
        status: 'published',
        author_user_id: createdUsers[3]?.user_id || createdUsers[0].user_id,
        published_at: new Date(Date.now() - 14*24*3600*1000)
      }
    ];

    for (const n of newsSamples) {
      await NewsPost.create(n);
    }

    console.log('Seeding complete. Summary:');
    console.log('Faculties:', await Faculty.count());
    console.log('Users:', await User.count());
    console.log('News posts:', await NewsPost.count());

    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
