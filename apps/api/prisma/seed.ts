import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Government Hospital Smart Queue Database...');

  // 0. Clean existing data for idempotency
  await prisma.feedback.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.queueHistory.deleteMany();
  await prisma.tokenTransferHistory.deleteMany();
  await prisma.token.deleteMany();
  await prisma.staffAssignment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.counter.deleteMany();
  await prisma.service.deleteMany();
  await prisma.department.deleteMany();
  await prisma.branch.deleteMany();

  // 1. Create Organization
  const org = await prisma.organization.upsert({
    where: { code: 'AIIPH-DELHI-01' },
    update: {},
    create: {
      name: 'All India Institute of Public Health & Research',
      code: 'AIIPH-DELHI-01',
      logoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150&auto=format&fit=crop&q=80'
    }
  });

  // 2. Create Main Branch Campus
  const branch = await prisma.branch.create({
    data: {
      organizationId: org.id,
      name: 'Main Campus OPD & Diagnostic Block',
      location: 'Block A, Rajpath Marg, New Delhi',
      timezone: 'Asia/Kolkata'
    }
  });

  // 3. Create Departments
  const deptRegistration = await prisma.department.create({
    data: {
      branchId: branch.id,
      name: 'Central Registration & Ticket Kiosk',
      code: 'REG',
      type: 'REGISTRATION'
    }
  });

  const deptTriage = await prisma.department.create({
    data: {
      branchId: branch.id,
      name: 'Nurse Triage & Vitals Check',
      code: 'TRG',
      type: 'TRIAGE'
    }
  });

  const deptGeneralOPD = await prisma.department.create({
    data: {
      branchId: branch.id,
      name: 'General Medicine OPD',
      code: 'OPD-GEN',
      type: 'OPD_CONSULTATION'
    }
  });

  const deptCardiology = await prisma.department.create({
    data: {
      branchId: branch.id,
      name: 'Cardiology OPD',
      code: 'OPD-CARD',
      type: 'OPD_CONSULTATION'
    }
  });

  const deptLab = await prisma.department.create({
    data: {
      branchId: branch.id,
      name: 'Central Diagnostic Lab & Pathology',
      code: 'LAB',
      type: 'DIAGNOSTIC_LAB'
    }
  });

  const deptPharmacy = await prisma.department.create({
    data: {
      branchId: branch.id,
      name: 'Central Dispensary & Pharmacy',
      code: 'PHARM',
      type: 'PHARMACY'
    }
  });

  // 4. Create Services
  const serviceGenOPD = await prisma.service.create({
    data: {
      departmentId: deptGeneralOPD.id,
      name: 'General OPD Consultation',
      prefix: 'OPD',
      avgServiceTimeMinutes: 10,
      maxCapacityPerDay: 500
    }
  });

  const serviceCardio = await prisma.service.create({
    data: {
      departmentId: deptCardiology.id,
      name: 'Cardiology Specialist OPD',
      prefix: 'CARD',
      avgServiceTimeMinutes: 15,
      maxCapacityPerDay: 200
    }
  });

  const serviceLab = await prisma.service.create({
    data: {
      departmentId: deptLab.id,
      name: 'Blood Sample & Pathology',
      prefix: 'LAB',
      avgServiceTimeMinutes: 5,
      maxCapacityPerDay: 800
    }
  });

  const servicePharm = await prisma.service.create({
    data: {
      departmentId: deptPharmacy.id,
      name: 'Medication Dispensing',
      prefix: 'PHARM',
      avgServiceTimeMinutes: 4,
      maxCapacityPerDay: 1000
    }
  });

  // 5. Create Counters / Rooms
  const counterOPD1 = await prisma.counter.create({
    data: {
      departmentId: deptGeneralOPD.id,
      number: 101,
      name: 'Room 101 - Dr. Rajesh Sharma',
      roomNumber: 'Room 101',
      doctorName: 'Dr. Rajesh Sharma (Senior Physician)',
      isAvailable: true
    }
  });

  const counterOPD2 = await prisma.counter.create({
    data: {
      departmentId: deptGeneralOPD.id,
      number: 102,
      name: 'Room 102 - Dr. Ananya Sen',
      roomNumber: 'Room 102',
      doctorName: 'Dr. Ananya Sen (Physician)',
      isAvailable: true
    }
  });

  const counterLab1 = await prisma.counter.create({
    data: {
      departmentId: deptLab.id,
      number: 1,
      name: 'Phlebotomy Booth 1',
      roomNumber: 'Lab Station A',
      isAvailable: true
    }
  });

  const counterPharm1 = await prisma.counter.create({
    data: {
      departmentId: deptPharmacy.id,
      number: 1,
      name: 'Dispensary Counter 1 (Senior / Priority)',
      roomNumber: 'Counter 1',
      isAvailable: true
    }
  });

  // 6. Create Users (Admin, Doctor, Nurse, Citizen)
  const defaultPasswordHash = await bcrypt.hash('Admin@123', 10);
  const docPasswordHash = await bcrypt.hash('Doctor@123', 10);
  const nursePasswordHash = await bcrypt.hash('Nurse@123', 10);
  const staffPasswordHash = await bcrypt.hash('Staff@123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'superadmin@aiiph.gov.in',
      passwordHash: defaultPasswordHash,
      name: 'Dr. V. K. Paul (Medical Superintendent)',
      phone: '+919876543210',
      role: 'SUPER_ADMIN',
      branchId: branch.id
    }
  });

  const doctor = await prisma.user.create({
    data: {
      email: 'doctor@aiiph.gov.in',
      passwordHash: docPasswordHash,
      name: 'Dr. Rajesh Sharma',
      phone: '+919876543211',
      role: 'DOCTOR',
      branchId: branch.id,
      departmentId: deptGeneralOPD.id
    }
  });

  const nurse = await prisma.user.create({
    data: {
      email: 'nurse@aiiph.gov.in',
      passwordHash: nursePasswordHash,
      name: 'Sister Sunita Verma',
      phone: '+919876543212',
      role: 'NURSE',
      branchId: branch.id,
      departmentId: deptTriage.id
    }
  });

  const staff = await prisma.user.create({
    data: {
      email: 'staff@aiiph.gov.in',
      passwordHash: staffPasswordHash,
      name: 'Ramesh Kumar (Dispensary Staff)',
      phone: '+919876543213',
      role: 'STAFF',
      branchId: branch.id,
      departmentId: deptPharmacy.id
    }
  });

  // 7. Staff Assignments
  await prisma.staffAssignment.create({
    data: {
      userId: doctor.id,
      counterId: counterOPD1.id,
      isActive: true
    }
  });

  // 8. Create Active Tokens for Demo
  await prisma.token.createMany({
    data: [
      {
        tokenNumber: 41,
        displayCode: 'OPD-041',
        patientName: 'Ram Sharan',
        patientPhone: '+919811122233',
        abhaId: '91-2384-9102-4912',
        serviceId: serviceGenOPD.id,
        departmentId: deptGeneralOPD.id,
        branchId: branch.id,
        status: 'WAITING',
        priorityType: 'SENIOR_CITIZEN',
        triageLevel: 'YELLOW_URGENT',
        priorityScore: 18.5,
        estimatedWaitMinutes: 12
      },
      {
        tokenNumber: 42,
        displayCode: 'OPD-042',
        patientName: 'Sunita Sharma',
        patientPhone: '+919822233344',
        abhaId: '91-8821-3312-9901',
        serviceId: serviceGenOPD.id,
        departmentId: deptGeneralOPD.id,
        branchId: branch.id,
        status: 'WAITING',
        priorityType: 'NORMAL',
        triageLevel: 'GREEN_ROUTINE',
        priorityScore: 5.0,
        estimatedWaitMinutes: 22
      },
      {
        tokenNumber: 43,
        displayCode: 'OPD-043',
        patientName: 'Vikram Singh (Emergency)',
        patientPhone: '+919833344455',
        serviceId: serviceGenOPD.id,
        departmentId: deptGeneralOPD.id,
        branchId: branch.id,
        status: 'WAITING',
        priorityType: 'EMERGENCY',
        triageLevel: 'RED_IMMEDIATE',
        priorityScore: 105.0,
        estimatedWaitMinutes: 2
      },
      {
        tokenNumber: 15,
        displayCode: 'LAB-015',
        patientName: 'Priya Mukherjee',
        patientPhone: '+919844455566',
        serviceId: serviceLab.id,
        departmentId: deptLab.id,
        branchId: branch.id,
        status: 'WAITING',
        priorityType: 'PREGNANT',
        triageLevel: 'GREEN_ROUTINE',
        priorityScore: 14.0,
        estimatedWaitMinutes: 6
      }
    ]
  });

  // 8. Create Kiosk Terminals Fleet
  await prisma.kioskTerminal.createMany({
    data: [
      {
        branchId: branch.id,
        terminalCode: 'KIOSK-GATE-A',
        location: 'Main OPD Entrance Gate A',
        paperRollPercent: 92,
        status: 'ONLINE'
      },
      {
        branchId: branch.id,
        terminalCode: 'KIOSK-GATE-B',
        location: 'Emergency & Trauma Block',
        paperRollPercent: 14,
        status: 'LOW_PAPER'
      },
      {
        branchId: branch.id,
        terminalCode: 'KIOSK-DIAGNOSTIC',
        location: 'Lab Pathology Hall B',
        paperRollPercent: 88,
        status: 'ONLINE'
      }
    ]
  });

  // 9. Initial Audit Log
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: 'SYSTEM_INITIALIZATION',
      details: 'Initialized Government Hospital Smart Queue Database for AIIPH Main Campus.'
    }
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
