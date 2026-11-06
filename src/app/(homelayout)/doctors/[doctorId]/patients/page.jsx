import DoctorPatients from "@/components/(doctors)/DoctorPatients";

export default async function DoctorPatientsPage({ params }) {
  const { doctorId } = await params;
  return <DoctorPatients doctorId={doctorId} />;
}
