-- CEC Sekolah Admin Panel - SQL Sample Data

-- Create database (run this first)
CREATE DATABASE IF NOT EXISTS cec_sekolah CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cec_sekolah;

-- After running Laravel migrations, insert sample admin user
-- Default password: admin123 (hashed)

INSERT INTO users (username, password, name, role, created_at, updated_at) VALUES 
('admin', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin', NOW(), NOW()),
('user', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'User Biasa', 'user', NOW(), NOW());

-- Sample Projects
INSERT INTO projects (nama_proyek, klien, nilai_kontrak, tanggal_mulai, tanggal_selesai, status, deskripsi, created_at, updated_at) VALUES 
('Pembangunan Gedung Sekola', 'Diknas', 5000000000, '2024-01-01', '2024-12-31', 'aktif', 'Pembangunan gedung sekolah 3 lantai', NOW(), NOW()),
('Renovasi Aula', 'Diknas', 1500000000, '2024-03-01', '2024-06-30', 'aktif', 'Renovasi aula sekolah', NOW(), NOW()),
('Pemasangan Solar Panel', 'PLN', 2500000000, '2024-02-15', '2024-08-15', 'selesai', 'Pemasangan solar panel 100kW', NOW(), NOW()),
('Pengadaan Komputer', 'Kemendikbud', 800000000, '2024-04-01', '2024-05-31', 'selesai', 'Pengadaan 50 unit komputer', NOW(), NOW()),
('Perbaikan Jaringan', 'Sekolah', 300000000, '2024-05-01', '2024-07-31', 'ditunda', 'Perbaikan jaringan internet', NOW(), NOW());

-- Sample Penanggung Jawab
INSERT INTO penanggung_jawab (project_id, nama, jabatan, no_telp, email, created_at, updated_at) VALUES 
(1, 'Budi Santoso', 'Kepala Sekolah', '021-1234567', 'budi@sekolah.ac.id', NOW(), NOW()),
(1, 'Siti Aminah', 'Koordinator Proyek', '021-1234568', 'siti@sekolah.ac.id', NOW(), NOW()),
(2, 'Ahmad Fauzi', 'Wakasek', '021-1234569', 'ahmad@sekolah.ac.id', NOW(), NOW()),
(3, 'Dewi Lestari', 'Kepala Tata Usaha', '021-1234570', 'dewi@sekolah.ac.id', NOW(), NOW()),
(4, 'Rudi Hermawan', 'IT Manager', '021-1234571', 'rudi@sekolah.ac.id', NOW(), NOW());

-- Sample Porsi Perusahaan
INSERT INTO porsi_perusahaan (project_id, nama_pemilik, persentase, nilai, keterangan, created_at, updated_at) VALUES 
(1, 'PT Maju Jaya', 35.00, 1750000000, 'Konstruksi utama', NOW(), NOW()),
(1, 'PT Bersama Sejahtera', 25.00, 1250000000, 'Konstruksi pendukung', NOW(), NOW()),
(1, 'CV Sumber Rejeki', 40.00, 2000000000, 'Material bangunan', NOW(), NOW()),
(2, 'PT Maju Jaya', 50.00, 750000000, 'Konstruksi', NOW(), NOW()),
(2, 'CV Sumber Rejeki', 50.00, 750000000, 'Material', NOW(), NOW()),
(3, 'PT Bersama Sejahtera', 60.00, 1500000000, 'Pemasangan', NOW(), NOW()),
(3, 'CV Sumber Rejeki', 40.00, 1000000000, 'Material', NOW(), NOW()),
(4, 'PT Maju Jaya', 100.00, 800000000, 'Penyedia komputer', NOW(), NOW());
