import type { Gender, DocumentType } from '../../generated/prisma/index.js';

type SeedDocument = {
    type: DocumentType;
    content: string;
};

type SeedConsultation = {
    status: 'COMPLETED';
    transcript_text: string;
    audio_url: null;
    documents: SeedDocument[];
};

type SeedPatient = {
    name: string;
    date_of_birth: Date;
    gender: Gender;
    last_visit: Date;
    consultations: SeedConsultation[];
};

const daysAgo = (n: number): Date => new Date(Date.now() - n * 86_400_000);

const yearsAgo = (years: number): Date => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - years);
    return date;
};

const formatDate = (date: Date): string =>
    date.toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric' });

const formatDateLong = (date: Date): string =>
    date.toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' });

export const createSeedPatients = (): SeedPatient[] => {
    const anaAdmission = daysAgo(4);
    const anaDischarge = daysAgo(0);

    return [
    {
        name: 'Carlos Rodríguez',
        date_of_birth: yearsAgo(34),
        gender: 'MALE',
        last_visit: daysAgo(5),
        consultations: [
            {
                status: 'COMPLETED',
                audio_url: null,
                transcript_text:
                    'Paciente masculino de 34 años que consulta por dolor en el epigastrio de dos semanas de evolución. Lo describe como quemante, de intensidad moderada, que aparece aproximadamente media hora después de comer y mejora parcialmente con antiácidos. Refiere náuseas ocasionales sin vómitos, sin hematemesis ni melena. Viene consumiendo ibuprofeno cuatro o cinco veces por semana por cefaleas recurrentes y toma entre cuatro y cinco tazas de café al día. Sin antecedentes patológicos de importancia, sin cirugías previas. No fuma, consume alcohol solo los fines de semana, sin alergias. Al examen el abdomen tiene dolor a la palpación profunda en epigastrio, sin irritación peritoneal. El resto del examen normal. Diagnóstico presuntivo: gastritis aguda por AINEs y café.',
                documents: [
                    {
                        type: 'MEDICAL_HISTORY',
                        content: `MOTIVO DE CONSULTA
Dolor epigástrico de dos semanas de evolución.

ENFERMEDAD ACTUAL
Paciente masculino de 34 años que refiere dolor epigástrico de tipo urente, de intensidad moderada (6/10), que se inicia aproximadamente 30 minutos tras la ingesta de alimentos y mejora parcialmente con antiácidos de venta libre. Acompaña náuseas ocasionales sin vómitos. Niega hematemesis ni melena. Refiere consumo frecuente de AINEs (ibuprofeno, 4 a 5 veces por semana) por cefalea recurrente, y elevada ingesta de café (4 a 5 tazas diarias).

ANTECEDENTES PERSONALES PATOLÓGICOS
Ninguno de importancia.

MEDICAMENTOS / TRATAMIENTO HABITUAL
Ibuprofeno 400 mg vía oral condicional a cefalea (frecuencia aproximada: 4 a 5 veces por semana).

ANTECEDENTES QUIRÚRGICOS
Ninguno.

ANTECEDENTES PERSONALES NO PATOLÓGICOS / HISTORIA SOCIAL
No fumador. Consumo de alcohol ocasional (fines de semana). Ingesta elevada de café (4 a 5 tazas diarias). Sin alergias medicamentosas conocidas.

EXAMEN FÍSICO
Tórax: Simétrico, normoexpansible, ruidos cardiacos rítmicos, normofonéticos, sin soplo ni galope, ruidos respiratorios presentes en ambos hemitórax sin agregados.
Abdomen: Blando, depresible, con dolor a la palpación profunda en epigastrio, sin signos de irritación peritoneal, ruidos hidroaéreos presentes y normales.
Extremidades: Simétricas, móviles, sin edema, sin várices.
Neurológico: Consciente, orientado en espacio, tiempo y persona. Glasgow 15/15 puntos.

DIAGNÓSTICOS
1. Gastritis aguda por AINEs y café (presuntivo).`,
                    },
                ],
            },
        ],
    },
    {
        name: 'María González',
        date_of_birth: yearsAgo(52),
        gender: 'FEMALE',
        last_visit: daysAgo(1),
        consultations: [
            {
                status: 'COMPLETED',
                audio_url: null,
                transcript_text:
                    'Paciente femenina de 52 años, séptimo día de postoperatorio de colecistectomía laparoscópica. Refiere dolor leve en los sitios de los puertos, dos sobre diez, manejable. Sin fiebre desde el primer día. Sin náuseas ni vómitos desde el tercer día postoperatorio. Está tolerando bien la dieta blanda y ya presentó gases y deposiciones. Al examen: afebril, tensión arterial 118 sobre 76, frecuencia cardíaca 74, frecuencia respiratoria 16, saturación de oxígeno 98% al aire ambiente. Abdomen blando, heridas en buen estado, sin signos de infección local, sin colecciones palpables, ruidos hidroaéreos presentes. Se aprueba el alta. Indicaciones: dieta blanda por cinco días más y luego libre según tolerancia, omeprazol 20 miligramos cada 12 horas por 14 días, paracetamol 500 miligramos cada 8 horas condicional a dolor, retiro de puntos en 7 días en consulta externa, control en un mes. Que regrese antes si presenta fiebre, dolor intenso o signos de infección en las heridas.',
                documents: [
                    {
                        type: 'PROGRESS_NOTE',
                        content: `EVOLUCIÓN MÉDICA

DIAGNÓSTICOS:
1. Colecistectomía laparoscópica (postoperatorio día 7).

SUBJETIVO:
- Dolor leve en sitios de puertos, tolerable (EVA 2/10).
- Afebril durante el postoperatorio.
- Sin náuseas ni vómitos desde el tercer día postoperatorio.
- Tolerando dieta blanda sin dificultad.
- Gases y deposiciones presentes.

OBJETIVO:
Afebril. TA 118/76 mmHg. FC 74 lpm. FR 16 rpm. SpO2 98% al aire ambiente.
Abdomen: Blando, depresible, heridas quirúrgicas en buen estado, sin signos de infección local, sin colecciones palpables. Ruidos hidroaéreos presentes.

PLAN / COMENTARIOS:
- Alta hospitalaria aprobada.
- Dieta blanda por 5 días adicionales, luego dieta libre según tolerancia.
- Omeprazol 20 mg vía oral cada 12 horas por 14 días.
- Paracetamol 500 mg vía oral cada 8 horas condicional a dolor.
- Retiro de puntos en 7 días en consulta externa.
- Control en consulta en 4 semanas. Acudir antes si presenta fiebre, dolor abdominal intenso o signos de infección en heridas.`,
                    },
                ],
            },
        ],
    },
    {
        name: 'Ana Martínez',
        date_of_birth: yearsAgo(67),
        gender: 'FEMALE',
        last_visit: daysAgo(0),
        consultations: [
            {
                status: 'COMPLETED',
                audio_url: null,
                transcript_text: `Resumen de egreso. Paciente femenina de 67 años, Ana Martínez. Ingresó el ${formatDateLong(anaAdmission)} por dolor en fosa ilíaca derecha de inicio súbito. Se le realizó apendicectomía laparoscópica de urgencia ese mismo día. Hallazgos operatorios: apéndice cecal congestivo con exudado periapendicular escaso, sin perforación. Evolución postoperatoria satisfactoria. Diagnóstico de egreso: apendicitis aguda supurada no perforada. Egresa el ${formatDateLong(anaDischarge)} con amoxicilina clavulanato 875/125 miligramos vía oral cada 12 horas por 7 días, paracetamol 500 miligramos condicional a dolor cada 8 horas, dieta blanda por cinco días y luego libre. Reposo relativo. Control en diez días para retiro de puntos.`,
                documents: [
                    {
                        type: 'DISCHARGE_SUMMARY',
                        content: `RESUMEN DE EGRESO

PACIENTE: Ana Martínez
C.I.: V-11223344
EDAD: 67 años
FECHA DE INGRESO: ${formatDate(anaAdmission)}
FECHA DE EGRESO: ${formatDate(anaDischarge)}

DIAGNÓSTICO DE INGRESO:
1. Dolor en fosa ilíaca derecha de inicio súbito.

INTERVENCIÓN PRACTICADA:
Apendicectomía laparoscópica de urgencia (${formatDate(anaAdmission)}).
HALLAZGOS:
Apéndice cecal congestivo con exudado periapendicular escaso. Sin perforación.

DIAGNÓSTICOS DE EGRESO:
1. Apendicitis aguda supurada, no perforada.

RECOMENDACIONES:
TRATAMIENTO:
- Amoxicilina-clavulanato 875/125 mg vía oral cada 12 horas por 7 días.
- Paracetamol 500 mg vía oral cada 8 horas condicional a dolor.
- Dieta blanda por 5 días, luego dieta libre según tolerancia.
- Reposo relativo. Evitar actividad física intensa por 4 semanas.

PRÓXIMA CONSULTA:
Control en consulta externa en 10 días para retiro de puntos y evaluación de heridas.`,
                    },
                ],
            },
        ],
    },
    ];
};
