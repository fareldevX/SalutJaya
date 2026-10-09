// Konten layanan. TODO: tinjau ulang naskah bersama tim SalutJaya sebelum rilis.
export const services = [
  {
    id: 'network',
    title: 'Network architecture',
    summary: 'Topologi jaringan yang dirancang untuk tumbuh bersama bisnis Anda.',
    description:
      'Kami memetakan kondisi jaringan saat ini, lalu merancang arsitektur baru: segmentasi, redundansi, dan jalur migrasi yang tidak mengganggu operasional.',
    deliverables: [
      'Audit topologi dan titik kegagalan tunggal',
      'Rancangan arsitektur beserta daftar perangkat',
      'Rencana migrasi bertahap',
    ],
  },
  {
    id: 'server',
    title: 'Server maintenance',
    summary: 'Server yang terawat, terpantau, dan siap saat dibutuhkan.',
    description:
      'Pemeliharaan berkala, pemantauan kesehatan perangkat keras, pembaruan firmware, dan penanganan insiden agar layanan Anda tetap berjalan.',
    deliverables: [
      'Jadwal pemeliharaan preventif',
      'Pemantauan kapasitas dan kesehatan perangkat',
      'Prosedur pemulihan saat terjadi gangguan',
    ],
  },
  {
    id: 'security',
    title: 'Cybersecurity',
    summary: 'Perlindungan berlapis untuk jaringan dan data perusahaan.',
    description:
      'Penilaian celah keamanan, penguatan konfigurasi perangkat, dan kebijakan akses yang jelas, dari firewall sampai segmentasi internal.',
    deliverables: [
      'Laporan penilaian celah dan prioritas perbaikan',
      'Penguatan konfigurasi firewall dan switch',
      'Kebijakan akses dan segmentasi jaringan',
    ],
  },
]
