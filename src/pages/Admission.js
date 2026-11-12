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
      <ul className="admission-bullets">
        {admissionSteps.map((step) => (
          <li key={step}>
            <span className="admission-bullets__text">{step}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Admission;
