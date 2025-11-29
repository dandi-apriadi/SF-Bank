// Minimal institution configuration; production deployments can override via env or replace this file
const InstitutionConfig = {
  institution: {
    name: process.env.INSTITUTION_NAME || 'Politeknik Negeri Manado',
    founded: process.env.INSTITUTION_FOUNDED || '1985',
    type: process.env.INSTITUTION_TYPE || 'Politeknik Negeri',
    accreditation: process.env.INSTITUTION_ACCREDITATION || 'B (Baik)',
    address: process.env.INSTITUTION_ADDRESS || 'Jl. Raya Kampus Unima, Ternate Baru, Manado, Sulawesi Utara',
    website: process.env.INSTITUTION_WEBSITE || 'www.polman-manado.ac.id',
    phone: process.env.INSTITUTION_PHONE || '+62 431 123456',
    email: process.env.INSTITUTION_EMAIL || 'info@polman-manado.ac.id'
  },
  strategicGoals: process.env.INSTITUTION_GOALS ? JSON.parse(process.env.INSTITUTION_GOALS) : [
    {
      id: 1,
      title: 'Academic Excellence',
      progress: 78,
      target: 'Achieve A accreditation by 2025',
      status: 'on-track',
      initiatives: ['Faculty development', 'Curriculum enhancement', 'Research strengthening']
    },
    {
      id: 2,
      title: 'Digital Transformation',
      progress: 65,
      target: '100% digital learning infrastructure',
      status: 'in-progress',
      initiatives: ['LMS implementation', 'Digital library', 'Smart campus']
    },
    {
      id: 3,
      title: 'International Recognition',
      progress: 45,
      target: 'QS World University Rankings inclusion',
      status: 'needs-attention',
      initiatives: ['International partnerships', 'Research collaboration', 'Student exchange']
    },
    {
      id: 4,
      title: 'Industry Partnership',
      progress: 82,
      target: '50+ industry collaborations',
      status: 'on-track',
      initiatives: ['Internship programs', 'Joint research', 'Career placement']
    }
  ],
  facilities: process.env.INSTITUTION_FACILITIES ? JSON.parse(process.env.INSTITUTION_FACILITIES) : [
    { name: 'Perpustakaan Digital', capacity: '15,600 koleksi', status: 'Excellent' },
    { name: 'Laboratorium Komputer', capacity: '28 unit lab', status: 'Good' },
    { name: 'Auditorium', capacity: '1,200 kursi', status: 'Excellent' },
    { name: 'Asrama Mahasiswa', capacity: '800 kamar', status: 'Good' },
    { name: 'Poliklinik Kampus', capacity: '24/7 layanan', status: 'Good' },
    { name: 'Sports Center', capacity: 'Multi-purpose', status: 'Excellent' }
  ]
};

export default InstitutionConfig;
