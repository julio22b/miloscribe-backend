import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { findDoctorByUsername } from '../models/doctor.model.js';
import { prisma } from '../lib/prisma.js';
import { createSeedPatients } from '../data/seedData.js';

const seedDemoAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const rawUsername = req.query.username;

        if (typeof rawUsername !== 'string' || !rawUsername.trim()) {
            res.status(400).json({ error: 'username query param is required' });
            return;
        }

        const username = rawUsername.trim();

        const existing = await findDoctorByUsername(username);
        if (existing) {
            res.status(400).json({ error: 'Username already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(username, 12);

        const doctor = await prisma.$transaction(async (tx) => {
            const created = await tx.doctor.create({
                data: {
                    username,
                    password: hashedPassword,
                    name: 'Dr. Demo',
                    specialty: 'Cirugía General',
                },
            });

            await Promise.all(
                createSeedPatients().map((p) =>
                    tx.patient.create({
                        data: {
                            name: p.name,
                            date_of_birth: p.date_of_birth,
                            gender: p.gender,
                            last_visit: p.last_visit,
                            doctor: { connect: { id: created.id } },
                            consultations: {
                                create: p.consultations.map((c) => ({
                                    status: c.status,
                                    transcript_text: c.transcript_text,
                                    audio_url: c.audio_url,
                                    documents: {
                                        create: c.documents.map((d) => ({
                                            type: d.type,
                                            content: d.content,
                                        })),
                                    },
                                })),
                            },
                        },
                    }),
                ),
            );

            return created;
        });

        const token = jwt.sign({ id: doctor.id, username: doctor.username }, process.env.JWT_SECRET!, {
            expiresIn: '24h',
        });

        const { password: _, ...doctorWithoutPassword } = doctor;

        res.status(201).json({ message: 'Demo account created', token, doctor: doctorWithoutPassword });
    } catch (error) {
        console.error('Seed demo account error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export default { seedDemoAccount };
