import db from '../config/Database.js';
import {
  User,
  Faculty,
  Department,
  StudyProgram,
  UserProgramRole,
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

    const tablesToBackup = ['users','faculties','departments','study_programs','user_program_roles','news_posts','news_attachments'];
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

    // Create study programs
    const programs = [
      { faculty: createdFaculties[0], name: 'Teknik Mesin', code: 'TM-D3', jenjang: 'D3', student_count: 420, faculty_count: 18, accreditation_grade: 'B' },
      { faculty: createdFaculties[0], name: 'Teknik Elektro', code: 'TE-D3', jenjang: 'D3', student_count: 360, faculty_count: 15, accreditation_grade: 'B' },
      { faculty: createdFaculties[2], name: 'Teknik Informatika', code: 'TI-D4', jenjang: 'D4', student_count: 520, faculty_count: 24, accreditation_grade: 'A' },
      { faculty: createdFaculties[1], name: 'Akuntansi', code: 'AK-D3', jenjang: 'D3', student_count: 300, faculty_count: 10, accreditation_grade: 'B' },
      { faculty: createdFaculties[1], name: 'Manajemen', code: 'MN-D3', jenjang: 'D3', student_count: 280, faculty_count: 9, accreditation_grade: 'B' }
    ];

    const createdPrograms = [];
    for (const p of programs) {
      const pr = await StudyProgram.create({
        faculty_id: p.faculty.faculty_id,
        name: p.name,
        code: p.code,
        jenjang: p.jenjang,
        accreditation_grade: p.accreditation_grade,
        overall_score: Math.round((70 + Math.random()*25)*100)/100,
        student_count: p.student_count,
        faculty_count: p.faculty_count
      });
      createdPrograms.push(pr);
    }

    // Create users (admin + coordinators + sample staff)
    // Passwords will be hashed by model hooks (argon2). Use distinct passwords but prompt to change them after seed.
    const users = [
      { fullname: 'Administrator Politeknik', role: 'pimpinan', email: 'admin@polman.ac.id', password: 'PrimaAdmin123!', position: 'Kepala Sistem', is_active: true },
      { fullname: 'Koordinator Teknik Mesin', role: 'koordinator', email: 'koor_tm@polman.ac.id', password: 'KoorTm123!', position: 'Koordinator Prodi', study_program_id: createdPrograms[0].study_program_id },
      { fullname: 'Koordinator Teknik Elektro', role: 'koordinator', email: 'koor_te@polman.ac.id', password: 'KoorTe123!', position: 'Koordinator Prodi', study_program_id: createdPrograms[1].study_program_id },
      { fullname: 'Koordinator Teknik Informatika', role: 'koordinator', email: 'koor_ti@polman.ac.id', password: 'KoorTi123!', position: 'Koordinator Prodi', study_program_id: createdPrograms[2].study_program_id },
      { fullname: 'Koordinator Akuntansi', role: 'koordinator', email: 'koor_ak@polman.ac.id', password: 'KoorAk123!', position: 'Koordinator Prodi', study_program_id: createdPrograms[3].study_program_id }
    ];

    const createdUsers = [];
    for (const u of users) {
      const nu = await User.create(u);
      createdUsers.push(nu);
    }

    // Link user_program_roles for coordinators
    for (const u of createdUsers) {
      if (u.role === 'koordinator' && u.study_program_id) {
        await UserProgramRole.create({ user_id: u.user_id, study_program_id: u.study_program_id, role: 'koordinator', is_primary: true });
      }
    }

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
    console.log('Programs:', await StudyProgram.count());
    console.log('Users:', await User.count());
    console.log('News posts:', await NewsPost.count());

    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
