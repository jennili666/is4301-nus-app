import { render, screen } from "@testing-library/react";
import Home from "./pages/Home";
import Academics from "./pages/Academics";
import Admission from "./pages/Admission";

test("home page shows the NUS logo and introduction text", () => {
  render(<Home />);
  expect(screen.getByAltText(/national university of singapore logo/i)).toBeInTheDocument();
  expect(
    screen.getByText("NUS is a leading research university in Asia")
  ).toBeInTheDocument();
});

test("academics page lists the modules in a table", () => {
  render(<Academics />);
  expect(screen.getByRole("columnheader", { name: "Module Code" })).toBeInTheDocument();
  ["BT1101", "BT2101", "BT2102", "BT2103"].forEach((code) =>
    expect(screen.getByText(code)).toBeInTheDocument()
  );
});

test("admission page shows the five steps in order", () => {
  render(<Admission />);
  const steps = screen.getAllByRole("listitem");
  expect(steps).toHaveLength(5);
  expect(steps[0]).toHaveTextContent("Understanding Admission requirements");
  expect(steps[4]).toHaveTextContent("Check application status");
});
