export const admissionSteps = [
  "Understanding Admission requirements",
  "Submit application online",
  "Upload supporting documents",
  "Make application fee payment",
  "Check application status",
];

function Admission() {
  return (
    <section className="card">
      <h1>Admission</h1>
      <p className="lead">Admission process flow</p>
      <ol className="admission-flow">
        {admissionSteps.map((step) => (
          <li key={step}>
            <span className="admission-flow__text">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default Admission;
